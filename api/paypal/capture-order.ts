import type { VercelRequest, VercelResponse } from '@vercel/node';

type TryOnPackage = 'one_look' | 'three_looks';

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
    const orderId = String(req.body?.orderId || '').trim();
    if (!orderId) {
      return res.status(400).json({ error: 'orderId is required' });
    }

    const token = await accessToken();
    const captureRes = await fetch(
      `${paypalBase()}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = (await captureRes.json().catch(() => ({}))) as {
      id?: string;
      status?: string;
      message?: string;
      purchase_units?: Array<{
        reference_id?: string;
        payments?: {
          captures?: Array<{
            amount?: { value?: string; currency_code?: string };
          }>;
        };
      }>;
    };

    if (!captureRes.ok || !data.id) {
      return res.status(502).json({ error: data.message || 'PayPal capture failed' });
    }

    const unit = data.purchase_units?.[0];
    const capture = unit?.payments?.captures?.[0];
    const packageKey =
      unit?.reference_id === 'one_look' || unit?.reference_id === 'three_looks'
        ? (unit.reference_id as TryOnPackage)
        : null;

    if (data.status !== 'COMPLETED') {
      return res.status(400).json({
        error: 'Payment was not completed',
        status: data.status,
        id: data.id,
      });
    }

    return res.status(200).json({
      id: data.id,
      status: data.status,
      package: packageKey,
      amount: capture?.amount?.value || null,
      currency: capture?.amount?.currency_code || 'ZAR',
    });
  } catch (error: any) {
    const status = Number(error?.statusCode) || 500;
    return res.status(status).json({ error: error?.message || 'Failed to capture PayPal order' });
  }
}
