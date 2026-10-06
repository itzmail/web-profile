/**
 * Shared HTML escaping for tools that build markup strings.
 * Pure client-side.
 */

const HTML_ESCAPES: Record<string, string> = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&#39;",
};

/** Escape text before interpolating it into an innerHTML template. */
export function escapeHtml(value: string): string {
	return value.replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch]);
}
