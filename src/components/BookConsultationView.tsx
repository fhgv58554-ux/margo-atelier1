import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';
import { OccasionType } from '../types';
import { getBudgetTiers, getOccasions, timelineLabelFromDate } from '../data/atelierContent';
import { SupportedLanguage, TRANSLATIONS } from '../data/translations';
import { CONSENT_VERSION } from './WelcomeView';
import { staggerContainer, microFadeUp } from '../utils/motion';

interface BookConsultationViewProps {
  lang: SupportedLanguage;
  onBackHome: () => void;
  onVirtualTryOn: () => void;
}

export const BookConsultationView: React.FC<BookConsultationViewProps> = ({
  lang,
  onBackHome,
  onVirtualTryOn,
}) => {
  const t = TRANSLATIONS[lang];
  const occasions = getOccasions(lang);
  const budgetTiers = getBudgetTiers(lang);

  const [occasion, setOccasion] = useState<OccasionType | ''>('');
  const [date, setDate] = useState('');
  const [budget, setBudget] = useState('');
  const [fullName, setFullName] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dossierId, setDossierId] = useState('');
  const [error, setError] = useState('');

  const canSubmit =
    Boolean(occasion) &&
    Boolean(budget) &&
    fullName.trim().length > 1 &&
    whatsappPhone.trim().length > 4 &&
    acceptTerms &&
    acceptPrivacy &&
    !submitting;

  const handleSubmit = async () => {
    if (!canSubmit || !occasion) return;
    setSubmitting(true);
    setError('');
    try {
      const occasionMeta = occasions.find((o) => o.id === occasion);
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion,
          date,
          timeline: date ? timelineLabelFromDate(date, lang) : 'Flexible',
          budget,
          silhouette: '',
          style: '',
          colors: [],
          measurements: {},
          references: [],
          priorities: ['Short consultation booking'],
          contact: {
            fullName: fullName.trim(),
            whatsappPhone: whatsappPhone.trim(),
            telegramHandle: '',
            consultationType: 'atelier',
            atelierLocation: 'South Africa',
            preferredLanguage: 'English',
          },
          preferredChannel: 'whatsapp',
          consentAccepted: true,
          consentAcceptedAt: new Date().toISOString(),
          consentVersion: CONSENT_VERSION,
          silhouetteLabel: '',
          styleLabel: '',
          colourLabel: '',
          referenceNotes: `Quick booking · ${occasionMeta?.title || occasion}`,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.consultation?.id) {
        setDossierId(data.consultation.id);
      } else {
        setError(typeof data?.error === 'string' ? data.error : t.bookError);
      }
    } catch {
      setError(t.bookError);
    } finally {
      setSubmitting(false);
    }
  };

  if (dossierId) {
    return (
      <motion.div
        variants={staggerContainer(0.05, 0.03)}
        initial="initial"
        animate="animate"
        className="w-full max-w-xl mx-auto px-4 py-12 text-center"
      >
        <motion.div
          variants={microFadeUp}
          className="mx-auto mb-4 w-12 h-12 rounded-full bg-[#E8F3EC] flex items-center justify-center"
        >
          <Check className="w-6 h-6 text-[#2E8B4A]" />
        </motion.div>
        <motion.h2 variants={microFadeUp} className="font-serif text-2xl font-light mb-3">
          {t.bookSuccessTitle}
        </motion.h2>
        <motion.p variants={microFadeUp} className="text-sm text-[#61574D] font-light mb-8">
          {t.bookSuccessText(dossierId)}
        </motion.p>
        <motion.button
          variants={microFadeUp}
          type="button"
          onClick={onBackHome}
          className="px-6 py-3 rounded-full border border-[#D9D1C5] text-xs uppercase tracking-[0.16em] text-[#54493F] hover:bg-[#F2EDE5]"
        >
          {t.bookBackHome}
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer(0.04, 0.02)}
      initial="initial"
      animate="animate"
      className="w-full max-w-xl mx-auto px-3 sm:px-4 py-4 sm:py-8 flex flex-col"
    >
      <motion.div variants={microFadeUp} className="text-center mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#968A7F] block mb-1">
          {t.bookBadge}
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl font-light text-[#1A1816] tracking-tight">
          {t.bookTitle} <span className="italic font-normal">{t.bookTitleItalic}</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#706459] mt-2 font-light">{t.bookSubtitle}</p>
      </motion.div>

      {/* Occasion */}
      <motion.section variants={microFadeUp} className="mb-6">
        <h3 className="text-[11px] uppercase tracking-[0.18em] text-[#61564C] mb-3 font-medium">
          {t.step01Title} {t.step01TitleItalic}{' '}
          <span className="normal-case tracking-normal font-light">
            ({t.bookOccasionHint})
          </span>
        </h3>
        <div className="grid grid-cols-2 gap-2.5 items-stretch">
          {occasions.map((item) => {
            const selected = occasion === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setOccasion(item.id)}
                className={`rounded-2xl overflow-hidden border text-left transition-all cursor-pointer flex flex-col h-full ${
                  selected
                    ? 'border-[#1A1816] ring-2 ring-[#1A1816]/25'
                    : 'border-[#EAE3D9] hover:border-[#BDB0A2]'
                }`}
              >
                <div className="aspect-[3/4] w-full shrink-0 bg-[#ECE6DD] relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-contain object-center"
                  />
                </div>
                <div className="px-2.5 py-2 bg-[#FAF8F5] border-t border-[#EAE3D9] flex-1 flex flex-col">
                  <div className="font-serif text-sm text-[#1A1816] leading-snug">{item.title}</div>
                  <div className="text-[10px] text-[#6B5F54] mt-0.5 leading-relaxed">{item.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </motion.section>

      {/* Date */}
      <motion.section variants={microFadeUp} className="mb-6">
        <label
          htmlFor="book-date"
          className="block text-[11px] uppercase tracking-[0.18em] text-[#61564C] mb-2 font-medium"
        >
          {t.step02DateLabel}
        </label>
        <input
          id="book-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl bg-[#F6F1EA] border border-[#D9D1C5] text-sm text-[#1A1816] focus:outline-none focus:ring-1 focus:ring-[#1A1816]"
        />
        <p className="text-[10px] text-[#867B71] mt-1.5 font-light">{t.step02TimelineNote}</p>
      </motion.section>

      {/* Budget */}
      <motion.section variants={microFadeUp} className="mb-6">
        <h3 className="text-[11px] uppercase tracking-[0.18em] text-[#61564C] mb-3 font-medium">
          {t.step03Title} {t.step03TitleItalic}
        </h3>
        <div className="space-y-2.5">
          {budgetTiers.map((tier) => {
            const selected = budget === tier.range;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => setBudget(tier.range)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  selected
                    ? 'bg-[#FAF6F0] border-[#1A1816] ring-1 ring-[#1A1816]'
                    : 'bg-[#FAF8F5] border-[#E8E1D6] hover:border-[#BDB0A2]'
                }`}
              >
                <span className="text-[10px] uppercase tracking-[0.16em] text-[#867B71] font-medium">
                  {tier.tier}
                </span>
                <div className="font-serif text-base text-[#1A1816] mt-1">
                  {tier.prices[0] || tier.range}
                </div>
                <p className="text-[11px] text-[#6B5F54] mt-1 font-light leading-relaxed">
                  {tier.description}
                </p>
              </button>
            );
          })}
        </div>
      </motion.section>

      {/* Name + WhatsApp */}
      <motion.section variants={microFadeUp} className="space-y-3 mb-6">
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D6]">
          <label
            htmlFor="book-name"
            className="block text-[11px] uppercase tracking-[0.18em] text-[#61564C] mb-1.5 font-medium"
          >
            {t.bookNameLabel}
          </label>
          <input
            id="book-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={t.bookNamePlaceholder}
            className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#D9D1C5] text-sm focus:outline-none focus:ring-1 focus:ring-[#1A1816]"
          />
        </div>
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D6]">
          <label
            htmlFor="book-wa"
            className="block text-[11px] uppercase tracking-[0.18em] text-[#61564C] mb-1.5 font-medium"
          >
            {t.bookWaLabel}
          </label>
          <input
            id="book-wa"
            type="tel"
            value={whatsappPhone}
            onChange={(e) => setWhatsappPhone(e.target.value)}
            placeholder={t.bookWaPlaceholder}
            className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#D9D1C5] text-sm focus:outline-none focus:ring-1 focus:ring-[#1A1816]"
          />
        </div>
      </motion.section>

      <motion.div variants={microFadeUp} className="space-y-2 mb-5 text-left">
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-0.5 accent-[#1A1816]"
          />
          <span className="text-xs text-[#1A1816] leading-snug">{t.consentTermsCheck}</span>
        </label>
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptPrivacy}
            onChange={(e) => setAcceptPrivacy(e.target.checked)}
            className="mt-0.5 accent-[#1A1816]"
          />
          <span className="text-xs text-[#1A1816] leading-snug">{t.consentPrivacyCheck}</span>
        </label>
      </motion.div>

      {error && (
        <p className="text-center text-xs text-[#A14A3A] mb-3" role="alert">
          {error}
        </p>
      )}

      <motion.button
        variants={microFadeUp}
        type="button"
        disabled={!canSubmit}
        onClick={handleSubmit}
        className={`w-full py-4 px-5 rounded-full text-xs font-medium tracking-[0.14em] uppercase border transition-all ${
          canSubmit
            ? 'bg-[#1A1816] text-[#FAF8F5] border-[#1A1816] hover:bg-[#2C2723] active:scale-[0.99] cursor-pointer'
            : 'bg-[#E5DDD2] text-[#9E9488] border-[#E5DDD2] cursor-not-allowed'
        }`}
      >
        {submitting ? t.bookSubmitting : t.bookSubmitBtn}
      </motion.button>

      <motion.div variants={microFadeUp} className="mt-4 flex flex-col gap-2">
        <p className="text-[11px] sm:text-xs text-[#61574D] font-light leading-relaxed text-center px-1">
          {t.virtualTryOnPromo}
        </p>
        <button
          id="book-virtual-tryon-btn"
          type="button"
          onClick={onVirtualTryOn}
          className="w-full py-2.5 sm:py-3.5 px-5 rounded-full border border-[#C9BEB0] bg-[#F6F1EA] text-[#1A1816] hover:border-[#1A1816] transition-all duration-200 flex items-center justify-center gap-2 text-[9px] sm:text-xs font-medium tracking-[0.14em] uppercase cursor-pointer"
        >
          <span>{t.virtualTryOnBtn}</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#8C7D70]" />
        </button>
      </motion.div>
    </motion.div>
  );
};
