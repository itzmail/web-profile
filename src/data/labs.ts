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
        description: "Interactive dissection of modern token-based authentication, from wire format anatomy to common security exploit patterns.",
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
        description: "Byte-level comparison of serialization formats and what modern binary protocols trade for performance.",
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
        description: "Interactive comparison of traffic control strategies and how distributed counters behave under concurrent load.",
        tags: ["Distributed Systems", "Redis", "Traffic", "Resilience"],
        featured: true,
        available: true,
        date: "2025-05-20",
    },
];
