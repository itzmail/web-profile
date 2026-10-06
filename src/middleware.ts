import { defineMiddleware } from "astro:middleware";

const BLOG_HOST = "blog.itsmail.dev";

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

	let response: Response;

	if (
		url.hostname === BLOG_HOST &&
		!url.pathname.startsWith("/blog") &&
		!url.pathname.startsWith("/api")
	) {
		url.pathname = `/blog${url.pathname === "/" ? "" : url.pathname}`;
		response = await next(url);
	} else {
		response = await next();
	}

	// next() may resolve without a Response (API 404 short-circuits); pass through
	if (!(response instanceof Response)) return response;
	return applySecurityHeaders(response);
});
