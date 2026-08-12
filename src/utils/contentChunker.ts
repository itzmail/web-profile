const FULL_INJECT_LIMIT = 6000;
const SECTION_SUB_CAP = 1000;
const TOP_K = 3;

const STOPWORDS = new Set([
    "yang", "dan", "di", "ke", "dari", "untuk", "dengan", "ini", "itu", "atau",
    "juga", "ada", "tidak", "saya", "kamu", "aku", "kita", "akan", "bisa",
    "the", "a", "an", "and", "or", "of", "to", "in", "is", "it", "for", "on",
    "with", "this", "that", "are", "was", "be", "as", "at", "by",
]);

interface Section {
    heading: string;
    body: string;
}

export function stripMarkdown(md: string): string {
    return md
        .replace(/```[\s\S]*?```/g, "")
        .replace(/!\[.*?\]\(.*?\)/g, "")
        .replace(/\[(.*?)\]\(.*?\)/g, "$1")
        .replace(/^#{1,6}\s+/gm, "")
        .replace(/[*_~`>]/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

function splitIntoSections(text: string): Section[] {
    const headingRegex = /^#{1,3}\s+(.+)$/gm;
    const matches = [...text.matchAll(headingRegex)];

    if (matches.length === 0) {
        return text
            .split(/\n{2,}/)
            .map((p) => p.trim())
            .filter(Boolean)
            .map((body) => ({ heading: "", body }));
    }

    const sections: Section[] = [];
    const intro = text.slice(0, matches[0].index).trim();
    if (intro) sections.push({ heading: "", body: intro });

    for (let i = 0; i < matches.length; i++) {
        const start = matches[i].index! + matches[i][0].length;
        const end = i + 1 < matches.length ? matches[i + 1].index! : text.length;
        sections.push({
            heading: matches[i][1].trim(),
            body: text.slice(start, end).trim(),
        });
    }

    return sections;
}

function capSection(section: Section): Section[] {
    if (section.body.length <= SECTION_SUB_CAP) return [section];

    const parts: Section[] = [];
    let remaining = section.body;
    let first = true;
    while (remaining.length > 0) {
        const chunk = remaining.slice(0, SECTION_SUB_CAP);
        parts.push({ heading: first ? section.heading : `${section.heading} (lanjutan)`, body: chunk });
        remaining = remaining.slice(SECTION_SUB_CAP);
        first = false;
    }
    return parts;
}

function tokenize(text: string): string[] {
    return text
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .split(/\s+/)
        .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

function scoreSection(section: Section, queryWords: string[]): number {
    const sectionWords = tokenize(`${section.heading} ${section.body}`);
    if (sectionWords.length === 0) return 0;
    const wordSet = new Set(sectionWords);
    return queryWords.reduce((score, w) => score + (wordSet.has(w) ? 1 : 0), 0);
}

function formatSection(section: Section): string {
    return section.heading ? `## ${section.heading}\n${section.body}` : section.body;
}

/**
 * Reduces long page content to a bounded set of sections relevant to the visitor's
 * question, so the system prompt stays within a predictable token budget instead of
 * carrying the full article on every turn. Sections are split on raw markdown headings
 * before stripping syntax, since strip removes the "#" markers the splitter relies on.
 */
export function buildContentContext(rawContent: string, query: string): string {
    if (!rawContent.trim()) return "";

    const fullPlain = stripMarkdown(rawContent);
    if (fullPlain.length <= FULL_INJECT_LIMIT) return fullPlain;

    const sections = splitIntoSections(rawContent)
        .map((s) => ({ heading: s.heading, body: stripMarkdown(s.body) }))
        .filter((s) => s.body)
        .flatMap(capSection);
    const queryWords = tokenize(query);

    const intro = sections.find((s) => s.heading === "");
    const scored = sections
        .filter((s) => s !== intro)
        .map((s) => ({ section: s, score: scoreSection(s, queryWords) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, TOP_K)
        .map((s) => s.section);

    const selected = intro ? [intro, ...scored] : scored;
    return selected.map(formatSection).join("\n\n");
}
