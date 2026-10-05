import React from 'react';
import { motion } from 'motion/react';
import { Check, Ruler } from 'lucide-react';
import { ClientMeasurements } from '../types';
import { getFitPreferences } from '../data/atelierContent';
import { SupportedLanguage, TRANSLATIONS } from '../data/translations';
import { staggerContainer, microFadeUp, microFadeUpSubtle } from '../utils/motion';

interface StepMeasurementsProps {
  measurements: ClientMeasurements;
  onUpdate: (measurements: ClientMeasurements) => void;
  onNext: () => void;
  lang: SupportedLanguage;
}

const SIZE_OPTIONS = [
  'EU 34 (US 2)',
  'EU 36 (US 4)',
  'EU 38 (US 6)',
  'EU 40 (US 8)',
  'EU 42 (US 10)',
  'EU 44 (US 12)',
];

export const StepMeasurements: React.FC<StepMeasurementsProps> = ({
  measurements,
  onUpdate,
  onNext,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const fitPreferences = getFitPreferences(lang);
  const sizeOptions = SIZE_OPTIONS
  const selectedFits = Array.isArray(measurements.fitPreferences) ? measurements.fitPreferences : [];
  const needHelpId = 'need_help';

  const handleChange = (field: keyof ClientMeasurements, value: string | string[]) => {
    onUpdate({
      ...measurements,
      [field]: value,
    });
  };

  const toggleFit = (id: string) => {
    if (id === needHelpId) {
      handleChange('fitPreferences', selectedFits.includes(needHelpId) ? [] : [needHelpId]);
      return;
    }
    const withoutHelp = selectedFits.filter((f) => f !== needHelpId);
    if (withoutHelp.includes(id)) {
      handleChange(
        'fitPreferences',
        withoutHelp.filter((f) => f !== id)
      );
    } else {
      handleChange('fitPreferences', [...withoutHelp, id]);
    }
  };

  return (
    <motion.div
      variants={staggerContainer(0.05, 0.03)}
      initial="initial"
      animate="animate"
      className="w-full max-w-xl mx-auto px-3 sm:px-4 pt-2 sm:pt-4 pb-36 sm:pb-28 flex flex-col min-w-0"
    >
      <motion.div variants={microFadeUp} className="text-center mb-5 sm:mb-6 px-0.5">
        <span className="text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-[#968A7F] block mb-1">
          {t.step07Badge}
        </span>
        <h2 className="font-serif text-[1.35rem] sm:text-4xl font-light text-[#1A1816] tracking-tight leading-snug break-words">
          {t.step07Title} <span className="italic font-normal">{t.step07TitleItalic}</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#706459] mt-2 font-light leading-relaxed max-w-md mx-auto break-words">
          {t.step07Subtitle}
        </p>
      </motion.div>

      <motion.div variants={microFadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D6]">
          <label
            htmlFor="height-input"
            className="block text-[11px] font-medium uppercase tracking-[0.18em] text-[#61564C] mb-0.5 flex items-center gap-1.5"
          >
            <Ruler className="w-3.5 h-3.5 text-[#8C7D70]" />
            {t.step07HeightLabel}
          </label>
          <span className="block text-[10px] text-[#8A7D71] mb-1.5 font-light">
            {t.step07HeightOptional}
          </span>
          <input
            id="height-input"
            type="text"
            inputMode="numeric"
            placeholder={t.step07HeightPlaceholder}
            value={measurements.height}
            onChange={(e) => handleChange('height', e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#D9D1C5] text-xs sm:text-sm text-[#1A1816] placeholder:text-[#A3988C] focus:outline-none focus:ring-1 focus:ring-[#1A1816]"
          />
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D6]">
          <label
            htmlFor="clothing-size-select"
            className="block text-[11px] font-medium uppercase tracking-[0.18em] text-[#61564C] mb-0.5"
          >
            {t.step07SizeLabel}
          </label>
          <span className="block text-[10px] text-[#8A7D71] mb-1.5 font-light">
            {t.step07SizeOptional}
          </span>
          <select
            id="clothing-size-select"
            value={measurements.clothingSize}
            onChange={(e) => handleChange('clothingSize', e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#F6F1EA] border border-[#D9D1C5] text-xs sm:text-sm text-[#1A1816] focus:outline-none focus:ring-1 focus:ring-[#1A1816]"
          >
            <option value="">{t.step07SizePlaceholder}</option>
            {sizeOptions.map((sz) => (
              <option key={sz} value={sz}>
                {sz}
              </option>
            ))}
            <option value="dont_know">{t.step07SizeDontKnow}</option>
          </select>
        </div>
      </motion.div>

      <motion.p
        variants={microFadeUp}
        className="text-[10px] sm:text-[11px] text-[#8A7D71] font-light leading-relaxed mb-5 text-center max-w-md mx-auto"
      >
        {t.step07SizeHint}
      </motion.p>

      <motion.div variants={microFadeUp} className="mb-5">
        <span className="block text-xs font-medium uppercase tracking-[0.15em] text-[#544B43] mb-1">
          {t.step07FitLabel}
        </span>
        <p className="text-[10px] sm:text-[11px] text-[#8A7D71] font-light mb-2.5">
          {t.step07FitHint}
        </p>
        <div className="space-y-2.5">
          {fitPreferences.map((fit) => {
            const isSelected = selectedFits.includes(fit.id);
            return (
              <motion.div
                key={fit.id}
                id={`fit-${fit.id}`}
                whileHover={{ y: -2, transition: { duration: 0.2, ease: 'easeOut' } }}
                whileTap={{ scale: 0.985 }}
                onClick={() => toggleFit(fit.id)}
                className={`p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-colors duration-300 border flex items-start justify-between gap-3 min-w-0 ${
                  isSelected
                    ? 'bg-[#FAF6F0] border-[#1A1816] ring-1 ring-[#1A1816] shadow-sm'
                    : 'bg-[#FAF8F5] border-[#E8E1D6] hover:border-[#BDB0A2]'
                }`}
              >
                <div className="min-w-0">
                  <div className="font-serif text-base sm:text-lg font-light text-[#1A1816] leading-snug break-words">
                    {fit.title}
                  </div>
                  <div className="text-xs text-[#6B5F54] font-light mt-1 leading-relaxed break-words">
                    {fit.desc}
                  </div>
                </div>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border shrink-0 mt-0.5 transition-all ${
                    isSelected
                      ? 'bg-[#1A1816] border-[#1A1816] text-[#FAF8F5]'
                      : 'border-[#D9D1C5] bg-[#FAF8F5]'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.div variants={microFadeUp} className="mb-6 p-4 rounded-2xl bg-[#F6F1EA] border border-[#E9E2D8]">
        <label
          htmlFor="fit-notes-textarea"
          className="block text-xs font-medium uppercase tracking-[0.15em] text-[#544B43] mb-0.5"
        >
          {t.step07NotesLabel}
        </label>
        <span className="block text-[10px] text-[#8A7D71] mb-2 font-light">
          {t.step07NotesOptional}
        </span>
        <textarea
          id="fit-notes-textarea"
          rows={3}
          placeholder={t.step07NotesPlaceholder}
          value={measurements.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D9D1C5] text-xs sm:text-sm text-[#1A1816] placeholder:text-[#A3988C] focus:outline-none focus:ring-1 focus:ring-[#1A1816] resize-none"
        />
      </motion.div>

      <motion.div
        variants={microFadeUpSubtle}
        className="fixed bottom-0 inset-x-0 z-20 px-3 sm:px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/95 to-transparent"
      >
        <div className="w-full max-w-xl mx-auto">
          <button
            id="measurements-continue-btn"
            type="button"
            onClick={onNext}
            className="w-full py-3.5 px-4 sm:px-6 rounded-full text-[10px] sm:text-sm font-medium tracking-[0.14em] sm:tracking-[0.2em] uppercase transition-all duration-200 shadow-md break-words leading-snug bg-[#1A1816] text-[#FAF8F5] hover:bg-[#2C2723] active:scale-[0.99] cursor-pointer"
          >
            {t.step07Continue}
          </button>

          <div className="mt-3 mb-1 text-center uppercase text-[#9A9085]">
            <div className="font-serif text-[8px] sm:text-[9px] tracking-[0.12em] text-[#6F655C] leading-snug">
              {t.step07PageFooterBrand}
            </div>
            <div className="text-[7px] sm:text-[8px] tracking-[0.1em] mt-0.5 leading-snug">
              {t.step07PageFooterPlace}
              <span className="mx-1.5">·</span>
              {t.step07PageFooterMode}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
