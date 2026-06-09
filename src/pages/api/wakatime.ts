export const prerender = false;

import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
    const apiKey = import.meta.env.WAKATIME_API_KEY;

    if (!apiKey) {
        return new Response(JSON.stringify({ error: "Missing API key" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }

    const response = await fetch(
        "https://api.wakatime.com/api/v1/users/current/stats/last_7_days",
        {
            headers: { Authorization: `Basic ${btoa(apiKey)}` },
        }
    );

    if (!response.ok) {
        return new Response(JSON.stringify({ error: "Wakatime API error" }), {
            status: response.status,
            headers: { "Content-Type": "application/json" },
        });
    }

    const data = await response.json() as { data: unknown };

    return new Response(JSON.stringify(data.data), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=300",
        },
    });
};
