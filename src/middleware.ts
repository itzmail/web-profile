import { defineMiddleware } from "astro:middleware";

const BLOG_HOST = "blog.itsmail.dev";

export const onRequest = defineMiddleware((context, next) => {
  const { url } = context;

  if (
    url.hostname === BLOG_HOST &&
    !url.pathname.startsWith("/blog") &&
    !url.pathname.startsWith("/api")
  ) {
    url.pathname = `/blog${url.pathname === "/" ? "" : url.pathname}`;
    return next(url);
  }

  return next();
});
