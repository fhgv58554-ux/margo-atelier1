export type DossierImageRow = { label: string; value: string };

export type DossierImageInput = {
  filename: string;
  dossierId: string;
  title: string;
  clientName: string;
  heroSrc?: string;
  rows: DossierImageRow[];
  colourSwatches?: Array<{ name: string; hex: string }>;
  priorities?: string[];
  notes?: string;
  photoSrcs?: string[];
  footer: string;
};

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }
    const img = new Image();
    // Same-origin / data URLs work without CORS; remote needs it.
    if (/^https?:\/\//i.test(src) && !src.startsWith(window.location.origin)) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const lines: string[] = [];
  let current = words[0];
  for (let i = 1; i < words.length; i += 1) {
    const test = `${current} ${words[i]}`;
    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
    } else {
      lines.push(current);
      current = words[i];
    }
  }
  lines.push(current);
  return lines;
}

function drawContainImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const scale = Math.min(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  const dx = x + (w - dw) / 2;
  const dy = y + (h - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
}

export async function captureDossierImage(input: DossierImageInput): Promise<string> {
  const width = 900;
  const pad = 40;
  const contentWidth = width - pad * 2;

  const heroImg = input.heroSrc ? await loadImage(input.heroSrc) : null;
  const photoImgs = await Promise.all((input.photoSrcs || []).slice(0, 4).map(loadImage));

  // Measure height first with an offscreen context
  const measure = document.createElement('canvas').getContext('2d');
  if (!measure) throw new Error('Canvas unavailable');

  let y = 0;
  y += 36; // top
  y += 48; // brand
  y += 34; // id
  y += 220; // hero
  y += 28; // title
  y += 40; // client

  measure.font = '28px "Plus Jakarta Sans", Arial, sans-serif';
  for (const row of input.rows) {
    const valueLines = wrapText(measure, row.value, contentWidth * 0.58);
    y += Math.max(34, 18 + valueLines.length * 28);
  }

  if (input.colourSwatches?.length) y += 54;
  if (input.priorities?.length) {
    y += 28;
    y += Math.ceil(input.priorities.length / 2) * 36 + 12;
  }
  if (input.notes) {
    measure.font = 'italic 24px Georgia, serif';
    y += 16 + wrapText(measure, `“${input.notes}”`, contentWidth).length * 30;
  }
  if (photoImgs.some(Boolean)) y += 28 + 180;
  y += 50; // footer
  y += 40; // bottom pad

  const height = Math.max(1200, Math.ceil(y));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');

  // Background
  ctx.fillStyle = '#FAF8F5';
  ctx.fillRect(0, 0, width, height);

  let cursor = 36;

  ctx.fillStyle = '#867B71';
  ctx.font = '600 18px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText('MARGO ATELIER', pad, cursor);
  cursor += 42;

  ctx.fillStyle = '#1A1816';
  ctx.font = '300 40px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(input.dossierId, pad, cursor);
  cursor += 24;

  // Hero block
  ctx.fillStyle = '#EAE2D8';
  roundRect(ctx, pad, cursor, contentWidth, 200, 24);
  ctx.fill();
  if (heroImg) {
    ctx.save();
    roundRect(ctx, pad, cursor, contentWidth, 200, 24);
    ctx.clip();
    drawContainImage(ctx, heroImg, pad, cursor, contentWidth, 200);
    ctx.restore();
  }
  // Overlay bar
  ctx.fillStyle = 'rgba(26, 24, 22, 0.62)';
  ctx.fillRect(pad, cursor + 146, contentWidth, 54);
  ctx.fillStyle = '#E8DFD4';
  ctx.font = '600 14px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText(input.title.toUpperCase(), pad + 18, cursor + 170);
  ctx.fillStyle = '#FAF8F5';
  ctx.font = '300 26px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(input.clientName, pad + 18, cursor + 196);
  cursor += 230;

  // Rows
  for (const row of input.rows) {
    ctx.fillStyle = '#8A8177';
    ctx.font = '600 14px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText(row.label.toUpperCase(), pad, cursor);

    ctx.fillStyle = '#1A1816';
    ctx.font = '300 24px "Plus Jakarta Sans", Arial, sans-serif';
    const lines = wrapText(ctx, row.value, contentWidth * 0.58);
    let ly = cursor;
    for (const line of lines) {
      const tw = ctx.measureText(line).width;
      ctx.fillText(line, width - pad - tw, ly);
      ly += 28;
    }

    const blockH = Math.max(34, 18 + lines.length * 28);
    ctx.strokeStyle = '#EFE7DC';
    ctx.beginPath();
    ctx.moveTo(pad, cursor + blockH - 10);
    ctx.lineTo(width - pad, cursor + blockH - 10);
    ctx.stroke();
    cursor += blockH;
  }

  if (input.colourSwatches?.length) {
    cursor += 8;
    let x = pad;
    for (const swatch of input.colourSwatches.slice(0, 8)) {
      ctx.fillStyle = swatch.hex || '#B8A896';
      ctx.beginPath();
      ctx.arc(x + 10, cursor + 10, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#D9D1C5';
      ctx.stroke();
      ctx.fillStyle = '#54493F';
      ctx.font = '16px "Plus Jakarta Sans", Arial, sans-serif';
      ctx.fillText(swatch.name, x + 28, cursor + 16);
      x += Math.min(180, 40 + ctx.measureText(swatch.name).width);
      if (x > width - pad - 120) break;
    }
    cursor += 46;
  }

  if (input.priorities?.length) {
    ctx.fillStyle = '#8A8177';
    ctx.font = '600 14px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText('PRIORITIES', pad, cursor);
    cursor += 18;
    let x = pad;
    let rowY = cursor;
    for (const p of input.priorities) {
      ctx.font = '16px "Plus Jakarta Sans", Arial, sans-serif';
      const tw = ctx.measureText(p).width + 28;
      if (x + tw > width - pad) {
        x = pad;
        rowY += 36;
      }
      ctx.fillStyle = '#EFE8DF';
      roundRect(ctx, x, rowY, tw, 28, 14);
      ctx.fill();
      ctx.fillStyle = '#4A4036';
      ctx.fillText(p, x + 14, rowY + 19);
      x += tw + 10;
    }
    cursor = rowY + 44;
  }

  if (input.notes) {
    ctx.fillStyle = '#706459';
    ctx.font = 'italic 22px Georgia, serif';
    const lines = wrapText(ctx, `“${input.notes}”`, contentWidth);
    for (const line of lines) {
      ctx.fillText(line, pad, cursor);
      cursor += 28;
    }
    cursor += 10;
  }

  const validPhotos = photoImgs.filter(Boolean) as HTMLImageElement[];
  if (validPhotos.length) {
    ctx.fillStyle = '#8A8177';
    ctx.font = '600 14px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText(`PHOTOS · ${validPhotos.length}`, pad, cursor);
    cursor += 16;
    const gap = 12;
    const pw = (contentWidth - gap * (validPhotos.length - 1)) / validPhotos.length;
    const ph = 160;
    validPhotos.forEach((img, i) => {
      const x = pad + i * (pw + gap);
      ctx.fillStyle = '#ECE6DD';
      roundRect(ctx, x, cursor, pw, ph, 14);
      ctx.fill();
      ctx.save();
      roundRect(ctx, x, cursor, pw, ph, 14);
      ctx.clip();
      drawContainImage(ctx, img, x, cursor, pw, ph);
      ctx.restore();
    });
    cursor += ph + 24;
  }

  ctx.fillStyle = '#A5988C';
  ctx.font = '600 14px "Plus Jakarta Sans", Arial, sans-serif';
  const footerW = ctx.measureText(input.footer.toUpperCase()).width;
  ctx.fillText(input.footer.toUpperCase(), (width - footerW) / 2, height - 28);

  const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.92);
  const jpegBytes = dataUrlToUint8Array(jpegDataUrl);
  const pdfBytes = buildJpegPdf(jpegBytes, width, height);
  const pdfBlob = new Blob([Uint8Array.from(pdfBytes)], { type: 'application/pdf' });
  const pdfUrl = URL.createObjectURL(pdfBlob);

  const filename = input.filename.replace(/\.(png|jpe?g|pdf)$/i, '') + '.pdf';
  const link = document.createElement('a');
  link.download = filename;
  link.href = pdfUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(pdfUrl);

  return jpegDataUrl;
}

function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1] || '';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/** Minimal single-page PDF wrapping a JPEG image (no external deps). */
function buildJpegPdf(jpeg: Uint8Array, imgW: number, imgH: number): Uint8Array {
  const encoder = new TextEncoder();
  const objects: Uint8Array[] = [];
  const offsets: number[] = [0];

  const pushObject = (content: string | Uint8Array) => {
    const body = typeof content === 'string' ? encoder.encode(content) : content;
    objects.push(body);
  };

  // Page size in points — keep image aspect, max width ~595 (A4-ish) or use image size scaled
  const maxW = 595;
  const scale = Math.min(1, maxW / imgW);
  const pageW = Math.round(imgW * scale);
  const pageH = Math.round(imgH * scale);

  pushObject('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
  pushObject('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');
  pushObject(
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Contents 4 0 R /Resources << /XObject << /Im0 5 0 R >> >> >>\nendobj\n`
  );
  const contentStream = `q\n${pageW} 0 0 ${pageH} 0 0 cm\n/Im0 Do\nQ\n`;
  pushObject(
    `4 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}endstream\nendobj\n`
  );

  const imgHeader = encoder.encode(
    `5 0 obj\n<< /Type /XObject /Subtype /Image /Width ${imgW} /Height ${imgH} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`
  );
  const imgFooter = encoder.encode('\nendstream\nendobj\n');
  const imgObject = new Uint8Array(imgHeader.length + jpeg.length + imgFooter.length);
  imgObject.set(imgHeader, 0);
  imgObject.set(jpeg, imgHeader.length);
  imgObject.set(imgFooter, imgHeader.length + jpeg.length);
  pushObject(imgObject);

  let pdf = encoder.encode('%PDF-1.4\n');
  for (const obj of objects) {
    offsets.push(pdf.length);
    const next = new Uint8Array(pdf.length + obj.length);
    next.set(pdf, 0);
    next.set(obj, pdf.length);
    pdf = next;
  }

  const xrefStart = pdf.length;
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i += 1) {
    xref += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  xref += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

  const xrefBytes = encoder.encode(xref);
  const out = new Uint8Array(pdf.length + xrefBytes.length);
  out.set(pdf, 0);
  out.set(xrefBytes, pdf.length);
  return out;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}
