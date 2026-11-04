import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { getBudgetTiers } from '../data/atelierContent';
import { SupportedLanguage, TRANSLATIONS } from '../data/translations';
import { staggerContainer, microFadeUp, microFadeUpSubtle } from '../utils/motion';

interface StepBudgetProps {
  selected: string;
  onSelect: (budget: string) => void;
  onNext: () => void;
  lang: SupportedLanguage;
}

export const StepBudget: React.FC<StepBudgetProps> = ({ selected, onSelect, onNext, lang }) => {
  const t = TRANSLATIONS[lang];
  const budgetTiers = getBudgetTiers(lang);

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
          {t.step03Badge}
        </span>
        <h2 className="font-serif text-[1.35rem] sm:text-4xl font-light text-[#1A1816] tracking-tight leading-snug break-words">
          {t.step03Title} <span className="italic font-normal">{t.step03TitleItalic}</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#706459] mt-2 font-light leading-relaxed max-w-md mx-auto break-words">
          {t.step03Subtitle}
        </p>
      </motion.div>

      <motion.p
        variants={microFadeUp}
        className="text-[11px] sm:text-xs text-[#877C72] font-light leading-relaxed text-center mb-2 px-1 break-words"
      >
        {t.step03Disclaimer}
      </motion.p>
      <motion.p
        variants={microFadeUp}
        className="text-[11px] sm:text-xs text-[#877C72] font-light leading-relaxed text-center mb-6 px-1 break-words"
      >
        {t.step03ChooseHint}
      </motion.p>

      {/* Budget Tiers List */}
      <div className="space-y-3.5 mb-4">
        {budgetTiers.map((tier) => {
          const isSelected = selected === tier.range;
          return (
            <motion.div
              key={tier.id}
              id={`budget-${tier.id}`}
              variants={microFadeUp}
              whileHover={{ y: -3, transition: { duration: 0.22, ease: 'easeOut' } }}
              whileTap={{ scale: 0.985 }}
              onClick={() => onSelect(tier.range)}
              className={`p-4 sm:p-5 rounded-2xl cursor-pointer transition-colors duration-300 border min-w-0 ${
                isSelected
                  ? 'bg-[#FAF6F0] border-[#1A1816] ring-1 ring-[#1A1816] shadow-lg'
                  : 'bg-[#FAF8F5] border-[#E8E1D6] hover:border-[#BDB0A2] shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-[#867B71] block font-medium leading-snug break-words">
                    {tier.tier}
                  </span>
                  <div className="mt-1.5 space-y-0.5">
                    {tier.prices.map((price, i) => (
                      <div
                        key={i}
                        className="font-serif text-base sm:text-lg font-light text-[#1A1816] tracking-wide leading-snug break-words"
                      >
                        {price}
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all shrink-0 ${
                    isSelected
                      ? 'bg-[#1A1816] border-[#1A1816] text-[#FAF8F5]'
                      : 'border-[#D9D1C5] bg-[#FAF8F5]'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>

              <p className="text-xs text-[#63574D] leading-relaxed font-light mb-3 break-words">
                {tier.description}
              </p>

              <div className="pt-2.5 border-t border-[#EAE3D9] space-y-1.5">
                <div className="text-[9px] uppercase tracking-[0.16em] text-[#9A9085] mb-1">
                  {t.step03IncludedBadge}
                </div>
                {tier.includes.map((inc, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px] text-[#786D62] leading-snug">
                    <span className="text-[#B8A793] shrink-0 mt-0.5">•</span>
                    <span className="break-words">{inc}</span>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-[#9A9085] font-light leading-relaxed mt-3 break-words">
                {tier.note}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Sticky CTA + page footer */}
      <motion.div
        variants={microFadeUpSubtle}
        className="fixed bottom-0 inset-x-0 z-20 px-3 sm:px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/95 to-transparent"
      >
        <div className="w-full max-w-xl mx-auto">
          <button
            id="budget-continue-btn"
            type="button"
            disabled={!selected}
            onClick={onNext}
            className={`w-full py-3.5 px-4 sm:px-6 rounded-full text-[10px] sm:text-sm font-medium tracking-[0.14em] sm:tracking-[0.2em] uppercase transition-all duration-200 shadow-md break-words leading-snug ${
              selected
                ? 'bg-[#1A1816] text-[#FAF8F5] hover:bg-[#2C2723] active:scale-[0.99] cursor-pointer'
                : 'bg-[#E5DDD2] text-[#9E9488] cursor-not-allowed'
            }`}
          >
            {selected ? t.step03Continue : t.step03SelectHint}
          </button>

          <div className="mt-3 mb-1 text-center uppercase text-[#9A9085]">
            <div className="font-serif text-[8px] sm:text-[9px] tracking-[0.12em] text-[#6F655C] leading-snug">
              {t.step03PageFooterBrand}
            </div>
            <div className="text-[7px] sm:text-[8px] tracking-[0.1em] mt-0.5 leading-snug">
              {t.step03PageFooterPlace}
              <span className="mx-1.5">·</span>
              {t.step03PageFooterMode}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
