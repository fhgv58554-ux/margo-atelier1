import { createHmac, timingSafeEqual } from 'node:crypto';

const SESSION_PURPOSE = 'margo-admin-session-v3';
const MAX_AGE_SEC = 90 * 24 * 60 * 60;

function normalizeSecret(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.normalize('NFKC').replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
}

/** Admin password from env only. Never hardcode a default. */
export function adminSecret(): string {
  return normalizeSecret(process.env.ADMIN_PASSWORD);
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function isAdminPasswordConfigured(): boolean {
  return adminSecret().length > 0;
}

export function verifyAdminPassword(password: string): boolean {
  const expected = adminSecret();
  const given = normalizeSecret(password);
  if (!expected || !given) return false;
  return safeEqual(given, expected);
}

function signToken(secret: string, issuedAt: number): string {
  const payload = `${SESSION_PURPOSE}.${issuedAt}`;
  const sig = createHmac('sha256', secret).update(payload).digest('hex');
  return `${issuedAt}.${sig}`;
}

export function createAdminToken(): string {
  const secret = adminSecret();
  if (!secret) {
    throw new Error('ADMIN_PASSWORD is not configured');
  }
  const issuedAt = Math.floor(Date.now() / 1000);
  return signToken(secret, issuedAt);
}

export function verifyAdminToken(token: string | undefined | null): boolean {
  const given = normalizeSecret(token);
  const secret = adminSecret();
  if (!given || !secret) return false;

  // Legacy v2: pure HMAC hex (64 chars)
  if (/^[a-f0-9]{64}$/i.test(given)) {
    const legacy = createHmac('sha256', secret).update('margo-admin-session-v2').digest('hex');
    return safeEqual(given.toLowerCase(), legacy.toLowerCase());
  }

  // v3: issuedAt.signature
  const dot = given.indexOf('.');
  if (dot <= 0) return false;
  const issuedAt = Number(given.slice(0, dot));
  const sig = given.slice(dot + 1);
  if (!Number.isFinite(issuedAt) || issuedAt <= 0 || !/^[a-f0-9]{64}$/i.test(sig)) return false;

  const now = Math.floor(Date.now() / 1000);
  if (issuedAt > now + 60 || now - issuedAt > MAX_AGE_SEC) return false;

  const expected = signToken(secret, issuedAt);
  return safeEqual(given, expected);
}

export function getBearerToken(authHeader: string | undefined | null): string | undefined {
  if (!authHeader || typeof authHeader !== 'string') return undefined;
  if (!authHeader.startsWith('Bearer ')) return undefined;
  return authHeader.slice(7).trim() || undefined;
}

export function requireAdminAuth(authHeader: string | undefined | null): boolean {
  return verifyAdminToken(getBearerToken(authHeader));
}
