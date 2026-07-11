import type { APIRoute } from "astro";
import { apiFetch } from "../utils/api";
import type { PostListItem, ApiProject } from "../types/index";

const SITE = "https://itsmail.dev";

const STATIC_PATHS = ["/", "/projects", "/certificates", "/blog"];

export const GET: APIRoute = async () => {
  const [posts, projects] = await Promise.all([
    apiFetch<PostListItem[]>("/posts"),
    apiFetch<ApiProject[]>("/projects"),
  ]);

  const urls = [
    ...STATIC_PATHS,
    ...(posts ?? []).map((p) => `/blog/${p.slug}`),
    ...(projects ?? []).map((p) => `/projects/${p.web_profile.data.slug}`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => `  <url><loc>${SITE}${path}</loc></url>`).join("\n")}
</urlset>`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml" },
  });
};
