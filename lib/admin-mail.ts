import type { Consultation } from './types';

function smtpConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const port = Number(process.env.SMTP_PORT || 587);
  const to = process.env.ADMIN_EMAIL?.trim();
  const from = process.env.SMTP_FROM?.trim() || user;
  if (!host || !user || !pass || !to || !from) return null;
  return { host, user, pass, port, to, from };
}

function photoAttachments(consultation: Consultation) {
  const refs = Array.isArray(consultation.references) ? consultation.references.slice(0, 8) : [];
  return refs.flatMap((source, index) => {
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
}

export async function sendAdminDossierEmail(consultation: Consultation): Promise<boolean> {
  const smtp = smtpConfig();
  if (!smtp) {
    console.info('[Email] ADMIN_EMAIL or SMTP settings are missing. Skipping.');
    return false;
  }

  try {
    const nodemailerMod = await import('nodemailer');
    const nodemailer = nodemailerMod.default ?? nodemailerMod;
    const transport = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.port === 465,
      auth: { user: smtp.user, pass: smtp.pass },
    });
    const { formatConsultationMessage } = await import('./consultations');
    await transport.sendMail({
      from: smtp.from,
      to: smtp.to,
      subject: `Досье ${consultation.id || ''} · MARGO Atelier`.trim(),
      text: formatConsultationMessage(consultation),
      attachments: photoAttachments(consultation),
    });
    console.info(`[Email] Dossier ${consultation.id} sent to ${smtp.to}`);
    return true;
  } catch (error: any) {
    console.error('[Email] Failed to send dossier:', error?.message || error);
    return false;
  }
}
