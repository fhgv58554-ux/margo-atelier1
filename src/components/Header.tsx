import React from 'react';
import { ArrowLeft, Sparkles, LayoutDashboard, Smartphone, MessageCircle } from 'lucide-react';
import { StepKey } from '../types';
import { SupportedLanguage, TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  currentStep: StepKey;
  stepIndex: number;
  totalSteps: number;
  onBack: () => void;
  canGoBack: boolean;
  isDashboard: boolean;
  onToggleDashboard: () => void;
  isMobileSimulator: boolean;
  onToggleSimulator: () => void;
  lang: SupportedLanguage;
  onSelectLang: (lang: SupportedLanguage) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  stepIndex,
  totalSteps,
  onBack,
  canGoBack,
  isDashboard,
  onToggleDashboard,
  isMobileSimulator,
  onToggleSimulator,
  lang,
  onSelectLang,
}) => {
  const t = TRANSLATIONS[lang];
  const showProgress =
    !isDashboard &&
    !['welcome', 'explore_intro', 'book_consultation', 'virtual_tryon', 'summary'].includes(
      currentStep
    );

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EBE5DE] px-2.5 sm:px-4 py-1.5 sm:py-2 transition-all duration-300">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Left: Back button or spacer */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-[28px] sm:min-w-[64px]">
          {canGoBack && !isDashboard ? (
            <button
              id="back-button"
              type="button"
              onClick={onBack}
              aria-label={lang === 'ru' ? 'Предыдущий шаг' : 'Previous step'}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[#1A1816] hover:bg-[#EFE9E1] transition-colors border border-[#E5DFD6]"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          ) : (
            <div className="w-7 h-7 sm:w-8 sm:h-8" aria-hidden="true" />
          )}
        </div>

        {/* Center: Brand Wordmark */}
        <div className="text-center cursor-pointer flex-1 px-0.5 min-w-0" onClick={() => !isDashboard && onBack()}>
          <span className="font-serif text-[10px] sm:text-sm font-light tracking-[0.05em] sm:tracking-[0.07em] text-[#1A1816] uppercase block leading-tight">
            {t.brandName}
          </span>
          <span className="text-[6px] sm:text-[8px] tracking-[0.1em] sm:tracking-[0.14em] text-[#867C74] uppercase block font-sans mt-0.5 leading-tight">
            {t.brandTagline}
          </span>
        </div>

        {/* Right: Language switch, Simulator & Dashboard */}
        <div className="flex items-center gap-1 sm:gap-1.5 min-w-[28px] sm:min-w-[64px] justify-end shrink-0">
          {/* Language Toggle: RU | EN */}
          <div className="flex items-center rounded-full bg-[#EFEAE2] border border-[#DDD5C9] p-0.5 text-[9px] sm:text-[10px] font-medium tracking-wide">
            <button
              id="lang-ru-btn"
              type="button"
              onClick={() => onSelectLang('ru')}
              className={`px-1.5 sm:px-2 py-0.5 rounded-full transition-all ${
                lang === 'ru'
                  ? 'bg-[#1A1816] text-[#FAF8F5] shadow-xs'
                  : 'text-[#6D6359] hover:text-[#1A1816]'
              }`}
            >
              RU
            </button>
            <button
              id="lang-en-btn"
              type="button"
              onClick={() => onSelectLang('en')}
              className={`px-1.5 sm:px-2 py-0.5 rounded-full transition-all ${
                lang === 'en'
                  ? 'bg-[#1A1816] text-[#FAF8F5] shadow-xs'
                  : 'text-[#6D6359] hover:text-[#1A1816]'
              }`}
            >
              EN
            </button>
          </div>

          {/* Mobile frame simulator toggle for desktop testing */}
          <button
            id="toggle-simulator-btn"
            type="button"
            onClick={onToggleSimulator}
            title={isMobileSimulator ? 'Switch to Full Screen view' : 'Preview in Telegram Device View'}
            className="hidden sm:flex items-center justify-center w-7 h-7 rounded-full border border-[#E2DAD0] bg-[#FAF8F5] text-[#6B6157] hover:text-[#1A1816] hover:bg-[#EFE9E1] transition-colors text-xs"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>

          {/* Toggle Atelier Dashboard */}
          <button
            id="toggle-dashboard-btn"
            type="button"
            onClick={onToggleDashboard}
            aria-label={isDashboard ? t.clientAppBtn : t.atelierDeskBtn}
            className={`flex items-center justify-center gap-1 w-7 h-7 sm:w-auto sm:h-auto sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-medium tracking-wide transition-all border ${
              isDashboard
                ? 'bg-[#1A1816] text-[#FAF8F5] border-[#1A1816]'
                : 'bg-[#FAF8F5] text-[#1A1816] border-[#D9D0C5] hover:bg-[#EFE9E1]'
            }`}
          >
            <LayoutDashboard className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">{isDashboard ? t.clientAppBtn : t.atelierDeskBtn}</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-0.5 sm:mt-1 flex justify-end">
        <a
          href="https://wa.me/27763643600"
          target="_blank"
          rel="noopener noreferrer"
          id="header-whatsapp-consult"
          className="inline-flex items-center gap-1 text-[8px] sm:text-[10px] tracking-[0.05em] text-[#1A1816] hover:text-[#128C7E] transition-colors"
        >
          <MessageCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#25D366] shrink-0" />
          <span className="uppercase font-medium">{t.headerWhatsappLabel}</span>
          <span className="font-light tracking-normal normal-case">{t.headerWhatsappNumber}</span>
        </a>
      </div>

      {/* Subtle Progress Line for Client questionnaire */}
      {showProgress && (
        <div className="max-w-4xl mx-auto mt-1 sm:mt-2">
          <div className="w-full bg-[#EBE5DE] h-[2px] rounded-full overflow-hidden">
            <div
              className="bg-[#1A1816] h-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, Math.round((stepIndex / totalSteps) * 100))}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[9px] sm:text-[10px] tracking-widest text-[#8A8177] uppercase mt-0.5 sm:mt-1">
            <span>{t.stepIndicator(stepIndex, totalSteps)}</span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#A59480]" />
              {t.headerSub}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
