import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Phone, MapPin, User } from 'lucide-react';
import { ClientContact } from '../types';
import { getAtelierLocations } from '../data/atelierContent';
import { SupportedLanguage, TRANSLATIONS } from '../data/translations';
import { staggerContainer, microFadeUp, microFadeUpSubtle } from '../utils/motion';

interface StepContactsProps {
  contact: ClientContact;
  onUpdate: (contact: ClientContact) => void;
  onSubmitToSummary: () => void;
  lang: SupportedLanguage;
}

export const StepContacts: React.FC<StepContactsProps> = ({
  contact,
  onUpdate,
  onSubmitToSummary,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const atelierLocations = getAtelierLocations(lang);

  // Try to detect Telegram WebApp user context
  useEffect(() => {
    try {
      const tg = (window as any).Telegram?.WebApp;
      if (tg && tg.initDataUnsafe?.user) {
        const u = tg.initDataUnsafe.user;
        const tgHandle = u.username ? `@${u.username}` : '';
        const tgName = [u.first_name, u.last_name].filter(Boolean).join(' ');

        if (!contact.telegramHandle && tgHandle) {
          onUpdate({
            ...contact,
            telegramHandle: tgHandle,
            fullName: contact.fullName || tgName,
          });
        }
      }
    } catch {
      // Ignore if not in Telegram webview
    }
  }, []);

  const handleLocationSelect = (locName: string) => {
    const matchedLoc = atelierLocations.find((l) => l.name === locName);
    onUpdate({
      ...contact,
      atelierLocation: locName,
      consultationType: matchedLoc?.type === 'virtual' ? 'virtual' : 'atelier',
    });
  };

  useEffect(() => {
    const validLocations = atelierLocations.map((l) => l.name);
    if (!contact.atelierLocation || !validLocations.includes(contact.atelierLocation)) {
      if (atelierLocations.length > 0) {
        handleLocationSelect(atelierLocations[0].name);
      }
    }
  }, [atelierLocations, contact.atelierLocation]);

  const handleChange = (field: keyof ClientContact, value: any) => {
    onUpdate({
      ...contact,
      [field]: value,
    });
  };

  const isValid =
    contact.fullName.trim().length > 1 &&
    (contact.telegramHandle.trim().length > 1 || contact.whatsappPhone.trim().length > 4);

  return (
    <motion.div
      variants={staggerContainer(0.05, 0.03)}
      initial="initial"
      animate="animate"
      className="w-full max-w-xl mx-auto px-4 py-4 flex flex-col"
    >
      {/* Header */}
      <motion.div variants={microFadeUp} className="text-center mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#968A7F] block mb-1">
          {t.step10Badge}
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl font-light text-[#1A1816] tracking-tight">
          {t.step10Title} <span className="italic font-normal">{t.step10TitleItalic}</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#706459] mt-1 font-light">
          {t.step10Subtitle}
        </p>
      </motion.div>

      {/* Form Fields */}
      <motion.div variants={microFadeUp} className="space-y-4 mb-8">
        {/* Full Name */}
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D6]">
          <label htmlFor="contact-fullname" className="block text-[11px] font-medium uppercase tracking-[0.18em] text-[#61564C] mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#8C7D70]" />
            {t.step10NameLabel}
          </label>
          <input
            id="contact-fullname"
            type="text"
            placeholder={t.step10NamePlaceholder}
            value={contact.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#D9D1C5] text-xs sm:text-sm text-[#1A1816] focus:outline-none focus:ring-1 focus:ring-[#1A1816]"
            required
          />
        </div>

        {/* Telegram Username */}
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D6]">
          <label htmlFor="contact-telegram" className="block text-[11px] font-medium uppercase tracking-[0.18em] text-[#61564C] mb-1.5 flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5 text-[#8C7D70]" />
            {t.step10TgLabel}
          </label>
          <input
            id="contact-telegram"
            type="text"
            placeholder="@username"
            value={contact.telegramHandle}
            onChange={(e) => handleChange('telegramHandle', e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#D9D1C5] text-xs sm:text-sm text-[#1A1816] focus:outline-none focus:ring-1 focus:ring-[#1A1816]"
          />
          <span className="text-[10px] text-[#867B71] block mt-1">
            {t.step10TgHint}
          </span>
        </div>

        {/* WhatsApp Phone */}
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D6]">
          <label htmlFor="contact-phone" className="block text-[11px] font-medium uppercase tracking-[0.18em] text-[#61564C] mb-1.5 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#8C7D70]" />
            {t.step10WaLabel}
          </label>
          <input
            id="contact-phone"
            type="tel"
            placeholder="+7 / +39 / +33 / +971..."
            value={contact.whatsappPhone}
            onChange={(e) => handleChange('whatsappPhone', e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#D9D1C5] text-xs sm:text-sm text-[#1A1816] focus:outline-none focus:ring-1 focus:ring-[#1A1816]"
          />
        </div>

        {/* Consultation Location / Format */}
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D6]">
          <label htmlFor="contact-location" className="block text-[11px] font-medium uppercase tracking-[0.18em] text-[#61564C] mb-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#8C7D70]" />
            {t.step10VenueLabel}
          </label>
          {/* Quick Segmented Options: Южная Африка & Онлайн */}
          <div className="grid grid-cols-2 gap-2 mb-2.5">
            {atelierLocations.map((loc) => {
              const isSelected = contact.atelierLocation === loc.name;
              return (
                <button
                  key={loc.id}
                  type="button"
                  id={`location-option-${loc.id}`}
                  onClick={() => handleLocationSelect(loc.name)}
                  className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm text-center transition-all border cursor-pointer font-medium flex items-center justify-center gap-2 ${
                    isSelected
                      ? 'bg-[#1A1816] text-[#FAF8F5] border-[#1A1816] shadow-sm'
                      : 'bg-[#F6F1EA] text-[#61564C] border-[#E2DAD0] hover:border-[#CEC2B4]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#FAF8F5]' : 'bg-[#9E9285]'}`} />
                  {loc.name}
                </button>
              );
            })}
          </div>
          <select
            id="contact-location"
            value={contact.atelierLocation}
            onChange={(e) => handleLocationSelect(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#D9D1C5] text-xs sm:text-sm text-[#1A1816] focus:outline-none focus:ring-1 focus:ring-[#1A1816]"
          >
            {atelierLocations.map((loc) => (
              <option key={loc.id} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

      </motion.div>

      {/* Navigation Footer */}
      <motion.div variants={microFadeUpSubtle} className="sticky bottom-4 z-20 w-full pt-2">
        <button
          id="generate-summary-btn"
          type="button"
          disabled={!isValid}
          onClick={onSubmitToSummary}
          className={`w-full py-4 px-6 rounded-full text-xs sm:text-sm font-medium tracking-[0.2em] uppercase transition-all duration-200 shadow-md ${
            isValid
              ? 'bg-[#1A1816] text-[#FAF8F5] hover:bg-[#2C2723] active:scale-[0.99] cursor-pointer'
              : 'bg-[#E5DDD2] text-[#9E9488] cursor-not-allowed'
          }`}
        >
          {isValid ? t.step10GenerateBtn : (lang === 'ru' ? 'Укажите ваше имя и контакт' : 'Please Provide Name & Contact')}
        </button>
      </motion.div>
    </motion.div>
  );
};

