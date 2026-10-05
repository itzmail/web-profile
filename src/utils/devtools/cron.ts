/**
 * Cron expression parser, human description, and next-run calculator.
 * Supports standard 5-field Vixie cron + @aliases. Pure client-side.
 */

export interface CronMatch {
	minute: Set<number>;
	hour: Set<number>;
	dayOfMonth: Set<number>; // null in set => '*'
	dayOfWeek: Set<number>; // 0 = Sunday (both 0 and 7 accepted)
	month: Set<number>;
	starDom: boolean;
	starDow: boolean;
}

export class CronParseError extends Error {}

const ALIASES: Record<string, string> = {
	"@yearly": "0 0 1 1 *",
	"@annually": "0 0 1 1 *",
	"@monthly": "0 0 1 * *",
	"@weekly": "0 0 * * 0",
	"@daily": "0 0 * * *",
	"@midnight": "0 0 * * *",
	"@hourly": "0 * * * *",
};

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function parseField(raw: string, min: number, max: number, names?: Map<string, number>): number[] {
	const values = new Set<number>();
	for (const partRaw of raw.split(",")) {
		const part = partRaw.trim();
		if (!part) throw new CronParseError(`Empty list item in field "${raw}".`);
		let range = part;
		let step = 1;
		const slashIdx = part.indexOf("/");
		if (slashIdx !== -1) {
			range = part.slice(0, slashIdx);
			step = Number(part.slice(slashIdx + 1));
			if (!Number.isInteger(step) || step < 1) throw new CronParseError(`Invalid step in "${partRaw}".`);
		}

		let start: number;
		let end: number;
		if (range === "*") {
			start = min;
			end = max;
			if (slashIdx === -1) {
				for (let v = start; v <= end; v++) values.add(v);
				continue;
			}
		} else {
			const dashIdx = range.indexOf("-");
			if (dashIdx !== -1) {
				start = toNumber(range.slice(0, dashIdx), names);
				end = toNumber(range.slice(dashIdx + 1), names);
			} else {
				start = toNumber(range, names);
				// step without range: "5/15" means start at 5 to max
				end = slashIdx !== -1 ? max : start;
			}
			if (start > end) throw new CronParseError(`Invalid range "${range}".`);
		}
		for (let v = start; v <= end; v += step) values.add(v);
	}
	for (const v of values) {
		if (v < min || v > max) throw new CronParseError(`Value ${v} out of bounds (${min}-${max}) in field "${raw}".`);
	}
	return [...values];
}

function toNumber(raw: string, names?: Map<string, number>): number {
	const key = raw.toUpperCase();
	if (names?.has(key)) return names.get(key)!;
	const n = Number(raw);
	if (!Number.isInteger(n)) throw new CronParseError(`Invalid value "${raw}".`);
	return n;
}

export function parseCron(expr: string): CronMatch {
	let cleaned = expr.trim().toLowerCase().split(/\s+/).join(" ");
	if (ALIASES[cleaned]) cleaned = ALIASES[cleaned];

	const fields = cleaned.split(" ");
	if (fields.length !== 5) {
		throw new CronParseError(`Expected 5 fields (minute hour dom month dow), got ${fields.length}.`);
	}

	const monthMap = new Map(MONTH_NAMES.map((n, i) => [n.toUpperCase(), i + 1]));
	const dayMap = new Map(DAY_NAMES.map((n, i) => [n.toUpperCase().slice(0, 3), i]));

	const minute = parseField(fields[0], 0, 59);
	const hour = parseField(fields[1], 0, 23);
	const dom = parseField(fields[2], 1, 31);
	let month = parseField(fields[3], 1, 12, monthMap);
	let dow = parseField(fields[4], 0, 7, dayMap);
	// Normalize 7 -> 0 (Sunday)
	dow = [...new Set(dow.map((d) => (d === 7 ? 0 : d)))];

	return {
		minute: new Set(minute),
		hour: new Set(hour),
		dayOfMonth: new Set(dom),
		dayOfWeek: new Set(dow),
		month: new Set(month),
		starDom: fields[2] === "*",
		starDow: fields[4] === "*",
	};
}

/** Vixie cron: if both dom and dow are restricted, match on either. */
function matchesDate(c: CronMatch, d: Date): boolean {
	if (!c.minute.has(d.getMinutes())) return false;
	if (!c.hour.has(d.getHours())) return false;
	if (!c.month.has(d.getMonth() + 1)) return false;
	const domOk = c.starDom || c.dayOfMonth.has(d.getDate());
	const dowOk = c.starDow || c.dayOfWeek.has(d.getDay());
	if (c.starDom && c.starDow) return true;
	if (c.starDom) return dowOk;
	if (c.starDow) return domOk;
	return domOk || dowOk;
}

/** Next `count` matching run times, minute resolution, scanned up to 2 years ahead. */
export function nextRuns(c: CronMatch, count = 5, from: Date = new Date()): Date[] {
	const out: Date[] = [];
	const start = new Date(from.getTime());
	start.setSeconds(0, 0);
	start.setMinutes(start.getMinutes() + 1);

	const cursor = new Date(start);
	const limit = new Date(start.getTime());
	limit.setFullYear(limit.getFullYear() + 2);

	while (cursor <= limit && out.length < count) {
		if (!c.month.has(cursor.getMonth() + 1)) {
			// Jump to the 1st of the next month
			cursor.setMonth(cursor.getMonth() + 1, 1);
			cursor.setHours(0, 0, 0, 0);
			continue;
		}
		if (matchesDate(c, cursor)) {
			out.push(new Date(cursor));
		}
		cursor.setMinutes(cursor.getMinutes() + 1);
	}
	if (out.length < count) {
		throw new CronParseError("No matching time found within 2 years — expression may never fire.");
	}
	return out;
}

function listToWords(values: number[], names: string[] | null): string {
	const sorted = [...values].sort((a, b) => a - b);
	const label = (v: number) => (names ? names[v] : String(v));
	if (sorted.length === 1) return label(sorted[0]);
	if (sorted.every((v, i) => i === 0 || v === sorted[i - 1] + 1)) {
		if (names) {
			const from = names[sorted[0]];
			const to = names[sorted[sorted.length - 1]];
			if (DAY_NAMES.includes(from) && DAY_NAMES.includes(to)) return `${from} through ${to}`;
			return `${from} to ${to}`;
		}
		return `${sorted[0]} through ${sorted[sorted.length - 1]}`;
	}
	return sorted.map(label).join(", ");
}

/** Human-readable description, cron-style grammar. */
export function describeCron(c: CronMatch): string {
	const h = [...c.hour];
	const m = [...c.minute];
	const parts: string[] = [];

	if (m.length === 60 && h.length === 24) {
		parts.push("Every minute");
	} else if (h.length === 24) {
		parts.push(`At minute ${listToWords(m, null)} of every hour`);
	} else {
		parts.push(`At ${fmtClock(h, m)}`);
	}

	// Day scope
	const dayClause: string[] = [];
	if (!c.starDom && !c.starDow) {
		dayClause.push(
			`on day-of-month ${listToWords([...c.dayOfMonth], null)} or ${listToWords([...c.dayOfWeek], DAY_NAMES)}`
		);
	} else if (!c.starDom) {
		dayClause.push(`on day-of-month ${listToWords([...c.dayOfMonth], null)}`);
	} else if (!c.starDow) {
		dayClause.push(`on ${listToWords([...c.dayOfWeek], DAY_NAMES)}`);
	}

	if (c.month.size < 12) {
		dayClause.push(`in ${listToWords([...c.month], MONTH_NAMES)}`);
	}

	return `${parts.join(", ")} ${dayClause.join(", ")}`.trim();
}

function fmtClock(hours: number[], minutes: number[]): string {
	const hh = hours.length === 1 ? String(hours[0]).padStart(2, "0") : "HH";
	const mm = minutes.length === 1 ? String(minutes[0]).padStart(2, "0") : minutes.length <= 5 ? minutes.map((x) => String(x).padStart(2, "0")).join(", ") : "MM";
	return `${hh}:${mm}`;
}

export const CRON_PRESETS: { label: string; expr: string }[] = [
	{ label: "Every minute", expr: "* * * * *" },
	{ label: "Hourly", expr: "0 * * * *" },
	{ label: "Daily 09:00", expr: "0 9 * * *" },
	{ label: "Weekdays 09:00", expr: "0 9 * * 1-5" },
	{ label: "Every 15 min", expr: "*/15 * * * *" },
	{ label: "Monthly 1st 00:00", expr: "0 0 1 * *" },
];
