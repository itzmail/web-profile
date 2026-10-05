// rateLimiter.ts — Zero-dependency rate limiting simulation engine.
// Pure TypeScript: virtual clock, 4 algorithms, distributed race-condition model.

export type AlgorithmId = "tokenBucket" | "leakyBucket" | "fixedWindow" | "slidingWindow";

export interface LimiterConfig {
    limit: number;           // capacity / requests per window
    windowMs: number;        // window/period for window algorithms
    refillRatePerSec: number; // token refill or bucket leak rate
}

export interface Decision {
    allowed: boolean;
    remaining: number;
    resetRemainingSec: number; // seconds until quota/window recovers
    retryAfterSec: number;     // suggested wait when blocked
}

export interface RequestLogEntry {
    simTimeMs: number;    // virtual timestamp
    algorithm: AlgorithmId;
    allowed: boolean;
}

// ---------------------------------------------------------------------------
// 1. Token Bucket — capacity + constant refill. Classic burst-allowing limiter.
// ---------------------------------------------------------------------------
export class TokenBucket {
    tokens: number;
    capacity: number;
    refillPerSec: number;

    constructor(cfg: LimiterConfig) {
        this.capacity = cfg.limit;
        this.tokens = cfg.limit; // start full
        this.refillPerSec = cfg.refillRatePerSec;
    }

    advance(dtMs: number): void {
        this.tokens = Math.min(this.capacity, this.tokens + (dtMs / 1000) * this.refillPerSec);
    }

    tryTake(): Decision {
        if (this.tokens >= 1) {
            this.tokens -= 1;
            return {
                allowed: true,
                remaining: Math.floor(this.tokens),
                resetRemainingSec: (this.capacity - this.tokens) / this.refillPerSec,
                retryAfterSec: 0,
            };
        }
        return {
            allowed: false,
            remaining: 0,
            resetRemainingSec: (this.capacity - this.tokens) / this.refillPerSec,
            retryAfterSec: 1 / this.refillPerSec,
        };
    }

    /** fraction 0..1 for visual fill */
    fillLevel(): number {
        return this.tokens / this.capacity;
    }
}

// ---------------------------------------------------------------------------
// 2. Leaky Bucket — FIFO queue with constant drain rate. Traffic shaping.
// ---------------------------------------------------------------------------
export class LeakyBucket {
    queue: number;
    capacity: number;
    leakPerSec: number;

    constructor(cfg: LimiterConfig) {
        this.capacity = cfg.limit;
        this.queue = 0;
        this.leakPerSec = cfg.refillRatePerSec;
    }

    advance(dtMs: number): void {
        this.queue = Math.max(0, this.queue - (dtMs / 1000) * this.leakPerSec);
    }

    tryTake(): Decision {
        if (this.queue + 1 <= this.capacity) {
            this.queue += 1;
            return {
                allowed: true,
                remaining: Math.floor(this.capacity - this.queue),
                resetRemainingSec: this.queue / this.leakPerSec,
                retryAfterSec: 0,
            };
        }
        // Overflow: packet dropped (queue full), retry when queue drains enough room
        return {
            allowed: false,
            remaining: 0,
            resetRemainingSec: this.queue / this.leakPerSec,
            retryAfterSec: (this.capacity - this.leakPerSec * 0) / this.leakPerSec,
        };
    }

    fillLevel(): number {
        return this.queue / this.capacity;
    }
}

// ---------------------------------------------------------------------------
// 3. Fixed Window Counter — static boundary window. Vulnerable to 2x boundary burst.
// ---------------------------------------------------------------------------
export class FixedWindow {
    count: number;
    windowStartMs: number;
    windowMs: number;
    limit: number;
    nowMs: number;

    constructor(cfg: LimiterConfig, startNow = 0) {
        this.limit = cfg.limit;
        this.windowMs = cfg.windowMs;
        this.windowStartMs = startNow;
        this.count = 0;
        this.nowMs = startNow;
    }

    advance(dtMs: number): void {
        this.nowMs += dtMs;
        if (this.nowMs - this.windowStartMs >= this.windowMs) {
            this.windowStartMs += this.windowMs * Math.floor((this.nowMs - this.windowStartMs) / this.windowMs);
            this.count = 0;
        }
    }

    tryTake(): Decision {
        const used = Math.min(1, this.count / this.limit);
        if (this.count < this.limit) {
            this.count += 1;
            const elapsed = this.nowMs - this.windowStartMs;
            return {
                allowed: true,
                remaining: this.limit - this.count,
                resetRemainingSec: (this.windowMs - elapsed) / 1000,
                retryAfterSec: 0,
            };
        }
        const elapsed = this.nowMs - this.windowStartMs;
        return {
            allowed: false,
            remaining: 0,
            resetRemainingSec: (this.windowMs - elapsed) / 1000,
            retryAfterSec: (this.windowMs - elapsed) / 1000,
        };
    }

    fillLevel(): number {
        return this.count / this.limit;
    }
}

// ---------------------------------------------------------------------------
// 4. Sliding Window Log — exact per-timestamp deque. Accurate, memory-hungry.
// ---------------------------------------------------------------------------
export class SlidingWindowLog {
    timestamps: number[];
    windowMs: number;
    limit: number;
    nowMs: number;

    constructor(cfg: LimiterConfig, startNow = 0) {
        this.limit = cfg.limit;
        this.windowMs = cfg.windowMs;
        this.timestamps = [];
        this.nowMs = startNow;
    }

    advance(dtMs: number): void {
        this.nowMs += dtMs;
        const cutoff = this.nowMs - this.windowMs;
        while (this.timestamps.length > 0 && this.timestamps[0] <= cutoff) {
            this.timestamps.shift();
        }
    }

    tryTake(): Decision {
        const cutoff = this.nowMs - this.windowMs;
        while (this.timestamps.length > 0 && this.timestamps[0] <= cutoff) {
            this.timestamps.shift();
        }
        if (this.timestamps.length < this.limit) {
            this.timestamps.push(this.nowMs);
            // window recovers when the oldest hit expires
            const oldest = this.timestamps[0];
            const resetMs = oldest + this.windowMs - this.nowMs;
            return {
                allowed: true,
                remaining: this.limit - this.timestamps.length,
                resetRemainingSec: Math.max(0, resetMs) / 1000,
                retryAfterSec: 0,
            };
        }
        const oldest = this.timestamps[0];
        return {
            allowed: false,
            remaining: 0,
            resetRemainingSec: (oldest + this.windowMs - this.nowMs) / 1000,
            retryAfterSec: (oldest + this.windowMs - this.nowMs) / 1000,
        };
    }

    fillLevel(): number {
        return this.timestamps.length / this.limit;
    }
}

// ---------------------------------------------------------------------------
// Distributed Concurrency Race Simulator (Redis GET→SET vs atomic EVAL)
// ---------------------------------------------------------------------------
export interface RaceEvent {
    worker: number;
    readAtMs: number;
    writeAtMs: number;
    readValue: number;
    allowed: boolean;
}

export interface RaceResult {
    limit: number;
    workers: number;
    passed: number;
    dropped: number;
    leaked: number;      // requests that slipped through over the quota
    finalCount: number;
    atomic: boolean;
    events: RaceEvent[];
}

export function simulateRace(opts: {
    workers: number;
    limit: number;
    maxJitterMs: number;
    latencyMs: number;
    atomic: boolean;
}): RaceResult {
    const { workers, limit, maxJitterMs, latencyMs, atomic } = opts;

    const raw: { id: number; readAt: number; writeAt: number }[] = [];
    for (let i = 0; i < workers; i++) {
        const readAt = Math.random() * maxJitterMs;
        raw.push({ id: i, readAt, writeAt: readAt + latencyMs });
    }

    if (atomic) {
        // EVAL runs serially — order by commit time, reject past quota
        const byCommit = [...raw].sort((a, b) => a.writeAt - b.writeAt);
        let accepted = 0;
        const events: RaceEvent[] = byCommit.map((w, idx) => {
            const allowed = idx < limit;
            if (allowed) accepted++;
            return { worker: w.id, readAtMs: Math.round(w.readAt), writeAtMs: Math.round(w.writeAt), readValue: idx, allowed };
        });
        return {
            limit,
            workers,
            passed: accepted,
            dropped: workers - accepted,
            leaked: 0,
            finalCount: accepted,
            atomic: true,
            events,
        };
    }

    // Naive GET→SET: each worker reads a stale snapshot, then blindly writes
    const sortedByRead = [...raw].sort((a, b) => a.readAt - b.readAt);
    const events: RaceEvent[] = [];
    let passed = 0;

    for (let i = 0; i < sortedByRead.length; i++) {
        const w = sortedByRead[i];
        // value visible at readAt = writes committed strictly before this read
        let committed = 0;
        for (const o of raw) {
            if (o.writeAt < w.readAt) committed++;
        }
        const allowed = committed < limit;
        if (allowed) passed++;
        events.push({
            worker: w.id,
            readAtMs: Math.round(w.readAt),
            writeAtMs: Math.round(w.writeAt),
            readValue: committed,
            allowed,
        });
    }

    const finalCount = passed;
    return {
        limit,
        workers,
        passed,
        dropped: 0, // naive never drops — it just lets everything race through
        leaked: Math.max(0, finalCount - limit),
        finalCount,
        atomic: false,
        events,
    };
}

export const ALGO_LABELS: Record<AlgorithmId, string> = {
    tokenBucket: "Token Bucket",
    leakyBucket: "Leaky Bucket",
    fixedWindow: "Fixed Window",
    slidingWindow: "Sliding Window",
};

export function createLimiter(algo: AlgorithmId, cfg: LimiterConfig): TokenBucket | LeakyBucket | FixedWindow | SlidingWindowLog {
    switch (algo) {
        case "tokenBucket": return new TokenBucket(cfg);
        case "leakyBucket": return new LeakyBucket(cfg);
        case "fixedWindow": return new FixedWindow(cfg);
        case "slidingWindow": return new SlidingWindowLog(cfg);
    }
}
