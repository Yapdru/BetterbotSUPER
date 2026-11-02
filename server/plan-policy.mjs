// Server policy. Entitlements must come from verified billing/membership records,
// never from a client-supplied plan or localStorage.
export const MAX_DAILY_TOKENS = 25_000;
export const TEAM_MEMBER_LIMIT = 100;

export function teamPriceInr(seats) {
  if (!Number.isInteger(seats) || seats < 1 || seats > TEAM_MEMBER_LIMIT) {
    throw new RangeError('Teams supports 1–100 members.');
  }
  return seats <= 10 ? 5_000 : 7_000;
}

export function allowanceFor(plan) {
  if (plan === 'max' || plan === 'teams' || plan === 'pro') return MAX_DAILY_TOKENS;
  if (plan === 'basic') return 15_000;
  if (plan === 'free') return 5_000;
  return 0;
}

export function quotaDay(now = new Date()) {
  // Explicit shared boundary for all servers: midnight UTC (05:30 India time).
  return now.toISOString().slice(0, 10);
}

export function quotaKey(uid, now = new Date()) {
  if (typeof uid !== 'string' || !uid.trim()) throw new TypeError('Verified user ID required.');
  return JSON.stringify([uid, quotaDay(now)]);
}

export function canReserve({ plan, used, reserved, requested }) {
  for (const amount of [used, reserved, requested]) {
    if (!Number.isSafeInteger(amount) || amount < 0) throw new RangeError('Invalid token count.');
  }
  return requested > 0 && requested <= allowanceFor(plan) - used - reserved;
}
