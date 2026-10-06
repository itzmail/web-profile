/**
 * Line-based diff (LCS) producing side-by-side and unified views.
 * Pure client-side.
 */

export type DiffOp = "equal" | "add" | "remove" | "change";

export interface DiffRow {
	left: { num: number | null; text: string } | null;
	right: { num: number | null; text: string } | null;
	op: DiffOp;
}

export interface DiffStats {
	added: number;
	removed: number;
	unchanged: number;
}

/** Normalize option: trim trailing spaces, ignore blank lines, or JSON-normalize. */
export type DiffNormalize = "none" | "trim" | "json";

function prepare(text: string, mode: DiffNormalize): string[] {
	let lines = text.replace(/\r\n?/g, "\n").split("\n");
	if (mode === "trim") lines = lines.map((l) => l.replace(/\s+$/, ""));
	if (mode === "json") {
		try {
			lines = JSON.stringify(JSON.parse(text), null, 2).split("\n");
		} catch {
			// fall through — diff raw lines
		}
	}
	return lines;
}

export class DiffTooLargeError extends Error {}

/** Guard against O(n·m) memory blow-up (Uint32Array table). ~4M cells). */
const MAX_LCS_CELLS = 4_000_000;

/** Pair removes/adds inside contiguous runs only — never across equal blocks. */
function opsToRows(ops: { op: DiffOp; text: string }[]): DiffRow[] {
	const rows: DiffRow[] = [];
	let k = 0;
	while (k < ops.length) {
		if (ops[k].op === "equal") {
			rows.push({
				left: { num: null, text: ops[k].text },
				right: { num: null, text: ops[k].text },
				op: "equal",
			});
			k++;
			continue;
		}
		const removes: string[] = [];
		while (k < ops.length && ops[k].op === "remove") removes.push(ops[k++].text);
		const adds: string[] = [];
		while (k < ops.length && ops[k].op === "add") adds.push(ops[k++].text);

		const count = Math.max(removes.length, adds.length);
		for (let i = 0; i < count; i++) {
			const l = removes[i];
			const r = adds[i];
			if (l !== undefined && r !== undefined) {
				rows.push({ left: { num: null, text: l }, right: { num: null, text: r }, op: "change" });
			} else if (l !== undefined) {
				rows.push({ left: { num: null, text: l }, right: null, op: "remove" });
			} else {
				rows.push({ left: null, right: { num: null, text: r! }, op: "add" });
			}
		}
	}
	return rows;
}

/** Longest-common-subsequence table (O(n*m); fine for editor-scale inputs). */
export function diffLines(aText: string, bText: string, normalize: DiffNormalize = "none"): DiffRow[] {
	const a = prepare(aText, normalize);
	const b = prepare(bText, normalize);
	const n = a.length;
	const m = b.length;

	if (n * m > MAX_LCS_CELLS) {
		throw new DiffTooLargeError(
			`Input too large for line diff (${n}×${m} lines). Trim the text or split it into smaller chunks.`
		);
	}

	// LCS lengths
	const dp: Uint32Array[] = [];
	for (let i = 0; i <= n; i++) dp.push(new Uint32Array(m + 1));
	for (let i = n - 1; i >= 0; i--) {
		for (let j = m - 1; j >= 0; j--) {
			dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
		}
	}

	// Walk the table
	const ops: { op: DiffOp; text: string }[] = [];
	let i = 0;
	let j = 0;
	while (i < n && j < m) {
		if (a[i] === b[j]) {
			ops.push({ op: "equal", text: a[i] });
			i++;
			j++;
		} else if (dp[i + 1][j] >= dp[i][j + 1]) {
			ops.push({ op: "remove", text: a[i] });
			i++;
		} else {
			ops.push({ op: "add", text: b[j] });
			j++;
		}
	}
	while (i < n) ops.push({ op: "remove", text: a[i++] });
	while (j < m) ops.push({ op: "add", text: b[j++] });

	// Pair remove/add rows for side-by-side alignment
	const rows = opsToRows(ops);

	// Assign line numbers
	let lnum = 0;
	let rnum = 0;
	for (const row of rows) {
		if (row.left && row.op !== "add") row.left.num = ++lnum;
		if (row.right && row.op !== "remove") row.right.num = ++rnum;
	}
	return rows;
}

export function diffStats(rows: DiffRow[]): DiffStats {
	let added = 0;
	let removed = 0;
	let unchanged = 0;
	for (const r of rows) {
		if (r.op === "add" || r.op === "change") added++;
		if (r.op === "remove" || r.op === "change") removed++;
		if (r.op === "equal") unchanged++;
	}
	return { added, removed, unchanged };
}

/** Unified-diff text (like `diff -u`, without hunk headers). */
export function unifiedDiff(aText: string, bText: string, normalize: DiffNormalize = "none"): string {
	const rows = diffLines(aText, bText, normalize);
	const out: string[] = [];
	for (const row of rows) {
		if (row.op === "equal") out.push(`  ${row.left?.text ?? ""}`);
		else if (row.op === "remove") out.push(`- ${row.left?.text ?? ""}`);
		else if (row.op === "add") out.push(`+ ${row.right?.text ?? ""}`);
		else out.push(`- ${row.left?.text ?? ""}`, `+ ${row.right?.text ?? ""}`);
	}
	return out.join("\n") + "\n";
}
