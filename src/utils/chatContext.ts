import { apiFetch } from "./api";
import type { ApiProject, ApiSettings, Experience } from "../types/index";

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_PROJECTS = 15;
const MAX_PROJECT_SUMMARY_LENGTH = 200;

let cachedContext: string | null = null;
let cachedAt = 0;

export async function buildBaseContext(): Promise<string> {
    const now = Date.now();
    if (cachedContext && now - cachedAt < CACHE_TTL_MS) {
        return cachedContext;
    }

    const [settings, experiences, projects] = await Promise.all([
        apiFetch<ApiSettings>("/settings"),
        apiFetch<Experience[]>("/experiences"),
        apiFetch<ApiProject[]>("/projects"),
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

    if (projects && projects.length > 0) {
        lines.push("");
        lines.push("[PROYEK]");
        for (const project of projects.slice(0, MAX_PROJECTS)) {
            const stack = (project.web_profile?.data?.stack ?? []).join(", ");
            const summary = (project.description ?? "").slice(0, MAX_PROJECT_SUMMARY_LENGTH);
            lines.push(`- ${project.title}${stack ? ` [stack: ${stack}]` : ""}${summary ? `: ${summary}` : ""}`);
        }
    }

    cachedContext = lines.join("\n");
    cachedAt = now;
    return cachedContext;
}
