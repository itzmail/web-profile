/**
 * Reads intrinsic image dimensions from the first bytes of a remote image
 * (PNG, JPEG, GIF, WebP) so <img> tags can reserve space and avoid layout shift.
 * Results are cached per isolate; failures resolve to null (image renders as before).
 */
export interface ImageSize {
	width: number;
	height: number;
}

const cache = new Map<string, ImageSize | null>();
const PROBE_BYTES = 65535;
const PROBE_TIMEOUT_MS = 1500;

function parseSize(b: Uint8Array): ImageSize | null {
	// PNG
	if (b[0] === 0x89 && b[1] === 0x50) {
		return {
			width: ((b[16] << 24) | (b[17] << 16) | (b[18] << 8) | b[19]) >>> 0,
			height: ((b[20] << 24) | (b[21] << 16) | (b[22] << 8) | b[23]) >>> 0,
		};
	}
	// GIF
	if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) {
		return { width: b[6] | (b[7] << 8), height: b[8] | (b[9] << 8) };
	}
	// JPEG: walk segments until a start-of-frame marker
	if (b[0] === 0xff && b[1] === 0xd8) {
		let i = 2;
		while (i + 9 < b.length) {
			if (b[i] !== 0xff) {
				i++;
				continue;
			}
			const marker = b[i + 1];
			if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
				return { width: (b[i + 7] << 8) | b[i + 8], height: (b[i + 5] << 8) | b[i + 6] };
			}
			i += 2 + ((b[i + 2] << 8) | b[i + 3]);
		}
		return null;
	}
	// WebP: RIFF....WEBP + VP8 / VP8L / VP8X
	if (b[0] === 0x52 && b[8] === 0x57 && b[9] === 0x45) {
		const kind = String.fromCharCode(b[12], b[13], b[14], b[15]);
		if (kind === "VP8X") {
			return {
				width: 1 + (b[24] | (b[25] << 8) | (b[26] << 16)),
				height: 1 + (b[27] | (b[28] << 8) | (b[29] << 16)),
			};
		}
		if (kind === "VP8L") {
			const bits = b[21] | (b[22] << 8) | (b[23] << 16) | (b[24] << 24);
			return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
		}
		if (kind === "VP8 ") {
			return { width: (b[26] | (b[27] << 8)) & 0x3fff, height: (b[28] | (b[29] << 8)) & 0x3fff };
		}
	}
	return null;
}

export async function getImageSize(url: string): Promise<ImageSize | null> {
	if (cache.has(url)) return cache.get(url) ?? null;
	let size: ImageSize | null = null;
	try {
		const res = await fetch(url, {
			headers: { Range: `bytes=0-${PROBE_BYTES}` },
			signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
		});
		if (res.ok) {
			size = parseSize(new Uint8Array(await res.arrayBuffer()));
			if (size && (!size.width || !size.height)) size = null;
		}
	} catch {
		size = null;
	}
	cache.set(url, size);
	return size;
}

/** Adds width/height (plus async decoding) to <img> tags in an HTML string that lack them. */
export async function addImageDimensions(html: string): Promise<string> {
	const tags = [...new Set(html.match(/<img\b[^>]*>/gi) ?? [])];
	const replacements = await Promise.all(
		tags.map(async (tag) => {
			if (/\swidth\s*=/.test(tag)) return [tag, tag] as const;
			const src = tag.match(/\ssrc\s*=\s*"(https?:\/\/[^"]+)"/i)?.[1];
			const size = src ? await getImageSize(src) : null;
			if (!size) return [tag, tag] as const;
			return [tag, tag.replace(/<img\b/i, `<img width="${size.width}" height="${size.height}" decoding="async"`)] as const;
		}),
	);
	let out = html;
	for (const [from, to] of replacements) if (from !== to) out = out.split(from).join(to);
	return out;
}
