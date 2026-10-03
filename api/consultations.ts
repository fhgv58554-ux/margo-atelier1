import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Vercel-safe consultations API (zero runtime parent-lib imports).
 * GET/POST both use fetch + Web Crypto so the serverless bundle boots reliably.
 */

const SESSION_PURPOSE = 'margo-admin-session-v3';
const MAX_AGE_SEC = 90 * 24 * 60 * 60;
const MAX_REF_COUNT = 8;
const MAX_REF_BYTES = 8 * 1024 * 1024;
const ALLOWED_REF_MIME = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']);

function normalizeSecret(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.normalize('NFKC').replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
}

function adminSecret(): string {
  return normalizeSecret(process.env.ADMIN_PASSWORD) || 'margo-admin';
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

async function signToken(secret: string, issuedAt: number): Promise<string> {
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

async function verifyAdminToken(token: string | undefined): Promise<boolean> {
  const given = normalizeSecret(token);
  const secret = adminSecret();
  if (!given || !secret) return false;

  if (/^[a-f0-9]{64}$/i.test(given)) {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const sig = await crypto.subtle.sign('HMAC', key, enc.encode('margo-admin-session-v2'));
    return safeEqual(given.toLowerCase(), toHex(sig));
  }

  const dot = given.indexOf('.');
  if (dot <= 0) return false;
  const issuedAt = Number(given.slice(0, dot));
  if (!Number.isFinite(issuedAt) || issuedAt <= 0) return false;
  const now = Math.floor(Date.now() / 1000);
  if (issuedAt > now + 60 || now - issuedAt > MAX_AGE_SEC) return false;
  const expected = await signToken(secret, issuedAt);
  return safeEqual(given, expected);
}

function bearer(req: VercelRequest): string | undefined {
  const h = req.headers.authorization;
  if (!h || typeof h !== 'string' || !h.startsWith('Bearer ')) return undefined;
  return h.slice(7).trim() || undefined;
}

function supabaseConfig() {
  const url = process.env.SUPABASE_URL?.trim().replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  return { url, key };
}

function clip(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

function asJoined(value: unknown): string {
  if (Array.isArray(value)) return value.filter(Boolean).join(', ');
  if (typeof value === 'string') return value;
  return '';
}

function sanitizeReferences(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  const out: string[] = [];
  for (const item of input) {
    if (typeof item !== 'string') continue;
    const value = item.trim();
    if (!value || value.length > MAX_REF_BYTES * 1.4) continue;

    if (value.startsWith('data:')) {
      const match = value.match(/^data:([^;,]+);base64,([A-Za-z0-9+/=\s]+)$/);
      if (!match) continue;
      const mime = match[1].toLowerCase();
      if (!ALLOWED_REF_MIME.has(mime)) continue;
      const b64 = match[2].replace(/\s/g, '');
      const approxBytes = Math.floor((b64.length * 3) / 4);
      if (approxBytes <= 0 || approxBytes > MAX_REF_BYTES) continue;
      out.push(`data:${mime};base64,${b64}`);
    } else if (/^https?:\/\//i.test(value) && value.length < 2048) {
      out.push(value);
    }

    if (out.length >= MAX_REF_COUNT) break;
  }
  return out;
}

function rowToConsultation(row: any) {
  const contact = row.contact && typeof row.contact === 'object' ? row.contact : {};
  return {
    id: row.id,
    createdAt: row.created_at,
    occasion: row.occasion || '',
    date: row.event_date || '',
    timeline: row.timeline || '',
    settings: Array.isArray(row.settings) ? row.settings : [],
    settingOther: row.setting_other || '',
    eventCity: row.event_city || '',
    budget: row.budget || '',
    silhouette: row.silhouette || '',
    style: row.style || '',
    colors: Array.isArray(row.colors) ? row.colors : [],
    customColorNote: row.custom_color_note || '',
    measurements: row.measurements && typeof row.measurements === 'object' ? row.measurements : {},
    references: Array.isArray(row.reference_images) ? row.reference_images : [],
    referenceNotes: row.reference_notes || '',
    priorities: Array.isArray(row.priorities) ? row.priorities : [],
    contact: {
      name: contact.name || contact.fullName || 'Guest Client',
      fullName: contact.fullName || contact.name || 'Guest Client',
      telegram: contact.telegram || contact.telegramHandle || '',
      telegramHandle: contact.telegramHandle || contact.telegram || '',
      phone: contact.phone || contact.whatsappPhone || '',
      whatsappPhone: contact.whatsappPhone || contact.phone || '',
      email: contact.email || '',
      consultationType: contact.consultationType === 'virtual' ? 'virtual' : 'atelier',
      location: contact.location || contact.atelierLocation || '',
      atelierLocation: contact.atelierLocation || contact.location || '',
      preferredLanguage: contact.preferredLanguage || 'Русский',
    },
    aiStyleDirection: row.ai_style_direction || undefined,
    consentAccepted: Boolean(row.consent_accepted),
    consentAcceptedAt: row.consent_accepted_at || '',
    consentVersion: row.consent_version || '',
    preferredChannel: row.preferred_channel || undefined,
    status: row.status || 'new',
    archived: Boolean(row.archived),
    archivedAt: row.archived_at || undefined,
  };
}

function createConsultationFromBody(body: any) {
  const consentAccepted = Boolean(body?.consentAccepted);
  return {
    id: `MARGO-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    occasion: clip(body.occasion, 80) || 'Atelier Consultation',
    date: clip(body.date, 40),
    timeline: clip(body.timeline, 80) || 'Flexible',
    settings: Array.isArray(body.settings)
      ? body.settings.map((s: unknown) => clip(s, 80)).filter(Boolean).slice(0, 12)
      : [],
    settingOther: clip(body.settingOther, 200),
    eventCity: clip(body.eventCity, 120),
    budget: clip(body.budget, 80),
    silhouette: clip(body.silhouetteLabel || asJoined(body.silhouette), 200),
    style: clip(body.styleLabel || asJoined(body.style), 200),
    colors: Array.isArray(body.colors)
      ? body.colors.map((c: unknown) => clip(c, 60)).filter(Boolean).slice(0, 20)
      : body.colourLabel
        ? String(body.colourLabel)
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean)
            .slice(0, 20)
        : [],
    customColorNote: clip(body.customColorNote, 500),
    measurements:
      body.measurements && typeof body.measurements === 'object' ? body.measurements : {},
    references: sanitizeReferences(body.references),
    referenceNotes: clip(body.referenceNotes, 1000),
    priorities: Array.isArray(body.priorities)
      ? body.priorities.map((p: unknown) => clip(p, 120)).filter(Boolean).slice(0, 20)
      : [],
    contact: {
      name: clip(body.contact?.fullName || body.contact?.name, 120) || 'Guest Client',
      fullName: clip(body.contact?.fullName || body.contact?.name, 120) || 'Guest Client',
      telegram: clip(body.contact?.telegramHandle || body.contact?.telegram, 80),
      telegramHandle: clip(body.contact?.telegramHandle || body.contact?.telegram, 80),
      phone: clip(body.contact?.whatsappPhone || body.contact?.phone, 40),
      whatsappPhone: clip(body.contact?.whatsappPhone || body.contact?.phone, 40),
      email: clip(body.contact?.email, 120),
      consultationType: body.contact?.consultationType === 'virtual' ? 'virtual' : 'atelier',
      location: clip(body.contact?.atelierLocation || body.contact?.location, 120),
      atelierLocation: clip(body.contact?.atelierLocation || body.contact?.location, 120),
      preferredLanguage: clip(body.contact?.preferredLanguage, 40) || 'Русский',
    },
    aiStyleDirection: body.aiStyleDirection,
    consentAccepted,
    consentAcceptedAt: consentAccepted
      ? clip(body.consentAcceptedAt, 40) || new Date().toISOString()
      : '',
    consentVersion: clip(body.consentVersion, 40),
    preferredChannel:
      body.preferredChannel === 'whatsapp' || body.preferredChannel === 'telegram'
        ? body.preferredChannel
        : undefined,
    status: 'new' as const,
  };
}

function assertConsultationPayload(body: any): void {
  if (!body || typeof body !== 'object') {
    throw Object.assign(new Error('Invalid payload'), { statusCode: 400 });
  }
  if (!Boolean(body.consentAccepted)) {
    throw Object.assign(new Error('Consent is required'), { statusCode: 400 });
  }
  const name = clip(body.contact?.fullName || body.contact?.name, 120);
  if (!name) {
    throw Object.assign(new Error('Client name is required'), { statusCode: 400 });
  }
  const tg = clip(body.contact?.telegramHandle || body.contact?.telegram, 80);
  const phone = clip(body.contact?.whatsappPhone || body.contact?.phone, 40);
  if (!tg && !phone) {
    throw Object.assign(new Error('Telegram or WhatsApp contact is required'), { statusCode: 400 });
  }
  if (Array.isArray(body.references) && body.references.length > MAX_REF_COUNT) {
    throw Object.assign(new Error('Too many reference images'), { statusCode: 400 });
  }
}

function formatConsultationMessage(consultation: ReturnType<typeof createConsultationFromBody>): string {
  const clientName =
    consultation.contact?.fullName || consultation.contact?.name || 'Guest Client';

  const OCCASION_NAMES: Record<string, string> = {
    bridal: 'Свадебный образ',
    evening: 'Вечерний образ',
    special_occasion: 'Особое событие',
    custom_dress: 'Платье на заказ',
  };
  const occasion =
    OCCASION_NAMES[consultation.occasion] || consultation.occasion || 'Atelier Consultation';

  const dateStr = consultation.date
    ? consultation.timeline
      ? `${consultation.date} (${consultation.timeline})`
      : consultation.date
    : consultation.timeline || 'Flexible';

  const settingsParts = [
    ...(Array.isArray(consultation.settings) ? consultation.settings : []),
    consultation.settingOther,
    consultation.eventCity ? `Город/регион: ${consultation.eventCity}` : '',
  ].filter(Boolean);
  const settingsStr = settingsParts.length > 0 ? settingsParts.join('; ') : '';

  const budget = consultation.budget || 'Не указан';
  const silhouette = consultation.silhouette || 'Не выбран';
  const style = consultation.style || 'Не выбран';
  const colours =
    Array.isArray(consultation.colors) && consultation.colors.length > 0
      ? consultation.colors.join(', ')
      : 'Не указаны';
  const colorNote = consultation.customColorNote?.trim()
    ? `\nПожелания по цвету: ${consultation.customColorNote.trim()}`
    : '';
  const priorities =
    Array.isArray(consultation.priorities) && consultation.priorities.length > 0
      ? consultation.priorities.join(', ')
      : 'Не указаны';

  const m = consultation.measurements || ({} as any);
  const fit =
    Array.isArray(m.fitPreferences) && m.fitPreferences.length > 0
      ? m.fitPreferences.join(', ')
      : m.fitPreference || '—';
  const measurementsStr = [
    m.height ? `Рост: ${m.height}` : '',
    m.clothingSize ? `Размер: ${m.clothingSize}` : '',
    `Посадка: ${fit}`,
    m.notes ? `Заметки: ${m.notes}` : '',
  ]
    .filter(Boolean)
    .join(' | ');

  const refNotes = consultation.referenceNotes?.trim()
    ? `\nЗаметки к референсам: ${consultation.referenceNotes.trim()}`
    : '';
  const refsCount = Array.isArray(consultation.references) ? consultation.references.length : 0;

  const contactList: string[] = [];
  const tg = consultation.contact?.telegramHandle || consultation.contact?.telegram;
  if (tg) contactList.push(`Telegram: ${tg}`);
  const phone = consultation.contact?.whatsappPhone || consultation.contact?.phone;
  if (phone) contactList.push(`WhatsApp: ${phone}`);
  const email = consultation.contact?.email;
  if (email) contactList.push(`Email: ${email}`);
  const location = consultation.contact?.atelierLocation || consultation.contact?.location;
  if (location) contactList.push(`Локация: ${location}`);
  const lang = consultation.contact?.preferredLanguage;
  if (lang) contactList.push(`Язык: ${lang}`);
  const contactStr = contactList.length > 0 ? contactList.join(' | ') : 'Не указаны';

  let aiSummary = 'Не сгенерировано';
  if (consultation.aiStyleDirection) {
    const { headline, concept } = consultation.aiStyleDirection as any;
    if (headline && concept) aiSummary = `"${headline}"\n${concept}`;
    else if (concept) aiSummary = concept;
    else if (headline) aiSummary = `"${headline}"`;
  }

  const consentLine = consultation.consentAccepted
    ? `Согласие: да (${consultation.consentAcceptedAt || '—'}; v${consultation.consentVersion || '—'})`
    : 'Согласие: не отмечено';

  const channelLine =
    consultation.preferredChannel === 'whatsapp'
      ? 'Канал отправки: WhatsApp'
      : consultation.preferredChannel === 'telegram'
        ? 'Канал отправки: Telegram'
        : '';

  const header = consultation.id
    ? `NEW MARGO ATELIER CONSULTATION\nID: ${consultation.id}`
    : 'NEW MARGO ATELIER CONSULTATION';

  return `${header}

Клиент: ${clientName}
Повод: ${occasion}
Дата: ${dateStr}${settingsStr ? `\nФормат события: ${settingsStr}` : ''}
Бюджет: ${budget}
Силуэт: ${silhouette}
Стиль: ${style}
Цвета: ${colours}${colorNote}
Посадка: ${measurementsStr || '—'}
Приоритеты: ${priorities}
Фото-референсы: ${refsCount}${refNotes}
Контакты: ${contactStr}
${consentLine}${channelLine ? `\n${channelLine}` : ''}

AI STYLE DIRECTION:
${aiSummary}`;
}

async function sendAdminDossierEmail(
  consultation: ReturnType<typeof createConsultationFromBody>
): Promise<boolean> {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const port = Number(process.env.SMTP_PORT || 587);
  const to = process.env.ADMIN_EMAIL?.trim();
  const from = process.env.SMTP_FROM?.trim() || user;
  if (!host || !user || !pass || !to || !from) {
    console.info('[Email] ADMIN_EMAIL or SMTP settings are missing. Skipping.');
    return false;
  }

  try {
    const nodemailerMod = await import('nodemailer');
    const nodemailer = (nodemailerMod as any).default ?? nodemailerMod;
    const transport = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const refs = Array.isArray(consultation.references)
      ? consultation.references.slice(0, MAX_REF_COUNT)
      : [];
    const attachments = refs.flatMap((source: string, index: number) => {
      const match = source.match(/^data:([^;]+);base64,(.+)$/);
      if (!match) return [];
      const mime = match[1] || 'image/jpeg';
      const ext = mime.includes('png') ? 'png' : mime.includes('webp') ? 'webp' : 'jpg';
      return [
        {
          filename: `reference-${index + 1}.${ext}`,
          content: Buffer.from(match[2], 'base64'),
          contentType: mime,
        },
      ];
    });

    await transport.sendMail({
      from,
      to,
      subject: `Досье ${consultation.id || ''} · MARGO Atelier`.trim(),
      text: formatConsultationMessage(consultation),
      attachments,
    });
    console.info(`[Email] Dossier ${consultation.id} sent to ${to}`);
    return true;
  } catch (error: any) {
    console.error('[Email] Failed to send dossier:', error?.message || error);
    return false;
  }
}

async function sendTelegramNotification(
  consultation: ReturnType<typeof createConsultationFromBody>
): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) {
    console.info('[Telegram] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured. Skipping.');
    return false;
  }

  try {
    const text = formatConsultationMessage(consultation);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const data: any = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) {
      console.error(
        `[Telegram] Failed to send notification (status: ${response.status}):`,
        data?.description || 'Unknown Telegram API error'
      );
      return false;
    }

    const refs = Array.isArray(consultation.references) ? consultation.references.slice(0, MAX_REF_COUNT) : [];
    for (let i = 0; i < refs.length; i++) {
      const source = refs[i];
      if (!source.startsWith('data:') && !/^https?:\/\//i.test(source)) continue;
      try {
        const form = new FormData();
        form.append('chat_id', chatId);
        form.append('caption', `Референс ${i + 1}/${refs.length} · ${consultation.id}`.slice(0, 1024));
        if (source.startsWith('data:')) {
          const match = source.match(/^data:([^;]+);base64,(.+)$/);
          if (!match) continue;
          const mime = match[1] || 'image/jpeg';
          const bytes = Buffer.from(match[2], 'base64');
          const ext = mime.includes('png') ? 'png' : mime.includes('webp') ? 'webp' : 'jpg';
          form.append(
            'photo',
            new Blob([bytes], { type: mime }),
            `reference.${ext}`
          );
        } else {
          form.append('photo', source);
        }
        await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
          method: 'POST',
          body: form,
        });
      } catch (photoErr: any) {
        console.error('[Telegram] sendPhoto error:', photoErr?.message || photoErr);
      }
    }

    console.info(`[Telegram] Successfully delivered notification for dossier ${consultation.id}`);
    return true;
  } catch (error: any) {
    console.error('[Telegram] Dispatch error:', error?.message || 'Network failure');
    return false;
  }
}

async function uploadWhatsAppMedia(
  token: string,
  phoneNumberId: string,
  source: string,
  index: number
): Promise<string | null> {
  try {
    const form = new FormData();
    form.append('messaging_product', 'whatsapp');
    if (source.startsWith('data:')) {
      const match = source.match(/^data:([^;]+);base64,(.+)$/);
      if (!match) return null;
      const mime = match[1] || 'image/jpeg';
      const bytes = Buffer.from(match[2], 'base64');
      const ext = mime.includes('png') ? 'png' : mime.includes('webp') ? 'webp' : 'jpg';
      form.append('type', mime);
      form.append('file', new Blob([bytes], { type: mime }), `photo-${index + 1}.${ext}`);
    } else if (/^https:\/\//i.test(source)) {
      const imgRes = await fetch(source);
      if (!imgRes.ok) return null;
      const blob = await imgRes.blob();
      const mime = blob.type || 'image/jpeg';
      form.append('type', mime);
      form.append('file', blob, `photo-${index + 1}.jpg`);
    } else {
      return null;
    }

    const uploadRes = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/media`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    const uploadData: any = await uploadRes.json().catch(() => ({}));
    if (!uploadRes.ok || !uploadData?.id) {
      console.error('[WhatsApp] Media upload failed:', uploadData?.error?.message || uploadRes.status);
      return null;
    }
    return String(uploadData.id);
  } catch (err: any) {
    console.error('[WhatsApp] Media upload error:', err?.message || err);
    return null;
  }
}

async function sendWhatsAppNotification(
  consultation: ReturnType<typeof createConsultationFromBody>
): Promise<boolean> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN?.trim();
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
  const notifyTo = (process.env.WHATSAPP_NOTIFY_TO || '').replace(/\D/g, '');
  if (!token || !phoneNumberId || !notifyTo) return false;

  try {
    const text = formatConsultationMessage(consultation);
    const body = text.length > 4000 ? `${text.slice(0, 3990)}\n…` : text;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const response = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: notifyTo,
        type: 'text',
        text: { preview_url: false, body },
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      console.error('[WhatsApp] Failed:', (data as any)?.error?.message || response.status);
      return false;
    }

    const refs = Array.isArray(consultation.references) ? consultation.references.slice(0, MAX_REF_COUNT) : [];
    for (let i = 0; i < refs.length; i++) {
      const mediaId = await uploadWhatsAppMedia(token, phoneNumberId, refs[i], i);
      if (!mediaId) continue;
      const imgRes = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: notifyTo,
          type: 'image',
          image: {
            id: mediaId,
            caption: `Фото ${i + 1}/${refs.length} · ${consultation.id}`,
          },
        }),
      });
      if (!imgRes.ok) {
        const imgData = await imgRes.json().catch(() => ({}));
        console.error('[WhatsApp] Image send failed:', (imgData as any)?.error?.message || imgRes.status);
      }
    }

    return true;
  } catch (error: any) {
    console.error('[WhatsApp] Dispatch error:', error?.message || 'Network failure');
    return false;
  }
}

type GlobalStore = typeof globalThis & { __margoConsultations?: any[] };

function memoryStore(): any[] {
  const g = globalThis as GlobalStore;
  if (!g.__margoConsultations) g.__margoConsultations = [];
  return g.__margoConsultations;
}

async function insertConsultationRest(
  consultation: ReturnType<typeof createConsultationFromBody>,
  summaryText: string
): Promise<{ saved: any; persisted: boolean }> {
  const sb = supabaseConfig();
  if (!sb) {
    // Soft fallback: still issue a dossier number + notify Telegram when Supabase env is missing.
    const mem = memoryStore();
    mem.unshift(consultation);
    console.warn(
      '[api/consultations] Supabase not configured; dossier kept in ephemeral memory for this instance.'
    );
    return { saved: consultation, persisted: false };
  }

  const row = {
    id: consultation.id,
    created_at: consultation.createdAt,
    updated_at: new Date().toISOString(),
    occasion: consultation.occasion || '',
    event_date: consultation.date || '',
    timeline: consultation.timeline || '',
    settings: consultation.settings || [],
    setting_other: consultation.settingOther || '',
    event_city: consultation.eventCity || '',
    budget: consultation.budget || '',
    silhouette: consultation.silhouette || '',
    style: consultation.style || '',
    colors: consultation.colors || [],
    custom_color_note: consultation.customColorNote || '',
    measurements: consultation.measurements || {},
    reference_images: consultation.references || [],
    reference_notes: consultation.referenceNotes || '',
    priorities: consultation.priorities || [],
    contact: consultation.contact || {},
    ai_style_direction: consultation.aiStyleDirection || null,
    consent_accepted: Boolean(consultation.consentAccepted),
    consent_accepted_at: consultation.consentAcceptedAt || null,
    consent_version: consultation.consentVersion || '',
    preferred_channel: consultation.preferredChannel || null,
    status: consultation.status || 'new',
    archived: false,
    archived_at: null,
    summary_text: summaryText || '',
  };

  const response = await fetch(`${sb.url}/rest/v1/consultations`, {
    method: 'POST',
    headers: {
      apikey: sb.key,
      Authorization: `Bearer ${sb.key}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(row),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      (Array.isArray(payload) && payload[0]?.message) ||
      payload?.message ||
      payload?.error ||
      'Failed to save consultation';
    throw Object.assign(new Error(String(message)), { statusCode: 500 });
  }

  const savedRow = Array.isArray(payload) ? payload[0] : payload;
  return { saved: savedRow ? rowToConsultation(savedRow) : consultation, persisted: true };
}

async function submitConsultation(body: any) {
  assertConsultationPayload(body);
  const created = createConsultationFromBody(body);
  const summaryText = formatConsultationMessage(created);
  const { saved, persisted } = await insertConsultationRest(created, summaryText);

  let telegramNotificationSent = false;
  let whatsappNotificationSent = false;
  let emailNotificationSent = false;

  // Always deliver to atelier: Telegram bot + admin email (+ WhatsApp when configured).
  try {
    telegramNotificationSent = await sendTelegramNotification(saved as any);
  } catch (tgErr: any) {
    console.error('[Telegram] Unexpected notification error:', tgErr?.message || 'Error');
  }

  try {
    whatsappNotificationSent = await sendWhatsAppNotification(saved as any);
  } catch (waErr: any) {
    console.error('[WhatsApp] Unexpected notification error:', waErr?.message || 'Error');
  }

  try {
    emailNotificationSent = await sendAdminDossierEmail(saved as any);
  } catch (mailErr: any) {
    console.error('[Email] Unexpected notification error:', mailErr?.message || 'Error');
  }

  return {
    success: true,
    consultation: saved,
    telegramNotificationSent,
    whatsappNotificationSent,
    emailNotificationSent,
    persisted,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
  if (req.method === 'GET') {
      const ok = await verifyAdminToken(bearer(req));
      if (!ok) return res.status(401).json({ error: 'Unauthorized' });

      const sb = supabaseConfig();
      if (!sb) {
      return res.status(503).json({
          error:
            'Supabase is not configured on Vercel. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, run the SQL migration, then redeploy.',
        });
      }

      const response = await fetch(
        `${sb.url}/rest/v1/consultations?select=*&order=created_at.desc`,
        {
          headers: {
            apikey: sb.key,
            Authorization: `Bearer ${sb.key}`,
            Accept: 'application/json',
          },
        }
      );
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        return res.status(500).json({
          error: typeof payload?.message === 'string' ? payload.message : 'Failed to load consultations',
        });
      }
      const list = Array.isArray(payload) ? payload.map(rowToConsultation) : [];
      return res.status(200).json({ consultations: list, total: list.length });
  }

  if (req.method === 'POST') {
      const result = await submitConsultation(req.body || {});
      return res.status(200).json(result);
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    const status = Number(error?.statusCode) || 500;
    console.error('[api/consultations]', error?.message || error);
    return res.status(status).json({ error: error?.message || 'Request failed' });
  }
}
