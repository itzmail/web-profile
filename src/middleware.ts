import { defineMiddleware } from "astro:middleware";

const BLOG_HOST = "blog.itsmail.dev";
const MAIN_HOST = "itsmail.dev";
const NOTES_HOST = "notes.itsmail.dev";

/**
 * Baseline hardening headers for every response served by the Worker.
 * No CSP nonce handling here — the theme pre-paint script and Astro inline
 * scripts rely on inline execution; a strict CSP needs nonces end-to-end.
 */
function applySecurityHeaders(response: Response): Response {
	response.headers.set("X-Content-Type-Options", "nosniff");
	response.headers.set("X-Frame-Options", "SAMEORIGIN");
	response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
	response.headers.set(
		"Permissions-Policy",
		"camera=(), microphone=(), geolocation=(), payment=(), usb=()"
	);
	return response;
}

export const onRequest = defineMiddleware(async (context, next) => {
	const { url } = context;

	// 1. Subdomain redirect: blog.itsmail.dev -> https://itsmail.dev/notes (301 Permanent)
	// notes.itsmail.dev does not have a public DNS record, so route directly to itsmail.dev/notes
	if (url.hostname === BLOG_HOST) {
		const target = new URL(url);
		target.hostname = MAIN_HOST;
		const cleanPath = target.pathname.replace(/^\/blog(\/|$)/, "$1").replace(/^\//, "");
		target.pathname = cleanPath ? `/notes/${cleanPath}` : "/notes";
		return applySecurityHeaders(context.redirect(target.toString(), 301));
	}

	let response: Response;

	// 2. Subdomain routing: notes.itsmail.dev maps transparently to /notes internally
	if (
		url.hostname === NOTES_HOST &&
		!url.pathname.startsWith("/notes") &&
		!url.pathname.startsWith("/api")
	) {
		url.pathname = `/notes${url.pathname === "/" ? "" : url.pathname}`;
		response = await next(url);
	} else {
		response = await next();
	}

	// next() may resolve without a Response (API 404 short-circuits); pass through
	if (!(response instanceof Response)) return response;
	return applySecurityHeaders(response);
});
