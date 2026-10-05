import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { getPriorities } from '../data/atelierContent';
import { SupportedLanguage, TRANSLATIONS } from '../data/translations';
import { staggerContainer, microFadeUp, microFadeUpSubtle } from '../utils/motion';

interface StepPrioritiesProps {
  selected: string[];
  onToggle: (priority: string) => void;
  onNext: () => void;
  lang: SupportedLanguage;
}

export const StepPriorities: React.FC<StepPrioritiesProps> = ({ selected, onToggle, onNext, lang }) => {
  const t = TRANSLATIONS[lang];
  const priorities = getPriorities(lang);
  const isValid = selected.length > 0;

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
          {t.step09Badge}
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl font-light text-[#1A1816] tracking-tight">
          {t.step09Title} <span className="italic font-normal">{t.step09TitleItalic}</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#706459] mt-1 font-light">
          {t.step09Subtitle}
        </p>
      </motion.div>

      {/* Priorities List */}
      <div className="space-y-3 mb-8">
        {priorities.map((item) => {
          const isSelected = selected.includes(item.label) || selected.includes(item.id);
          return (
            <motion.div
              key={item.id}
              id={`priority-${item.id}`}
              variants={microFadeUp}
              whileHover={{ y: -2, transition: { duration: 0.2, ease: 'easeOut' } }}
              whileTap={{ scale: 0.985 }}
              onClick={() => onToggle(item.label)}
              className={`p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-colors duration-300 border ${
                isSelected
                  ? 'bg-[#FAF6F0] border-[#1A1816] ring-1 ring-[#1A1816] shadow-sm'
                  : 'bg-[#FAF8F5] border-[#E8E1D6] hover:border-[#BDB0A2]'
              }`}
            >
              <div className="pr-4">
                <div className="font-serif text-base sm:text-lg font-light text-[#1A1816]">
                  {item.label}
                </div>
                <div className="text-xs text-[#6B5F54] font-light mt-0.5 leading-relaxed">
                  {item.description}
                </div>
              </div>

              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center border shrink-0 transition-all ${
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

      {/* Navigation Footer */}
      <motion.div variants={microFadeUpSubtle} className="sticky bottom-4 z-20 w-full pt-2">
        <button
          id="priorities-continue-btn"
          type="button"
          disabled={!isValid}
          onClick={onNext}
          className={`w-full py-3.5 px-6 rounded-full text-xs sm:text-sm font-medium tracking-[0.2em] uppercase transition-all duration-200 shadow-md ${
            isValid
              ? 'bg-[#1A1816] text-[#FAF8F5] hover:bg-[#2C2723] active:scale-[0.99] cursor-pointer'
              : 'bg-[#E5DDD2] text-[#9E9488] cursor-not-allowed'
          }`}
        >
          {isValid ? t.step09Continue(selected.length) : 'Select at Least 1 Priority'}
        </button>
      </motion.div>
    </motion.div>
  );
};

