export interface LabItem {
    slug: string;
    title: string;
    subtitle: string;
    category: "Security" | "Protocols" | "Distributed Systems" | "Performance";
    difficulty: "Easy" | "Medium" | "Hard";
    readingTime: string;
    rfcRef?: string;
    description: string;
    tags: string[];
    featured?: boolean;
    available: boolean;
    date: string;
}

export const LAB_ITEMS: LabItem[] = [
    {
        slug: "jwt-inspector",
        title: "JWT & Algorithm Confusion Attack Inspector",
        subtitle: "Deconstructing Base64URL tokens, Web Crypto HMAC-SHA256, and critical algorithm confusion exploits.",
        category: "Security",
        difficulty: "Easy",
        readingTime: "5 min",
        rfcRef: "RFC 7519 / RFC 8725",
        description: "Interactive visualizer exploring JWT token anatomy, live HMAC-SHA256 signature calculation via Web Crypto API, and simulating the infamous 'alg: none' vulnerability.",
        tags: ["Auth", "JWT", "Web Crypto", "Security", "RFC 7519"],
        featured: true,
        available: true,
        date: "2025-05-10",
    },
    {
        slug: "protobuf-wire-inspector",
        title: "Protobuf vs JSON Wire-Format Comparator",
        subtitle: "Under the hood of gRPC binary serialization, Varint encoding, and Wire Types.",
        category: "Protocols",
        difficulty: "Medium",
        readingTime: "8 min",
        rfcRef: "Protocol Buffers v3",
        description: "Analyze byte-level binary encoding, ZigZag signed integer packing, and benchmark payload compression against gzip JSON.",
        tags: ["gRPC", "Protobuf", "Binary Encoding", "Network"],
        featured: true,
        available: true,
        date: "2025-05-15",
    },
    {
        slug: "rate-limiter-visualizer",
        title: "Distributed Rate Limiter Algorithms",
        subtitle: "Token Bucket vs Leaky Bucket vs Sliding Window under burst traffic.",
        category: "Distributed Systems",
        difficulty: "Medium",
        readingTime: "7 min",
        rfcRef: "RFC 6585",
        description: "Interactive simulation comparing queueing and drop strategies under concurrent request bursts and node clock drift.",
        tags: ["Distributed Systems", "Resilience", "Traffic"],
        featured: false,
        available: false,
        date: "Coming Soon",
    },
];
