/**
 * Einfaches In-Memory Sliding-Window-Rate-Limit pro Schlüssel (z. B. IP).
 *
 * Caveat: Funktioniert nur per Server-Instanz. Auf Vercel/serverless gibt es
 * mehrere Instanzen → der Schutz ist „best effort". Für echte Limits
 * Upstash/Redis verwenden. Trotzdem deutlich besser als nichts.
 */

interface Entry {
    timestamps: number[];
}

const buckets = new Map<string, Entry>();

export interface RateLimitOptions {
    /** Schlüssel, z. B. IP-Adresse */
    key: string;
    /** Max. Anfragen pro Fenster */
    limit: number;
    /** Fenster in Millisekunden */
    windowMs: number;
}

export interface RateLimitResult {
    success: boolean;
    remaining: number;
    resetMs: number;
}

export function rateLimit({ key, limit, windowMs }: RateLimitOptions): RateLimitResult {
    const now = Date.now();
    const cutoff = now - windowMs;
    const entry = buckets.get(key) ?? { timestamps: [] };

    entry.timestamps = entry.timestamps.filter((t) => t > cutoff);

    if (entry.timestamps.length >= limit) {
        const oldest = entry.timestamps[0];
        buckets.set(key, entry);
        return {
            success: false,
            remaining: 0,
            resetMs: Math.max(0, oldest + windowMs - now),
        };
    }

    entry.timestamps.push(now);
    buckets.set(key, entry);

    // Gelegentlich aufräumen, damit die Map nicht ewig wächst.
    if (buckets.size > 5000) {
        for (const [k, e] of buckets) {
            if (e.timestamps.length === 0 || e.timestamps[e.timestamps.length - 1] < cutoff) {
                buckets.delete(k);
            }
        }
    }

    return {
        success: true,
        remaining: limit - entry.timestamps.length,
        resetMs: windowMs,
    };
}

export function getClientIp(req: Request): string {
    const fwd = req.headers.get('x-forwarded-for');
    if (fwd) return fwd.split(',')[0].trim();
    const real = req.headers.get('x-real-ip');
    if (real) return real.trim();
    return 'unknown';
}
