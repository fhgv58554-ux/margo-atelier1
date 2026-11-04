import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const supabaseConfigured = Boolean(
    process.env.SUPABASE_URL?.trim() && process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  );
  res.status(200).json({
    status: 'ok',
    atelier: 'MARGO Atelier',
    timestamp: new Date().toISOString(),
    storage: supabaseConfigured ? 'supabase' : 'unconfigured',
    adminConfigured: Boolean(process.env.ADMIN_PASSWORD?.trim()),
  });
}
