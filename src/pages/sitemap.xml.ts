import type { APIRoute } from "astro";
import { apiFetch } from "../utils/api";
import type { PostListItem, ApiProject, PaginatedResponse } from "../types/index";

const SITE = "https://itsmail.dev";

const STATIC_PATHS = ["/", "/projects", "/notes", "/certificates", "/tools", "/lab"];

export const GET: APIRoute = async () => {
  const [postsRes, projectsRes] = await Promise.all([
    apiFetch<PaginatedResponse<PostListItem> | PostListItem[]>("/posts"),
    apiFetch<ApiProject[]>("/projects"),
  ]);

  const postList: PostListItem[] = Array.isArray(postsRes)
    ? postsRes
    : postsRes?.data && Array.isArray(postsRes.data)
      ? postsRes.data
      : [];

  const projectList: ApiProject[] = Array.isArray(projectsRes)
    ? projectsRes
    : (projectsRes as any)?.data && Array.isArray((projectsRes as any).data)
      ? (projectsRes as any).data
      : [];

  const urls = [
    ...STATIC_PATHS,
    ...postList.filter((p) => Boolean(p?.slug)).map((p) => `/notes/${p.slug}`),
    ...projectList
      .map((p) => p?.web_profile?.data?.slug)
      .filter((slug): slug is string => Boolean(slug))
      .map((slug) => `/projects/${slug}`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => `  <url><loc>${SITE}${path}</loc></url>`).join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
