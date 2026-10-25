const YOUTUBE_RE = /^https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=([\w-]+)(?:&\S*)?|youtu\.be\/([\w-]+)|youtube\.com\/embed\/([\w-]+))\S*$/i;
const VIMEO_RE = /^https?:\/\/(?:www\.)?vimeo\.com\/(\d+)\S*$/i;
const DIRECT_VIDEO_RE = /^https?:\/\/\S+\.(mp4|webm|ogg)(\?\S*)?$/i;

/** Escape a URL before interpolating it into an HTML attribute. */
function attr(url: string): string {
    return url
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

/** Only http(s) URLs are embeddable; anything else is refused. */
function isSafeUrl(url: string): boolean {
    try {
        const { protocol } = new URL(url);
        return protocol === "https:" || protocol === "http:";
    } catch {
        return false;
    }
}

/**
 * Replaces standalone video URLs (own line, no surrounding text) with
 * embeddable HTML (iframe/video tag) before markdown is parsed, since
 * `marked` otherwise renders bare URLs as plain <a> links.
 */
export function embedVideoLinks(markdown: string): string {
    const lines = markdown.split("\n");

    return lines
        .map((line) => {
            const url = line.trim();
            if (!url) return line;

            const yt = url.match(YOUTUBE_RE);
            if (yt) {
                const id = yt[1] || yt[2] || yt[3];
                return `<div class="video-embed"><iframe src="https://www.youtube.com/embed/${attr(id)}" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`;
            }

            const vimeo = url.match(VIMEO_RE);
            if (vimeo) {
                return `<div class="video-embed"><iframe src="https://player.vimeo.com/video/${attr(vimeo[1])}" title="Vimeo video" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`;
            }

            if (DIRECT_VIDEO_RE.test(url) && isSafeUrl(url)) {
                return `<div class="video-embed"><video src="${attr(url)}" controls preload="metadata"></video></div>`;
            }

            return line;
        })
        .join("\n");
}
