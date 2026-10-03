import type { VercelRequest, VercelResponse } from '@vercel/node';

type TryOnPackage = 'one_look' | 'three_looks';

const PACKAGES: Record<TryOnPackage, { amount: string; label: string }> = {
  one_look: { amount: '350.00', label: 'One look' },
  three_looks: { amount: '750.00', label: 'Three looks' },
};

function paypalBase(): string {
  return String(process.env.PAYPAL_MODE || 'sandbox').toLowerCase() === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
}

async function accessToken(): Promise<string> {
  const clientId = String(process.env.PAYPAL_CLIENT_ID || '').trim();
  const secret = String(process.env.PAYPAL_CLIENT_SECRET || '').trim();
  if (!clientId || !secret) {
    throw Object.assign(new Error('PayPal is not configured'), { statusCode: 503 });
  }
  const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');
  const res = await fetch(`${paypalBase()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const data = (await res.json().catch(() => ({}))) as {
    access_token?: string;
    error_description?: string;
  };
  if (!res.ok || !data.access_token) {
    throw Object.assign(new Error(data.error_description || 'PayPal auth failed'), { statusCode: 502 });
  }
  return data.access_token;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const pkg = req.body?.package as TryOnPackage;
    if (pkg !== 'one_look' && pkg !== 'three_looks') {
      return res.status(400).json({ error: 'Invalid package' });
    }

    const pack = PACKAGES[pkg];
    const token = await accessToken();
    const orderRes = await fetch(`${paypalBase()}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: pkg,
            description: `MARGO Virtual Try-On — ${pack.label}`,
            custom_id: `tryon_${pkg}`,
            amount: {
              currency_code: 'ZAR',
              value: pack.amount,
            },
          },
        ],
        application_context: {
          brand_name: 'MARGO Atelier',
          user_action: 'PAY_NOW',
          shipping_preference: 'NO_SHIPPING',
        },
      }),
    });

    const data = (await orderRes.json().catch(() => ({}))) as {
      id?: string;
      message?: string;
      details?: Array<{ description?: string }>;
    };

    if (!orderRes.ok || !data.id) {
      return res.status(502).json({
        error: data.details?.[0]?.description || data.message || 'PayPal create order failed',
      });
    }

    return res.status(200).json({ id: data.id, package: pkg, amount: pack.amount, currency: 'ZAR' });
  } catch (error: any) {
    const status = Number(error?.statusCode) || 500;
    return res.status(status).json({ error: error?.message || 'Failed to create PayPal order' });
  }
}
