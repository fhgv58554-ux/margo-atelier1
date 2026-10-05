import { randomUUID } from 'node:crypto';
import type { Consultation } from './types';
import { getSupabaseAdmin, isSupabaseConfigured } from './supabase';

const BUCKET = 'consultation-references';
const SIGNED_URL_TTL_SEC = 60 * 60 * 24 * 7; // 7 days for admin viewing / telegram retries

type ConsultationRow = {
  id: string;
  created_at: string;
  updated_at?: string;
  occasion: string;
  event_date: string;
  timeline: string;
  settings: unknown;
  setting_other: string;
  event_city: string;
  budget: string;
  silhouette: string;
  style: string;
  colors: unknown;
  custom_color_note: string;
  measurements: unknown;
  reference_images: unknown;
  reference_notes: string;
  priorities: unknown;
  contact: unknown;
  ai_style_direction: unknown;
  consent_accepted: boolean;
  consent_accepted_at: string | null;
  consent_version: string;
  preferred_channel: string | null;
  status: Consultation['status'];
  archived: boolean;
  archived_at: string | null;
  summary_text: string;
};

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v) => typeof v === 'string') : [];
}

function parseDataUrl(value: string): { mime: string; bytes: Buffer; ext: string } | null {
  const match = value.match(/^data:([^;,]+);base64,([A-Za-z0-9+/=\s]+)$/);
  if (!match) return null;
  const mime = match[1].toLowerCase();
  const allowed = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']);
  if (!allowed.has(mime)) return null;
  const bytes = Buffer.from(match[2].replace(/\s/g, ''), 'base64');
  if (!bytes.length || bytes.length > 8 * 1024 * 1024) return null;
  const ext =
    mime.includes('png') ? 'png' : mime.includes('webp') ? 'webp' : mime.includes('gif') ? 'gif' : 'jpg';
  return { mime, bytes, ext };
}

function isStoragePath(value: string): boolean {
  return value.startsWith('storage:') || (!value.startsWith('data:') && !/^https?:\/\//i.test(value) && value.includes('/'));
}

function storagePathFromRef(value: string): string | null {
  if (value.startsWith('storage:')) return value.slice('storage:'.length);
  if (isStoragePath(value) && !/^https?:\/\//i.test(value)) return value;
  return null;
}

export function consultationToRow(
  consultation: Consultation,
  summaryText: string
): Record<string, unknown> {
  return {
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
    archived: Boolean(consultation.archived),
    archived_at: consultation.archivedAt || null,
    summary_text: summaryText || '',
  };
}

export function rowToConsultation(row: ConsultationRow): Consultation {
  const contact = (row.contact && typeof row.contact === 'object' ? row.contact : {}) as Consultation['contact'];
  return {
    id: row.id,
    createdAt: row.created_at,
    occasion: row.occasion || '',
    date: row.event_date || '',
    timeline: row.timeline || '',
    settings: asStringArray(row.settings),
    settingOther: row.setting_other || '',
    eventCity: row.event_city || '',
    budget: row.budget || '',
    silhouette: row.silhouette || '',
    style: row.style || '',
    colors: asStringArray(row.colors),
    customColorNote: row.custom_color_note || '',
    measurements:
      row.measurements && typeof row.measurements === 'object'
        ? (row.measurements as Consultation['measurements'])
        : {},
    references: asStringArray(row.reference_images),
    referenceNotes: row.reference_notes || '',
    priorities: asStringArray(row.priorities),
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
      preferredLanguage: contact.preferredLanguage || 'English',
    },
    aiStyleDirection:
      row.ai_style_direction && typeof row.ai_style_direction === 'object'
        ? (row.ai_style_direction as Consultation['aiStyleDirection'])
        : undefined,
    consentAccepted: Boolean(row.consent_accepted),
    consentAcceptedAt: row.consent_accepted_at || '',
    consentVersion: row.consent_version || '',
    preferredChannel:
      row.preferred_channel === 'whatsapp' || row.preferred_channel === 'telegram'
        ? row.preferred_channel
        : undefined,
    status: row.status || 'new',
    archived: Boolean(row.archived),
    archivedAt: row.archived_at || undefined,
  };
}

async function resolveReferenceUrls(refs: string[]): Promise<string[]> {
  if (!refs.length || !isSupabaseConfigured()) return refs;
  const supabase = getSupabaseAdmin();
  const out: string[] = [];
  for (const ref of refs) {
    const path = storagePathFromRef(ref);
    if (!path) {
      out.push(ref);
      continue;
    }
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(path, SIGNED_URL_TTL_SEC);
    if (error || !data?.signedUrl) {
      console.warn('[Storage] Could not sign reference URL:', error?.message || path);
      out.push(ref);
    } else {
      out.push(data.signedUrl);
    }
  }
  return out;
}

/** Upload data-URL images to Supabase Storage; keep https URLs; store storage paths in DB. */
export async function persistReferenceImages(
  consultationId: string,
  references: string[]
): Promise<string[]> {
  if (!isSupabaseConfigured()) return references;
  const supabase = getSupabaseAdmin();
  const stored: string[] = [];

  for (let i = 0; i < references.length; i++) {
    const ref = references[i];
    if (/^https:\/\//i.test(ref)) {
      stored.push(ref);
      continue;
    }
    const parsed = parseDataUrl(ref);
    if (!parsed) continue;

    const path = `${consultationId}/ref-${i + 1}-${randomUUID()}.${parsed.ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, parsed.bytes, {
      contentType: parsed.mime,
      upsert: false,
    });
    if (error) {
      console.error('[Storage] Upload failed:', error.message);
      // Fall back to keeping data URL only if upload fails (still in DB jsonb)
      stored.push(ref);
      continue;
    }
    stored.push(`storage:${path}`);
  }
  return stored;
}

export async function deleteReferenceFiles(references: string[]): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const paths = references.map(storagePathFromRef).filter((p): p is string => Boolean(p));
  if (!paths.length) return;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage.from(BUCKET).remove(paths);
  if (error) console.warn('[Storage] Could not delete references:', error.message);
}

export async function dbListConsultations(): Promise<Consultation[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('consultations')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    throw Object.assign(new Error(`Failed to load consultations: ${error.message}`), {
      statusCode: 500,
    });
  }
  const rows = (data || []) as ConsultationRow[];
  const mapped = rows.map(rowToConsultation);
  return Promise.all(
    mapped.map(async (item) => ({
      ...item,
      references: await resolveReferenceUrls(item.references),
    }))
  );
}

export async function dbInsertConsultation(
  consultation: Consultation,
  summaryText: string
): Promise<Consultation> {
  const supabase = getSupabaseAdmin();
  const withStoredRefs = {
    ...consultation,
    references: await persistReferenceImages(consultation.id, consultation.references),
  };
  const row = consultationToRow(withStoredRefs, summaryText);
  const { data, error } = await supabase.from('consultations').insert(row).select('*').single();
  if (error) {
    throw Object.assign(new Error(`Failed to save consultation: ${error.message}`), {
      statusCode: 500,
    });
  }
  const saved = rowToConsultation(data as ConsultationRow);
  return {
    ...saved,
    references: await resolveReferenceUrls(saved.references),
  };
}

export async function dbUpdateConsultation(
  id: string,
  patch: Partial<Consultation>
): Promise<Consultation | null> {
  const supabase = getSupabaseAdmin();
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.status) payload.status = patch.status;
  if (typeof patch.archived === 'boolean') {
    payload.archived = patch.archived;
    payload.archived_at = patch.archived ? patch.archivedAt || new Date().toISOString() : null;
  }

  const { data, error } = await supabase
    .from('consultations')
    .update(payload)
    .eq('id', id)
    .select('*')
    .maybeSingle();

  if (error) {
    throw Object.assign(new Error(`Failed to update consultation: ${error.message}`), {
      statusCode: 500,
    });
  }
  if (!data) return null;
  const saved = rowToConsultation(data as ConsultationRow);
  return {
    ...saved,
    references: await resolveReferenceUrls(saved.references),
  };
}

export async function dbDeleteConsultation(id: string): Promise<Consultation | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('consultations')
    .delete()
    .eq('id', id)
    .select('*')
    .maybeSingle();
  if (error) {
    throw Object.assign(new Error(`Failed to delete consultation: ${error.message}`), {
      statusCode: 500,
    });
  }
  if (!data) return null;
  const deleted = rowToConsultation(data as ConsultationRow);
  await deleteReferenceFiles(deleted.references);
  return deleted;
}

export async function dbGetConsultation(id: string): Promise<Consultation | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('consultations').select('*').eq('id', id).maybeSingle();
  if (error) {
    throw Object.assign(new Error(`Failed to load consultation: ${error.message}`), {
      statusCode: 500,
    });
  }
  if (!data) return null;
  const item = rowToConsultation(data as ConsultationRow);
  return {
    ...item,
    references: await resolveReferenceUrls(item.references),
  };
}
