/**
 * Hash & HMAC utilities. SHA family via Web Crypto; MD5 pure JS
 * (not in Web Crypto). Pure client-side.
 */

export type HashAlgo = "MD5" | "SHA-1" | "SHA-256" | "SHA-512";
export type HashFormat = "hex" | "base64";

function toHex(buf: ArrayBuffer): string {
	return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function toB64(buf: ArrayBuffer): string {
	return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function encodeInput(text: string): Uint8Array {
	return new TextEncoder().encode(text);
}

async function cryptoDigest(algo: string, data: Uint8Array): Promise<ArrayBuffer> {
	return crypto.subtle.digest(algo, data as unknown as ArrayBuffer);
}

/** MD5 (RFC 1321) — pure JS implementation. */
export function md5(text: string): string {
	const bytes = encodeInput(text);
	return md5Bytes(bytes);
}

function md5Bytes(bytes: Uint8Array): string {
	// Convert message to 32-bit little-endian words with padding
	const len = bytes.length;
	const bitLen = len * 8;
	const withPadding = new Uint8Array((((len + 8) >> 6) + 1) << 6);
	withPadding.set(bytes);
	withPadding[len] = 0x80;
	const dv = new DataView(withPadding.buffer);
	dv.setUint32(withPadding.length - 8, bitLen >>> 0, true);
	dv.setUint32(withPadding.length - 4, Math.floor(bitLen / 2 ** 32), true);

	const S = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
		5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
		4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
		6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21];

	const K = new Uint32Array(64);
	for (let i = 0; i < 64; i++) {
		K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32);
	}

	let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;

	for (let chunk = 0; chunk < withPadding.length; chunk += 64) {
		const M = new Uint32Array(16);
		for (let i = 0; i < 16; i++) M[i] = dv.getUint32(chunk + i * 4, true);

		let A = a0, B = b0, C = c0, D = d0;
		for (let i = 0; i < 64; i++) {
			let F: number;
			let g: number;
			if (i < 16) {
				F = (B & C) | (~B & D);
				g = i;
			} else if (i < 32) {
				F = (D & B) | (~D & C);
				g = (5 * i + 1) % 16;
			} else if (i < 48) {
				F = B ^ C ^ D;
				g = (3 * i + 5) % 16;
			} else {
				F = C ^ (B | ~D);
				g = (7 * i) % 16;
			}
			F = (F + A + K[i] + M[g]) >>> 0;
			A = D;
			D = C;
			C = B;
			B = (B + ((F << S[i]) | (F >>> (32 - S[i])))) >>> 0;
		}
		a0 = (a0 + A) >>> 0;
		b0 = (b0 + B) >>> 0;
		c0 = (c0 + C) >>> 0;
		d0 = (d0 + D) >>> 0;
	}

	const out = new DataView(new ArrayBuffer(16));
	out.setUint32(0, a0, true);
	out.setUint32(4, b0, true);
	out.setUint32(8, c0, true);
	out.setUint32(12, d0, true);
	return toHex(out.buffer);
}

/** Digest of a text input. */
export async function hashText(algo: HashAlgo, text: string, format: HashFormat = "hex"): Promise<string> {
	if (algo === "MD5") {
		const hex = md5(text);
		if (format === "hex") return hex;
		const bytes = Uint8Array.from(hex.match(/.{2}/g)!.map((h) => parseInt(h, 16)));
		return btoa(String.fromCharCode(...bytes));
	}
	const digest = await cryptoDigest(algo, encodeInput(text));
	return format === "hex" ? toHex(digest) : toB64(digest);
}

/** HMAC-SHA-256/512 of a text input with a secret key. */
export async function hmacText(algo: "SHA-256" | "SHA-512", text: string, secret: string, format: HashFormat = "hex"): Promise<string> {
	const key = await crypto.subtle.importKey(
		"raw",
		encodeInput(secret) as unknown as ArrayBuffer,
		{ name: "HMAC", hash: algo },
		false,
		["sign"]
	);
	const sig = await crypto.subtle.sign("HMAC", key, encodeInput(text) as unknown as ArrayBuffer);
	return format === "hex" ? toHex(sig) : toB64(sig);
}

export const HASH_ALGOS: HashAlgo[] = ["MD5", "SHA-1", "SHA-256", "SHA-512"];
