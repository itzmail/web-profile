export async function getWakatimeData() {
    try {
        const response = await fetch("https://wakatime.com/api/v1/users/current/stats/last_7_days", {
            headers: {
                Authorization: `Basic ${Buffer.from("waka_3aac49f6-a530-46ef-a242-7fc4ec7e4168").toString("base64")}`,
            },
        });

        if (!response.ok) {
            console.error("Wakatime API error:", response.statusText);
            return null;
        }

        const data = await response.json();
        return data.data;
    } catch (e) {
        console.error("Failed to fetch Wakatime data", e);
        return null;
    }
}
