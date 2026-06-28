# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

No test suite — this is a static/SSR site.

## Architecture

**Stack**: Astro 6 (SSR mode) + Cloudflare adapter + vanilla CSS. Deployed to Cloudflare Workers.

**Runtime**: All pages are server-rendered at request time (`output: 'server'`). There is no static generation. Cloudflare KV (`SESSION` binding) is available but currently unused.

---

### Data flow

All content comes from the `my-data` Laravel API at `PUBLIC_API_URL` (default: `https://my-data.itsmail.dev/api`).

`src/utils/api.ts` — single `apiFetch<T>(path)` function. Returns `null` on any error; all pages must handle `null` gracefully.

Pages fetch directly in the Astro frontmatter at request time (no caching layer). Types for all API responses are in `src/types/index.ts`.

---

### Pages

| Route | File | Data fetched |
|-------|------|-------------|
| `/` | `pages/index.astro` | — (delegates to components) |
| `/projects` | `pages/projects/index.astro` | `/projects` |
| `/projects/[slug]` | `pages/projects/[slug].astro` | `/projects` (finds by `web_profile.data.slug`) |
| `/certificates` | `pages/certificates/index.astro` | `/certificates` |
| `/blog` | `pages/blog/index.astro` | `/posts` |
| `/blog/[slug]` | `pages/blog/[slug].astro` | `/posts/{slug}` (redirect 404 if null/draft) |
| `/api/wakatime` | `pages/api/wakatime.ts` | Wakatime API (proxied, 5min Cache-Control) |

---

### Bento grid (homepage)

`BentoGrid.astro` composes multiple `Bento*.astro` sub-components. Each fetches its own data independently. The BentoWakatime component fetches from the `/api/wakatime` proxy route (client-side) to avoid exposing `WAKATIME_API_KEY`.

---

### Styling

- Single global stylesheet: `src/styles/global.css`
- CSS custom properties for theming (`--text`, `--surface`, `--green`, `--border`, etc.)
- Dark/light theme toggled via `data-theme` attribute on `<html>`, persisted in `localStorage`. Theme is applied inline before paint (script in `<head>`) to prevent flash.
- Scroll reveal via `IntersectionObserver` in `Layout.astro` — add class `reveal` or `reveal-stagger` to any element.
- No CSS framework — all styles are vanilla.

---

### Markdown rendering

`marked` library is used to render Markdown content (`web_profile.data.content` on project detail pages). Rendered via `set:html` directive.

---

### Static assets

- `src/assets/icons/` — SVG icons as `.astro` components
- `src/data/site.ts` — static copy strings (site name, contact section, footer text)

---

### Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `PUBLIC_API_URL` | No | Backend API base URL (default: `https://my-data.itsmail.dev/api`) |
| `WAKATIME_API_KEY` | Yes (for stats) | Wakatime API key, server-side only |
| `GITHUB_TOKEN` | No | For git activity heatmap component |
| `GITHUB_USERNAME` | No | GitHub username for heatmap |
| `GITLAB_TOKEN` | No | GitLab token for heatmap |
| `GITLAB_USERNAME` | No | GitLab username for heatmap |

`PUBLIC_` prefix = exposed to client-side. All others are server-only.
