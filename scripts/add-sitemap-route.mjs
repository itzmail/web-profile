import { readFileSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";

const FILE = new URL("../src/pages/sitemap.xml.ts", import.meta.url);

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => rl.question(q);

const kind = (await ask("Static or dynamic route? [static/dynamic]: ")).trim().toLowerCase();

if (kind === "dynamic") {
  console.log(`
Dynamic routes (fetched from API) aren't auto-inserted — each API response
shape differs. Add it to src/pages/sitemap.xml.ts manually:

1. Import the type:
   import type { YourType } from "../types/index";

2. Add a fetch to the Promise.all array:
   const [posts, projects, yourData] = await Promise.all([
     apiFetch<PostListItem[]>("/posts"),
     apiFetch<ApiProject[]>("/projects"),
     apiFetch<YourType[]>("/your-endpoint"),
   ]);

3. Add a .map() to the urls array:
   ...(yourData ?? []).map((item) => \`/your-route/\${item.slug}\`),
`);
  rl.close();
  process.exit(0);
}

if (kind !== "static") {
  console.error("Please answer 'static' or 'dynamic'.");
  rl.close();
  process.exit(1);
}

let path = (await ask("Route path (e.g. /about): ")).trim();
rl.close();

if (!path.startsWith("/")) path = `/${path}`;

const src = readFileSync(FILE, "utf8");

const match = src.match(/const STATIC_PATHS = \[([^\]]*)\];/);
if (!match) {
  console.error("Could not find STATIC_PATHS array in sitemap.xml.ts");
  process.exit(1);
}

const existing = match[1].match(/"([^"]*)"/g)?.map((s) => s.slice(1, -1)) ?? [];
if (existing.includes(path)) {
  console.log(`"${path}" is already in STATIC_PATHS — nothing to do.`);
  process.exit(0);
}

const updatedList = [...existing, path].map((p) => `"${p}"`).join(", ");
const updated = src.replace(
  /const STATIC_PATHS = \[[^\]]*\];/,
  `const STATIC_PATHS = [${updatedList}];`
);

writeFileSync(FILE, updated);
console.log(`Added "${path}" to STATIC_PATHS in src/pages/sitemap.xml.ts`);
