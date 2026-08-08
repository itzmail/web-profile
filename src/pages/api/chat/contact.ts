export const prerender = false;

import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

interface ContactRequestBody {
    name: string;
    email: string;
    question: string;
    pageContext?: { type: "project" | "blog"; title: string };
}

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_SECONDS = 600; // 10 minutes
const NOTIFY_DAILY_MAX = 10;
const NOTIFY_DAILY_WINDOW_SECONDS = 86400; // 24 hours
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 200;
const MAX_QUESTION_LENGTH = 1000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
    let body: ContactRequestBody;
    try {
        body = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const question = typeof body.question === "string" ? body.question.trim() : "";

    if (!name || name.length > MAX_NAME_LENGTH) {
        return new Response(JSON.stringify({ error: "Nama tidak valid" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
        return new Response(JSON.stringify({ error: "Email tidak valid" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    if (!question || question.length > MAX_QUESTION_LENGTH) {
        return new Response(JSON.stringify({ error: "Pertanyaan tidak valid" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const kv = env.SESSION;
    if (!kv) {
        return new Response(JSON.stringify({ error: "Rate limiter unavailable" }), {
            status: 503,
            headers: { "Content-Type": "application/json" },
        });
    }

    const rateLimitKey = `ratelimit:contact:${clientAddress ?? "unknown"}`;
    const current = await kv.get(rateLimitKey);
    const count = current ? parseInt(current, 10) : 0;

    if (count >= RATE_LIMIT_MAX) {
        return new Response(
            JSON.stringify({ error: "Terlalu banyak percobaan, coba lagi sebentar lagi." }),
            { status: 429, headers: { "Content-Type": "application/json" } }
        );
    }

    await kv.put(rateLimitKey, String(count + 1), { expirationTtl: RATE_LIMIT_WINDOW_SECONDS });

    const botToken = env.TELEGRAM_BOT_TOKEN;
    const chatId = env.TELEGRAM_CHAT_ID;
    if (!botToken || !chatId) {
        return new Response(JSON.stringify({ error: "Notifikasi tidak tersedia" }), {
            status: 503,
            headers: { "Content-Type": "application/json" },
        });
    }

    const todayUtc = new Date().toISOString().slice(0, 10);
    const notifyKey = `notify:telegram:${todayUtc}`;
    const notifyCurrent = await kv.get(notifyKey);
    const notifyCount = notifyCurrent ? parseInt(notifyCurrent, 10) : 0;

    if (notifyCount >= NOTIFY_DAILY_MAX) {
        // Daily notify budget is spent — quietly succeed so the visitor isn't told anything
        // is wrong; only the Telegram push is skipped.
        return new Response(JSON.stringify({ ok: true }), {
            headers: { "Content-Type": "application/json" },
        });
    }

    const pageLine = body.pageContext?.title
        ? `\n<b>Halaman:</b> ${escapeHtml(body.pageContext.title)}`
        : "";

    const text = [
        "<b>Lead baru dari chat AI</b>",
        `<b>Nama:</b> ${escapeHtml(name)}`,
        `<b>Email:</b> ${escapeHtml(email)}`,
        `<b>Pertanyaan:</b> ${escapeHtml(question)}${pageLine}`,
        `<b>Waktu:</b> ${new Date().toISOString()}`,
    ].join("\n");

    const threadId = env.TELEGRAM_CHAT_THREAD_ID;

    try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                ...(threadId ? { message_thread_id: Number(threadId) } : {}),
                text,
                parse_mode: "HTML",
            }),
        });
    } catch {
        return new Response(JSON.stringify({ error: "Gagal mengirim notifikasi" }), {
            status: 502,
            headers: { "Content-Type": "application/json" },
        });
    }

    await kv.put(notifyKey, String(notifyCount + 1), { expirationTtl: NOTIFY_DAILY_WINDOW_SECONDS });

    return new Response(JSON.stringify({ ok: true }), {
        headers: { "Content-Type": "application/json" },
    });
};
