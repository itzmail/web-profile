export const prerender = false;

import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

/**
 * Agent — System-1 decision router backed by Cloudflare Workers AI
 * (@cf/cloudflare/clef-flash).
 *
 * Clef is a decision model: it does NOT generate text. It reads a `state` and a
 * schema of typed questions and returns a probability for every allowed option.
 * That makes it a perfect fit for instant intent routing — we never pay for
 * output tokens, and the round trip stays in the ~350-700ms range.
 */

export type AgentIntent =
	| "view_cv"
	| "hire_contact"
	| "browse_projects"
	| "inspect_project"
	| "open_tools"
	| "deep_question"
	| "smalltalk";

export type AgentAudience = "recruiter" | "client" | "engineer";

export interface AgentDecision {
	intent: AgentIntent;
	audience: AgentAudience;
	confidence: number;
	probabilities: Record<string, number>;
	needsLlm: boolean;
	needsLlmProbability: number;
	/** "clef" = Workers AI decision model, "local" = deterministic keyword fallback. */
	source: "clef" | "local";
	model: string;
	latencyMs: number;
	/** True when confidence fell below the threshold and the caller should fall back to the LLM. */
	lowConfidence: boolean;
}

const INTENT_CRITERIA: Record<AgentIntent, string> = {
	view_cv: "The visitor wants to see, open, or download the CV / resume / curriculum vitae PDF",
	hire_contact:
		"The visitor wants to contact Ismail for a job offer, freelance work, a quotation, pricing, or a collaboration",
	browse_projects:
		"The visitor wants a general list or index of the projects / portfolio / case studies",
	inspect_project:
		"The visitor asks about the technical details, architecture, stack, or implementation of a specific project",
	open_tools: "The visitor wants to use a developer tool or utility (json, base64, uuid, cron, cidr, regex)",
	deep_question:
		"The visitor asks a factual question about Ismail himself, his career, skills, availability, or background that needs a written answer",
	smalltalk: "The visitor is greeting, saying hello, or making small talk with no real request",
};

const AUDIENCE_CRITERIA: Record<AgentAudience, string> = {
	recruiter: "A recruiter or hiring manager screening a candidate for a role",
	client: "A business owner or prospective client commissioning work",
	engineer: "A fellow engineer curious about technical details",
};

// Sized so chat + agent KV writes stay under the free plan's 1,000 writes/day.
const GLOBAL_DAILY_MAX = 350;
const GLOBAL_DAILY_WINDOW_SECONDS = 86400; // 24 hours
const MAX_QUERY_LENGTH = 400;
const CLEF_TIMEOUT_MS = 8000;

/** Fallback thresholds when a keyword classifier cannot decide. */
const LOCAL_INTENT_SCORES: Array<{ intent: AgentIntent; weight: number; patterns: RegExp }> = [
	{
		intent: "view_cv",
		weight: 1,
		patterns: /\b(cv|curriculum vitae|resume|biodata|curriculum)\b/i,
	},
	{
		intent: "hire_contact",
		weight: 1,
		patterns:
			/\b(hire|hire me|contact|email|reach out|collaborat|freelance|quotation|quote|price|pricing|budget|kontrak|hubungi|kontak|sewa|rate)\b/i,
	},
	{
		intent: "browse_projects",
		weight: 1,
		patterns: /\b(project|projects|portfolio|works?|case stud(y|ies)|portofolio|proyek)\b/i,
	},
	{
		intent: "inspect_project",
		weight: 1,
		patterns:
			/\b(architecture|architectur|stack|implement|bunda mulia|jm click|pintro|subly|how did you|gimana cara|cara kerja|teknologi|teknis)\b/i,
	},
	{
		intent: "open_tools",
		weight: 1,
		patterns: /\b(tool|tools|json|base64|uuid|cron|cidr|regex|diff|hash|converter|konversi)\b/i,
	},
	{
		intent: "smalltalk",
		weight: 1,
		patterns: /^\s*(halo|hi|hello|hey|pagi|siang|sore|malam|apa kabar|how are you|thx|thanks)\b/i,
	},
];

const LOCAL_AUDIENCE_PATTERNS: Array<{ audience: AgentAudience; patterns: RegExp }> = [
	{
		audience: "recruiter",
		patterns: /\b(recruit|hiring|hiring manager|hrd|hr|interview|cv|resume|talent|we are looking)\b/i,
	},
	{
		audience: "client",
		patterns: /\b(client|customer|business|startup|company|perusahaan|quotation|project|komisi|budget)\b/i,
	},
	{
		audience: "engineer",
		patterns: /\b(engineer|developer|dev|programmer|coding|tech stack|architecture|api|backend|frontend)\b/i,
	},
];

interface ClefChoiceAnswer {
	type: "choice";
	choice: string;
	probabilities?: Record<string, number>;
	confidence?: number;
}

interface ClefNoulAnswer {
	type: "noul";
	noul: number;
}

type ClefAnswer = ClefChoiceAnswer | ClefNoulAnswer | { type: string; [key: string]: unknown };

interface ClefResponse {
	model?: string;
	answers?: Record<string, ClefAnswer>;
	usage?: { input_tokens?: number; output_tokens?: number };
}

function isChoice(answer: ClefAnswer | undefined): answer is ClefChoiceAnswer {
	return !!answer && (answer as ClefChoiceAnswer).type === "choice";
}

function isNoul(answer: ClefAnswer | undefined): answer is ClefNoulAnswer {
	return !!answer && (answer as ClefNoulAnswer).type === "noul";
}

function isIntent(value: string): value is AgentIntent {
	return Object.hasOwn(INTENT_CRITERIA, value);
}

function isAudience(value: string): value is AgentAudience {
	return Object.hasOwn(AUDIENCE_CRITERIA, value);
}

function buildState(query: string): string {
	return [
		"Context: This is the personal website of Ismail Alam, a Systems & Fullstack Engineer.",
		"Available sections: CV (PDF), Selected Works, Recent Notes, Offline Developer Tools.",
		`Visitor message: ${query}`,
	].join("\n");
}

function buildQuestions() {
	return {
		intent: {
			type: "choice" as const,
			instructions:
				"Classify what the visitor wants from this personal engineering website.",
			criteria: INTENT_CRITERIA,
		},
		needs_llm: {
			type: "noul" as const,
			instructions:
				"Does answering this require a long written answer rather than an instant UI action like opening the CV, a project page, or the tools page?",
		},
		audience: {
			type: "choice" as const,
			instructions: "Who is the visitor most likely to be?",
			criteria: AUDIENCE_CRITERIA,
		},
	};
}

function decideLocally(query: string, latencyMs: number): AgentDecision {
	const scores = new Map<AgentIntent, number>();

	for (const entry of LOCAL_INTENT_SCORES) {
		if (entry.patterns.test(query)) {
			scores.set(entry.intent, (scores.get(entry.intent) ?? 0) + entry.weight);
		}
	}

	let intent: AgentIntent = "deep_question";
	let confidence = 0.35;
	const probabilities: Record<string, number> = {};

	if (scores.size > 0) {
		const ranked = [...scores.entries()].sort((a, b) => b[1] - a[1]);
		intent = ranked[0][0];
		const total = ranked.reduce((sum, [, value]) => sum + value, 0);
		confidence = Math.min(0.9, 0.5 + ranked[0][1] / total / 2);
		for (const [key, value] of ranked) {
			probabilities[key] = Number((value / total).toFixed(3));
		}
	} else {
		for (const key of Object.keys(INTENT_CRITERIA)) probabilities[key] = 0;
	}

	let audience: AgentAudience = "engineer";
	for (const entry of LOCAL_AUDIENCE_PATTERNS) {
		if (entry.patterns.test(query)) {
			audience = entry.audience;
			break;
		}
	}

	const needsLlm =
		intent === "deep_question" || intent === "inspect_project" ? 0.7 : 0.1;

	return {
		intent,
		audience,
		confidence,
		probabilities,
		needsLlm: needsLlm > 0.5,
		needsLlmProbability: needsLlm,
		source: "local",
		model: "keyword-fallback",
		latencyMs,
		lowConfidence: confidence < 0.5,
	};
}

async function decideWithClef(
	query: string,
	model: string,
	minConfidence: number
): Promise<AgentDecision> {
	const startedAt = Date.now();

	const ai = env.AI;
	if (!ai) {
		throw new Error("AI binding unavailable");
	}

	let timeoutId: ReturnType<typeof setTimeout> | undefined;

	try {
		const raw = (await Promise.race([
			ai.run(
				"@cf/cloudflare/clef-flash" as never,
				{
					model,
					state: buildState(query),
					questions: buildQuestions(),
				} as never
			) as Promise<ClefResponse>,
			new Promise<never>((_, reject) => {
				timeoutId = setTimeout(
					() => reject(new Error("Clef request timed out")),
					CLEF_TIMEOUT_MS
				);
			}),
		])) as ClefResponse;

		const answers = raw?.answers;
		if (!answers || typeof answers !== "object") {
			throw new Error("Malformed Clef response: missing answers");
		}

		const intentAnswer = answers.intent;
		const audienceAnswer = answers.audience;
		const needsLlmAnswer = answers.needs_llm;

		const probabilities = isChoice(intentAnswer) ? (intentAnswer.probabilities ?? {}) : {};
		const rawChoice = isChoice(intentAnswer) ? intentAnswer.choice : "";
		const confidence =
			isChoice(intentAnswer) && typeof intentAnswer.confidence === "number"
				? intentAnswer.confidence
				: (probabilities[rawChoice] ?? 0);

		const intent: AgentIntent = isIntent(rawChoice) ? rawChoice : "deep_question";
		const rawAudience = isChoice(audienceAnswer) ? audienceAnswer.choice : "";
		const audience: AgentAudience = isAudience(rawAudience) ? rawAudience : "engineer";
		const needsLlmProbability = isNoul(needsLlmAnswer) ? needsLlmAnswer.noul : 0;

		return {
			intent,
			audience,
			confidence: Number(confidence.toFixed(4)),
			probabilities,
			needsLlm: needsLlmProbability > 0.5,
			needsLlmProbability: Number(needsLlmProbability.toFixed(4)),
			source: "clef",
			model: raw.model ?? model,
			latencyMs: Date.now() - startedAt,
			lowConfidence: confidence < minConfidence,
		};
	} finally {
		if (timeoutId !== undefined) clearTimeout(timeoutId);
	}
}

async function readJsonBody(request: Request): Promise<unknown> {
	try {
		const contentType = request.headers.get("Content-Type") ?? "";
		if (!contentType.includes("application/json")) return null;
		return await request.json();
	} catch {
		return null;
	}
}

export const POST: APIRoute = async ({ request }) => {
	const body = await readJsonBody(request);
	const query =
		typeof body === "object" && body !== null && "query" in body
			? String((body as { query: unknown }).query ?? "").trim()
			: "";

	if (!query) {
		return new Response(JSON.stringify({ error: "Missing query" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	if (query.length > MAX_QUERY_LENGTH) {
		return new Response(JSON.stringify({ error: "Query too long" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	// Rate limit — reuse the SESSION KV namespace (same pattern as /api/chat).
	// Fail closed: without KV we cannot enforce a budget on billable AI calls.
	const kv = env.SESSION;
	const limiter = env.AGENT_RATE_LIMITER;
	if (!kv || !limiter) {
		return new Response(JSON.stringify({ error: "Rate limiter unavailable" }), {
			status: 503,
			headers: { "Content-Type": "application/json" },
		});
	}

	const clientAddress = request.headers.get("CF-Connecting-IP") ?? "unknown";
	const { success } = await limiter.limit({ key: clientAddress });

	if (!success) {
		return new Response(
			JSON.stringify({ error: "Too many Agent requests, slow down." }),
			{ status: 429, headers: { "Content-Type": "application/json" } }
		);
	}

	// Global daily cap — bounds total Workers AI spend regardless of client churn.
	const todayUtc = new Date().toISOString().slice(0, 10);
	const globalKey = `agent-ratelimit:global:${todayUtc}`;
	const globalCurrent = await kv.get(globalKey);
	const globalCount = globalCurrent ? parseInt(globalCurrent, 10) : 0;

	if (globalCount >= GLOBAL_DAILY_MAX) {
		return new Response(
			JSON.stringify({ error: "Agent is busy today, try again tomorrow." }),
			{ status: 429, headers: { "Content-Type": "application/json" } }
		);
	}

	await kv.put(globalKey, String(globalCount + 1), {
		expirationTtl: GLOBAL_DAILY_WINDOW_SECONDS,
	});

	const model = env.AI_MODEL ?? "clef-flash";
	const minConfidenceRaw = Number(env.AI_MIN_CONFIDENCE ?? "0.5");
	const minConfidence =
		Number.isFinite(minConfidenceRaw) &&
		minConfidenceRaw >= 0 &&
		minConfidenceRaw <= 1
			? minConfidenceRaw
			: 0.5;

	try {
		const decision = await decideWithClef(query, model, minConfidence);
		return new Response(JSON.stringify(decision), {
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "no-store",
			},
		});
	} catch (err) {
		console.warn("[agent] Clef unavailable, using local fallback:", err);
		const decision = decideLocally(query, 0);
		return new Response(JSON.stringify(decision), {
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "no-store",
			},
		});
	}
};
