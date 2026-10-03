import React, { forwardRef } from 'react';
import { ConsultationDossier } from '../types';
import { getOccasions } from '../data/atelierContent';
import { SupportedLanguage, TRANSLATIONS } from '../data/translations';

export interface DossierVisualCardProps {
  dossier: ConsultationDossier;
  dossierId: string;
  occasionImg: string;
  silhouetteLabel: string;
  styleLabel: string;
  colourLabel: string;
  colourItems: Array<{ id: string; name: string; hex: string }>;
  fitLabel: string;
  sizeLabel: string;
  lang: SupportedLanguage;
}

const EMPTY_VALUES = new Set([
  'Не выбран',
  'Не выбрана',
  'Не указан',
  'Не знаю',
  'Not selected',
  'Not specified',
  'Not sure',
  '',
]);

export const DossierVisualCard = forwardRef<HTMLDivElement, DossierVisualCardProps>(
  function DossierVisualCard(
    {
      dossier,
      dossierId,
      occasionImg,
      silhouetteLabel,
      styleLabel,
      colourLabel,
      colourItems,
      fitLabel,
      sizeLabel,
      lang,
    },
    ref
  ) {
    const t = TRANSLATIONS[lang];
    const occasionTitle =
      getOccasions(lang).find((o) => o.id === dossier.occasion)?.title ||
      (dossier.occasion ? dossier.occasion.replace(/_/g, ' ') : '');

    const rows = [
      { label: t.dossierFieldName, value: dossier.contact.fullName },
      { label: 'WhatsApp', value: dossier.contact.whatsappPhone },
      { label: 'Telegram', value: dossier.contact.telegramHandle },
      { label: t.dossierFieldLocation, value: dossier.contact.atelierLocation },
      { label: t.dossierFieldOccasion, value: occasionTitle },
      { label: t.dossierFieldDate, value: dossier.date || dossier.timeline },
      { label: t.dossierFieldBudget, value: dossier.budget },
      { label: t.dossierFieldSilhouette, value: silhouetteLabel },
      { label: t.dossierFieldStyle, value: styleLabel },
      { label: t.dossierFieldColours, value: colourLabel },
      { label: t.dossierFieldFit, value: fitLabel },
      { label: t.dossierFieldSize, value: sizeLabel },
      { label: t.dossierFieldHeight, value: dossier.measurements.height },
    ].filter((row) => row.value && !EMPTY_VALUES.has(String(row.value).trim()));

    const priorities = Array.isArray(dossier.priorities) ? dossier.priorities.filter(Boolean) : [];
    const refs = Array.isArray(dossier.references) ? dossier.references.slice(0, 4) : [];

    return (
      <div
        ref={ref}
        id="dossier-visual-card"
        className="w-full overflow-hidden rounded-3xl border border-[#E2DAD0] bg-[#FAF8F5] text-left shadow-lg"
        style={{ fontFamily: '"Plus Jakarta Sans", "Cormorant Garamond", sans-serif' }}
      >
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-[#EAE2D8]">
          <img
            src={occasionImg}
            alt=""
            className="absolute inset-0 w-full h-full object-contain object-center"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1A1816]/75 to-transparent px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#E8DFD4]">MARGO Atelier</p>
            <p className="font-serif text-xl sm:text-2xl text-[#FAF8F5] tracking-wide">{dossierId}</p>
          </div>
        </div>

        <div className="px-4 sm:px-5 py-4 space-y-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#867B71] mb-1">
              {t.dossierVisualTitle}
            </p>
            <h3 className="font-serif text-xl text-[#1A1816] font-light leading-snug">
              {dossier.contact.fullName || t.dossierVisualClient}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex items-start justify-between gap-3 border-b border-[#EFE7DC] pb-1.5"
              >
                <span className="text-[10px] uppercase tracking-[0.14em] text-[#8A8177] shrink-0 pt-0.5">
                  {row.label}
                </span>
                <span className="text-xs sm:text-sm text-[#1A1816] text-right font-light leading-snug">
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {colourItems.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {colourItems.map((c) => (
                <span
                  key={c.id}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#F3EEE6] border border-[#E2DAD0] text-[10px] text-[#54493F]"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-[#D9D1C5]"
                    style={{ backgroundColor: c.hex }}
                  />
                  {c.name}
                </span>
              ))}
            </div>
          )}

          {priorities.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#8A8177] mb-1.5">
                {t.dossierVisualPriorities}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {priorities.map((p, i) => (
                  <span
                    key={`${p}-${i}`}
                    className="px-2 py-1 rounded-full bg-[#EFE8DF] text-[10px] text-[#4A4036]"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {dossier.referenceNotes && (
            <p className="text-xs italic text-[#706459] font-light leading-relaxed">
              “{dossier.referenceNotes}”
            </p>
          )}

          {refs.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#8A8177] mb-1.5">
                {t.dossierVisualPhotos} · {refs.length}
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {refs.map((src, i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] rounded-lg overflow-hidden border border-[#E2DAD0] bg-[#ECE6DD]"
                  >
                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-contain object-center"
                      crossOrigin="anonymous"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="pt-2 text-[9px] uppercase tracking-[0.18em] text-[#A5988C] text-center">
            MARGO Bridal & Special Occasion
          </p>
        </div>
      </div>
    );
  }
);
