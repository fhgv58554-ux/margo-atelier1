import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { getStyles } from '../data/atelierContent';
import { SupportedLanguage, TRANSLATIONS } from '../data/translations';
import { staggerContainer, microFadeUp, microFadeUpSubtle } from '../utils/motion';

interface StepStyleProps {
  selected: string[];
  onSelect: (styles: string[]) => void;
  onNext: () => void;
  lang: SupportedLanguage;
}

export const StepStyle: React.FC<StepStyleProps> = ({
  selected = [],
  onSelect,
  onNext,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const styles = getStyles(lang);
  const undecidedId = 'undecided';
  const isValid = selected.length > 0;

  const toggle = (id: string) => {
    if (id === undecidedId) {
      onSelect(selected.includes(undecidedId) ? [] : [undecidedId]);
      return;
    }
    const withoutUndecided = selected.filter((s) => s !== undecidedId);
    if (withoutUndecided.includes(id)) {
      onSelect(withoutUndecided.filter((s) => s !== id));
    } else {
      onSelect([...withoutUndecided, id]);
    }
  };

  return (
    <motion.div
      variants={staggerContainer(0.05, 0.03)}
      initial="initial"
      animate="animate"
      className="w-full max-w-xl mx-auto px-3 sm:px-4 pt-2 sm:pt-4 pb-36 sm:pb-28 flex flex-col min-w-0"
    >
      {/* Header */}
      <motion.div variants={microFadeUp} className="text-center mb-5 sm:mb-6 px-0.5">
        <span className="text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-[#968A7F] block mb-1">
          {t.step05Badge}
        </span>
        <h2 className="font-serif text-[1.35rem] sm:text-4xl font-light text-[#1A1816] tracking-tight leading-snug break-words">
          {t.step05Title} <span className="italic font-normal">{t.step05TitleItalic}</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#706459] mt-2 font-light leading-relaxed max-w-md mx-auto break-words">
          {t.step05Subtitle}
        </p>
        <p className="text-xs sm:text-sm text-[#706459] mt-2 font-light leading-relaxed max-w-md mx-auto break-words">
          {t.step05ImageHint}
        </p>
      </motion.div>

      {/* Style cards */}
      <div className="space-y-4 mb-4">
        {styles.map((item) => {
          const isSelected = selected.includes(item.id);
          const isUndecided = item.id === undecidedId;

          return (
            <motion.div
              key={item.id}
              id={`style-${item.id}`}
              variants={microFadeUp}
              whileHover={{ y: -2, transition: { duration: 0.22, ease: 'easeOut' } }}
              whileTap={{ scale: 0.99 }}
              onClick={() => toggle(item.id)}
              className={`group flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-colors duration-300 border min-w-0 ${
                isSelected
                  ? 'bg-[#FAF6F0] border-[#1A1816] ring-1 ring-[#1A1816] shadow-lg'
                  : 'bg-[#FAF8F5] border-[#E8E1D6] hover:border-[#BDB0A2] shadow-sm'
              }`}
            >
              {item.image && (
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F3EEE6]">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-contain object-center"
                  />
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-[#1A1816] text-[#FAF8F5] flex items-center justify-center shadow-md">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              )}

              <div className={`p-4 sm:p-5 ${isUndecided ? 'py-5' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] uppercase tracking-[0.18em] text-[#867B71] block font-medium leading-snug break-words">
                      {item.subtitle}
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-light text-[#1A1816] tracking-wide mt-0.5 leading-snug break-words">
                      {item.name}
                    </h3>
                  </div>

                  {(!item.image || isUndecided) && (
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 transition-all ${
                        isSelected
                          ? 'bg-[#1A1816] border-[#1A1816] text-[#FAF8F5]'
                          : 'border-[#D9D1C5] bg-[#FAF8F5]'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  )}
                </div>

                <p className="text-xs text-[#63574D] mt-2 font-light leading-relaxed break-words">
                  {item.description}
                </p>

                {item.moodWords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3 pt-2.5 border-t border-[#EAE3D9]">
                    {item.moodWords.map((word, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full bg-[#EFE9E0] text-[9px] tracking-wider text-[#61564C] uppercase leading-snug break-words"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Sticky CTA */}
      <motion.div
        variants={microFadeUpSubtle}
        className="fixed bottom-0 inset-x-0 z-20 px-3 sm:px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/95 to-transparent"
      >
        <div className="w-full max-w-xl mx-auto">
          <button
            id="style-continue-btn"
            type="button"
            disabled={!isValid}
            onClick={onNext}
            className={`w-full py-3.5 px-4 sm:px-6 rounded-full text-[10px] sm:text-sm font-medium tracking-[0.14em] sm:tracking-[0.2em] uppercase transition-all duration-200 shadow-md break-words leading-snug ${
              isValid
                ? 'bg-[#1A1816] text-[#FAF8F5] hover:bg-[#2C2723] active:scale-[0.99] cursor-pointer'
                : 'bg-[#E5DDD2] text-[#9E9488] cursor-not-allowed'
            }`}
          >
            {isValid ? t.step05Continue : t.step05SelectHint}
          </button>

          <div className="mt-3 mb-1 text-center uppercase text-[#9A9085]">
            <div className="font-serif text-[8px] sm:text-[9px] tracking-[0.12em] text-[#6F655C] leading-snug">
              {t.step05PageFooterBrand}
            </div>
            <div className="text-[7px] sm:text-[8px] tracking-[0.1em] mt-0.5 leading-snug">
              {t.step05PageFooterPlace}
              <span className="mx-1.5">·</span>
              {t.step05PageFooterMode}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
