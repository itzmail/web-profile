/**
 * cURL command parser & code generator (fetch / axios / Python / Go / PHP).
 * Pure client-side.
 */

export interface ParsedCurl {
	url: string;
	method: string;
	headers: Record<string, string>;
	cookies: Record<string, string>;
	auth?: { user: string; pass: string };
	body?: string;
	bodyIsJson: boolean;
	insecure: boolean;
	followRedirects: boolean;
	warnings: string[];
}

export class CurlParseError extends Error {}

/** Tokenize a shell-like string, respecting single/double quotes. */
function tokenize(input: string): string[] {
	const tokens: string[] = [];
	let cur = "";
	let quote: '"' | "'" | null = null;
	let has = false;
	for (let i = 0; i < input.length; i++) {
		const ch = input[i];
		if (quote) {
			if (ch === "\\" && quote === '"' && i + 1 < input.length) {
				cur += input[++i];
			} else if (ch === quote) {
				quote = null;
			} else {
				cur += ch;
			}
			continue;
		}
		if (ch === '"' || ch === "'") {
			quote = ch;
			has = true;
		} else if (ch === " " || ch === "\t" || ch === "\n") {
			if (cur || has) tokens.push(cur);
			cur = "";
			has = false;
		} else if (ch === "\\" && i + 1 < input.length && input[i + 1] === "\n") {
			i++; // line continuation
		} else {
			cur += ch;
		}
	}
	if (cur || has) tokens.push(cur);
	return tokens;
}

export function parseCurl(cmd: string): ParsedCurl {
	let cleaned = cmd.trim().replace(/^curl(\.exe)?\s+/i, "");
	cleaned = cleaned.replace(/\\\s*\n/g, " ");
	const tokens = tokenize(cleaned);
	if (tokens.length === 0) throw new CurlParseError("Empty curl command.");

	const result: ParsedCurl = {
		url: "",
		method: "",
		headers: {},
		cookies: {},
		body: undefined,
		bodyIsJson: false,
		insecure: false,
		followRedirects: false,
		warnings: [],
	};

	const dataParts: string[] = [];
	let sawData = false;

	for (let i = 0; i < tokens.length; i++) {
		const t = tokens[i];
		const next = () => {
			if (i + 1 >= tokens.length) throw new CurlParseError(`Missing value for flag "${t}".`);
			return tokens[++i];
		};

		switch (t) {
			case "-X":
			case "--request":
				result.method = next().toUpperCase();
				break;
			case "--url":
				result.url = next();
				break;
			case "-H":
			case "--header": {
				const h = next();
				const idx = h.indexOf(":");
				if (idx === -1) {
					result.warnings.push(`Malformed header ignored: "${h}"`);
					break;
				}
				const name = h.slice(0, idx).trim();
				const value = h.slice(idx + 1).trim();
				if (/^accept-encoding$/i.test(name)) break; // skip
				result.headers[name] = value;
				break;
			}
			case "-b":
			case "--cookie": {
				const c = next();
				for (const pair of c.split(";")) {
					const eq = pair.indexOf("=");
					if (eq > 0) result.cookies[pair.slice(0, eq).trim()] = pair.slice(eq + 1).trim();
				}
				break;
			}
			case "-d":
			case "--data":
			case "--data-raw":
			case "--data-ascii":
			case "--data-urlencode":
				sawData = true;
				dataParts.push(next());
				break;
			case "--json":
				sawData = true;
				result.headers["Content-Type"] = "application/json";
				result.headers["Accept"] = "application/json";
				dataParts.push(next());
				break;
			case "-F":
			case "--form":
				result.warnings.push(`Multipart form (-F) is not fully supported; treat body as text.`);
				sawData = true;
				dataParts.push(next());
				break;
			case "-u":
			case "--user": {
				const cred = next();
				const idx = cred.indexOf(":");
				result.auth = { user: cred.slice(0, idx), pass: cred.slice(idx + 1) };
				break;
			}
			case "-k":
			case "--insecure":
				result.insecure = true;
				break;
			case "-L":
			case "--location":
				result.followRedirects = true;
				break;
			case "--compressed":
			case "-s":
			case "--silent":
			case "-v":
			case "--verbose":
			case "-i":
			case "--include":
			case "-S":
			case "--show-error":
			case "-#":
			case "--progress-bar":
			case "-o":
			case "--output":
			case "--retry":
			case "--max-time":
			case "--connect-timeout":
				// consume optional value-less flags; some may take values
				if (["-o", "--output", "--retry", "--max-time", "--connect-timeout"].includes(t)) next();
				break;
			default:
				if (t.startsWith("-")) {
					result.warnings.push(`Unsupported flag ignored: "${t}"`);
				} else {
					result.url = t;
				}
		}
	}

	if (!result.url) throw new CurlParseError("No URL found in curl command.");

	if (dataParts.length > 0) {
		result.body = dataParts.join("&");
	}

	if (!result.method) {
		result.method = sawData ? "POST" : "GET";
	}

	if (result.auth) {
		const basic = btoa(`${result.auth.user}:${result.auth.pass}`);
		result.headers["Authorization"] = `Basic ${basic}`;
	}

	const bodyStr = result.body ?? "";
	try {
		JSON.parse(bodyStr);
		result.bodyIsJson = /application\/(.*\+)?json/i.test(result.headers["Content-Type"] ?? "") ||
			/^\s*[[{]/.test(bodyStr);
	} catch {
		result.bodyIsJson = false;
	}

	return result;
}

// ── Code generators ──────────────────────────────────────────

export type CurlTarget = "fetch" | "axios" | "python" | "go" | "php";

function qsHeaders(headers: Record<string, string>): string {
	return Object.entries(headers)
		.map(([k, v]) => `\t"${k}": ${JSON.stringify(v)},`)
		.join("\n");
}

function pyDict(obj: Record<string, string>, indent = "    "): string {
	return Object.entries(obj)
		.map(([k, v]) => `${indent}"${k}": ${JSON.stringify(v)},`)
		.join("\n");
}

export function generateCode(target: CurlTarget, parsed: ParsedCurl): string {
	const { url, method, headers, body, bodyIsJson } = parsed;

	if (target === "fetch") {
		const lines = [
			`const response = await fetch(${JSON.stringify(url)}, {`,
			`\tmethod: ${JSON.stringify(method)},`,
		];
		if (Object.keys(headers).length) {
			lines.push(`\theaders: {`, qsHeaders(headers), `\t},`);
		}
		if (body !== undefined) {
			lines.push(`\tbody: ${bodyIsJson ? `JSON.stringify(${body.replace(/\n\s*/g, " ")})` : JSON.stringify(body)},`);
		}
		lines.push(`});`);
		lines.push(``, `if (!response.ok) throw new Error(\`HTTP \${response.status}\`);`);
		lines.push(`const data = await response.json();`);
		lines.push(`console.log(data);`);
		return lines.join("\n") + "\n";
	}

	if (target === "axios") {
		const lines = [`import axios from "axios";`, ``];
		lines.push(`const { data } = await axios({`);
		lines.push(`\turl: ${JSON.stringify(url)},`);
		lines.push(`\tmethod: ${JSON.stringify(method.toLowerCase())},`);
		if (Object.keys(headers).length) {
			lines.push(`\theaders: {`, qsHeaders(headers), `\t},`);
		}
		if (body !== undefined) {
			lines.push(`\tdata: ${bodyIsJson ? body.replace(/\n\s*/g, " ") : JSON.stringify(body)},`);
		}
		lines.push(`});`);
		lines.push(`console.log(data);`);
		return lines.join("\n") + "\n";
	}

	if (target === "python") {
		const lines = [`import requests`, ``];
		lines.push(`response = requests.${method.toLowerCase()}(`);
		lines.push(`    ${JSON.stringify(url)},`);
		if (Object.keys(headers).length) {
			lines.push(`    headers={`);
			lines.push(pyDict(headers, "        "));
			lines.push(`    },`);
		}
		if (body !== undefined) {
			lines.push(`    data=${bodyIsJson ? body.replace(/\n\s*/g, " ") : JSON.stringify(body)},`);
		}
		lines.push(`)`);
		lines.push(`print(response.json())`);
		return lines.join("\n") + "\n";
	}

	if (target === "go") {
		const lines = [
			`package main`,
			``,
			`import (`,
			`	"fmt"`,
			`	"io"`,
			`	"net/http"`,
			`)`,
			``,
			`func main() {`,
		];
		if (body !== undefined) {
			lines.push(`	payload := ${JSON.stringify(body)}`);
			lines.push(`	req, err := http.NewRequest(${JSON.stringify(method)}, ${JSON.stringify(url)}, strings.NewReader(payload))`);
			lines.splice(lines.indexOf(`import (`), 0, `	"strings"`);
		} else {
			lines.push(`	req, err := http.NewRequest(${JSON.stringify(method)}, ${JSON.stringify(url)}, nil)`);
		}
		for (const [k, v] of Object.entries(headers)) {
			lines.push(`	req.Header.Set(${JSON.stringify(k)}, ${JSON.stringify(v)})`);
		}
		lines.push(`	if err != nil {`);
		lines.push(`		panic(err)`);
		lines.push(`	}`);
		lines.push(``);
		lines.push(`	res, err := http.DefaultClient.Do(req)`);
		lines.push(`	if err != nil {`);
		lines.push(`		panic(err)`);
		lines.push(`	}`);
		lines.push(`	defer res.Body.Close()`);
		lines.push(``);
		lines.push(`	body, _ := io.ReadAll(res.Body)`);
		lines.push(`	fmt.Println(res.StatusCode, string(body))`);
		lines.push(`}`);
		return lines.join("\n") + "\n";
	}

	// php
	const lines = [`<?php`, ``];
	lines.push(`$ch = curl_init();`);
	lines.push(`curl_setopt_array($ch, [`);
	lines.push(`    CURLOPT_URL => ${JSON.stringify(url)},`);
	lines.push(`    CURLOPT_RETURNTRANSFER => true,`);
	lines.push(`    CURLOPT_CUSTOMREQUEST => ${JSON.stringify(method)},`);
	if (Object.keys(headers).length) {
		lines.push(`    CURLOPT_HTTPHEADER => [`);
		for (const [k, v] of Object.entries(headers)) {
			lines.push(`        ${JSON.stringify(`${k}: ${v}`)},`);
		}
		lines.push(`    ],`);
	}
	if (body !== undefined) {
		lines.push(`    CURLOPT_POSTFIELDS => ${JSON.stringify(body)},`);
	}
	lines.push(`]);`);
	lines.push(``);
	lines.push(`$response = curl_exec($ch);`);
	lines.push(`$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);`);
	lines.push(`curl_close($ch);`);
	lines.push(``);
	lines.push(`echo $status . "\\n" . $response;`);
	return lines.join("\n") + "\n";
}

export const CURL_SAMPLE = `curl -X POST https://api.example.com/v1/users \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk_live_51H7xQ2eEvZ" \\
  -d '{"name": "Ismail", "role": "admin", "tags": ["backend"]}'`;
