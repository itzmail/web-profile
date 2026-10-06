/**
 * Regex explainer — tokenizes a pattern into human-readable parts.
 * Covers the common JS regex vocabulary. Pure client-side.
 */

export interface RegexToken {
	raw: string;
	desc: string;
	depth: number; // group nesting level
}

const CLASSES: Record<string, string> = {
	"\\d": "any digit (0-9)",
	"\\D": "any non-digit",
	"\\w": "any word character (a-z, A-Z, 0-9, _)",
	"\\W": "any non-word character",
	"\\s": "any whitespace (space, tab, newline)",
	"\\S": "any non-whitespace",
	"\\b": "word boundary",
	"\\B": "non-word boundary",
	"\\n": "newline",
	"\\t": "tab",
	"\\r": "carriage return",
};

/** Split a pattern into explanatory tokens (best-effort, JS flavor). */
export function explainRegex(pattern: string): RegexToken[] {
	const tokens: RegexToken[] = [];
	let depth = 0;
	let i = 0;

	const push = (raw: string, desc: string) => tokens.push({ raw, desc, depth });

	while (i < pattern.length) {
		const ch = pattern[i];
		const next = pattern[i + 1];

		if (ch === "\\" && next) {
			// escape / shorthand / backreference
			if (/^[1-9]$/.test(next)) {
				push(ch + next, `backreference to group ${next}`);
			} else if (CLASSES[ch + next]) {
				push(ch + next, CLASSES[ch + next]);
			} else {
				push(ch + next, `literal "${next}" (escaped)`);
			}
			i += 2;
			continue;
		}

		if (ch === "(") {
			if (next === "?") {
				// group modifiers (?: (?<name> (?= (?!
				const closeParen = pattern.indexOf(")", i);
				const head = pattern.slice(i, closeParen === -1 ? i + 4 : Math.min(closeParen + 1, i + 12));
				if (head.startsWith("(?")) {
					if (head.startsWith("(?<") && head[3] !== "=" && head[3] !== "!") {
						const nameEnd = pattern.indexOf(">", i);
						const name = nameEnd !== -1 ? pattern.slice(i + 3, nameEnd) : "?";
						depth++;
						push(`(?<${name}>)`, `start of named capture group "${name}"`);
						i = nameEnd !== -1 ? nameEnd + 1 : i + head.length;
						continue;
					}
					const descriptions: [string, string][] = [
						["(?:", "start of non-capturing group"],
						["(?=", "start of lookahead assertion (must be followed)"],
						["(?!", "start of negative lookahead (must NOT be followed)"],
						["(?<=", "start of lookbehind assertion (must be preceded)"],
						["(?<!", "start of negative lookbehind (must NOT be preceded)"],
					];
					const found = descriptions.find(([k]) => head.startsWith(k));
					if (found) {
						depth++;
						push(found[0], found[1]);
						i += found[0].length;
						continue;
					}
				}
			}
			depth++;
			push("(", "start of capture group");
			i++;
			continue;
		}

		if (ch === ")") {
			depth = Math.max(0, depth - 1);
			push(")", "end of group");
			i++;
			continue;
		}

		if (ch === "[") {
			// character class: read to unescaped ]
			let j = i + 1;
			if (pattern[j] === "^") j++;
			if (pattern[j] === "]") j++;
			while (j < pattern.length && pattern[j] !== "]") {
				if (pattern[j] === "\\") j++;
				j++;
			}
			const raw = pattern.slice(i, j + 1);
			const negate = raw[1] === "^";
			push(raw, negate ? "character class, NONE of: " + classMembers(raw) : "character class, any of: " + classMembers(raw));
			i = j + 1;
			continue;
		}

		if (ch === "{") {
			const close = pattern.indexOf("}", i);
			if (close !== -1) {
				const raw = pattern.slice(i, close + 1);
				push(raw, `quantifier: repeat ${quantifierDesc(raw)}`);
				i = close + 1;
				continue;
			}
		}

		if ("*+?".includes(ch)) {
			push(ch, `quantifier: ${ch === "*" ? "zero or more" : ch === "+" ? "one or more" : "zero or one (optional)"}`);
			i++;
			if (next === "?" || next === "+") {
				push(next, next === "?" ? "lazy match (fewest first)" : "possessive match");
				i++;
			}
			continue;
		}

		if (ch === "^") {
			push("^", "anchor: start of string (or line with m flag)");
			i++;
			continue;
		}
		if (ch === "$") {
			push("$", "anchor: end of string (or line with m flag)");
			i++;
			continue;
		}
		if (ch === ".") {
			push(".", "any character (except newline; all with s flag)");
			i++;
			continue;
		}
		if (ch === "|") {
			push("|", "alternation: OR between choices");
			i++;
			continue;
		}

		// Literal run
		let run = "";
		while (i < pattern.length && !/[\^\$\.\*\+\?\(\)\[\]\{\}\|\\]/.test(pattern[i])) {
			run += pattern[i++];
		}
		push(run, `literal "${run}"`);
	}

	return tokens;
}

function classMembers(raw: string): string {
	const inner = raw.slice(1, -1).replace(/^\^/, "");
	return inner.length <= 40 ? `"${inner}"` : `"${inner.slice(0, 37)}…"`;
}

function quantifierDesc(raw: string): string {
	const inner = raw.slice(1, -1);
	if (inner.includes(",")) {
		const [lo, hi] = inner.split(",");
		if (!hi) return `${lo} or more times`;
		return `between ${lo} and ${hi} times`;
	}
	return `exactly ${inner} times`;
}

export interface RegexPreset {
	label: string;
	pattern: string;
	flags: string;
	sample: string;
}

export const REGEX_PRESETS: RegexPreset[] = [
	{ label: "Email", pattern: "[\\w.+-]+@[\\w-]+\\.[\\w.]+", flags: "g", sample: "Contact: alice@example.com, bob.smith@test.co.id" },
	{ label: "IPv4", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b", flags: "g", sample: "Server at 192.168.1.100 and 10.0.0.1 (not 999.999.999.999)" },
	{ label: "SemVer", pattern: "^(\\d+)\\.(\\d+)\\.(\\d+)(?:-([\\w.]+))?$", flags: "gm", sample: "v1.2.3\n2.0.0-rc.1\n10.20.30" },
	{ label: "Slug", pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$", flags: "gm", sample: "my-blog-post\nBad_Slug\napi-v2" },
	{ label: "ISO Date", pattern: "\\d{4}-\\d{2}-\\d{2}", flags: "g", sample: "Deadline 2025-05-10, review 2025-06-01" },
];
