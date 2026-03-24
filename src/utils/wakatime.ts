import type { WakatimeStats } from "../types/index";

export async function getWakatimeData(): Promise<WakatimeStats | null> {
    const apiKey = import.meta.env.WAKATIME_API_KEY;
    if (!apiKey) {
        console.error("WAKATIME_API_KEY is not set");
        return null;
    }

    try {
        const response = await fetch(
            "https://wakatime.com/api/v1/users/current/stats/last_7_days",
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(apiKey).toString("base64")}`,
                },
            }
        );

        if (!response.ok) {
            console.error("Wakatime API error:", response.statusText);
            return null;
        }

        const data = await response.json();
        return data.data as WakatimeStats;
    } catch (e) {
        console.error("Failed to fetch Wakatime data", e);
        return null;
    }
}
