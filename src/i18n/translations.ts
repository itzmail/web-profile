export type Language = "en" | "id";

export interface TranslationDict {
    // Navigation & Global UI
    nav: {
        projects: string;
        certificates: string;
        lab: string;
        blog: string;
        toggleTheme: string;
        toggleTerminal: string;
    };
    // Lab Directory / Index
    labIndex: {
        eyebrow: string;
        title: string;
        subtitle: string;
        readingTimeSuffix: string;
        inDev: string;
        launchBtn: string;
    };
    // Lab #01: JWT Inspector
    jwtLab: {
        eyebrow: string;
        title: string;
        subtitle: string;
        backLink: string;
        livePlaygroundTitle: string;
        resetBtn: string;
        tokenHeaderLabel: string;
        tokenPayloadLabel: string;
        tokenSignatureLabel: string;
        encodedTokenLabel: string;
        charsBytes: string;
        secretKeyLabel: string;
        secretPlaceholder: string;
        randomizeBtn: string;
        attackSimulatorTitle: string;
        attackSimulatorDesc: string;
        btnAlgNoneTitle: string;
        btnAlgNoneDesc: string;
        btnTamperTitle: string;
        btnTamperDesc: string;
        btnExpiredTitle: string;
        btnExpiredDesc: string;
        decodedHeaderLabel: string;
        decodedPayloadLabel: string;
        liveEditableBadge: string;
        signatureValidStatus: string;
        unsecuredNoneStatus: string;
        signatureMismatchStatus: string;
        tokenExpiredStatus: string;
        cryptoUnavailableStatus: string;
        alertNoneTitle: string;
        alertNoneBody: string;
        alertTamperTitle: string;
        alertTamperBody: string;
        alertExpiredTitle: string;
        alertExpiredBody: string;
        alertInsecureTitle: string;
        alertInsecureBody: string;
        // Deep Dive Article
        section1Title: string;
        section1P1: string;
        section1P2: string;
        partHeaderDesc: string;
        partPayloadDesc: string;
        partSignatureDesc: string;
        section2Title: string;
        section2P1: string;
        section2Step1: string;
        section2Step2: string;
        section2Step3: string;
        defenseTitle: string;
        defensePoint1: string;
        defensePoint2: string;
        defensePoint3: string;
        section3Title: string;
        takeaway1Title: string;
        takeaway1Desc: string;
        takeaway2Title: string;
        takeaway2Desc: string;
        footerBackBtn: string;
        footerNextHint: string;
    };
    // Lab #02: Protobuf vs JSON Wire Comparator
    protobufLab: {
        eyebrow: string;
        title: string;
        subtitle: string;
        backLink: string;
        livePlaygroundTitle: string;
        resetBtn: string;
        presetsLabel: string;
        presetUserProfile: string;
        presetIotTelemetry: string;
        presetFinancialOrder: string;
        presetZigzag: string;
        // Quadrant 1: Schema
        schemaTitle: string;
        schemaSubtitle: string;
        fieldNameHeader: string;
        fieldTagHeader: string;
        fieldTypeHeader: string;
        fieldValueHeader: string;
        addFieldBtn: string;
        tagWarning: string;
        // Quadrant 2: Hex Visualizer
        visualizerTitle: string;
        visualizerSubtitle: string;
        hoverHint: string;
        tagLegend: string;
        lengthLegend: string;
        valueLegend: string;
        // Quadrant 3: Comparison Matrix
        comparisonTitle: string;
        protoSizeLabel: string;
        jsonSizeLabel: string;
        jsonGzipSizeLabel: string;
        savingsMeterLabel: string;
        trafficVolumeLabel: string;
        bandwidthSavedLabel: string;
        egressCostSavingsLabel: string;
        costPerGbNote: string;
        // Quadrant 4: Dissector
        dissectorTitle: string;
        dissectorSubtitle: string;
        stepOffset: string;
        stepAction: string;
        // Deep Dive Article
        section1Title: string;
        section1P1: string;
        section1P2: string;
        section1Benefit1Title: string;
        section1Benefit1Desc: string;
        section1Benefit2Title: string;
        section1Benefit2Desc: string;
        section1Benefit3Title: string;
        section1Benefit3Desc: string;
        section2Title: string;
        section2P1: string;
        section2P2: string;
        section3Title: string;
        section3P1: string;
        tagRangeTableTitle: string;
        tag1To15Desc: string;
        tag16PlusDesc: string;
        section4Title: string;
        section4P1: string;
        section4P2: string;
        section5Title: string;
        section5P1: string;
        footerBackBtn: string;
        footerPrevLab: string;
        footerNextHint: string;
    };
    rateLimiterLab: {
        eyebrow: string;
        title: string;
        subtitle: string;
        backLink: string;
        livePlaygroundTitle: string;
        resetBtn: string;
        // Engine selector
        engineLabel: string;
        algoTokenBucket: string;
        algoLeakyBucket: string;
        algoFixedWindow: string;
        algoSlidingWindow: string;
        // Parameter panel
        paramsTitle: string;
        capacityLabel: string;
        refillLeakLabel: string;
        windowMsLabel: string;
        sentCountLabel: string;
        // Traffic generator
        trafficTitle: string;
        sendOneBtn: string;
        burstBtn: string;
        burstSuffix: string;
        streamLabel: string;
        streamOff: string;
        streamOn: string;
        streamPerSecSuffix: string;
        // Bucket visual
        bucketTitle: string;
        tokensFillLabel: string;
        queueFillLabel: string;
        windowFillLabel: string;
        // Live HttpResponse headers
        headersTitle: string;
        headerLimit: string;
        headerRemaining: string;
        headerReset: string;
        headerRetryAfter: string;
        // Stats HUD
        statsTitle: string;
        statAllowed: string;
        statBlocked: string;
        statPassRate: string;
        logTitle: string;
        // Race simulator
        raceTitle: string;
        raceSubtitle: string;
        raceWorkersLabel: string;
        raceLatencyLabel: string;
        raceQuotaLabel: string;
        raceNaiveBtn: string;
        raceAtomicBtn: string;
        raceNaiveModeName: string;
        raceAtomicModeName: string;
        racePassedLabel: string;
        raceDroppedLabel: string;
        raceLeakedLabel: string;
        raceVerdictSafe: string;
        raceVerdictLeak: string;
        raceWorkerLabel: string;
        raceReadLabel: string;
        raceSawLabel: string;
        raceWriteLabel: string;
        raceResultAllowed: string;
        raceResultRejected: string;
        raceTimelineTitle: string;
        // Deep Dive Article
        section1Title: string;
        section1P1: string;
        section1P2: string;
        section1Algo1Title: string;
        section1Algo1Desc: string;
        section1Algo2Title: string;
        section1Algo2Desc: string;
        section1Algo3Title: string;
        section1Algo3Desc: string;
        section1Algo4Title: string;
        section1Algo4Desc: string;
        section2Title: string;
        section2P1: string;
        section2P2: string;
        section2P3: string;
        section3Title: string;
        section3P1: string;
        section3P2: string;
        section3LuaTitle: string;
        section3LuaPoint1: string;
        section3LuaPoint2: string;
        section4Title: string;
        section4P1: string;
        section4Header1: string;
        section4Header2: string;
        section4Header3: string;
        section4Header4: string;
        section5Title: string;
        takeaway1Title: string;
        takeaway1Desc: string;
        takeaway2Title: string;
        takeaway2Desc: string;
        footerPrevLab: string;
        footerNextHint: string;
    };
}

export const translations: Record<Language, TranslationDict> = {
    en: {
        nav: {
            projects: "Projects",
            certificates: "Certificates",
            lab: "Lab",
            blog: "Blog",
            toggleTheme: "Toggle theme",
            toggleTerminal: "Toggle Terminal (Ctrl + `)",
        },
        labIndex: {
            eyebrow: "// systems & architecture lab",
            title: "Proof of Concepts",
            subtitle: "Interactive engineering playgrounds, protocol dissections, and first-principles experiments built directly into the browser.",
            readingTimeSuffix: "min",
            inDev: "// in development",
            launchBtn: "Launch Interactive Lab",
        },
        jwtLab: {
            eyebrow: "// LAB #01 • SECURITY & PROTOCOLS",
            title: "JWT & Algorithm Confusion Attack Inspector",
            subtitle: "A deep dive into JSON Web Token (RFC 7519) anatomy, client-side Web Crypto signature generation, and how subtle parser flaws allow privilege escalation.",
            backLink: "← // return to lab directory",
            livePlaygroundTitle: "LIVE INTERACTIVE PLAYGROUND",
            resetBtn: "Reset",
            tokenHeaderLabel: "Header",
            tokenPayloadLabel: "Payload",
            tokenSignatureLabel: "Signature",
            encodedTokenLabel: "// ENCODED COMPACT TOKEN (Base64URL)",
            charsBytes: "chars (~{bytes} bytes)",
            secretKeyLabel: "1. Secret Key (HMAC-SHA256)",
            secretPlaceholder: "Enter HMAC Secret...",
            randomizeBtn: "Randomize",
            attackSimulatorTitle: "SECURITY ATTACK SIMULATOR",
            attackSimulatorDesc: "Inject known vulnerabilities to test parser defenses:",
            btnAlgNoneTitle: '💣 "alg": "none" Exploit',
            btnAlgNoneDesc: "Bypass signature verification by stripping alg",
            btnTamperTitle: "🎭 Privilege Escalation",
            btnTamperDesc: 'Tamper payload claim (role: "user" → "admin")',
            btnExpiredTitle: "⏰ Expired Token Test",
            btnExpiredDesc: "Set exp claim 1 hour in the past",
            decodedHeaderLabel: "HEADER (Algorithm & Type)",
            decodedPayloadLabel: "PAYLOAD (Claims / Identity)",
            liveEditableBadge: "Live Editable",
            signatureValidStatus: "SIGNATURE VALID (200 OK)",
            unsecuredNoneStatus: "UNSECURED (alg: none)",
            signatureMismatchStatus: "SIGNATURE MISMATCH (401)",
            tokenExpiredStatus: "TOKEN EXPIRED (401)",
            cryptoUnavailableStatus: "CRYPTO API UNAVAILABLE",
            alertNoneTitle: "🚨 Critical Vulnerability: 'alg: none' Accepted",
            alertNoneBody: "Token signature is completely missing. If the server does not enforce white-listed algorithms, attackers can forge any arbitrary payload (e.g. admin access) without needing the secret key.",
            alertTamperTitle: "🛡️ Signature Verification Failed",
            alertTamperBody: "Payload was altered without recalculating signature with the correct secret key. Verification failed: `HMAC_SHA256(Data, Secret) != Token_Signature`.",
            alertExpiredTitle: "⏰ Token Expired (exp claim passed)",
            alertExpiredBody: "The token signature is valid, but the timestamp claim 'exp' ({exp}) is in the past. Standard JWT verifiers will reject this token.",
            alertInsecureTitle: "Insecure Context Detected",
            alertInsecureBody: "Web Crypto API (window.crypto.subtle) is not available. Please access via HTTPS or localhost.",
            section1Title: "1. The First-Principles: What is a JWT?",
            section1P1: "A JSON Web Token (JWT) is not encrypted by default; it is simply signed and Base64URL-encoded. Anyone with the token can inspect its payload. The security guarantees come entirely from the cryptographic signature.",
            section1P2: "A standard compact token consists of three parts separated by dots (.):",
            partHeaderDesc: "Specifies signature algorithm & token type",
            partPayloadDesc: "Claims & identity metadata (openly readable)",
            partSignatureDesc: "Prevents tampering by cryptographically binding header + payload",
            section2Title: '2. The "alg": "none" Exploit Explained',
            section2P1: 'According to the original JWA specification (RFC 7518), an algorithm called "none" was permitted for unsecured tokens. If a backend library naively trusts the alg header passed by the client:',
            section2Step1: 'An attacker modifies the payload to elevate their role (e.g. "role": "admin").',
            section2Step2: 'The attacker updates the header to {"alg": "none"} and removes the signature part.',
            section2Step3: "If the server's verification logic checks if (header.alg === 'none') return true;, the forged token is accepted without any secret key!",
            defenseTitle: "🛡️ How to Defend (RFC 8725 Best Current Practice):",
            defensePoint1: "Enforce Algorithm Whitelisting: Never allow the token header to dictate which algorithm is used during verification. Hardcode the expected algorithm on the server (e.g., explicitly require HS256 or RS256).",
            defensePoint2: "Reject none by Default: Ensure your JWT verification library has unsecured tokens disabled.",
            defensePoint3: "Sufficient Key Entropy: For HS256, HMAC secrets must have at least 256 bits (32 bytes) of cryptographically secure randomness to resist brute-force attacks.",
            section3Title: "3. Key Takeaways from this Lab",
            takeaway1Title: "Encoding ≠ Encryption",
            takeaway1Desc: "Base64URL is merely an encoding mechanism to transport JSON safely across HTTP headers. Sensitive PII must never be stored in JWT payloads without JWE (JSON Web Encryption).",
            takeaway2Title: "Web Crypto in the Browser",
            takeaway2Desc: "Modern browsers can compute HMAC-SHA256 and RSA signatures directly using the native window.crypto.subtle API with zero external dependencies in <1ms.",
            footerBackBtn: "← Back to Lab Directory",
            footerNextHint: "Next Lab: Protobuf vs JSON Wire Inspector (Sprint 2) →",
        },
        protobufLab: {
            eyebrow: "// LAB #02 • PROTOCOLS & NETWORK",
            title: "Protobuf vs JSON Wire-Format Comparator",
            subtitle: "Under the hood of gRPC binary serialization, Varint Base-128 encoding, Tag-WireType packing, and real-world bandwidth compression benchmarks.",
            backLink: "← // return to lab directory",
            livePlaygroundTitle: "LIVE BINARY WIRE PLAYGROUND",
            resetBtn: "Reset Schema",
            presetsLabel: "Presets:",
            presetUserProfile: "User Profile",
            presetIotTelemetry: "IoT Sensor Telemetry",
            presetFinancialOrder: "Financial Order",
            presetZigzag: "ZigZag & Varint Edge Cases",
            // Quadrant 1
            schemaTitle: "1. Schema & Field Definitions",
            schemaSubtitle: "Proto3 Fields",
            fieldNameHeader: "Field Name",
            fieldTagHeader: "Tag #",
            fieldTypeHeader: "Type",
            fieldValueHeader: "Value",
            addFieldBtn: "+ Add Field",
            tagWarning: "⚠️ Tag ≥ 16 requires 2+ key bytes",
            // Quadrant 2
            visualizerTitle: "2. Live Binary Byte Visualizer",
            visualizerSubtitle: "16-Byte Canonical Hex Dump",
            hoverHint: "Hover any byte to inspect binary bit packing and Wire Type details",
            tagLegend: "Tag & WireType",
            lengthLegend: "Length Prefix",
            valueLegend: "Data / Value",
            // Quadrant 3
            comparisonTitle: "3. Wire Size Comparison & Cloud Egress Savings",
            protoSizeLabel: "Protobuf Binary",
            jsonSizeLabel: "Raw Minified JSON",
            jsonGzipSizeLabel: "Gzip Compressed JSON",
            savingsMeterLabel: "Payload Size Reduction vs Raw JSON",
            trafficVolumeLabel: "Simulated Monthly Traffic Scale:",
            bandwidthSavedLabel: "Bandwidth Saved per Month",
            egressCostSavingsLabel: "Estimated Cloud Egress Savings (AWS/GCP @ $0.09/GB)",
            costPerGbNote: "*Based on standard public cloud internet egress pricing tiers.",
            // Quadrant 4
            dissectorTitle: "4. Protocol Packet Dissector",
            dissectorSubtitle: "Bit-by-Bit Decoder Stream Trace",
            stepOffset: "Offset",
            stepAction: "Decoder Action",
            // Deep Dive
            section1Title: "1. Why is gRPC/Protobuf Dramatically Faster than JSON REST?",
            section1P1: "While REST APIs transmit data as ASCII/UTF-8 formatted string text (JSON), Protocol Buffers serialize structured data directly into packed binary bytes. The performance gain comes not only from smaller payload sizes over the wire, but from massive CPU deserialization efficiency.",
            section1P2: "Key architectural advantages include:",
            section1Benefit1Title: "Zero String Tokenization",
            section1Benefit1Desc: "JSON parsers must scan every byte for delimiters, quotes, colons, and escape sequences (O(N) character inspection). Protobuf decoders jump directly across memory offsets using explicit byte lengths.",
            section1Benefit2Title: "No Field Names on the Wire",
            section1Benefit2Desc: "JSON repeats verbose field keys in every single message (e.g. 'transaction_timestamp_utc': 1715000000). Protobuf strips all string keys, replacing them with a single packed integer tag (e.g. 1 byte).",
            section1Benefit3Title: "Memory & CPU Cache Friendly",
            section1Benefit3Desc: "Binary fields decode straight into native struct memory representations (integers and floats don't require string-to-number radix conversions).",
            section2Title: "2. Varint Base-128 Encoding & The MSB Continuation Bit",
            section2P1: "Variable-Length Quantities (Varints) allow small integers to occupy only a single byte instead of fixed 4 or 8 bytes. Integers are sliced into 7-bit payloads.",
            section2P2: "The Most Significant Bit (MSB, 8th bit) acts as a continuation flag: if MSB = 1, more bytes follow; if MSB = 0, this is the terminal byte.",
            section3Title: "3. Field Tag Packing & The Magic of Tags 1 to 15",
            section3P1: "Protobuf binds field number and wire type into a single integer: key = (field_number << 3) | wire_type. Because the lowest 3 bits represent the Wire Type (0 to 7), tag numbers 1 through 15 fit in a single 8-bit byte!",
            tagRangeTableTitle: "Tag Number Allocation Guide (Protobuf Best Practices):",
            tag1To15Desc: "Tags 1 to 15 require only 1 byte for both field tag and wire type. Reserve these exclusively for high-frequency fields.",
            tag16PlusDesc: "Tags 16 through 2047 require 2 bytes. Use these for optional or low-frequency fields.",
            section4Title: "4. ZigZag Encoding: Solving the Two's Complement Dilemma",
            section4P1: "In standard binary two's complement, negative numbers like -1 have their highest bits set to 1 (e.g. 0xFFFFFFFF). In standard varint, -1 would blow up to 10 bytes on the wire!",
            section4P2: "ZigZag encoding solves this by mapping signed integers onto unsigned integers such that small negative numbers become small positive integers: -1 -> 1, 1 -> 2, -2 -> 3, 2 -> 4. For sint32 and sint64, -1 takes only 1 byte!",
            section5Title: "5. Schema Evolution & Unknown Fields Handling",
            section5P1: "Protobuf decoders use the Wire Type metadata inside the tag byte to determine how many bytes to skip if a field tag is not recognized in the local schema. This enables backward and forward compatibility: older services can safely pass through newer fields without breaking.",
            footerBackBtn: "← Back to Lab Directory",
            footerPrevLab: "← Lab #01: JWT Inspector",
            footerNextHint: "Next Lab: Distributed Rate Limiter (Sprint 3) →",
        },
        rateLimiterLab: {
            eyebrow: "// LAB #03 • DISTRIBUTED SYSTEMS",
            title: "Distributed Rate Limiter Visualizer",
            subtitle: "Inside the algorithms that guard every API on earth: Token Bucket vs Leaky Bucket vs Fixed Window vs Sliding Window — and why naive Redis counters leak past their quota.",
            backLink: "← // return to lab directory",
            livePlaygroundTitle: "LIVE TRAFFIC & CONCURRENCY PLAYGROUND",
            resetBtn: "Reset Simulation",
            engineLabel: "Algorithm:",
            algoTokenBucket: "Token Bucket",
            algoLeakyBucket: "Leaky Bucket",
            algoFixedWindow: "Fixed Window",
            algoSlidingWindow: "Sliding Window",
            paramsTitle: "Parameters",
            capacityLabel: "Capacity / Quota",
            refillLeakLabel: "Refill / Leak Rate",
            windowMsLabel: "Window Duration",
            sentCountLabel: "Requests in flight",
            trafficTitle: "Traffic Generator",
            sendOneBtn: "⚡ Send 1 Request",
            burstBtn: "💥 Burst Attack",
            burstSuffix: "rd simult.",
            streamLabel: "Continuous Stream",
            streamOff: "OFF",
            streamOn: "ON",
            streamPerSecSuffix: " req/s",
            bucketTitle: "Limiter State",
            tokensFillLabel: "Tokens available",
            queueFillLabel: "Queue volume",
            windowFillLabel: "Window usage",
            headersTitle: "Live HTTP Response (IETF draft-ietf-httpapi-ratelimit-headers)",
            headerLimit: "RateLimit-Limit",
            headerRemaining: "RateLimit-Remaining",
            headerReset: "RateLimit-Reset",
            headerRetryAfter: "Retry-After (only when blocked)",
            statsTitle: "Session Statistics",
            statAllowed: "Passed (200 OK)",
            statBlocked: "Throttled (429)",
            statPassRate: "Pass rate",
            logTitle: "Request Log",
            raceTitle: "Redis Race Condition Simulator",
            raceSubtitle: "Why naive GET→SET counters leak past quota when workers tick in parallel",
            raceWorkersLabel: "Concurrent workers",
            raceLatencyLabel: "Demo latency (network + processing)",
            raceQuotaLabel: "Quota limit",
            raceNaiveBtn: "Naive GET → SET",
            raceAtomicBtn: "Atomic Lua (EVAL)",
            raceNaiveModeName: "Naive read-modify-write",
            raceAtomicModeName: "Atomic server-side script",
            racePassedLabel: "Passed",
            raceDroppedLabel: "Dropped",
            raceLeakedLabel: "Race Leak",
            raceVerdictSafe: "✅ Zero leakage — atomic EVAL guarantees exactly {n} admissions",
            raceVerdictLeak: "🚨 {leak} request(s) leaked past the {limit}-request quota — classic lost-update race",
            raceWorkerLabel: "Worker",
            raceReadLabel: "read@",
            raceSawLabel: "saw",
            raceWriteLabel: "write@",
            raceResultAllowed: "PASS",
            raceResultRejected: "REJECT",
            raceTimelineTitle: "Timeline (ms) — click a row to inspect",
            section1Title: "1. Why Rate Limiting Exists (Beyond “Being Nice”)",
            section1P1: "Every API endpoint has finite CPU, memory, and downstream dependencies (databases, payment gateways, third-party APIs). Without a limiter, one misbehaving client — or one buggy deploy retry loop — can starve every other tenant. A limiter converts unbounded incoming traffic into a bounded, predictable contract.",
            section1P2: "But not all limiters behave the same. Choosing an algorithm is choosing a trade-off between burst tolerance, memory footprint, and boundary correctness:",
            section1Algo1Title: "Token Bucket — burst-friendly, most common default",
            section1Algo1Desc: "A bucket holds up to N tokens and refills at a constant rate. Each request consumes one token. If tokens remain, bursts of up to N requests fly through instantly; sustained traffic is then paced at the refill rate. Used by Stripe, NGINX, AWS API Gateway (in spirit).",
            section1Algo2Title: "Leaky Bucket — smooths traffic into a constant stream",
            section1Algo2Desc: "Requests enter a FIFO queue that drains at a fixed rate; overflow requests are dropped. Instead of permitting bursts, it shapes traffic into a steady flow — ideal for protecting brittle downstream systems that choke on spikes.",
            section1Algo3Title: "Fixed Window Counter — cheap but boundary-vulnerable",
            section1Algo3Desc: "A simple counter resets at fixed intervals (e.g. every minute). Trivially cheap to implement in Redis (INCR + EXPIRE), but vulnerable to a 2× boundary burst: a client can fire a full quota at 00:59.999 and another full quota at 01:00.001.",
            section1Algo4Title: "Sliding Window Log — exact but memory-hungry",
            section1Algo4Desc: "Stores a timestamp for every request and evicts entries older than the window. Boundary-perfect with zero 2× spikes, but O(N) memory per client makes it expensive at scale — mitigated in production by approximations like Sliding Window Counter.",
            section2Title: "2. The Distributed Cache Problem: Why Naive Redis Counters Leak",
            section2P1: "In a real distributed deployment, thousands of servers share one Redis-backed counter. The naive pattern — READ value, CHECK quota, WRITE value+1 — is not atomic: between the READ of worker A and its WRITE, other workers also READ the same stale value and all reach the same “quota still available” conclusion.",
            section2P2: "This is the classic lost-update race condition. Consider a quota of 10 and 25 concurrent workers: several workers read count = 9 simultaneously, all see “slot available,” all increment, and 14 requests sail past a 10-request quota. Real incidents of this shape cause silent quota bypass, billing discrepancies, and downstream overload.",
            section2P3: "Fixes in production, from most common to most niche: Redis Lua scripts (EVAL) that execute read-check-write atomically on the server, the INCR-then-compare pattern (atomic increment first, reject when the incremented value exceeds the limit), and distributed locking (SETNX / Redlock) which trades throughput for strict ordering.",
            section3Title: "3. Production Implementation Patterns (Redis)",
            section3P1: "The canonical atomic fixed-window limiter is a single Lua script or MULTI/EXEC pipeline: INCR the key, and when the result is 1 (first hit in this window) set the expiry. Incrementing first means every worker gets a unique ordinal — no two workers can ever see the same value twice — making quota enforcement race-free by construction.",
            section3P2: "For sliding-window semantics at scale, production systems use Redis Sorted Sets (ZADD member = unique request id, score = timestamp). Each hit adds one entry and evicts old ones via ZREMRANGEBYSCORE, then checks ZCARD against the quota inside the same atomic script.",
            section3LuaTitle: "🛡️ Battle-Tested Patterns:",
            section3LuaPoint1: "INCR-first (fixed window): The incremented ordinal itself is the admission ticket. Atomic in a single INCR call — no Lua required for basic windows.",
            section3LuaPoint2: "Sorted Set + ZREMRANGEBYSCORE (sliding window): Exact sliding behavior with O(log N) insertion and O(log N) eviction, wrapped in one EVAL for atomicity.",
            section4Title: "4. The Standard HTTP Contract: IETF RateLimit Headers",
            section4P1: "Rate limiting is part of your API's public interface. The IETF draft-ietf-httpapi-ratelimit-headers standard defines response headers so well-behaved clients can back off automatically instead of hammering a 429 wall:",
            section4Header1: "RateLimit-Limit — the total quota per window. Your client's ceiling.",
            section4Header2: "RateLimit-Remaining — tokens/room left right now. Hit 0 and the next request fails.",
            section4Header3: "RateLimit-Reset — seconds until the quota fully recovers. The number autoscalers watch.",
            section4Header4: "Retry-After — mandatory once a request is rejected with 429. Tells the client exactly when to retry.",
            section5Title: "5. Key Takeaways from this Lab",
            takeaway1Title: "No limiter survives a race condition",
            takeaway1Desc: "A perfect in-memory algorithm still fails when distributed without atomicity. Correctness lives at the read-check-write boundary — enforce it with INCR-first, Lua EVAL, or locks.",
            takeaway2Title: "Algorithm choice is a contract with your clients",
            takeaway2Desc: "Token Bucket forgives bursts; Leaky Bucket forgives nothing; Sliding Window tells the truth. Pick the one matching what your downstream can actually absorb, then publish it via RateLimit headers.",
            footerPrevLab: "← Lab #02: Protobuf Wire Inspector",
            footerNextHint: "Next Lab: OAuth2 PKCE Flow (Sprint 4) →",
        },
    },
    id: {
        nav: {
            projects: "Proyek",
            certificates: "Sertifikasi",
            lab: "Lab",
            blog: "Blog",
            toggleTheme: "Ganti tema",
            toggleTerminal: "Buka Terminal (Ctrl + `)",
        },
        labIndex: {
            eyebrow: "// lab sistem & arsitektur",
            title: "Proof of Concepts",
            subtitle: "Playground rekayasa perangkat lunak interaktif, pembedahan protokol, dan eksperimen first-principles langsung di browser.",
            readingTimeSuffix: "menit",
            inDev: "// dalam pengembangan",
            launchBtn: "Buka Lab Interaktif",
        },
        jwtLab: {
            eyebrow: "// LAB #01 • KEAMANAN & PROTOKOL",
            title: "Inspektor JWT & Serangan Algorithm Confusion",
            subtitle: "Membedah anatomi JSON Web Token (RFC 7519), kalkulasi signature Web Crypto HMAC-SHA256 di browser, dan bagaimana celah parser memicu eskalasi hak akses.",
            backLink: "← // kembali ke direktori lab",
            livePlaygroundTitle: "PLAYGROUND INTERAKTIF LIVE",
            resetBtn: "Reset",
            tokenHeaderLabel: "Header",
            tokenPayloadLabel: "Payload",
            tokenSignatureLabel: "Signature",
            encodedTokenLabel: "// TOKEN KOMPAK TER-ENCODE (Base64URL)",
            charsBytes: "karakter (~{bytes} byte)",
            secretKeyLabel: "1. Kunci Rahasia / Secret (HMAC-SHA256)",
            secretPlaceholder: "Masukkan HMAC Secret...",
            randomizeBtn: "Acak Kunci",
            attackSimulatorTitle: "SIMULATOR SERANGAN KEAMANAN",
            attackSimulatorDesc: "Uji ketahanan parser dengan menginjeksikan celah keamanan populer:",
            btnAlgNoneTitle: '💣 Eksploit "alg": "none"',
            btnAlgNoneDesc: "Bypass verifikasi tanda tangan dengan menghapus algoritma",
            btnTamperTitle: "🎭 Eskalasi Hak Akses",
            btnTamperDesc: 'Ubah klaim payload (role: "user" → "admin")',
            btnExpiredTitle: "⏰ Uji Token Kedaluwarsa",
            btnExpiredDesc: "Atur klaim exp mundur 1 jam ke masa lalu",
            decodedHeaderLabel: "HEADER (Algoritma & Tipe)",
            decodedPayloadLabel: "PAYLOAD (Klaim / Identitas)",
            liveEditableBadge: "Bisa Diedit Langsung",
            signatureValidStatus: "SIGNATURE VALID (200 OK)",
            unsecuredNoneStatus: "TIDAK AMAN (alg: none)",
            signatureMismatchStatus: "SIGNATURE TIDAK COCOK (401)",
            tokenExpiredStatus: "TOKEN KEDALUWARSA (401)",
            cryptoUnavailableStatus: "CRYPTO API TIDAK TERSEDIA",
            alertNoneTitle: "🚨 Kerentanan Kritis: 'alg: none' Diterima",
            alertNoneBody: "Signature token tidak ada sama sekali. Jika server tidak membatasi whitelist algoritma, penyerang dapat memalsukan payload apapun (misal akses admin) tanpa perlu secret key.",
            alertTamperTitle: "🛡️ Verifikasi Signature Gagal",
            alertTamperBody: "Payload telah dimodifikasi tanpa menghitung ulang signature dengan kunci rahasia yang sah. Verifikasi gagal: `HMAC_SHA256(Data, Secret) != Token_Signature`.",
            alertExpiredTitle: "⏰ Token Kedaluwarsa (Klaim exp terlewati)",
            alertExpiredBody: "Signature token sah secara kriptografi, tetapi stempel waktu klaim 'exp' ({exp}) telah terlewati. Verifier JWT standar akan menolak token ini.",
            alertInsecureTitle: "Konteks Tidak Aman Terdeteksi",
            alertInsecureBody: "Web Crypto API (window.crypto.subtle) tidak tersedia. Silakan akses lewat HTTPS atau localhost.",
            section1Title: "1. First-Principles: Apa itu JWT Sebenarnya?",
            section1P1: "JSON Web Token (JWT) pada dasarnya tidak dienkripsi secara default; token hanya ditandatangani secara kriptografis dan di-encode ke Base64URL. Siapa pun yang memegang token bisa membaca payload-nya. Jaminan keamanan sepenuhnya berasal dari tanda tangan digitalnya (signature).",
            section1P2: "Token kompak standar terdiri dari tiga bagian yang dipisahkan oleh tanda titik (.):",
            partHeaderDesc: "Menentukan algoritma signature & tipe token",
            partPayloadDesc: "Klaim & metadata identitas pengguna (terbuka & terbaca)",
            partSignatureDesc: "Mencegah manipulasi data dengan mengikat header + payload secara matematis",
            section2Title: '2. Cara Kerja Celah "alg": "none"',
            section2P1: 'Berdasarkan spesifikasi awal JWA (RFC 7518), algoritma bernama "none" diizinkan untuk token tanpa proteksi. Jika library backend secara naif mempercayai header alg dari kiriman klien:',
            section2Step1: 'Penyerang memodifikasi payload untuk menaikkan hak aksesnya (misal "role": "admin").',
            section2Step2: 'Penyerang mengubah header menjadi {"alg": "none"} lalu menghapus bagian signature token.',
            section2Step3: "Jika kode verifikasi server mengecek if (header.alg === 'none') return true;, token palsu diterima tanpa butuh kunci rahasia sama sekali!",
            defenseTitle: "🛡️ Cara Mitigasi Standar (RFC 8725 Best Practice):",
            defensePoint1: "Terapkan Whitelist Algoritma: Jangan biarkan header token menentukan algoritma saat verifikasi. Kunci mati algoritma yang diharapkan di sisi server (contoh: wajibkan HS256 atau RS256 secara eksplisit).",
            defensePoint2: "Tolak none Secara Default: Pastikan library JWT Anda menonaktifkan unsecured tokens secara permanen.",
            defensePoint3: "Entropi Kunci Memadai: Untuk HS256, rahasia HMAC minimal memiliki panjang 256-bit (32 byte) acak kriptografis agar tahan terhadap serangan brute-force.",
            section3Title: "3. Kesimpulan Penting dari Lab Ini",
            takeaway1Title: "Encoding ≠ Enkripsi",
            takeaway1Desc: "Base64URL hanyalah mekanisme encoding agar JSON aman ditransmisikan lewat HTTP header. Data sensitif rahasia tidak boleh disimpan di payload JWT tanpa JWE (JSON Web Encryption).",
            takeaway2Title: "Web Crypto di Browser Modern",
            takeaway2Desc: "Browser modern mampu menghitung signature HMAC-SHA256 & RSA secara native via window.crypto.subtle tanpa dependency eksternal dalam waktu <1 milidetik.",
            footerBackBtn: "← Kembali ke Direktori Lab",
            footerNextHint: "Lab Berikutnya: Protobuf vs JSON Wire Inspector (Sprint 2) →",
        },
        protobufLab: {
            eyebrow: "// LAB #02 • PROTOKOL & JARINGAN",
            title: "Komparator Wire-Format Protobuf vs JSON",
            subtitle: "Membedah serialisasi biner gRPC, encoding Varint Base-128, packing Tag-WireType, dan benchmark kompresi bandwidth dunia nyata.",
            backLink: "← // kembali ke direktori lab",
            livePlaygroundTitle: "PLAYGROUND WIRE BINER LIVE",
            resetBtn: "Reset Skema",
            presetsLabel: "Preset:",
            presetUserProfile: "Profil Pengguna",
            presetIotTelemetry: "Telemetri Sensor IoT",
            presetFinancialOrder: "Order Finansial",
            presetZigzag: "Kasus Ekstrem ZigZag & Varint",
            // Quadrant 1
            schemaTitle: "1. Definisi Skema & Field",
            schemaSubtitle: "Field Proto3",
            fieldNameHeader: "Nama Field",
            fieldTagHeader: "Tag #",
            fieldTypeHeader: "Tipe",
            fieldValueHeader: "Nilai",
            addFieldBtn: "+ Tambah Field",
            tagWarning: "⚠️ Tag ≥ 16 membutuhkan 2+ byte kunci",
            // Quadrant 2
            visualizerTitle: "2. Visualizer Byte Biner Live",
            visualizerSubtitle: "Hex Dump Kanonikal 16-Byte",
            hoverHint: "Arahkan kursor ke byte mana saja untuk melihat bit packing dan detail Wire Type",
            tagLegend: "Tag & WireType",
            lengthLegend: "Prefix Panjang",
            valueLegend: "Data / Nilai",
            // Quadrant 3
            comparisonTitle: "3. Komparasi Ukuran Wire & Penghematan Egress Cloud",
            protoSizeLabel: "Biner Protobuf",
            jsonSizeLabel: "JSON Minified Mentah",
            jsonGzipSizeLabel: "JSON Terkompresi Gzip",
            savingsMeterLabel: "Reduksi Ukuran Payload vs JSON Mentah",
            trafficVolumeLabel: "Skala Volume Trafik Bulanan:",
            bandwidthSavedLabel: "Bandwidth Dihemat per Bulan",
            egressCostSavingsLabel: "Estimasi Penghematan Biaya Egress (AWS/GCP @ $0.09/GB)",
            costPerGbNote: "*Berdasarkan tier harga standar internet egress cloud publik.",
            // Quadrant 4
            dissectorTitle: "4. Disektor Paket Protokol",
            dissectorSubtitle: "Pelacakan Stream Decoder Bit-demi-Bit",
            stepOffset: "Offset",
            stepAction: "Aksi Decoder",
            // Deep Dive
            section1Title: "1. Mengapa gRPC/Protobuf Jauh Lebih Cepat daripada REST JSON?",
            section1P1: "Sementara REST API mentransmisikan data sebagai string teks berformat ASCII/UTF-8 (JSON), Protocol Buffers menserialisasikan data terstruktur langsung menjadi byte biner padat. Peningkatan performa tidak hanya datang dari ukuran payload yang lebih kecil di kabel jaringan, tetapi dari efisiensi deserialisasi CPU yang masif.",
            section1P2: "Keunggulan arsitektural utamanya meliputi:",
            section1Benefit1Title: "Tanpa Tokenisasi String",
            section1Benefit1Desc: "Parser JSON wajib memindai setiap karakter byte untuk mencari kurung kurawal, tanda kutip, titik dua, dan escape sequence (pemindaian O(N)). Decoder Protobuf melompat langsung melintasi offset memori menggunakan panjang byte eksplisit.",
            section1Benefit2Title: "Tanpa Nama Field di Jalur Jaringan",
            section1Benefit2Desc: "JSON mengulang string key yang panjang di setiap pesan (misal 'transaction_timestamp_utc': 1715000000). Protobuf membuang semua string key dan menggantinya dengan satu integer tag terkompresi (hanya 1 byte).",
            section1Benefit3Title: "Ramah Memori & Cache CPU",
            section1Benefit3Desc: "Field biner didekode langsung ke representasi memori struct native (integer dan float tidak memerlukan konversi string-ke-angka).",
            section2Title: "2. Encoding Varint Base-128 & Bit Kontinuasi MSB",
            section2P1: "Variable-Length Quantities (Varints) memungkinkan integer bernilai kecil hanya memakan 1 byte alih-alih 4 atau 8 byte tetap. Integer diiris menjadi payload 7-bit.",
            section2P2: "Bit Paling Signifikan (MSB, bit ke-8) berfungsi sebagai bendera kontinuasi: jika MSB = 1, byte berikutnya masih bersambung; jika MSB = 0, ini adalah byte terminal akhir.",
            section3Title: "3. Field Tag Packing & Keajaiban Tag 1 sampai 15",
            section3P1: "Protobuf mengemas nomor field dan tipe wire ke dalam satu integer: key = (field_number << 3) | wire_type. Karena 3 bit terendah mewakili Wire Type (0 hingga 7), tag nomor 1 sampai 15 muat dalam 1 byte 8-bit tunggal!",
            tagRangeTableTitle: "Panduan Alokasi Tag Number (Best Practice Protobuf):",
            tag1To15Desc: "Tag 1 hingga 15 hanya butuh 1 byte untuk field tag dan wire type. Alokasikan khusus untuk field berfrekuensi tinggi.",
            tag16PlusDesc: "Tag 16 hingga 2047 butuh 2 byte. Gunakan untuk field opsional atau berfrekuensi rendah.",
            section4Title: "4. ZigZag Encoding: Mengatasi Dilema Two's Complement",
            section4P1: "Dalam format biner two's complement standar, bilangan negatif seperti -1 memiliki bit tertinggi bernilai 1 (0xFFFFFFFF). Dalam format varint standar, -1 membengkak menjadi 10 byte di jaringan!",
            section4P2: "ZigZag encoding memetakan integer bertanda ke unsigned integer sedemikian rupa sehingga bilangan negatif kecil menjadi bilangan positif kecil: -1 -> 1, 1 -> 2, -2 -> 3, 2 -> 4. Untuk sint32 dan sint64, angka -1 hanya memakan 1 byte!",
            section5Title: "5. Evolusi Skema & Penanganan Unknown Fields",
            section5P1: "Decoder Protobuf menggunakan metadata Wire Type di dalam byte tag untuk menentukan berapa byte yang harus dilewati jika nomor tag tidak dikenali di skema lokal. Ini memungkinkan kompatibilitas maju dan mundur yang aman.",
            footerBackBtn: "← Kembali ke Direktori Lab",
            footerPrevLab: "← Lab #01: Inspektor JWT",
            footerNextHint: "Lab Berikutnya: Distributed Rate Limiter (Sprint 3) →",
        },
        rateLimiterLab: {
            eyebrow: "// LAB #03 • SISTEM TERDISTRIBUSI",
            title: "Visualizer Distributed Rate Limiter",
            subtitle: "Di balik algoritma yang menjaga setiap API di dunia: Token Bucket vs Leaky Bucket vs Fixed Window vs Sliding Window — dan mengapa counter naif di Redis bocor melewati kuotanya.",
            backLink: "← // kembali ke direktori lab",
            livePlaygroundTitle: "PLAYGROUND TRAFIK & KONKURENSI LIVE",
            resetBtn: "Reset Simulasi",
            engineLabel: "Algoritma:",
            algoTokenBucket: "Token Bucket",
            algoLeakyBucket: "Leaky Bucket",
            algoFixedWindow: "Fixed Window",
            algoSlidingWindow: "Sliding Window",
            paramsTitle: "Parameter",
            capacityLabel: "Kapasitas / Kuota",
            refillLeakLabel: "Laju Refill / Leak",
            windowMsLabel: "Durasi Window",
            sentCountLabel: "Request dalam antrean",
            trafficTitle: "Generator Trafik",
            sendOneBtn: "⚡ Kirim 1 Request",
            burstBtn: "💥 Burst Attack",
            burstSuffix: " rd simult.",
            streamLabel: "Stream Kontinu",
            streamOff: "MATI",
            streamOn: "HIDUP",
            streamPerSecSuffix: " req/dt",
            bucketTitle: "Status Limiter",
            tokensFillLabel: "Token tersedia",
            queueFillLabel: "Volume antrean",
            windowFillLabel: "Pemakaian window",
            headersTitle: "Respons HTTP Live (IETF draft-ietf-httpapi-ratelimit-headers)",
            headerLimit: "RateLimit-Limit",
            headerRemaining: "RateLimit-Remaining",
            headerReset: "RateLimit-Reset",
            headerRetryAfter: "Retry-After (hanya saat diblokir)",
            statsTitle: "Statistik Sesi",
            statAllowed: "Lolos (200 OK)",
            statBlocked: "Dithrottle (429)",
            statPassRate: "Rasio lolos",
            logTitle: "Log Request",
            raceTitle: "Simulator Race Condition Redis",
            raceSubtitle: "Mengapa counter naif GET→SET bocor melewati kuota saat worker berjalan paralel",
            raceWorkersLabel: "Worker paralel",
            raceLatencyLabel: "Latensi demo (jaringan + processing)",
            raceQuotaLabel: "Batas kuota",
            raceNaiveBtn: "Naif GET → SET",
            raceAtomicBtn: "Atomik Lua (EVAL)",
            raceNaiveModeName: "Read-modify-write naif",
            raceAtomicModeName: "Skrip atomik di sisi server",
            racePassedLabel: "Lolos",
            raceDroppedLabel: "Ditolak",
            raceLeakedLabel: "Kebocoran Race",
            raceVerdictSafe: "✅ Nol kebocoran — EVAL atomik menjamin tepat {n} admisi",
            raceVerdictLeak: "🚨 {leak} request bocor melewati kuota {limit} request — lost-update race klasik",
            raceWorkerLabel: "Worker",
            raceReadLabel: "baca@",
            raceSawLabel: "lihat",
            raceWriteLabel: "tulis@",
            raceResultAllowed: "LOLOS",
            raceResultRejected: "TOLAK",
            raceTimelineTitle: "Timeline (ms) — klik baris untuk inspeksi",
            section1Title: "1. Mengapa Rate Limiting Itu Ada (Lebih dari “Sopan Santai”)",
            section1P1: "Setiap endpoint API punya CPU, memori, dan dependensi downstream yang terbatas (database, payment gateway, API pihak ketiga). Tanpa limiter, satu klien nakal — atau satu loop retry deploy yang bug — bisa memstarvasi semua tenant lain. Limiter mengubah trafik masuk yang tak terbatas menjadi kontrak yang terikat dan terprediksi.",
            section1P2: "Namun tidak semua limiter berperilaku sama. Memilih algoritma berarti memilih trade-off antara toleransi burst, jejak memori, dan kebenaran batas window:",
            section1Algo1Title: "Token Bucket — ramah burst, default paling umum",
            section1Algo1Desc: "Ember menyimpan hingga N token dan terisi ulang dengan laju konstan. Setiap request mengonsumsi satu token. Jika token tersedia, burst hingga N request langsung lolos; trafik berkelanjutan kemudian dipace di laju refill. Dipakai oleh Stripe, NGINX, AWS API Gateway (secara prinsip).",
            section1Algo2Title: "Leaky Bucket — menghaluskan trafik menjadi aliran konstan",
            section1Algo2Desc: "Request masuk ke antrean FIFO yang dibuang dengan laju tetap; request yang meluap di-drop. Alih-alih mengizinkan burst, ia membentuk trafik menjadi aliran stabil — ideal untuk melindungi sistem downstream yang rapuh terhadap lonjakan.",
            section1Algo3Title: "Fixed Window Counter — murah tapi rentan di batas window",
            section1Algo3Desc: "Counter sederhana yang di-reset pada interval tetap (misal tiap menit). Sangat murah diimplementasikan di Redis (INCR + EXPIRE), tetapi rentan burst 2× di batas: klien bisa menembak kuota penuh di 00:59.999 dan kuota penuh lagi di 01:00.001.",
            section1Algo4Title: "Sliding Window Log — akurat tapi rakus memori",
            section1Algo4Desc: "Menyimpan timestamp setiap request dan menghapus entri yang lebih tua dari window. Sempurna di batas window tanpa lonjakan 2×, tetapi memori O(N) per klien membuatnya mahal di skala besar — dimitigasi di produksi dengan aproksimasi seperti Sliding Window Counter.",
            section2Title: "2. Masalah Cache Terdistribusi: Mengapa Counter Redis Naif Bocor",
            section2P1: "Pada deployment terdistribusi nyata, ribuan server berbagi satu counter di Redis. Pola naif — BACA nilai, CEK kuota, TULIS nilai+1 — tidak atomik: di antara BACA worker A dan TULIS-nya, worker lain juga membaca nilai basi yang sama dan semua sampai pada kesimpulan “kuota masih tersedia”.",
            section2P2: "Inilah race condition lost-update klasik. Ambil kuota 10 dengan 25 worker paralel: beberapa worker membaca count = 9 secara bersamaan, semua melihat “slot tersedia,” semua menambah, dan 14 request lewat begitu saja melewati kuota 10 request. Insiden nyata berpola seperti ini menyebabkan bypass kuota senyap, diskrepansi penagihan, dan overload di hilir.",
            section2P3: "Solusi di produksi, dari yang paling umum hingga paling niche: skrip Lua Redis (EVAL) yang mengeksekusi baca-cek-tulis secara atomik di server, pola INCR-lalu-bandingkan (increment atomik dulu, tolak saat nilai hasil increment melebihi limit), dan distributed locking (SETNX / Redlock) yang menukar throughput demi urutan yang ketat.",
            section3Title: "3. Pola Implementasi di Produksi (Redis)",
            section3P1: "Limiter fixed-window atomik yang kanonik adalah skrip Lua tunggal atau pipeline MULTI/EXEC: INCR kunci tersebut, dan saat hasilnya 1 (hit pertama di window ini) pasang expiry. Increment di awal berarti setiap worker mendapat nomor unik — tidak ada dua worker yang pernah melihat nilai yang sama dua kali — sehingga penegakan kuota bebas race secara konstruksi.",
            section3P2: "Untuk semantik sliding-window di skala besar, sistem produksi memakai Redis Sorted Sets (ZADD member = id request unik, score = timestamp). Setiap hit menambah satu entri dan menghapus entri lama via ZREMRANGEBYSCORE, lalu memeriksa ZCARD terhadap kuota di dalam skrip atomik yang sama.",
            section3LuaTitle: "🛡️ Pola Teruji Produksi:",
            section3LuaPoint1: "INCR-dulu (fixed window): Nomor hasil increment sendiri adalah tiket admisi. Atomik dalam satu panggilan INCR — tanpa butuh Lua untuk window dasar.",
            section3LuaPoint2: "Sorted Set + ZREMRANGEBYSCORE (sliding window): Perilaku sliding yang eksak dengan penyisipan O(log N) dan eviksi O(log N), dibungkus satu EVAL untuk atomisitas.",
            section4Title: "4. Kontrak HTTP Standar: Header IETF RateLimit",
            section4P1: "Rate limiting adalah bagian dari antarmuka publik API Anda. Standar IETF draft-ietf-httpapi-ratelimit-headers mendefinisikan header respons agar klien yang baik dapat backoff otomatis alih-alih menghantam dinding 429:",
            section4Header1: "RateLimit-Limit — total kuota per window. Plafon klien Anda.",
            section4Header2: "RateLimit-Remaining — token/ruang tersisa saat ini. Jika 0, request berikutnya gagal.",
            section4Header3: "RateLimit-Reset — detik hingga kuota pulih penuh. Angka yang dipantau autoscaler.",
            section4Header4: "Retry-After — wajib saat request ditolak dengan 429. Memberi tahu klien tepat kapan harus mencoba lagi.",
            section5Title: "5. Kesimpulan Penting dari Lab Ini",
            takeaway1Title: "Tidak ada limiter yang selamat dari race condition",
            takeaway1Desc: "Algoritma in-memory yang sempurna tetap gagal saat didistribusikan di Redis tanpa atomisitas. Kebenaran hidup di batas baca-cek-tulis — tegakkan dengan INCR-dulu, Lua EVAL, atau lock.",
            takeaway2Title: "Pilihan algoritma adalah kontrak dengan klien Anda",
            takeaway2Desc: "Token Bucket memaafkan burst; Leaky Bucket tidak memaafkan apa pun; Sliding Window berkata benar. Pilih yang sesuai dengan apa yang benar-benar bisa diserap downstream Anda, lalu publikasikan via header RateLimit.",
            footerPrevLab: "← Lab #02: Inspektor Wire Protobuf",
            footerNextHint: "Lab Berikutnya: Alur OAuth2 PKCE (Sprint 4) →",
        },
    },
};

export function getTranslation(lang: Language): TranslationDict {
    return translations[lang] || translations.en;
}
