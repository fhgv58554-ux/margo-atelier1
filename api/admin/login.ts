import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Flat /api/login endpoint — avoids nested api/admin path issues on Vercel.
 * Token scheme matches lib/admin-auth.ts (margo-admin-session-v3).
 * Zero runtime imports (only type import) for reliable serverless boot.
 */

const SESSION_PURPOSE = 'margo-admin-session-v3';
const buckets = new Map<string, { count: number; resetAt: number }>();

function normalizeSecret(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.normalize('NFKC').replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
}

function adminSecret(): string {
  return normalizeSecret(process.env.ADMIN_PASSWORD);
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

function toHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function createAdminToken(secret: string): Promise<string> {
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload = `${SESSION_PURPOSE}.${issuedAt}`;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  return `${issuedAt}.${toHex(sig)}`;
}

function clientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim().slice(0, 64);
  }
  return 'unknown';
}

function consumeRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSec: 0 };
  }
  if (existing.count >= limit) {
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }
  existing.count += 1;
  return { allowed: true, retryAfterSec: 0 };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const limit = consumeRateLimit(`admin-login:${clientIp(req)}`, 20, 15 * 60 * 1000);
    if (!limit.allowed) {
      res.setHeader('Retry-After', String(limit.retryAfterSec));
      return res.status(429).json({ error: 'Too many login attempts. Try again later.' });
    }

    const secret = adminSecret();
    let passwordRaw: unknown = '';
    if (typeof req.body === 'object' && req.body) {
      passwordRaw = (req.body as { password?: unknown }).password;
    } else if (typeof req.body === 'string') {
      try {
        passwordRaw = (JSON.parse(req.body) as { password?: unknown }).password;
      } catch {
        passwordRaw = '';
      }
    }

    const password = normalizeSecret(passwordRaw);
    if (!password || !safeEqual(password, secret)) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    return res.status(200).json({
      success: true,
      token: await createAdminToken(secret),
      expiresInDays: 90,
    });
  } catch (error: any) {
    console.error('[admin/login]', error?.message || error);
    return res.status(500).json({ error: 'Login failed' });
  }
}
