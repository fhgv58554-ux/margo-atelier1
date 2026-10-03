import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createStyleDirection } from './lib/style-direction';
import {
  loadConsultations,
  submitConsultation,
  updateConsultationStatus,
  archiveConsultation,
  permanentlyDeleteConsultation,
} from './lib/consultations';
import {
  createAdminToken,
  isAdminPasswordConfigured,
  requireAdminAuth,
  verifyAdminPassword,
} from './lib/admin-auth';
import { clientIpFromHeaders, consumeRateLimit } from './lib/rate-limit';
import type { Consultation } from './lib/types';
import {
  capturePayPalOrder,
  createPayPalOrder,
  getPayPalClientId,
  isPayPalConfigured,
  parseTryOnPackage,
  TRYON_PACKAGES,
} from './lib/paypal';

const runningFromDist = /dist[/\\]server\.cjs$/.test(process.argv[1] || '');
const isProduction =
  process.env.NODE_ENV === 'production' || runningFromDist;

const projectRoot = runningFromDist
  ? path.resolve(path.dirname(path.resolve(process.argv[1])), '..')
  : process.cwd();

dotenv.config({ path: path.join(projectRoot, '.env'), override: true });
dotenv.config({ path: path.join(projectRoot, '.env.local'), override: true });

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const PUBLIC_DIR = path.join(projectRoot, 'dist');

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(express.json({ limit: '12mb' }));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (req.path.startsWith('/api')) {
    res.setHeader('Cache-Control', 'no-store');
  }
  next();
});

function denyUnlessAdmin(req: express.Request, res: express.Response): boolean {
  if (!isAdminPasswordConfigured()) {
    res.status(503).json({
      error: 'Admin password is not configured. Set ADMIN_PASSWORD in environment.',
    });
    return false;
  }
  if (!requireAdminAuth(req.headers.authorization)) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', atelier: 'MARGO Atelier', timestamp: new Date().toISOString() });
});

function handleAdminLogin(req: express.Request, res: express.Response) {
  const ip = clientIpFromHeaders(
    req.headers as Record<string, string | string[] | undefined>,
    req.ip || 'unknown'
  );
  const limit = consumeRateLimit(`admin-login:${ip}`, 20, 15 * 60 * 1000);
  if (!limit.allowed) {
    res.setHeader('Retry-After', String(limit.retryAfterSec));
    return res.status(429).json({ error: 'Too many login attempts. Try again later.' });
  }
  if (!isAdminPasswordConfigured()) {
    return res.status(503).json({
      error: 'Admin password is not configured. Set ADMIN_PASSWORD in environment.',
    });
  }
  const password = String(req.body?.password || '');
  if (!verifyAdminPassword(password)) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  return res.json({ success: true, token: createAdminToken(), expiresInDays: 90 });
}

app.post('/api/admin/login', handleAdminLogin);
app.post('/api/login', handleAdminLogin);

app.get('/api/paypal/config', (_req, res) => {
  const configured = isPayPalConfigured();
  return res.json({
    configured,
    clientId: configured ? getPayPalClientId() : null,
    currency: 'ZAR',
    mode: String(process.env.PAYPAL_MODE || 'sandbox').toLowerCase() === 'live' ? 'live' : 'sandbox',
  });
});

app.post('/api/paypal/create-order', async (req, res) => {
  const ip = clientIpFromHeaders(
    req.headers as Record<string, string | string[] | undefined>,
    req.ip || 'unknown'
  );
  const limit = consumeRateLimit(`paypal-create:${ip}`, 30, 60 * 60 * 1000);
  if (!limit.allowed) {
    res.setHeader('Retry-After', String(limit.retryAfterSec));
    return res.status(429).json({ error: 'Too many payment attempts. Try again later.' });
  }
  try {
    const pkg = parseTryOnPackage(req.body?.package);
    if (!pkg) {
      return res.status(400).json({ error: 'Invalid package' });
    }
    const order = await createPayPalOrder(pkg);
    const pack = TRYON_PACKAGES[pkg];
    return res.json({
      id: order.id,
      package: pkg,
      amount: pack.amount,
      currency: pack.currency,
    });
  } catch (error: any) {
    const status = Number(error?.statusCode) || 500;
    return res.status(status).json({ error: error?.message || 'Failed to create PayPal order' });
  }
});

app.post('/api/paypal/capture-order', async (req, res) => {
  const ip = clientIpFromHeaders(
    req.headers as Record<string, string | string[] | undefined>,
    req.ip || 'unknown'
  );
  const limit = consumeRateLimit(`paypal-capture:${ip}`, 30, 60 * 60 * 1000);
  if (!limit.allowed) {
    res.setHeader('Retry-After', String(limit.retryAfterSec));
    return res.status(429).json({ error: 'Too many payment attempts. Try again later.' });
  }
  try {
    const orderId = String(req.body?.orderId || '').trim();
    if (!orderId) {
      return res.status(400).json({ error: 'orderId is required' });
    }
    const captured = await capturePayPalOrder(orderId);
    if (captured.status !== 'COMPLETED') {
      return res.status(400).json({
        error: 'Payment was not completed',
        status: captured.status,
        id: captured.id,
      });
    }
    return res.json({
      id: captured.id,
      status: captured.status,
      package: captured.packageKey,
      amount: captured.amount,
      currency: captured.currency,
    });
  } catch (error: any) {
    const status = Number(error?.statusCode) || 500;
    return res.status(status).json({ error: error?.message || 'Failed to capture PayPal order' });
  }
});

app.post('/api/gemini/style-direction', async (req, res) => {
  try {
    const result = await createStyleDirection(req.body || {});
    return res.json(result);
  } catch (error: any) {
    console.error('[style-direction]', error?.message || error);
    return res.status(500).json({ error: 'Failed to generate style direction' });
  }
});

app.post('/api/consultations', async (req, res) => {
  const ip = clientIpFromHeaders(req.headers as Record<string, string | string[] | undefined>, req.ip || 'unknown');
  const limit = consumeRateLimit(`consult-post:${ip}`, 20, 60 * 60 * 1000);
  if (!limit.allowed) {
    res.setHeader('Retry-After', String(limit.retryAfterSec));
    return res.status(429).json({ error: 'Too many submissions. Try again later.' });
  }
  try {
    const result = await submitConsultation(req.body || {});
    return res.json(result);
  } catch (error: any) {
    const status = Number(error?.statusCode) || 500;
    if (status >= 400 && status < 500) {
      return res.status(status).json({ error: error?.message || 'Invalid request' });
    }
    console.error('Error creating consultation:', error);
    return res.status(500).json({ error: 'Failed to create consultation dossier' });
  }
});

app.get('/api/consultations', async (req, res) => {
  if (!denyUnlessAdmin(req, res)) return;
  try {
    const list = await loadConsultations();
    res.json({
      consultations: list,
      total: list.length,
    });
  } catch (error: any) {
    const status = Number(error?.statusCode) || 500;
    return res.status(status).json({ error: error?.message || 'Failed to load consultations' });
  }
});

app.patch('/api/consultations/:id', async (req, res) => {
  if (!denyUnlessAdmin(req, res)) return;
  const { id } = req.params;
  try {
    if (req.body?.archive === true) {
      const archived = await archiveConsultation(id);
      if (!archived) {
        return res.status(404).json({ error: 'Consultation not found' });
      }
      return res.json({ success: true, consultation: archived });
    }
    const { status } = req.body as { status?: Consultation['status'] };
    const item = await updateConsultationStatus(id, status as Consultation['status']);
    if (!item) {
      return res.status(404).json({ error: 'Consultation not found' });
    }
    return res.json({ success: true, consultation: item });
  } catch (error: any) {
    const code = Number(error?.statusCode) || 500;
    return res.status(code).json({ error: error?.message || 'Failed to update consultation' });
  }
});

app.delete('/api/consultations/:id', async (req, res) => {
  if (!denyUnlessAdmin(req, res)) return;
  const { id } = req.params;
  const password = String(req.body?.password || '');
  if (!verifyAdminPassword(password)) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  try {
    const result = await permanentlyDeleteConsultation(id);
    if (result === 'not_found') {
      return res.status(404).json({ error: 'Consultation not found' });
    }
    if (result === 'not_archived') {
      return res.status(400).json({ error: 'Archive the request before permanent deletion' });
    }
    return res.json({ success: true });
  } catch (error: any) {
    const code = Number(error?.statusCode) || 500;
    return res.status(code).json({ error: error?.message || 'Failed to delete consultation' });
  }
});

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    if (!fs.existsSync(path.join(PUBLIC_DIR, 'index.html'))) {
      console.error(`[Server] Frontend build not found in ${PUBLIC_DIR}. Run npm run build first.`);
      process.exit(1);
    }
    app.use(express.static(PUBLIC_DIR, { index: false, maxAge: '7d' }));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.setHeader('Cache-Control', 'no-cache');
      res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
    });
  }

  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (err?.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'Invalid JSON' });
    }
    console.error('[Server]', err?.message || err);
    return res.status(500).json({ error: 'Internal server error' });
  });

  const server = app.listen(PORT, HOST, () => {
    console.log(`MARGO ATELIER listening on http://${HOST}:${PORT} (${isProduction ? 'production' : 'development'})`);
  });

  const shutdown = () => {
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 8000).unref();
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer().catch((err) => {
  console.error('[Server] Failed to start:', err);
  process.exit(1);
});
