type Rule = { key: string; limit: number; windowSec: number };

const store = new Map<string, { count: number; resetAt: number }>();

export function hit(rule: Rule, userId: string) {
  const k = `${rule.key}:${userId}`;
  const now = Date.now();
  const bucket = store.get(k);
  if (!bucket || now > bucket.resetAt) {
    store.set(k, { count: 1, resetAt: now + rule.windowSec * 1000 });
    return { ok: true };
  }
  if (bucket.count >= rule.limit) {
    const wait = Math.ceil((bucket.resetAt - now) / 1000);
    return { ok: false, retryAfter: wait };
  }
  bucket.count++;
  return { ok: true };
}
