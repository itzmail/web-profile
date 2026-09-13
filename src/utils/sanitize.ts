/**
 * Edge-compatible HTML sanitizer for Cloudflare Workers SSR.
 * Strips executable scripts, event handlers, and dangerous URI schemes
 * without requiring browser DOM / window APIs.
 */
export function sanitizeHtml(html: string): string {
    if (!html) return "";

    // 1. Remove dangerous executable/embed tags and their inner content
    let sanitized = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
        .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
        .replace(/<embed\b[^>]*>/gi, "")
        .replace(/<applet\b[^<]*(?:(?!<\/applet>)<[^<]*)*<\/applet>/gi, "")
        .replace(/<base\b[^>]*>/gi, "")
        .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, "");

    // 2. Remove inline event handlers (e.g. onclick=..., onerror=...)
    sanitized = sanitized.replace(/\s+on[a-z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, "");

    // 3. Neutralize dangerous URL schemes in href, src, or action attributes (javascript:, vbscript:, data:)
    sanitized = sanitized.replace(
        /(href|src|action)\s*=\s*(['"])\s*(?:javascript|vbscript|data):.*?\2/gi,
        '$1="#"'
    );

    sanitized = sanitized.replace(
        /(href|src|action)\s*=\s*(?:javascript|vbscript|data):[^\s>]*/gi,
        '$1="#"'
    );

    return sanitized;
}
