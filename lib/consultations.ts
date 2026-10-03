import fs from 'fs';
import path from 'path';
import { sendAdminDossierEmail } from './admin-mail';
import {
  dbDeleteConsultation,
  dbGetConsultation,
  dbInsertConsultation,
  dbListConsultations,
  dbUpdateConsultation,
} from './consultation-db';
import { assertProductionStorageReady, isSupabaseConfigured } from './supabase';
import { Consultation } from './types';

/**
 * Persistence:
 * - Prefer Supabase PostgreSQL when SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set
 * - Local fallback: data/consultations.json (dev only)
 * - Production / Vercel requires Supabase
 */
const isVercel = Boolean(process.env.VERCEL);

type GlobalStore = typeof globalThis & { __margoConsultations?: Consultation[] };

function memoryStore(): Consultation[] {
  const g = globalThis as GlobalStore;
  if (!g.__margoConsultations) {
    g.__margoConsultations = [];
  }
  return g.__margoConsultations;
}

function consultationsFilePath(): string {
  if (isVercel) {
    return path.join('/tmp', 'margo-consultations.json');
  }
  return process.env.DATA_DIR
    ? path.join(process.env.DATA_DIR, 'consultations.json')
    : path.join(process.cwd(), 'data', 'consultations.json');
}

function readFileStore(): Consultation[] | null {
  try {
    const file = consultationsFilePath();
    if (!fs.existsSync(file)) return null;
    const data = fs.readFileSync(file, 'utf-8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : null;
  } catch (err) {
    console.warn('[Storage] Could not read consultations file, using memory store:', err);
    return null;
  }
}

function writeFileStore(items: Consultation[]): boolean {
  try {
    const file = consultationsFilePath();
    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(file, JSON.stringify(items, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.warn('[Storage] Could not write consultations file:', err);
    return false;
  }
}

function loadLocalConsultations(): Consultation[] {
  const mem = memoryStore();
  if (mem.length > 0) return mem;
  const fromFile = readFileStore();
  if (fromFile) {
    mem.splice(0, mem.length, ...fromFile);
    return mem;
  }
  return mem;
}

function saveLocalConsultations(items: Consultation[]): boolean {
  const mem = memoryStore();
  mem.splice(0, mem.length, ...items);
  return writeFileStore(items);
}

export async function loadConsultations(): Promise<Consultation[]> {
  assertProductionStorageReady();
  if (isSupabaseConfigured()) {
    return dbListConsultations();
  }
  return loadLocalConsultations();
}

function asJoined(value: unknown): string {
  if (Array.isArray(value)) return value.filter(Boolean).join(', ');
  if (typeof value === 'string') return value;
  return '';
}

function clip(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

const ALLOWED_REF_MIME = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']);
const MAX_REF_BYTES = 8 * 1024 * 1024;
const MAX_REF_COUNT = 8;

/** Accept only safe image data-URLs (or short https URLs for gallery assets). */
export function sanitizeReferences(input: unknown): string[] {
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
      // Allow remote https image URLs only (no javascript: / data exe payloads)
      out.push(value);
    }

    if (out.length >= MAX_REF_COUNT) break;
  }
  return out;
}

export function createConsultationFromBody(body: any): Consultation {
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
    consentAcceptedAt: consentAccepted ? clip(body.consentAcceptedAt, 40) || new Date().toISOString() : '',
    consentVersion: clip(body.consentVersion, 40),
    preferredChannel:
      body.preferredChannel === 'whatsapp' || body.preferredChannel === 'telegram'
        ? body.preferredChannel
        : undefined,
    status: 'new',
  };
}

export function assertConsultationPayload(body: any): void {
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

export function formatConsultationMessage(consultation: Consultation): string {
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

  const m = consultation.measurements || {};
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
    const { headline, concept } = consultation.aiStyleDirection;
    if (headline && concept) {
      aiSummary = `"${headline}"\n${concept}`;
    } else if (concept) {
      aiSummary = concept;
    } else if (headline) {
      aiSummary = `"${headline}"`;
    }
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

async function sendTelegramPhoto(
  token: string,
  chatId: string,
  source: string,
  caption?: string
): Promise<boolean> {
  try {
    const form = new FormData();
    form.append('chat_id', chatId);
    if (caption) form.append('caption', caption.slice(0, 1024));

    if (source.startsWith('data:')) {
      const match = source.match(/^data:([^;]+);base64,(.+)$/);
      if (!match) return false;
      const mime = match[1] || 'image/jpeg';
      const buffer = Buffer.from(match[2], 'base64');
      const ext = mime.includes('png') ? 'png' : mime.includes('webp') ? 'webp' : 'jpg';
      const blob = new Blob([buffer], { type: mime });
      form.append('photo', blob, `reference.${ext}`);
    } else if (/^https?:\/\//i.test(source)) {
      form.append('photo', source);
    } else if (source.startsWith('/')) {
      const appUrl = process.env.APP_URL?.replace(/\/$/, '');
      if (!appUrl) return false;
      form.append('photo', `${appUrl}${source}`);
    } else {
      return false;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const response = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
      method: 'POST',
      body: form,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const data: any = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) {
      console.error('[Telegram] sendPhoto failed:', data?.description || response.status);
      return false;
    }
    return true;
  } catch (err: any) {
    console.error('[Telegram] sendPhoto error:', err?.message || err);
    return false;
  }
}

export async function sendTelegramNotification(consultation: Consultation): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

  if (!token || !chatId) {
    console.info('[Telegram] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured. Skipping.');
    return false;
  }

  try {
    const text = formatConsultationMessage(consultation);
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
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
      await sendTelegramPhoto(
        token,
        chatId,
        refs[i],
        `Референс ${i + 1}/${refs.length} · ${consultation.id}`
      );
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
    } else if (/^https?:\/\//i.test(source)) {
      const imgRes = await fetch(source);
      if (!imgRes.ok) return null;
      const blob = await imgRes.blob();
      form.append('type', blob.type || 'image/jpeg');
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

export async function sendWhatsAppNotification(consultation: Consultation): Promise<boolean> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN?.trim();
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
  const notifyTo = (process.env.WHATSAPP_NOTIFY_TO || '').replace(/\D/g, '');

  if (!token || !phoneNumberId) {
    console.info(
      '[WhatsApp] WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID not configured. Skipping.'
    );
    return false;
  }

  if (!notifyTo) {
    console.info('[WhatsApp] WHATSAPP_NOTIFY_TO is empty. Skipping.');
    return false;
  }

  try {
    const text = formatConsultationMessage(consultation);
    // WhatsApp text body limit is 4096 characters
    const body = text.length > 4000 ? `${text.slice(0, 3990)}\n…` : text;
    const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(url, {
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

    const data: any = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error(
        `[WhatsApp] Failed to send notification (status: ${response.status}):`,
        data?.error?.message || data || 'Unknown WhatsApp API error'
      );
      return false;
    }

    const refs = Array.isArray(consultation.references) ? consultation.references.slice(0, MAX_REF_COUNT) : [];
    for (let i = 0; i < refs.length; i++) {
      const mediaId = await uploadWhatsAppMedia(token, phoneNumberId, refs[i], i);
      if (!mediaId) continue;
      const imgRes = await fetch(url, {
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
        const imgData: any = await imgRes.json().catch(() => ({}));
        console.error('[WhatsApp] Image send failed:', imgData?.error?.message || imgRes.status);
      }
    }

    console.info(`[WhatsApp] Successfully delivered notification for dossier ${consultation.id}`);
    return true;
  } catch (error: any) {
    console.error('[WhatsApp] Dispatch error:', error?.message || 'Network failure');
    return false;
  }
}

export async function submitConsultation(body: any) {
  assertProductionStorageReady();
  assertConsultationPayload(body);
  const newConsultation = createConsultationFromBody(body);
  const summaryText = formatConsultationMessage(newConsultation);

  let persisted = false;
  let saved = newConsultation;

  if (isSupabaseConfigured()) {
    saved = await dbInsertConsultation(newConsultation, summaryText);
    persisted = true;
  } else {
    const list = loadLocalConsultations();
    list.unshift(newConsultation);
    persisted = saveLocalConsultations(list);
    saved = newConsultation;
  }

  console.info(
    `[MARGO Atelier Engine] New Consultation Dossier received (${saved.id}) persisted=${persisted} supabase=${isSupabaseConfigured()}`
  );

  let telegramNotificationSent = false;
  let whatsappNotificationSent = false;
  let emailNotificationSent = false;

  // Always deliver to atelier: Telegram bot + admin email (+ WhatsApp when configured).
  try {
    telegramNotificationSent = await sendTelegramNotification(saved);
  } catch (tgErr: any) {
    console.error('[Telegram] Unexpected notification error:', tgErr?.message || 'Error');
    telegramNotificationSent = false;
  }

  try {
    whatsappNotificationSent = await sendWhatsAppNotification(saved);
  } catch (waErr: any) {
    console.error('[WhatsApp] Unexpected notification error:', waErr?.message || 'Error');
    whatsappNotificationSent = false;
  }

  try {
    emailNotificationSent = await sendAdminDossierEmail(saved);
  } catch (mailErr: any) {
    console.error('[Email] Unexpected notification error:', mailErr?.message || 'Error');
    emailNotificationSent = false;
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

export async function updateConsultationStatus(id: string, status: Consultation['status']) {
  assertProductionStorageReady();
  if (!status) return null;

  if (isSupabaseConfigured()) {
    return dbUpdateConsultation(id, { status });
  }

  const list = loadLocalConsultations();
  const item = list.find((c) => c.id === id);
  if (!item) return null;
  item.status = status;
  saveLocalConsultations(list);
  return item;
}

export async function archiveConsultation(id: string) {
  assertProductionStorageReady();
  const archivedAt = new Date().toISOString();

  if (isSupabaseConfigured()) {
    return dbUpdateConsultation(id, { archived: true, archivedAt });
  }

  const list = loadLocalConsultations();
  const item = list.find((c) => c.id === id);
  if (!item) return null;
  item.archived = true;
  item.archivedAt = archivedAt;
  saveLocalConsultations(list);
  return item;
}

export async function permanentlyDeleteConsultation(
  id: string
): Promise<'not_found' | 'not_archived' | 'deleted'> {
  assertProductionStorageReady();

  if (isSupabaseConfigured()) {
    const existing = await dbGetConsultation(id);
    if (!existing) return 'not_found';
    if (!existing.archived) return 'not_archived';
    await dbDeleteConsultation(id);
    return 'deleted';
  }

  const list = loadLocalConsultations();
  const item = list.find((c) => c.id === id);
  if (!item) return 'not_found';
  if (!item.archived) return 'not_archived';
  saveLocalConsultations(list.filter((c) => c.id !== id));
  return 'deleted';
}
