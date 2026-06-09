export const prerender = false;

import type { APIRoute } from "astro";

interface DayCount {
    date: string;
    count: number;
}

async function fetchGitHub(username: string, token: string): Promise<DayCount[]> {
    const query = `
        query($username: String!) {
            user(login: $username) {
                contributionsCollection {
                    contributionCalendar {
                        weeks {
                            contributionDays {
                                date
                                contributionCount
                            }
                        }
                    }
                }
            }
        }
    `;

    const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, variables: { username } }),
    });

    if (!res.ok) return [];

    const json = await res.json() as {
        data?: {
            user?: {
                contributionsCollection?: {
                    contributionCalendar?: {
                        weeks?: { contributionDays: { date: string; contributionCount: number }[] }[];
                    };
                };
            };
        };
    };

    const weeks = json.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? [];
    const result: DayCount[] = [];
    for (const week of weeks) {
        for (const day of week.contributionDays) {
            result.push({ date: day.date, count: day.contributionCount });
        }
    }
    return result;
}

async function fetchGitLab(username: string, token: string): Promise<DayCount[]> {
    // Get user ID first
    const userRes = await fetch(`https://gitlab.com/api/v4/users?username=${username}`, {
        headers: { "PRIVATE-TOKEN": token },
    });
    if (!userRes.ok) return [];

    const users = await userRes.json() as { id: number }[];
    if (!users.length) return [];

    const userId = users[0].id;

    // GitLab contributions chart returns { "2024-01-01": 3, ... }
    const contribRes = await fetch(
        `https://gitlab.com/api/v4/users/${userId}/contributions_chart`,
        { headers: { "PRIVATE-TOKEN": token } }
    );
    if (!contribRes.ok) return [];

    const chart = await contribRes.json() as Record<string, number>;
    return Object.entries(chart).map(([date, count]) => ({ date, count }));
}

export const GET: APIRoute = async () => {
    const githubToken = import.meta.env.GITHUB_TOKEN;
    const gitlabToken = import.meta.env.GITLAB_TOKEN;
    const githubUser = import.meta.env.GITHUB_USERNAME ?? "itzmail";
    const gitlabUser = import.meta.env.GITLAB_USERNAME ?? "itsmail";

    const results = await Promise.allSettled([
        githubToken ? fetchGitHub(githubUser, githubToken) : Promise.resolve([]),
        gitlabToken ? fetchGitLab(gitlabUser, gitlabToken) : Promise.resolve([]),
    ]);

    const merged = new Map<string, number>();

    for (const result of results) {
        if (result.status === "fulfilled") {
            for (const { date, count } of result.value) {
                merged.set(date, (merged.get(date) ?? 0) + count);
            }
        }
    }

    // Build last 53 weeks (371 days) aligned to Sunday
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Rewind to last Sunday
    const startDay = new Date(today);
    startDay.setDate(today.getDate() - today.getDay());
    // Go back 52 more weeks
    startDay.setDate(startDay.getDate() - 52 * 7);

    const days: { date: string; count: number }[] = [];
    const cursor = new Date(startDay);
    while (cursor <= today) {
        const dateStr = cursor.toISOString().split("T")[0];
        days.push({ date: dateStr, count: merged.get(dateStr) ?? 0 });
        cursor.setDate(cursor.getDate() + 1);
    }

    const total = days.reduce((s, d) => s + d.count, 0);

    return new Response(JSON.stringify({ days, total }), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=3600",
        },
    });
};
