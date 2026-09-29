export const prerender = false;

import type { APIRoute } from "astro";

const API_BASE =
    import.meta.env.PUBLIC_API_URL ?? "https://my-data.itsmail.dev/api";
const FILENAME = "Ismail_Nur_Alam_CV.pdf";

export const GET: APIRoute = async ({ url }) => {
    const download = url.searchParams.get("download") === "1";

    try {
        const upstream = await fetch(`${API_BASE}/cv`);

        if (!upstream.ok || !upstream.body) {
            return new Response(
                JSON.stringify({ error: "Failed to fetch CV" }),
                {
                    status: 502,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        return new Response(upstream.body, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `${
                    download ? "attachment" : "inline"
                }; filename="${FILENAME}"`,
                "Cache-Control": "public, max-age=3600",
            },
        });
    } catch {
        return new Response(
            JSON.stringify({ error: "Failed to fetch CV" }),
            {
                status: 502,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
};
