/**
 * ID generation & inspection utilities (UUID v4 / UUID v7 / ULID).
 * Pure client-side, uses Web Crypto when available.
 */

export interface UuidV7Info {
	timestamp: Date | null;
	version: number | null;
	variant: string;
	isValid: boolean;
}

/** RFC 4122 v4 UUID via crypto.getRandomValues with fallback. */
export function uuidV4(): string {
	if (typeof crypto !== "undefined" && crypto.getRandomValues) {
		const bytes = crypto.getRandomValues(new Uint8Array(16));
		bytes[6] = (bytes[6] & 0x0f) | 0x40;
		bytes[8] = (bytes[8] & 0x3f) | 0x80;
		return formatUuid(bytes);
	}
	// Non-crypto fallback (should not happen in browsers)
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

/** UUID v7: Unix epoch ms (48-bit) + random. Time-sortable. */
export function uuidV7(date: Date = new Date()): string {
	const ts = BigInt(date.getTime()) & 0xffffffffffffn;
	if (typeof crypto !== "undefined" && crypto.getRandomValues) {
		const bytes = crypto.getRandomValues(new Uint8Array(16));
		// 48-bit timestamp big-endian
		bytes[0] = Number((ts >> 40n) & 0xffn);
		bytes[1] = Number((ts >> 32n) & 0xffn);
		bytes[2] = Number((ts >> 24n) & 0xffn);
		bytes[3] = Number((ts >> 16n) & 0xffn);
		bytes[4] = Number((ts >> 8n) & 0xffn);
		bytes[5] = Number(ts & 0xffn);
		bytes[6] = (bytes[6] & 0x0f) | 0x70;
		bytes[8] = (bytes[8] & 0x3f) | 0x80;
		return formatUuid(bytes);
	}
	return "00000000-0000-7000-8000-000000000000".replace(/0/g, () =>
		Math.floor(Math.random() * 16).toString(16)
	);
}

// ── ULID ─────────────────────────────────────────────────────
const ULID_ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"; // Crockford base32

export function ulid(date: Date = new Date()): string {
	const time = date.getTime();
	let timePart = "";
	// i descends from 9 (most significant) to 0; append keeps big-endian order
	for (let i = 9; i >= 0; i--) {
		timePart += ULID_ENCODING[Math.floor(time / 32 ** i) % 32];
	}
	let randomness = "";
	const bytes =
		typeof crypto !== "undefined" && crypto.getRandomValues
			? crypto.getRandomValues(new Uint8Array(10))
			: Uint8Array.from({ length: 10 }, () => Math.floor(Math.random() * 256));
	for (let i = 0; i < 10; i++) {
		// 8 bits -> 1.6 chars; distribute across 16 chars (80 bits)
		randomness +=
			ULID_ENCODING[(bytes[i] * 8 + (i > 0 ? bytes[i - 1] : 0)) % 32] ?? ULID_ENCODING[bytes[i] % 32];
	}
	return timePart + randomness;
}

function formatUuid(bytes: Uint8Array): string {
	const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
	return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Inspect a UUID string: validity, version, variant, and v7 timestamp. */
export function inspectUuid(value: string): UuidV7Info {
	const v = value.trim().toLowerCase();
	if (!UUID_RE.test(v)) {
		return { timestamp: null, version: null, variant: "invalid", isValid: false };
	}
	const version = parseInt(v[14], 16);
	const variantBits = parseInt(v[19], 16);
	let variant = "unknown";
	if (variantBits >= 8 && variantBits <= 0xb) variant = "RFC 4122";
	else if ((variantBits & 0xc) === 0xc) variant = "Microsoft GUID";
	else if ((variantBits & 0xe) === 0xc) variant = "NCS (backward compat)";

	let timestamp: Date | null = null;
	if (version === 7) {
		// 48-bit timestamp = first 12 hex digits (8 high + 4 low)
		const ms = parseInt(v.slice(0, 8), 16) * 2 ** 16 + parseInt(v.slice(9, 13), 16);
		const d = new Date(ms);
		timestamp = Number.isFinite(d.getTime()) ? d : null;
	}
	return { timestamp, version, variant, isValid: true };
}

/** Decode a ULID's timestamp part (first 10 chars). */
export function ulidTimestamp(value: string): Date | null {
	const timePart = value.trim().toUpperCase().slice(0, 10);
	if (!/^[0-9ABCDEFGHJKMNPQRSTVWXYZ]{10}$/.test(timePart)) return null;
	let ms = 0;
	for (const ch of timePart) {
		ms = ms * 32 + ULID_ENCODING.indexOf(ch);
	}
	const d = new Date(ms);
	return Number.isFinite(d.getTime()) ? d : null;
}
