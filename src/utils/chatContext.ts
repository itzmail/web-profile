import { apiFetch } from "./api";
import type { ApiSettings, Experience } from "../types/index";

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

let cachedContext: string | null = null;
let cachedAt = 0;

export async function buildBaseContext(): Promise<string> {
    const now = Date.now();
    if (cachedContext && now - cachedAt < CACHE_TTL_MS) {
        return cachedContext;
    }

    const [settings, experiences] = await Promise.all([
        apiFetch<ApiSettings>("/settings"),
        apiFetch<Experience[]>("/experiences"),
    ]);

    const lines: string[] = [];

    lines.push("[PROFIL]");
    if (settings?.profile_name) lines.push(`Nama: ${settings.profile_name}`);
    if (settings?.profile_bio) lines.push(`Bio: ${settings.profile_bio}`);
    if (settings?.profile_location) lines.push(`Lokasi: ${settings.profile_location}`);
    if (settings?.available_for_work) {
        lines.push(`Status ketersediaan kerja: ${settings.available_for_work}`);
    }

    if (experiences && experiences.length > 0) {
        lines.push("");
        lines.push("[PENGALAMAN]");
        for (const exp of experiences) {
            const company = exp.web_profile?.data?.company ?? "";
            const date = exp.web_profile?.data?.date ?? "";
            const header = [exp.title, company, date].filter(Boolean).join(" — ");
            lines.push(`- ${header}${exp.description ? `: ${exp.description}` : ""}`);
        }
    }

    cachedContext = lines.join("\n");
    cachedAt = now;
    return cachedContext;
}
