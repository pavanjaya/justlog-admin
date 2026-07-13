// In-memory rate limiter — resets on cold start, fine for single-instance admin panel
const attempts = new Map<string, { count: number; firstAt: number }>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; retryAfterMs: number } {
  const now = Date.now();
  const entry = attempts.get(ip);

  if (!entry || now - entry.firstAt > WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAt: now });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, retryAfterMs: 0 };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    const retryAfterMs = WINDOW_MS - (now - entry.firstAt);
    return { allowed: false, remaining: 0, retryAfterMs };
  }

  entry.count++;
  return { allowed: true, remaining: MAX_ATTEMPTS - entry.count, retryAfterMs: 0 };
}

export function resetRateLimit(ip: string) {
  attempts.delete(ip);
}
