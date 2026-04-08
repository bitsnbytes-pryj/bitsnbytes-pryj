/**
 * In-memory sliding-window rate limiter.
 * Works on Vercel serverless (per-instance), and in long-running Node processes.
 * For stricter global limits, swap for a Redis/Supabase-backed implementation.
 */

type RateLimitEntry = {
  tokens: number
  lastRefill: number
}

const store = new Map<string, RateLimitEntry>()

// Cleanup stale entries every 5 minutes to prevent memory leaks
const CLEANUP_INTERVAL = 5 * 60 * 1000
let lastCleanup = Date.now()

function cleanup() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now
  const expiry = now - 60_000 * 2 // remove entries older than 2 minutes
  for (const [key, entry] of store) {
    if (entry.lastRefill < expiry) store.delete(key)
  }
}

export type RateLimitConfig = {
  /** Max requests allowed in the window */
  maxRequests: number
  /** Window size in milliseconds (default: 60_000 = 1 minute) */
  windowMs?: number
}

export type RateLimitResult = {
  allowed: boolean
  remaining: number
  retryAfterMs: number
}

/**
 * Check if a request from `key` (usually IP) is allowed.
 * Uses a token-bucket approach with a fixed refill window.
 */
export function rateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const { maxRequests, windowMs = 60_000 } = config
  const now = Date.now()

  cleanup()

  let entry = store.get(key)

  if (!entry) {
    entry = { tokens: maxRequests - 1, lastRefill: now }
    store.set(key, entry)
    return { allowed: true, remaining: entry.tokens, retryAfterMs: 0 }
  }

  // Refill tokens if window has passed
  const elapsed = now - entry.lastRefill
  if (elapsed >= windowMs) {
    entry.tokens = maxRequests - 1
    entry.lastRefill = now
    store.set(key, entry)
    return { allowed: true, remaining: entry.tokens, retryAfterMs: 0 }
  }

  // Consume a token
  if (entry.tokens > 0) {
    entry.tokens -= 1
    store.set(key, entry)
    return { allowed: true, remaining: entry.tokens, retryAfterMs: 0 }
  }

  // Rate limited
  const retryAfterMs = windowMs - elapsed
  return { allowed: false, remaining: 0, retryAfterMs }
}
