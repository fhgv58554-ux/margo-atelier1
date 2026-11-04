import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { OccasionType } from '../types';
import { getOccasions } from '../data/atelierContent';
import { SupportedLanguage, TRANSLATIONS } from '../data/translations';
import { staggerContainer, microFadeUp, microFadeUpSubtle } from '../utils/motion';

interface StepOccasionProps {
  selected: OccasionType | '';
  onSelect: (occasion: OccasionType) => void;
  onNext: () => void;
  lang: SupportedLanguage;
}

export const StepOccasion: React.FC<StepOccasionProps> = ({ selected, onSelect, onNext, lang }) => {
  const t = TRANSLATIONS[lang];
  const occasions = getOccasions(lang);

  return (
    <motion.div
      variants={staggerContainer(0.05, 0.03)}
      initial="initial"
      animate="animate"
      className="w-full max-w-xl mx-auto px-4 py-4 flex flex-col"
    >
      {/* Step Header */}
      <motion.div variants={microFadeUp} className="text-center mb-6">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#968A7F] block mb-1">
          {t.step01Badge}
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl font-light text-[#1A1816] tracking-tight">
          {t.step01Title} <span className="italic font-normal">{t.step01TitleItalic}</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#706459] mt-1 font-light">
          {t.step01Subtitle}
        </p>
        <p className="text-xs sm:text-sm text-[#706459] mt-2 font-light">
          {t.step01ImageHint}
        </p>
      </motion.div>

      {/* Visual Occasion Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
        {occasions.map((item) => {
          const isSelected = selected === item.id;
          return (
            <motion.div
              key={item.id}
              id={`occasion-${item.id}`}
              variants={microFadeUp}
              whileHover={{ y: -3, transition: { duration: 0.22, ease: 'easeOut' } }}
              whileTap={{ scale: 0.985 }}
              onClick={() => {
                onSelect(item.id);
              }}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-colors duration-300 border ${
                isSelected
                  ? 'border-[#1A1816] ring-2 ring-[#1A1816]/30 shadow-xl'
                  : 'border-[#EAE3D9] hover:border-[#BDB0A2] shadow-sm'
              }`}
            >
              {/* Image Container — full original visible, may shrink, never crop */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#ECE6DD]">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-contain object-center"
                />

                {isSelected && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                    className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#1A1816] text-[#FAF8F5] flex items-center justify-center shadow-md"
                  >
                    <Check className="w-4 h-4" />
                  </motion.div>
                )}
              </div>

              {/* Caption under photo — does not cover figure or dress */}
              <div className="px-3 py-3 bg-[#FAF8F5] border-t border-[#EAE3D9]">
                <span className="block text-[9px] uppercase tracking-[0.18em] font-medium text-[#867B71] leading-snug">
                  {item.tag}
                </span>
                <h3 className="font-serif text-base sm:text-lg font-light text-[#1A1816] tracking-wide leading-snug mt-1 break-words">
                  {item.title}
                </h3>
                <p className="text-[11px] text-[#6B5F54] mt-1 leading-relaxed font-light break-words">
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.p
        variants={microFadeUp}
        className="text-[10px] sm:text-[11px] text-[#8A7D71] font-light leading-relaxed mb-6 text-center max-w-md mx-auto px-1"
      >
        {t.step01PhotoNote}
      </motion.p>

      {/* Navigation Footer */}
      <motion.div variants={microFadeUpSubtle} className="sticky bottom-4 z-20 w-full pt-2">
        <button
          id="occasion-continue-btn"
          type="button"
          disabled={!selected}
          onClick={onNext}
          className={`w-full py-3.5 px-4 sm:px-6 rounded-full text-[10px] sm:text-sm font-medium tracking-[0.14em] sm:tracking-[0.2em] uppercase transition-all duration-200 shadow-md break-words leading-snug ${
            selected
              ? 'bg-[#1A1816] text-[#FAF8F5] hover:bg-[#2C2723] active:scale-[0.99] cursor-pointer'
              : 'bg-[#E5DDD2] text-[#9E9488] cursor-not-allowed'
          }`}
        >
          {selected ? t.step01Continue : t.step01SelectHint}
        </button>
      </motion.div>
    </motion.div>
  );
};
