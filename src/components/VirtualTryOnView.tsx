import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Check, Plus, Upload, X } from 'lucide-react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { SupportedLanguage, TRANSLATIONS } from '../data/translations';
import { AtelierLookItem, getAtelierCatalogueLooks } from '../data/atelierLooks';
import { CONSENT_VERSION } from './WelcomeView';
import { staggerContainer, microFadeUp } from '../utils/motion';
import tryonOriginal from '../assets/images/tryon/original.jpg';
import tryonResult from '../assets/images/tryon/look-result.jpg';
import tryonDress from '../assets/images/tryon/look-dress.jpg';
import tryonVideo from '../assets/images/tryon/tryon-demo.mp4';

interface VirtualTryOnViewProps {
  lang: SupportedLanguage;
  onBackHome: () => void;
}

type TryOnPackage = 'one_look' | 'three_looks';
type Phase = 'form' | 'tariff' | 'payment' | 'success';

type AtelierLook = AtelierLookItem;

const MAX_PHOTOS = 4;
const MAX_ATELIER_LOOKS = 3;
const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);

const PACKAGE_META: Record<TryOnPackage, { amount: string; priceLabel: string }> = {
  one_look: { amount: '350.00', priceLabel: 'R350' },
  three_looks: { amount: '750.00', priceLabel: 'R750' },
};

export const VirtualTryOnView: React.FC<VirtualTryOnViewProps> = ({ lang, onBackHome }) => {
  const t = TRANSLATIONS[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const atelierCarouselRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>('form');
  const [selectedPackage, setSelectedPackage] = useState<TryOnPackage | null>(null);
  const [fullName, setFullName] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [note, setNote] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [atelierLooks, setAtelierLooks] = useState<AtelierLook[]>([]);
  const [uploadError, setUploadError] = useState('');
  const [atelierError, setAtelierError] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [acceptSaAgreement, setAcceptSaAgreement] = useState(false);
  const [payStarted, setPayStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const paypalBoxRef = useRef<HTMLDivElement>(null);
  const [dossierId, setDossierId] = useState('');
  const [error, setError] = useState('');
  const [paypalClientId, setPaypalClientId] = useState('');
  const [paypalReady, setPaypalReady] = useState(false);
  const [paypalConfigured, setPaypalConfigured] = useState(true);

  const catalogueLooks = getAtelierCatalogueLooks(lang);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/paypal/config');
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (data?.configured && data?.clientId) {
          setPaypalClientId(String(data.clientId));
          setPaypalConfigured(true);
        } else {
          setPaypalConfigured(false);
        }
      } catch {
        if (!cancelled) setPaypalConfigured(false);
      } finally {
        if (!cancelled) setPaypalReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const canOrder =
    fullName.trim().length > 1 &&
    whatsappPhone.trim().length > 4 &&
    photos.length > 0 &&
    atelierLooks.length > 0 &&
    acceptTerms &&
    acceptPrivacy &&
    !submitting;

  const toAbsoluteUrl = (src: string) => {
    if (src.startsWith('data:') || /^https?:\/\//i.test(src)) return src;
    try {
      return new URL(src, window.location.origin).href;
    } catch {
      return src;
    }
  };

  const toggleAtelierLook = (look: AtelierLook) => {
    setAtelierError('');
    setAtelierLooks((prev) => {
      if (prev.some((item) => item.id === look.id)) {
        return prev.filter((item) => item.id !== look.id);
      }
      if (prev.length >= MAX_ATELIER_LOOKS) {
        setAtelierError(t.tryonAtelierMax);
        return prev;
      }
      return [...prev, look];
    });
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError('');
    const slots = MAX_PHOTOS - photos.length;
    if (slots <= 0) {
      setUploadError(t.tryonUploadMax);
      return;
    }

    Array.from(files)
      .slice(0, slots)
      .forEach((file) => {
        if (!ALLOWED.has(file.type)) {
          setUploadError('Please use JPG, PNG or WebP.');
          return;
        }
        if (file.size > MAX_BYTES) {
          setUploadError('File size exceeds 8MB.');
          return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (!result) return;
          setPhotos((prev) => (prev.includes(result) ? prev : [...prev, result].slice(0, MAX_PHOTOS)));
        };
        reader.readAsDataURL(file);
      });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setUploadError('');
  };

  const submitAfterPayment = async (payment: {
    orderId: string;
    packageKey: TryOnPackage;
    amount: string;
    currency: string;
  }) => {
    setSubmitting(true);
    setError('');
    try {
      const packLabel =
        payment.packageKey === 'one_look' ? t.tryonTariffOneTitle : t.tryonTariffThreeTitle;
      const lookLabels = atelierLooks.map((look) => look.label).join(', ');
      const personalRefs = photos.map(toAbsoluteUrl);
      const atelierRefs = atelierLooks.map((look) => toAbsoluteUrl(look.src));
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion: 'special_occasion',
          date: '',
          timeline: 'Flexible',
          budget: `${payment.amount} ${payment.currency}`,
          silhouette: lookLabels,
          style: 'Virtual Try-On',
          colors: [],
          measurements: {},
          references: [...personalRefs, ...atelierRefs].slice(0, 8),
          priorities: [
            'Virtual Try-On order',
            `Package: ${packLabel}`,
            `PayPal: ${payment.orderId}`,
            `Amount: ${payment.amount} ${payment.currency}`,
            `Personal photos: ${photos.length}`,
            `Atelier looks: ${lookLabels || '—'}`,
            'SA service agreement accepted',
            'Paid via PayPal',
          ],
          referenceNotes: [
            note.trim(),
            lookLabels ? `Atelier looks: ${lookLabels}` : '',
          ]
            .filter(Boolean)
            .join('\n'),
          contact: {
            fullName: fullName.trim(),
            whatsappPhone: whatsappPhone.trim(),
            telegramHandle: '',
            consultationType: 'virtual',
            atelierLocation: 'Online',
            preferredLanguage: 'English',
          },
          preferredChannel: 'whatsapp',
          consentAccepted: true,
          consentAcceptedAt: new Date().toISOString(),
          consentVersion: CONSENT_VERSION,
          styleLabel: `Virtual Try-On · ${packLabel}`,
          silhouetteLabel: lookLabels,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.consultation?.id) {
        setDossierId(data.consultation.id);
        setPhase('success');
      } else {
        setError(typeof data?.error === 'string' ? data.error : t.tryonError);
      }
    } catch {
      setError(t.tryonError);
    } finally {
      setSubmitting(false);
    }
  };

  if (phase === 'success' && dossierId) {
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
          {t.tryonSuccessTitle}
        </motion.h2>
        <motion.p
          variants={microFadeUp}
          className="text-[10px] uppercase tracking-[0.22em] text-[#7D7267] mb-1"
        >
          {t.tryonOrderNumberLabel}
        </motion.p>
        <motion.p
          variants={microFadeUp}
          className="font-serif text-2xl sm:text-3xl text-[#1A1816] tracking-wide mb-4"
        >
          {dossierId}
        </motion.p>
        <motion.p variants={microFadeUp} className="text-sm text-[#61574D] font-light mb-8">
          {t.tryonSuccessText(dossierId)}
        </motion.p>
        <motion.button
          variants={microFadeUp}
          type="button"
          onClick={onBackHome}
          className="px-6 py-3 rounded-full border border-[#D9D1C5] text-xs uppercase tracking-[0.16em] text-[#54493F] hover:bg-[#F2EDE5]"
        >
          {t.tryonBackHome}
        </motion.button>
      </motion.div>
    );
  }

  if (phase === 'tariff') {
    return (
      <motion.div
        variants={staggerContainer(0.04, 0.02)}
        initial="initial"
        animate="animate"
        className="w-full max-w-xl mx-auto px-3 sm:px-4 py-4 sm:py-8 flex flex-col"
      >
        <motion.div variants={microFadeUp} className="text-center mb-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#1A1816] tracking-tight mb-2">
            {t.tryonTariffTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#706459] font-light">{t.tryonTariffSubtitle}</p>
        </motion.div>

        <motion.div variants={microFadeUp} className="space-y-3 mb-6">
          {(
            [
              {
                key: 'one_look' as const,
                title: t.tryonTariffOneTitle,
                price: t.tryonTariffOnePrice,
                desc: t.tryonTariffOneDesc,
              },
              {
                key: 'three_looks' as const,
                title: t.tryonTariffThreeTitle,
                price: t.tryonTariffThreePrice,
                desc: t.tryonTariffThreeDesc,
              },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              type="button"
              id={`tryon-tariff-${item.key}`}
              onClick={() => {
                setSelectedPackage(item.key);
                setAcceptSaAgreement(false);
                setPayStarted(false);
                setError('');
                setPhase('payment');
              }}
              className="w-full text-left p-4 sm:p-5 rounded-2xl border border-[#E2DAD0] bg-[#F6F1EA] hover:border-[#1A1816] hover:bg-[#FAF8F5] transition-all cursor-pointer"
            >
              <div className="flex items-baseline justify-between gap-3 mb-1.5">
                <span className="text-sm sm:text-base font-medium uppercase tracking-[0.08em] text-[#1A1816]">
                  {item.title}
                </span>
                <span className="font-serif text-xl sm:text-2xl font-light text-[#1A1816] shrink-0">
                  {item.price}
                </span>
              </div>
              <p className="text-[12px] sm:text-sm text-[#61574D] font-light leading-relaxed">
                {item.desc}
              </p>
            </button>
          ))}
        </motion.div>

        <motion.button
          variants={microFadeUp}
          type="button"
          onClick={() => setPhase('form')}
          className="w-full py-3 rounded-full border border-[#D9D1C5] text-xs uppercase tracking-[0.16em] text-[#54493F] hover:bg-[#F2EDE5]"
        >
          {t.tryonTariffBack}
        </motion.button>
      </motion.div>
    );
  }

  if (phase === 'payment' && selectedPackage) {
    const pack = PACKAGE_META[selectedPackage];
    const packTitle =
      selectedPackage === 'one_look' ? t.tryonTariffOneTitle : t.tryonTariffThreeTitle;

    return (
      <motion.div
        variants={staggerContainer(0.04, 0.02)}
        initial="initial"
        animate="animate"
        className="w-full max-w-xl mx-auto px-3 sm:px-4 py-4 sm:py-8 flex flex-col"
      >
        <motion.div variants={microFadeUp} className="text-center mb-5">
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#1A1816] tracking-tight mb-2">
            {t.tryonPayTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#706459] font-light mb-1">{packTitle}</p>
          <p className="text-sm sm:text-base font-medium text-[#1A1816]">
            {t.tryonPaySubtitle(pack.amount)}
          </p>
        </motion.div>

        <motion.label
          variants={microFadeUp}
          className="flex items-start gap-2.5 cursor-pointer mb-5 p-3.5 rounded-2xl bg-[#F6F1EA] border border-[#E9E2D8] text-left"
        >
          <input
            type="checkbox"
            id="tryon-sa-agreement"
            checked={acceptSaAgreement}
            onChange={(e) => setAcceptSaAgreement(e.target.checked)}
            className="mt-0.5 accent-[#1A1816]"
          />
          <span className="text-xs text-[#1A1816] leading-snug">{t.tryonSaAgreement}</span>
        </motion.label>

        {error && (
          <p className="text-center text-xs text-[#A14A3A] mb-3" role="alert">
            {error}
          </p>
        )}

        <motion.button
          variants={microFadeUp}
          type="button"
          id="tryon-pay-btn"
          disabled={submitting}
          onClick={() => {
            setError('');
            if (!acceptSaAgreement) {
              setError('Confirm the service agreement to continue to payment.');
              return;
            }
            if (!paypalReady) return;
            if (!paypalConfigured || !paypalClientId) {
              setError(t.tryonPayNotConfigured);
              return;
            }
            setPayStarted(true);
            requestAnimationFrame(() => {
              paypalBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
          }}
          className={`w-full py-4 px-5 rounded-full text-xs font-medium tracking-[0.14em] uppercase border transition-all mb-3 ${
            acceptSaAgreement && !submitting
              ? 'bg-[#1A1816] text-[#FAF8F5] border-[#1A1816] hover:bg-[#2C2723] cursor-pointer'
              : 'bg-[#E5DDD2] text-[#9E9488] border-[#E5DDD2] cursor-pointer'
          }`}
        >
          {submitting ? t.tryonPayLoading : t.tryonPayBtn}
        </motion.button>

        {payStarted && acceptSaAgreement && (
          <motion.div
            ref={paypalBoxRef}
            variants={microFadeUp}
            className="mb-4 min-h-[48px]"
            id="tryon-paypal-buttons"
          >
            {!paypalReady || submitting ? (
              <p className="text-center text-xs text-[#7A6E63] py-4">{t.tryonPayLoading}</p>
            ) : !paypalConfigured || !paypalClientId ? (
              <p className="text-center text-xs text-[#A14A3A] py-4">{t.tryonPayNotConfigured}</p>
            ) : (
              <PayPalScriptProvider
                options={{
                  clientId: paypalClientId,
                  currency: 'ZAR',
                  intent: 'capture',
                  components: 'buttons',
                }}
              >
                <PayPalButtons
                  style={{ layout: 'vertical', shape: 'pill', label: 'pay' }}
                  disabled={submitting}
                  forceReRender={[selectedPackage]}
                  createOrder={async () => {
                    setError('');
                    const res = await fetch('/api/paypal/create-order', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ package: selectedPackage }),
                    });
                    const data = await res.json().catch(() => ({}));
                    if (!res.ok || !data?.id) {
                      throw new Error(typeof data?.error === 'string' ? data.error : t.tryonPayError);
                    }
                    return data.id as string;
                  }}
                  onApprove={async (data) => {
                    setError('');
                    setSubmitting(true);
                    try {
                      const res = await fetch('/api/paypal/capture-order', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ orderId: data.orderID }),
                      });
                      const captured = await res.json().catch(() => ({}));
                      if (!res.ok || captured?.status !== 'COMPLETED') {
                        setError(
                          typeof captured?.error === 'string' ? captured.error : t.tryonPayError
                        );
                        setSubmitting(false);
                        return;
                      }
                      await submitAfterPayment({
                        orderId: String(captured.id || data.orderID),
                        packageKey: selectedPackage,
                        amount: String(captured.amount || pack.amount),
                        currency: String(captured.currency || 'ZAR'),
                      });
                    } catch {
                      setError(t.tryonPayError);
                      setSubmitting(false);
                    }
                  }}
                  onError={() => {
                    setError(t.tryonPayError);
                    setSubmitting(false);
                  }}
                  onCancel={() => {
                    setSubmitting(false);
                  }}
                />
              </PayPalScriptProvider>
            )}
          </motion.div>
        )}

        <motion.button
          variants={microFadeUp}
          type="button"
          disabled={submitting}
          onClick={() => {
            setPhase('tariff');
            setPayStarted(false);
            setError('');
          }}
          className="w-full py-2 text-[10px] uppercase tracking-[0.16em] text-[#8A8177] hover:text-[#54493F] disabled:opacity-50"
        >
          {t.tryonPayBack}
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
          {t.tryonBadge}
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl font-light text-[#1A1816] tracking-tight mb-4">
          {t.tryonTitle} <span className="italic font-normal">{t.tryonTitleItalic}</span>
        </h2>
        <div className="space-y-3 text-xs sm:text-sm text-[#706459] font-light leading-relaxed max-w-md mx-auto">
          {t.tryonIntro.map((paragraph, idx) => (
            <p
              key={idx}
              className={idx === 0 ? 'font-medium text-[#1A1816] text-sm sm:text-base' : undefined}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </motion.div>

      <motion.section variants={microFadeUp} className="mb-6">
        <h3 className="text-[11px] uppercase tracking-[0.18em] text-[#61564C] mb-3 font-medium text-center">
          {t.tryonExamplesLabel}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-stretch">
          {[
            { src: tryonOriginal, label: t.tryonOriginalLabel },
            { src: tryonDress, label: t.tryonDressLabel },
            { src: tryonResult, label: t.tryonResultLabel },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl overflow-hidden border border-[#EAE3D9] bg-[#ECE6DD] flex flex-col"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECE6DD]">
                <img
                  src={item.src}
                  alt={item.label}
                  className="absolute inset-0 w-full h-full object-contain object-center"
                />
              </div>
              <div className="px-2 py-2 bg-[#FAF8F5] border-t border-[#EAE3D9] text-center text-[10px] uppercase tracking-[0.14em] text-[#6B5F54]">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 rounded-2xl overflow-hidden border border-[#EAE3D9] bg-[#ECE6DD]">
          <video
            src={tryonVideo}
            controls
            playsInline
            preload="metadata"
            className="w-full h-auto max-h-[420px] object-contain bg-[#1A1816]"
          >
            {t.tryonVideoLabel}
          </video>
          <div className="px-2 py-2 bg-[#FAF8F5] border-t border-[#EAE3D9] text-center text-[10px] uppercase tracking-[0.14em] text-[#6B5F54]">
            {t.tryonVideoLabel}
          </div>
        </div>

        <div className="mt-5 sm:mt-6 space-y-5 text-left">
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.18em] text-[#61564C] mb-3 font-medium text-center">
              {t.tryonPricingTitle}
            </h3>
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#F6F1EA] border border-[#E9E2D8]">
                <div className="text-[12px] sm:text-sm font-medium tracking-[0.08em] uppercase text-[#1A1816] mb-1.5">
                  {t.tryonPackageOneTitle}
                </div>
                <p className="text-[12px] sm:text-sm text-[#61574D] font-light leading-relaxed">
                  {t.tryonPackageOneBody}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F6F1EA] border border-[#E9E2D8]">
                <div className="text-[12px] sm:text-sm font-medium tracking-[0.08em] uppercase text-[#1A1816] mb-1.5">
                  {t.tryonPackageThreeTitle}
                </div>
                <p className="text-[12px] sm:text-sm text-[#61574D] font-light leading-relaxed">
                  {t.tryonPackageThreeBody}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[11px] uppercase tracking-[0.18em] text-[#61564C] mb-3 font-medium text-center">
              {t.tryonHowTitle}
            </h3>
            <ul className="space-y-2 text-[12px] sm:text-sm text-[#61574D] font-light leading-relaxed">
              {t.tryonHowSteps.map((step, idx) => (
                <li key={idx} className="flex gap-2.5">
                  <span className="text-[#968A7F] shrink-0">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2.5 text-[11px] sm:text-xs text-[#7A6E63] font-light leading-relaxed border-t border-[#EAE3D9] pt-4">
            {t.tryonPricingNotes.map((noteText, idx) => (
              <p key={idx}>{noteText}</p>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section variants={microFadeUp} className="mb-5">
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D6]">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="text-[11px] uppercase tracking-[0.18em] text-[#61564C] font-medium">
                {t.tryonUploadTitle} ({photos.length}/{MAX_PHOTOS})
              </h3>
              <p className="text-[11px] text-[#7A6E63] font-light mt-1">{t.tryonUploadHint}</p>
              <p className="text-[10px] text-[#9A8F84] font-light mt-0.5">{t.tryonUploadLimits}</p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = '';
            }}
          />

          {photos.length < MAX_PHOTOS && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full mt-2 py-4 rounded-xl border border-dashed border-[#C9BEB0] bg-[#F6F1EA] hover:border-[#1A1816] transition-colors flex flex-col items-center justify-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-[#8C7D70]" />
              <span className="text-[11px] uppercase tracking-[0.14em] text-[#61564C]">
                Upload photos
              </span>
            </button>
          )}

          {photos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
              {photos.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-[3/4] rounded-xl overflow-hidden border border-[#E2DAD0] bg-[#ECE6DD]"
                >
                  <img src={src} alt="" className="absolute inset-0 w-full h-full object-contain object-center" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#1A1816]/85 text-white flex items-center justify-center"
                    aria-label="Remove"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {uploadError && (
            <p className="text-[11px] text-[#A14A3A] mt-2" role="alert">
              {uploadError}
            </p>
          )}
        </div>
      </motion.section>

      <motion.section variants={microFadeUp} className="mb-5">
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D6]">
          <h3 className="text-[11px] uppercase tracking-[0.18em] text-[#61564C] font-medium">
            {t.tryonAtelierTitle} ({atelierLooks.length}/{MAX_ATELIER_LOOKS})
          </h3>
          <p className="text-[11px] text-[#7A6E63] font-light mt-1">{t.tryonAtelierHint}</p>

          <button
            id="tryon-add-atelier-look-btn"
            type="button"
            onClick={() => {
              atelierCarouselRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }}
            className="w-full mt-3 py-3.5 px-5 rounded-full border border-[#1A1816] bg-transparent text-[#1A1816] hover:bg-[#1A1816] hover:text-[#FAF8F5] transition-all duration-200 flex items-center justify-center gap-2 text-[10px] sm:text-xs font-medium tracking-[0.14em] uppercase cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.tryonAtelierBtn}</span>
          </button>

          {atelierLooks.length > 0 && (
            <div className="mt-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#867B71] mb-2">
                {t.tryonAtelierSelected}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {atelierLooks.map((look) => (
                  <div
                    key={look.id}
                    className="relative aspect-[3/4] rounded-xl overflow-hidden border border-[#1A1816] bg-[#ECE6DD]"
                  >
                    <img
                      src={look.src}
                      alt={look.label}
                      className="absolute inset-0 w-full h-full object-contain object-center"
                    />
                    <button
                      type="button"
                      onClick={() => toggleAtelierLook(look)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#1A1816]/85 text-white flex items-center justify-center"
                      aria-label="Remove"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="absolute inset-x-0 bottom-0 bg-[#1A1816]/70 px-1.5 py-1 text-[9px] text-[#FAF8F5] uppercase tracking-wide truncate">
                      {look.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {atelierError && (
            <p className="text-[11px] text-[#A14A3A] mt-2" role="alert">
              {atelierError}
            </p>
          )}
        </div>

        <div
          ref={atelierCarouselRef}
          className="mt-3 -mx-1 px-1 overflow-x-auto overscroll-x-contain [scrollbar-width:thin]"
        >
          <div className="flex gap-2.5 pb-1 min-w-max">
            {catalogueLooks.map((look) => {
              const selected = atelierLooks.some((item) => item.id === look.id);
              return (
                <button
                  key={look.id}
                  type="button"
                  onClick={() => toggleAtelierLook(look)}
                  className={`w-[120px] sm:w-[140px] shrink-0 rounded-2xl overflow-hidden border text-left transition-all cursor-pointer ${
                    selected
                      ? 'border-[#1A1816] ring-2 ring-[#1A1816]/25'
                      : 'border-[#EAE3D9] hover:border-[#BDB0A2]'
                  }`}
                >
                  <div className="relative aspect-[3/4] bg-[#ECE6DD]">
                    <img
                      src={look.src}
                      alt={look.label}
                      className="absolute inset-0 w-full h-full object-contain object-center"
                    />
                    {selected && (
                      <span className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-[#1A1816] text-[#FAF8F5] flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <div className="px-2 py-1.5 bg-[#FAF8F5] text-[10px] uppercase tracking-[0.08em] text-[#61564C] truncate">
                    {look.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </motion.section>

      <motion.section variants={microFadeUp} className="space-y-3 mb-5">
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D6]">
          <label
            htmlFor="tryon-name"
            className="block text-[11px] uppercase tracking-[0.18em] text-[#61564C] mb-1.5 font-medium"
          >
            {t.tryonNameLabel}
          </label>
          <input
            id="tryon-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={t.tryonNamePlaceholder}
            className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#D9D1C5] text-sm focus:outline-none focus:ring-1 focus:ring-[#1A1816]"
          />
        </div>
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D6]">
          <label
            htmlFor="tryon-wa"
            className="block text-[11px] uppercase tracking-[0.18em] text-[#61564C] mb-1.5 font-medium"
          >
            {t.tryonWaLabel}
          </label>
          <input
            id="tryon-wa"
            type="tel"
            value={whatsappPhone}
            onChange={(e) => setWhatsappPhone(e.target.value)}
            placeholder={t.tryonWaPlaceholder}
            className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#D9D1C5] text-sm focus:outline-none focus:ring-1 focus:ring-[#1A1816]"
          />
        </div>
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D6]">
          <label
            htmlFor="tryon-note"
            className="block text-[11px] uppercase tracking-[0.18em] text-[#61564C] mb-1.5 font-medium"
          >
            {t.tryonNoteLabel}
          </label>
          <textarea
            id="tryon-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t.tryonNotePlaceholder}
            rows={3}
            className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#D9D1C5] text-sm focus:outline-none focus:ring-1 focus:ring-[#1A1816] resize-none"
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

      {error && phase === 'form' && (
        <p className="text-center text-xs text-[#A14A3A] mb-3" role="alert">
          {error}
        </p>
      )}

      <motion.button
        variants={microFadeUp}
        type="button"
        id="tryon-order-btn"
        disabled={!canOrder}
        onClick={() => {
          if (!canOrder) return;
          if (photos.length === 0) {
            setError(t.tryonUploadRequired);
            return;
          }
          if (atelierLooks.length === 0) {
            setError(t.tryonAtelierRequired);
            return;
          }
          setError('');
          setPhase('tariff');
        }}
        className={`w-full py-4 px-5 rounded-full text-xs font-medium tracking-[0.14em] uppercase border transition-all ${
          canOrder
            ? 'bg-[#1A1816] text-[#FAF8F5] border-[#1A1816] hover:bg-[#2C2723] cursor-pointer'
            : 'bg-[#E5DDD2] text-[#9E9488] border-[#E5DDD2] cursor-not-allowed'
        }`}
      >
        {t.tryonSubmitBtn}
      </motion.button>

      <motion.p
        variants={microFadeUp}
        className="mt-3 text-center text-[11px] sm:text-xs text-[#61574D] font-light leading-relaxed px-1"
      >
        {t.tryonWhatsappHelp}{' '}
        <a
          href="https://wa.me/27763643600"
          target="_blank"
          rel="noopener noreferrer"
          id="tryon-whatsapp-help-link"
          className="font-medium text-[#1A1816] underline underline-offset-2 hover:text-[#128C7E] transition-colors whitespace-nowrap"
        >
          {t.headerWhatsappNumber}
        </a>
      </motion.p>
    </motion.div>
  );
};
