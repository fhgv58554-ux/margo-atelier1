export type TryOnPackage = 'one_look' | 'three_looks';

export const TRYON_PACKAGES: Record<
  TryOnPackage,
  { amount: string; currency: 'ZAR'; labelEn: string }
> = {
  one_look: {
    amount: '350.00',
    currency: 'ZAR',
    labelEn: 'One look',
  },
  three_looks: {
    amount: '750.00',
    currency: 'ZAR',
    labelEn: 'Three looks',
  },
};

function paypalMode(): 'sandbox' | 'live' {
  const mode = String(process.env.PAYPAL_MODE || 'sandbox').toLowerCase();
  return mode === 'live' ? 'live' : 'sandbox';
}

export function paypalApiBase(): string {
  return paypalMode() === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
}

export function getPayPalClientId(): string {
  return String(process.env.PAYPAL_CLIENT_ID || '').trim();
}

export function getPayPalClientSecret(): string {
  return String(process.env.PAYPAL_CLIENT_SECRET || '').trim();
}

export function isPayPalConfigured(): boolean {
  return Boolean(getPayPalClientId() && getPayPalClientSecret());
}

export function parseTryOnPackage(value: unknown): TryOnPackage | null {
  if (value === 'one_look' || value === 'three_looks') return value;
  return null;
}

let cachedToken: { value: string; expiresAt: number } | null = null;

export async function getPayPalAccessToken(): Promise<string> {
  const clientId = getPayPalClientId();
  const secret = getPayPalClientSecret();
  if (!clientId || !secret) {
    const err = new Error('PayPal is not configured');
    (err as Error & { statusCode?: number }).statusCode = 503;
    throw err;
  }

  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 30_000) {
    return cachedToken.value;
  }

  const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');
  const res = await fetch(`${paypalApiBase()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = (await res.json().catch(() => ({}))) as {
    access_token?: string;
    expires_in?: number;
    error_description?: string;
  };

  if (!res.ok || !data.access_token) {
    const err = new Error(data.error_description || 'PayPal auth failed');
    (err as Error & { statusCode?: number }).statusCode = 502;
    throw err;
  }

  cachedToken = {
    value: data.access_token,
    expiresAt: now + Math.max(60, Number(data.expires_in) || 300) * 1000,
  };
  return data.access_token;
}

export async function createPayPalOrder(pkg: TryOnPackage): Promise<{ id: string }> {
  const pack = TRYON_PACKAGES[pkg];
  const token = await getPayPalAccessToken();
  const res = await fetch(`${paypalApiBase()}/v2/checkout/orders`, {
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
          description: `MARGO Virtual Try-On — ${pack.labelEn}`,
          custom_id: `tryon_${pkg}`,
          amount: {
            currency_code: pack.currency,
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

  const data = (await res.json().catch(() => ({}))) as {
    id?: string;
    message?: string;
    details?: Array<{ description?: string }>;
  };

  if (!res.ok || !data.id) {
    const detail = data.details?.[0]?.description || data.message || 'PayPal create order failed';
    const err = new Error(detail);
    (err as Error & { statusCode?: number }).statusCode = 502;
    throw err;
  }

  return { id: data.id };
}

export async function capturePayPalOrder(orderId: string): Promise<{
  id: string;
  status: string;
  amount: string;
  currency: string;
  packageKey: TryOnPackage | null;
}> {
  const token = await getPayPalAccessToken();
  const res = await fetch(`${paypalApiBase()}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = (await res.json().catch(() => ({}))) as {
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

  if (!res.ok || !data.id) {
    const err = new Error(data.message || 'PayPal capture failed');
    (err as Error & { statusCode?: number }).statusCode = 502;
    throw err;
  }

  const unit = data.purchase_units?.[0];
  const capture = unit?.payments?.captures?.[0];
  const packageKey = parseTryOnPackage(unit?.reference_id);

  return {
    id: data.id,
    status: data.status || 'UNKNOWN',
    amount: capture?.amount?.value || (packageKey ? TRYON_PACKAGES[packageKey].amount : ''),
    currency: capture?.amount?.currency_code || 'ZAR',
    packageKey,
  };
}
