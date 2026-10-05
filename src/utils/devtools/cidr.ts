/**
 * IPv4 CIDR / subnet calculator. Pure client-side, numeric bit math.
 */

export interface CidrResult {
	ip: string;
	cidr: number;
	network: string;
	broadcast: string;
	mask: string;
	wildcard: string;
	firstHost: string;
	lastHost: string;
	totalHosts: number; // usable
	totalAddresses: number; // includes network/broadcast
	binaryIp: string;
	binaryMask: string;
	scope: string;
}

export class CidrError extends Error {}

const ipToInt = (ip: string): number => {
	const parts = ip.trim().split(".");
	if (parts.length !== 4) throw new CidrError("IP must have 4 octets (e.g. 192.168.1.1).");
	let n = 0;
	for (const p of parts) {
		if (!/^\d{1,3}$/.test(p)) throw new CidrError(`Invalid octet "${p}".`);
		const v = Number(p);
		if (v > 255) throw new CidrError(`Octet "${p}" out of range (0-255).`);
		n = (n << 8) | v;
	}
	return n >>> 0;
};

const intToIp = (n: number): string =>
	[(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");

const toBinary = (n: number): string =>
	[
		(n >>> 24) & 255,
		(n >>> 16) & 255,
		(n >>> 8) & 255,
		n & 255,
	]
		.map((b) => b.toString(2).padStart(8, "0"))
		.join(".");

export function classifyIp(ipInt: number): string {
	const a = (ipInt >>> 24) & 255;
	const b = (ipInt >>> 16) & 255;
	if (ipInt === 0) return "Unspecified (0.0.0.0)";
	if ((ipInt & 0xff000000) >>> 24 === 127) return "Loopback (RFC 1122)";
	if (a === 10) return "Private — 10.0.0.0/8 (RFC 1918)";
	if (a === 172 && b >= 16 && b <= 31) return "Private — 172.16.0.0/12 (RFC 1918)";
	if (a === 192 && b === 168) return "Private — 192.168.0.0/16 (RFC 1918)";
	if (a === 169 && b === 254) return "Link-local (RFC 3927)";
	if (a === 100 && b >= 64 && b <= 127) return "CGNAT — 100.64.0.0/10 (RFC 6598)";
	if (a >= 224 && a <= 239) return "Multicast (Class D)";
	if (a >= 240) return "Reserved (Class E)";
	return "Public";
}

export function calcCidr(input: string): CidrResult {
	const trimmed = input.trim();
	const [ipRaw, prefixRaw] = trimmed.split("/");
	let ip = ipRaw;
	let prefix = prefixRaw ?? "32";

	// Dotted mask instead of prefix (e.g. 192.168.1.1/255.255.255.0)
	if (prefix.includes(".")) {
		const maskInt = ipToInt(prefix);
		// Validate contiguous mask
		let tmp = maskInt;
		while (tmp & 0x80000000) tmp = (tmp << 1) >>> 0;
		if (tmp !== 0) throw new CidrError("Subnet mask must be contiguous (e.g. 255.255.255.0).");
		prefix = String(
			maskInt.toString(2).split("").lastIndexOf("1") + 1
		);
	}

	const p = Number(prefix);
	if (!Number.isInteger(p) || p < 0 || p > 32) throw new CidrError("Prefix must be 0-32.");

	const ipInt = ipToInt(ip);
	const maskInt = p === 0 ? 0 : (0xffffffff << (32 - p)) >>> 0;
	const networkInt = (ipInt & maskInt) >>> 0;
	const broadcastInt = (networkInt | ~maskInt) >>> 0;

	let firstHostInt = networkInt;
	let lastHostInt = broadcastInt;
	let usable = broadcastInt - networkInt + 1;
	if (p <= 30) {
		firstHostInt = networkInt + 1;
		lastHostInt = broadcastInt - 1;
		usable -= 2;
	}

	return {
		ip: intToIp(ipInt),
		cidr: p,
		network: intToIp(networkInt),
		broadcast: intToIp(broadcastInt),
		mask: intToIp(maskInt),
		wildcard: intToIp(~maskInt >>> 0),
		firstHost: intToIp(firstHostInt),
		lastHost: intToIp(lastHostInt),
		totalHosts: usable,
		totalAddresses: broadcastInt - networkInt + 1,
		binaryIp: toBinary(ipInt),
		binaryMask: toBinary(maskInt),
		scope: classifyIp(ipInt),
	};
}
