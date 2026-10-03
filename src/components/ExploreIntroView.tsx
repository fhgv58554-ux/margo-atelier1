import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { SupportedLanguage, TRANSLATIONS } from '../data/translations';
import { staggerContainer, microFadeUp } from '../utils/motion';

interface ExploreIntroViewProps {
  onNext: () => void;
  lang: SupportedLanguage;
}

export const ExploreIntroView: React.FC<ExploreIntroViewProps> = ({ onNext, lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <motion.div
      variants={staggerContainer(0.05, 0.03)}
      initial="initial"
      animate="animate"
      className="w-full max-w-xl mx-auto px-4 py-8 sm:py-14 flex flex-col items-center text-center"
    >
      <motion.span
        variants={microFadeUp}
        className="text-[10px] tracking-[0.3em] uppercase text-[#968A7F] block mb-2"
      >
        {t.exploreIntroBadge}
      </motion.span>
      <motion.h2
        variants={microFadeUp}
        className="font-serif text-2xl sm:text-4xl font-light text-[#1A1816] tracking-tight mb-6"
      >
        {t.exploreIntroTitle}{' '}
        <span className="italic font-normal">{t.exploreIntroTitleItalic}</span>
      </motion.h2>

      <motion.div
        variants={microFadeUp}
        className="space-y-4 text-sm sm:text-base text-[#61574D] font-light leading-relaxed max-w-md mb-10 text-left sm:text-center"
      >
        {t.exploreIntroBody.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </motion.div>

      <motion.button
        variants={microFadeUp}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
        id="explore-intro-next-btn"
        type="button"
        onClick={onNext}
        className="w-full max-w-md py-3.5 sm:py-4 px-6 rounded-full bg-[#1A1816] text-[#FAF8F5] hover:bg-[#2C2723] transition-all flex items-center justify-center gap-2 text-xs sm:text-sm font-medium tracking-[0.18em] uppercase shadow-lg shadow-black/10 cursor-pointer"
      >
        <span>{t.exploreIntroNext}</span>
        <ArrowRight className="w-4 h-4 text-[#D8CEBF]" />
      </motion.button>
    </motion.div>
  );
};
