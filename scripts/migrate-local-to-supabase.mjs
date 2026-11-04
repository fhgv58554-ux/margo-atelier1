/**
 * Import data/consultations.json into Supabase.
 *
 * Prerequisites:
 * 1. SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env
 * 2. SQL from supabase/migrations/001_consultations.sql already applied
 *
 * Usage: node scripts/migrate-local-to-supabase.mjs
 */
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local', override: true });

const url = process.env.SUPABASE_URL?.trim().replace(/\/$/, '');
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const file = path.join(process.cwd(), 'data', 'consultations.json');

if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}
if (!fs.existsSync(file)) {
  console.error('Local store not found:', file);
  process.exit(1);
}

const items = JSON.parse(fs.readFileSync(file, 'utf8'));
if (!Array.isArray(items) || items.length === 0) {
  console.error('No consultations to migrate');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function rowFromLocal(c) {
  return {
    id: c.id,
    created_at: c.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    occasion: c.occasion || '',
    event_date: c.date || '',
    timeline: c.timeline || '',
    settings: c.settings || [],
    setting_other: c.settingOther || '',
    event_city: c.eventCity || '',
    budget: c.budget || '',
    silhouette: typeof c.silhouette === 'string' ? c.silhouette : (c.silhouette || []).join(', '),
    style: typeof c.style === 'string' ? c.style : (c.style || []).join(', '),
    colors: c.colors || [],
    custom_color_note: c.customColorNote || '',
    measurements: c.measurements || {},
    // Skip huge data-URLs on first import; keep https refs only
    reference_images: Array.isArray(c.references)
      ? c.references.filter((r) => typeof r === 'string' && /^https?:\/\//i.test(r))
      : [],
    reference_notes: c.referenceNotes || '',
    priorities: c.priorities || [],
    contact: c.contact || {},
    ai_style_direction: c.aiStyleDirection || null,
    consent_accepted: Boolean(c.consentAccepted),
    consent_accepted_at: c.consentAcceptedAt || null,
    consent_version: c.consentVersion || '',
    preferred_channel: c.preferredChannel || null,
    status: c.status || 'new',
    archived: Boolean(c.archived),
    archived_at: c.archivedAt || null,
    summary_text: '',
  };
}

let ok = 0;
let failed = 0;

for (const item of items) {
  const row = rowFromLocal(item);
  const { error } = await supabase.from('consultations').upsert(row, { onConflict: 'id' });
  if (error) {
    failed += 1;
    console.error(`FAIL ${row.id}:`, error.message);
  } else {
    ok += 1;
    console.log(`OK   ${row.id}`);
  }
}

console.log(`\nDone. imported=${ok} failed=${failed} total=${items.length}`);
if (failed) process.exit(1);
