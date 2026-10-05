/**
 * JSON to TypeScript Interface generator (pure client-side, zero deps).
 */

export interface JsonToTypesOptions {
	rootTypeName?: string;
	useInterface?: boolean; // true => interface, false => type alias
}

export class JsonToTypesError extends Error {}

interface TypeEntry {
	name: string;
	definition: string;
}

/** Convert JSON text to TypeScript interface definitions. */
export function jsonToTypes(json: string, options: JsonToTypesOptions = {}): string {
	const rootTypeName = sanitizeName(options.rootTypeName || "Root");
	let parsed: unknown;
	try {
		parsed = JSON.parse(json);
	} catch (e) {
		throw new JsonToTypesError((e as SyntaxError).message);
	}

	const entries: TypeEntry[] = [];
	const seen = new Map<string, number>();
	generateType(rootTypeName, parsed, entries, seen);

	// generateType pushes children before parents — reverse so the root
	// interface renders first and each type appears before its dependencies.
	return entries.reverse().map((e) => e.definition).join("\n\n") + "\n";
}

function sanitizeName(raw: string): string {
	const name = raw.replace(/[^a-zA-Z0-9_$]/g, "").replace(/^(\d)/, "_$1");
	return name.length > 0 ? name : "Root";
}

function pascalCase(raw: string): string {
	const parts = raw.replace(/[^a-zA-Z0-9]+/g, " ").trim().split(/\s+/);
	const name = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");
	return sanitizeName(name);
}

function generateType(
	name: string,
	value: unknown,
	entries: TypeEntry[],
	seen: Map<string, number>
): string {
	if (value === null) return "null";
	if (Array.isArray(value)) {
		if (value.length === 0) return "unknown[]";
		const memberTypes = [...new Set(value.map((v) => generateType(name, v, entries, seen)))];
		return memberTypes.length === 1 ? `${memberTypes[0]}[]` : `(${memberTypes.join(" | ")})[]`;
	}

	switch (typeof value) {
		case "string":
			return "string";
		case "number":
			return "number";
		case "boolean":
			return "boolean";
		case "object": {
			// Nested object => named interface
			let base = pascalCase(name);
			const count = seen.get(base) ?? 0;
			seen.set(base, count + 1);
			const typeName = count === 0 ? base : `${base}${count + 1}`;

			const lines: string[] = [];
			for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
				const propType = generateType(key, val, entries, seen);
				const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
				lines.push(`\t${safeKey}: ${propType};`);
			}
			const definition = `export interface ${typeName} {\n${lines.join("\n")}\n}`;
			entries.push({ name: typeName, definition });
			return typeName;
		}
		default:
			return "unknown";
	}
}
