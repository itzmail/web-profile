// Pure TypeScript Protocol Buffers v3 Wire-Format Engine & Dissector
// Zero external runtime dependencies - runs directly in browser via Uint8Array & DataView

export enum WireType {
    VARINT = 0, // int32, int64, uint32, uint64, sint32, sint64, bool, enum
    I64 = 1,    // fixed64, sfixed64, double
    LEN = 2,    // string, bytes, embedded messages, packed repeated fields
    I32 = 5,    // fixed32, sfixed32, float
}

export type ProtoFieldType =
    | "int32"
    | "sint32"
    | "uint32"
    | "int64"
    | "sint64"
    | "bool"
    | "string"
    | "float"
    | "double";

export interface SchemaField {
    id: string;
    name: string;
    type: ProtoFieldType;
    tag: number; // 1..536870911
    value: string | number | boolean;
}

export interface ByteSegment {
    offset: number;
    length: number;
    category: "tag" | "length" | "value";
    fieldId: string;
    fieldName: string;
    tagNumber: number;
    wireType: number;
    wireTypeName: string;
    hexBytes: string[];
    binaryBytes: string[];
    explanation: string;
    bitBreakdown?: { bits: string; label: string; isContinuation?: boolean }[];
}

export interface DissectorStep {
    offset: number;
    title: string;
    description: string;
    rawHex: string;
    type: "tag" | "len" | "data" | "info";
}

export interface EncodingResult {
    rawBytes: Uint8Array;
    hexDump: string;
    totalBytes: number;
    segments: ByteSegment[];
    dissectorSteps: DissectorStep[];
    jsonString: string;
    jsonRawBytes: number;
}

// ==========================================
// 1. Bitwise Varint & ZigZag Helper Functions
// ==========================================

export function encodeVarint(val: number | bigint): number[] {
    let n = typeof val === "bigint" ? val : BigInt(Math.floor(val));
    if (n < 0n) {
        // Negative standard int32/int64 in proto3 is encoded as 10-byte 64-bit 2's complement
        n = BigInt.asUintN(64, n);
    }

    const bytes: number[] = [];
    while (n >= 0x80n) {
        bytes.push(Number((n & 0x7fn) | 0x80n));
        n >>= 7n;
    }
    bytes.push(Number(n & 0x7fn));
    return bytes;
}

export function decodeVarint(bytes: Uint8Array, offset: number): { value: bigint; bytesRead: number } {
    let result = 0n;
    let shift = 0n;
    let bytesRead = 0;

    for (let i = offset; i < bytes.length; i++) {
        const b = BigInt(bytes[i]);
        bytesRead++;
        result |= (b & 0x7fn) << shift;
        if ((b & 0x80n) === 0n) {
            break;
        }
        shift += 7n;
        if (shift >= 70n) {
            throw new Error("Malformed varint: exceeds 64 bits");
        }
    }

    return { value: result, bytesRead };
}

// ZigZag transforms signed integers so small negative numbers produce small positive integers
// -1 -> 1, 1 -> 2, -2 -> 3, 2 -> 4
export function encodeZigZag32(n: number): number {
    return ((n << 1) ^ (n >> 31)) >>> 0;
}

export function decodeZigZag32(n: number): number {
    return (n >>> 1) ^ -(n & 1);
}

export function encodeZigZag64(n: bigint): bigint {
    return (n << 1n) ^ (n >> 63n);
}

export function decodeZigZag64(n: bigint): bigint {
    return (n >> 1n) ^ -(n & 1n);
}

// Pack field number and wire type into a single tag key
export function makeTagKey(fieldNumber: number, wireType: WireType): number {
    return ((fieldNumber << 3) | wireType) >>> 0;
}

export function parseTagKey(tagKey: number): { fieldNumber: number; wireType: WireType } {
    return {
        fieldNumber: tagKey >>> 3,
        wireType: (tagKey & 0x07) as WireType,
    };
}

export function getWireTypeForProtoType(type: ProtoFieldType): WireType {
    switch (type) {
        case "int32":
        case "sint32":
        case "uint32":
        case "int64":
        case "sint64":
        case "bool":
            return WireType.VARINT;
        case "double":
            return WireType.I64;
        case "string":
            return WireType.LEN;
        case "float":
            return WireType.I32;
        default:
            return WireType.VARINT;
    }
}

export function getWireTypeName(wireType: WireType): string {
    switch (wireType) {
        case WireType.VARINT:
            return "0 (VARINT)";
        case WireType.I64:
            return "1 (I64 / Fixed64)";
        case WireType.LEN:
            return "2 (LEN / Length-Delimited)";
        case WireType.I32:
            return "5 (I32 / Fixed32)";
        default:
            return `${wireType} (Unknown)`;
    }
}

// ==========================================
// 2. Binary Serialization & Byte Segmenter
// ==========================================

export function encodeSchemaToProtobuf(fields: SchemaField[]): EncodingResult {
    const byteList: number[] = [];
    const segments: ByteSegment[] = [];
    const dissectorSteps: DissectorStep[] = [];
    const jsonObject: Record<string, unknown> = {};

    const textEncoder = new TextEncoder();

    // Sort fields by tag number (canonical Protobuf wire order)
    const sortedFields = [...fields].sort((a, b) => a.tag - b.tag);

    for (const field of sortedFields) {
        const wireType = getWireTypeForProtoType(field.type);
        const tagKey = makeTagKey(field.tag, wireType);
        const tagBytes = encodeVarint(tagKey);

        const tagOffset = byteList.length;
        byteList.push(...tagBytes);

        // Record Tag Segment
        const tagHex = tagBytes.map((b) => b.toString(16).padStart(2, "0").toUpperCase());
        const tagBin = tagBytes.map((b) => b.toString(2).padStart(8, "0"));

        segments.push({
            offset: tagOffset,
            length: tagBytes.length,
            category: "tag",
            fieldId: field.id,
            fieldName: field.name,
            tagNumber: field.tag,
            wireType,
            wireTypeName: getWireTypeName(wireType),
            hexBytes: tagHex,
            binaryBytes: tagBin,
            explanation: `Field #${field.tag} "${field.name}" → Key: (${field.tag} << 3) | ${wireType} = ${tagKey} (0x${tagKey.toString(16).toUpperCase()})`,
            bitBreakdown: [
                {
                    bits: (field.tag).toString(2),
                    label: `Field #${field.tag}`,
                },
                {
                    bits: (wireType).toString(2).padStart(3, "0"),
                    label: `WireType ${wireType}`,
                },
            ],
        });

        dissectorSteps.push({
            offset: tagOffset,
            title: `Read Tag Varint: Field #${field.tag}`,
            description: `Decoded key ${tagKey} → Tag #${field.tag}, Wire Type ${getWireTypeName(wireType)}`,
            rawHex: tagHex.join(" "),
            type: "tag",
        });

        // Encode Field Payload Value based on type
        switch (field.type) {
            case "int32":
            case "uint32": {
                const numVal = Number(field.value) || 0;
                jsonObject[field.name] = numVal;

                const valOffset = byteList.length;
                const valBytes = encodeVarint(numVal);
                byteList.push(...valBytes);

                const valHex = valBytes.map((b) => b.toString(16).padStart(2, "0").toUpperCase());
                const valBin = valBytes.map((b) => b.toString(2).padStart(8, "0"));

                segments.push({
                    offset: valOffset,
                    length: valBytes.length,
                    category: "value",
                    fieldId: field.id,
                    fieldName: field.name,
                    tagNumber: field.tag,
                    wireType,
                    wireTypeName: getWireTypeName(wireType),
                    hexBytes: valHex,
                    binaryBytes: valBin,
                    explanation: `Value ${numVal} (${field.type}) encoded as Base-128 Varint (${valBytes.length} byte${valBytes.length > 1 ? "s" : ""})`,
                });

                dissectorSteps.push({
                    offset: valOffset,
                    title: `Read Varint Value: ${numVal}`,
                    description: `Extracted numeric value ${numVal} across ${valBytes.length} byte(s)`,
                    rawHex: valHex.join(" "),
                    type: "data",
                });
                break;
            }

            case "sint32": {
                const numVal = Number(field.value) || 0;
                jsonObject[field.name] = numVal;

                const zigZag = encodeZigZag32(numVal);
                const valOffset = byteList.length;
                const valBytes = encodeVarint(zigZag);
                byteList.push(...valBytes);

                const valHex = valBytes.map((b) => b.toString(16).padStart(2, "0").toUpperCase());
                const valBin = valBytes.map((b) => b.toString(2).padStart(8, "0"));

                segments.push({
                    offset: valOffset,
                    length: valBytes.length,
                    category: "value",
                    fieldId: field.id,
                    fieldName: field.name,
                    tagNumber: field.tag,
                    wireType,
                    wireTypeName: getWireTypeName(wireType),
                    hexBytes: valHex,
                    binaryBytes: valBin,
                    explanation: `Signed value ${numVal} → ZigZag encoded to ${zigZag} → Varint (${valBytes.length} byte${valBytes.length > 1 ? "s" : ""})`,
                });

                dissectorSteps.push({
                    offset: valOffset,
                    title: `Read ZigZag sint32: ${numVal}`,
                    description: `Decoded ZigZag ${zigZag} → Signed Integer ${numVal}`,
                    rawHex: valHex.join(" "),
                    type: "data",
                });
                break;
            }

            case "int64":
            case "uint64": {
                let bigVal: bigint;
                try {
                    bigVal = BigInt(String(field.value || "0"));
                } catch {
                    bigVal = 0n;
                }
                jsonObject[field.name] = Number(bigVal);

                const valOffset = byteList.length;
                const valBytes = encodeVarint(bigVal);
                byteList.push(...valBytes);

                const valHex = valBytes.map((b) => b.toString(16).padStart(2, "0").toUpperCase());
                const valBin = valBytes.map((b) => b.toString(2).padStart(8, "0"));

                segments.push({
                    offset: valOffset,
                    length: valBytes.length,
                    category: "value",
                    fieldId: field.id,
                    fieldName: field.name,
                    tagNumber: field.tag,
                    wireType,
                    wireTypeName: getWireTypeName(wireType),
                    hexBytes: valHex,
                    binaryBytes: valBin,
                    explanation: `64-bit value ${bigVal} encoded as Base-128 Varint (${valBytes.length} byte${valBytes.length > 1 ? "s" : ""})`,
                });

                dissectorSteps.push({
                    offset: valOffset,
                    title: `Read 64-bit Varint: ${bigVal}`,
                    description: `Extracted 64-bit integer ${bigVal}`,
                    rawHex: valHex.join(" "),
                    type: "data",
                });
                break;
            }

            case "sint64": {
                let bigVal: bigint;
                try {
                    bigVal = BigInt(String(field.value || "0"));
                } catch {
                    bigVal = 0n;
                }
                jsonObject[field.name] = Number(bigVal);

                const zigZag = encodeZigZag64(bigVal);
                const valOffset = byteList.length;
                const valBytes = encodeVarint(zigZag);
                byteList.push(...valBytes);

                const valHex = valBytes.map((b) => b.toString(16).padStart(2, "0").toUpperCase());
                const valBin = valBytes.map((b) => b.toString(2).padStart(8, "0"));

                segments.push({
                    offset: valOffset,
                    length: valBytes.length,
                    category: "value",
                    fieldId: field.id,
                    fieldName: field.name,
                    tagNumber: field.tag,
                    wireType,
                    wireTypeName: getWireTypeName(wireType),
                    hexBytes: valHex,
                    binaryBytes: valBin,
                    explanation: `Signed 64-bit ${bigVal} → ZigZag64 ${zigZag} → Varint (${valBytes.length} byte${valBytes.length > 1 ? "s" : ""})`,
                });

                dissectorSteps.push({
                    offset: valOffset,
                    title: `Read ZigZag sint64: ${bigVal}`,
                    description: `Decoded ZigZag64 ${zigZag} → Signed Integer ${bigVal}`,
                    rawHex: valHex.join(" "),
                    type: "data",
                });
                break;
            }

            case "bool": {
                const boolVal = field.value === true || field.value === "true" || field.value === 1 || field.value === "1";
                jsonObject[field.name] = boolVal;

                const valOffset = byteList.length;
                const valBytes = [boolVal ? 1 : 0];
                byteList.push(...valBytes);

                const valHex = valBytes.map((b) => b.toString(16).padStart(2, "0").toUpperCase());
                const valBin = valBytes.map((b) => b.toString(2).padStart(8, "0"));

                segments.push({
                    offset: valOffset,
                    length: 1,
                    category: "value",
                    fieldId: field.id,
                    fieldName: field.name,
                    tagNumber: field.tag,
                    wireType,
                    wireTypeName: getWireTypeName(wireType),
                    hexBytes: valHex,
                    binaryBytes: valBin,
                    explanation: `Boolean value ${boolVal} encoded as single byte (0x0${boolVal ? "1" : "0"})`,
                });

                dissectorSteps.push({
                    offset: valOffset,
                    title: `Read Boolean: ${boolVal}`,
                    description: `Value: ${boolVal ? "true (1)" : "false (0)"}`,
                    rawHex: valHex.join(" "),
                    type: "data",
                });
                break;
            }

            case "string": {
                const strVal = String(field.value ?? "");
                jsonObject[field.name] = strVal;

                const strUtf8Bytes = textEncoder.encode(strVal);
                const lenBytes = encodeVarint(strUtf8Bytes.length);

                // 1. Length Prefix Segment
                const lenOffset = byteList.length;
                byteList.push(...lenBytes);

                const lenHex = lenBytes.map((b) => b.toString(16).padStart(2, "0").toUpperCase());
                const lenBin = lenBytes.map((b) => b.toString(2).padStart(8, "0"));

                segments.push({
                    offset: lenOffset,
                    length: lenBytes.length,
                    category: "length",
                    fieldId: field.id,
                    fieldName: field.name,
                    tagNumber: field.tag,
                    wireType,
                    wireTypeName: getWireTypeName(wireType),
                    hexBytes: lenHex,
                    binaryBytes: lenBin,
                    explanation: `String byte length: ${strUtf8Bytes.length} bytes (UTF-8)`,
                });

                dissectorSteps.push({
                    offset: lenOffset,
                    title: `Read Length Prefix: ${strUtf8Bytes.length} bytes`,
                    description: `Next string contains ${strUtf8Bytes.length} UTF-8 bytes`,
                    rawHex: lenHex.join(" "),
                    type: "len",
                });

                // 2. String Payload Bytes
                const valOffset = byteList.length;
                byteList.push(...strUtf8Bytes);

                const strHex = Array.from(strUtf8Bytes).map((b) => b.toString(16).padStart(2, "0").toUpperCase());
                const strBin = Array.from(strUtf8Bytes).map((b) => b.toString(2).padStart(8, "0"));

                segments.push({
                    offset: valOffset,
                    length: strUtf8Bytes.length,
                    category: "value",
                    fieldId: field.id,
                    fieldName: field.name,
                    tagNumber: field.tag,
                    wireType,
                    wireTypeName: getWireTypeName(wireType),
                    hexBytes: strHex,
                    binaryBytes: strBin,
                    explanation: `Raw UTF-8 string: "${strVal}"`,
                });

                dissectorSteps.push({
                    offset: valOffset,
                    title: `Read String Content: "${strVal}"`,
                    description: `Decoded ${strUtf8Bytes.length} bytes into UTF-8 text`,
                    rawHex: strHex.slice(0, 8).join(" ") + (strHex.length > 8 ? "..." : ""),
                    type: "data",
                });
                break;
            }

            case "float": {
                const fVal = Number(field.value) || 0.0;
                jsonObject[field.name] = fVal;

                const buffer = new ArrayBuffer(4);
                new DataView(buffer).setFloat32(0, fVal, true); // Little-endian
                const fBytes = Array.from(new Uint8Array(buffer));

                const valOffset = byteList.length;
                byteList.push(...fBytes);

                const fHex = fBytes.map((b) => b.toString(16).padStart(2, "0").toUpperCase());
                const fBin = fBytes.map((b) => b.toString(2).padStart(8, "0"));

                segments.push({
                    offset: valOffset,
                    length: 4,
                    category: "value",
                    fieldId: field.id,
                    fieldName: field.name,
                    tagNumber: field.tag,
                    wireType,
                    wireTypeName: getWireTypeName(wireType),
                    hexBytes: fHex,
                    binaryBytes: fBin,
                    explanation: `32-bit Float ${fVal} (IEEE 754 Little-Endian)`,
                });

                dissectorSteps.push({
                    offset: valOffset,
                    title: `Read Float (32-bit): ${fVal}`,
                    description: `Fixed 4-byte IEEE 754 single precision float`,
                    rawHex: fHex.join(" "),
                    type: "data",
                });
                break;
            }

            case "double": {
                const dVal = Number(field.value) || 0.0;
                jsonObject[field.name] = dVal;

                const buffer = new ArrayBuffer(8);
                new DataView(buffer).setFloat64(0, dVal, true); // Little-endian
                const dBytes = Array.from(new Uint8Array(buffer));

                const valOffset = byteList.length;
                byteList.push(...dBytes);

                const dHex = dBytes.map((b) => b.toString(16).padStart(2, "0").toUpperCase());
                const dBin = dBytes.map((b) => b.toString(2).padStart(8, "0"));

                segments.push({
                    offset: valOffset,
                    length: 8,
                    category: "value",
                    fieldId: field.id,
                    fieldName: field.name,
                    tagNumber: field.tag,
                    wireType,
                    wireTypeName: getWireTypeName(wireType),
                    hexBytes: dHex,
                    binaryBytes: dBin,
                    explanation: `64-bit Double ${dVal} (IEEE 754 Little-Endian)`,
                });

                dissectorSteps.push({
                    offset: valOffset,
                    title: `Read Double (64-bit): ${dVal}`,
                    description: `Fixed 8-byte IEEE 754 double precision float`,
                    rawHex: dHex.join(" "),
                    type: "data",
                });
                break;
            }
        }
    }

    const rawUint8 = new Uint8Array(byteList);
    const hexDump = formatHexDump(rawUint8);
    const jsonString = JSON.stringify(jsonObject, null, 2);
    const jsonRawBytes = textEncoder.encode(JSON.stringify(jsonObject)).length;

    return {
        rawBytes: rawUint8,
        hexDump,
        totalBytes: rawUint8.length,
        segments,
        dissectorSteps,
        jsonString,
        jsonRawBytes,
    };
}

// Format Uint8Array into a canonical 16-byte hex dump with offset and ASCII column
export function formatHexDump(bytes: Uint8Array): string {
    if (bytes.length === 0) return "00000000: (empty payload)";

    const lines: string[] = [];
    const chunkSize = 16;

    for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.slice(i, i + chunkSize);
        const offsetHex = i.toString(16).padStart(8, "0");

        const hexParts: string[] = [];
        let asciiPart = "";

        for (let j = 0; j < chunkSize; j++) {
            if (j < chunk.length) {
                const b = chunk[j];
                hexParts.push(b.toString(16).padStart(2, "0").toUpperCase());
                asciiPart += (b >= 32 && b <= 126) ? String.fromCharCode(b) : ".";
            } else {
                hexParts.push("  ");
            }
        }

        // Add visual gap in middle (after 8 bytes)
        const formattedHex = hexParts.slice(0, 8).join(" ") + "  " + hexParts.slice(8).join(" ");
        lines.push(`${offsetHex}:  ${formattedHex}  |${asciiPart}|`);
    }

    return lines.join("\n");
}

// Calculate Gzip compressed byte size natively in browser
export async function calculateGzipSize(bytes: Uint8Array): Promise<number> {
    if (bytes.length === 0) return 0;

    if (typeof CompressionStream !== "undefined") {
        try {
            const stream = new Response(new Blob([bytes]).stream().pipeThrough(new CompressionStream("gzip")));
            const blob = await stream.blob();
            return blob.size;
        } catch {
            // Fallback estimation
        }
    }

    // Heuristic fallback for non-supporting environments
    return Math.max(10, Math.round(bytes.length * 0.65));
}
