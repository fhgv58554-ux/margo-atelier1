/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  StepKey,
  ConsultationDossier,
  OccasionType,
  ClientMeasurements,
  ClientContact,
} from './types';
import { SupportedLanguage, TRANSLATIONS } from './data/translations';
import { Header } from './components/Header';
import { WelcomeView } from './components/WelcomeView';
import { ExploreIntroView } from './components/ExploreIntroView';
import { BookConsultationView } from './components/BookConsultationView';
import { VirtualTryOnView } from './components/VirtualTryOnView';
import { StepOccasion } from './components/StepOccasion';
import { StepDate } from './components/StepDate';
import { StepBudget } from './components/StepBudget';
import { StepSilhouette } from './components/StepSilhouette';
import { StepStyle } from './components/StepStyle';
import { StepColours } from './components/StepColours';
import { StepMeasurements } from './components/StepMeasurements';
import { StepReferences } from './components/StepReferences';
import { StepPriorities } from './components/StepPriorities';
import { StepContacts } from './components/StepContacts';
import { SummaryView } from './components/SummaryView';
import { AtelierDashboard } from './components/AtelierDashboard';
import { stepTransitionVariants } from './utils/motion';

const STEP_ORDER: StepKey[] = [
  'welcome',
  'explore_intro',
  'occasion',
  'date',
  'budget',
  'silhouette',
  'style',
  'colours',
  'measurements',
  'references',
  'priorities',
  'contacts',
  'summary',
];

const SIDE_FLOWS: StepKey[] = ['book_consultation', 'virtual_tryon'];

const INITIAL_DOSSIER: ConsultationDossier = {
  occasion: '',
  date: '',
  timeline: '',
  settings: [],
  settingOther: '',
  eventCity: '',
  budget: '',
  silhouette: [],
  style: [],
  colors: [],
  customColorNote: '',
  measurements: {
    height: '',
    clothingSize: '',
    fitPreferences: [],
    notes: '',
  },
  references: [],
  referenceNotes: '',
  priorities: ['Noble Fabrics & Tactile Luxury', 'Architectural Cut & Precision Line'],
  contact: {
    fullName: '',
    telegramHandle: '',
    whatsappPhone: '',
    consultationType: 'atelier',
    atelierLocation: 'Южная Африка',
    preferredLanguage: 'Русский',
  },
  consentAccepted: false,
  consentAcceptedAt: '',
  consentVersion: '',
};

export default function App() {
  const [currentStep, setCurrentStep] = useState<StepKey>('welcome');
  const [lang, setLang] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem('margo_atelier_lang');
      if (saved === 'ru' || saved === 'en') return saved;
    } catch {
      // ignore
    }
    return 'ru'; // Default to Russian as requested
  });

  const [dossier, setDossier] = useState<ConsultationDossier>(() => {
    try {
      const saved = localStorage.getItem('margo_atelier_dossier');
      if (!saved) return INITIAL_DOSSIER;
      const parsed = JSON.parse(saved) as Partial<ConsultationDossier>;
      return {
        ...INITIAL_DOSSIER,
        ...parsed,
        settings: Array.isArray(parsed.settings) ? parsed.settings : [],
        settingOther: typeof parsed.settingOther === 'string' ? parsed.settingOther : '',
        eventCity: typeof parsed.eventCity === 'string' ? parsed.eventCity : '',
        measurements: {
          ...INITIAL_DOSSIER.measurements,
          ...(parsed.measurements ?? {}),
          fitPreferences: Array.isArray((parsed.measurements as ClientMeasurements | undefined)?.fitPreferences)
            ? ((parsed.measurements as ClientMeasurements).fitPreferences || []).filter((id) =>
                ['defined_waist', 'soft_contour', 'defined_shape', 'ease_of_movement', 'need_help'].includes(id)
              )
            : [],
        },
        contact: {
          ...INITIAL_DOSSIER.contact,
          ...(parsed.contact ?? {}),
        },
        colors: Array.isArray(parsed.colors)
          ? parsed.colors.filter((c) =>
              [
                'white',
                'ivory',
                'light_champagne',
                'sand',
                'powder_rose',
                'rose_lilac',
                'peach',
                'orange',
                'soft_blue',
                'burgundy',
                'navy',
                'black',
                'undecided',
              ].includes(c)
            )
          : INITIAL_DOSSIER.colors,
        customColorNote:
          typeof parsed.customColorNote === 'string' ? parsed.customColorNote : '',
        references: Array.isArray(parsed.references) ? parsed.references : [],
        priorities: Array.isArray(parsed.priorities) ? parsed.priorities : INITIAL_DOSSIER.priorities,
        silhouette: Array.isArray(parsed.silhouette)
          ? parsed.silhouette
          : typeof parsed.silhouette === 'string' && parsed.silhouette
            ? [parsed.silhouette]
            : [],
        style: Array.isArray(parsed.style)
          ? parsed.style
          : typeof parsed.style === 'string' && parsed.style
            ? [parsed.style]
            : [],
        budget:
          typeof parsed.budget === 'string' &&
          ['MARGO Signature', 'MARGO Bespoke', 'MARGO Couture'].includes(parsed.budget)
            ? parsed.budget
            : '',
      };
    } catch {
      return INITIAL_DOSSIER;
    }
  });

  const [isDashboard, setIsDashboard] = useState<boolean>(false);
  const [isMobileSimulator, setIsMobileSimulator] = useState<boolean>(false);

  // Initialize Telegram WebApp API if in native Telegram client
  useEffect(() => {
    try {
      const tg = (window as any).Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
        tg.setHeaderColor?.('#FAF8F5');
        tg.setBackgroundColor?.('#FAF8F5');
      }
    } catch {
      // Not inside Telegram WebApp
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('margo_atelier_dossier', JSON.stringify(dossier));
    } catch {
      // ignore
    }
  }, [dossier]);

  // Save language preference to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('margo_atelier_lang', lang);
    } catch {
      // ignore
    }
  }, [lang]);

  const t = TRANSLATIONS[lang];
  const isSideFlow = SIDE_FLOWS.includes(currentStep);
  const currentIndex = STEP_ORDER.indexOf(currentStep);
  const totalSteps = 10; // questionnaire steps (occasion to contacts)
  // Progress starts at occasion (= index 2 in STEP_ORDER)
  const currentStepNumber =
    currentIndex >= 2 ? Math.max(1, Math.min(10, currentIndex - 1)) : 0;

  const goToNextStep = () => {
    const nextIdx = currentIndex + 1;
    if (nextIdx < STEP_ORDER.length) {
      setCurrentStep(STEP_ORDER[nextIdx]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousStep = () => {
    if (isSideFlow) {
      setCurrentStep('welcome');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (currentIndex > 0) {
      setCurrentStep(STEP_ORDER[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    setDossier(INITIAL_DOSSIER);
    try {
      localStorage.removeItem('margo_atelier_dossier');
    } catch {
      // ignore
    }
    setCurrentStep('welcome');
  };

  const isWelcomeScreen = currentStep === 'welcome' && !isDashboard;
  const isDateScreen = currentStep === 'date' && !isDashboard;
  const isBudgetScreen = currentStep === 'budget' && !isDashboard;
  const isSilhouetteScreen = currentStep === 'silhouette' && !isDashboard;
  const isStyleScreen = currentStep === 'style' && !isDashboard;
  const isColoursScreen = currentStep === 'colours' && !isDashboard;
  const isMeasurementsScreen = currentStep === 'measurements' && !isDashboard;
  const hideSiteFooter =
    isWelcomeScreen ||
    isDateScreen ||
    isBudgetScreen ||
    isSilhouetteScreen ||
    isStyleScreen ||
    isColoursScreen ||
    isMeasurementsScreen;

  return (
    <div
      className={`bg-[#FAF8F5] text-[#1A1816] flex flex-col selection:bg-[#EAE2D8] ${
        isWelcomeScreen
          ? 'h-dvh max-h-dvh overflow-hidden sm:min-h-screen sm:h-auto sm:max-h-none sm:overflow-visible sm:justify-between'
          : 'min-h-screen justify-between'
      }`}
    >
      {/* Top Header */}
      <Header
        currentStep={currentStep}
        stepIndex={currentStepNumber}
        totalSteps={totalSteps}
        onBack={goToPreviousStep}
        canGoBack={isSideFlow || currentIndex > 0}
        isDashboard={isDashboard}
        onToggleDashboard={() => setIsDashboard(!isDashboard)}
        isMobileSimulator={isMobileSimulator}
        onToggleSimulator={() => setIsMobileSimulator(!isMobileSimulator)}
        lang={lang}
        onSelectLang={setLang}
      />

      {/* Main Content Area */}
      <main
        className={`flex-1 w-full flex flex-col items-center justify-start min-h-0 ${
          isWelcomeScreen
            ? 'pb-0 overflow-y-auto sm:overflow-visible sm:pb-12'
            : isDateScreen ||
                isBudgetScreen ||
                isSilhouetteScreen ||
                isStyleScreen ||
                isColoursScreen ||
                isMeasurementsScreen
              ? 'pt-3 sm:pt-4 pb-0'
              : 'pt-3 sm:pt-4 pb-12'
        }`}
      >
        {/* If Mobile Simulator container is toggled on desktop */}
        <div
          className={`w-full transition-all duration-300 ${
            isMobileSimulator && !isDashboard
              ? 'max-w-[420px] my-4 rounded-[40px] border-[8px] border-[#201D1A] shadow-2xl bg-[#FAF8F5] overflow-hidden min-h-[740px]'
              : isWelcomeScreen
                ? 'max-w-4xl h-full min-h-0 flex flex-col'
                : 'max-w-4xl'
          }`}
        >
          {isMobileSimulator && !isDashboard && (
            /* Telegram App Top Status Bar Simulation */
            <div className="bg-[#201D1A] text-white px-6 py-2 flex items-center justify-between text-[11px] select-none font-medium">
              <span>9:41</span>
              <div className="w-16 h-3.5 bg-black rounded-full mx-auto" />
              <div className="flex items-center gap-1.5">
                <span className="text-[10px]">5G</span>
                <span>100%</span>
              </div>
            </div>
          )}

          {isDashboard ? (
            <AtelierDashboard onBackToApp={() => setIsDashboard(false)} lang={lang} />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={stepTransitionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className={`w-full ${isWelcomeScreen ? 'h-full min-h-0 flex flex-col' : ''}`}
              >
                {currentStep === 'welcome' && (
                  <WelcomeView
                    onStart={(consent) => {
                      setDossier((prev) => ({ ...prev, ...consent }));
                      setCurrentStep('explore_intro');
                    }}
                    onBookConsultation={() => setCurrentStep('book_consultation')}
                    onVirtualTryOn={() => setCurrentStep('virtual_tryon')}
                    lang={lang}
                  />
                )}

                {currentStep === 'explore_intro' && (
                  <ExploreIntroView onNext={goToNextStep} lang={lang} />
                )}

                {currentStep === 'book_consultation' && (
                  <BookConsultationView
                    lang={lang}
                    onBackHome={() => setCurrentStep('welcome')}
                    onVirtualTryOn={() => setCurrentStep('virtual_tryon')}
                  />
                )}

                {currentStep === 'virtual_tryon' && (
                  <VirtualTryOnView
                    lang={lang}
                    onBackHome={() => setCurrentStep('welcome')}
                  />
                )}

                {currentStep === 'occasion' && (
                  <StepOccasion
                    selected={dossier.occasion}
                    onSelect={(occ: OccasionType) =>
                      setDossier({ ...dossier, occasion: occ })
                    }
                    onNext={goToNextStep}
                    lang={lang}
                  />
                )}

                {currentStep === 'date' && (
                  <StepDate
                    date={dossier.date}
                    timeline={dossier.timeline}
                    settings={dossier.settings ?? []}
                    settingOther={dossier.settingOther ?? ''}
                    eventCity={dossier.eventCity ?? ''}
                    onUpdate={({ date, timeline, settings, settingOther, eventCity }) =>
                      setDossier({ ...dossier, date, timeline, settings, settingOther, eventCity })
                    }
                    onNext={goToNextStep}
                    lang={lang}
                  />
                )}

                {currentStep === 'budget' && (
                  <StepBudget
                    selected={dossier.budget}
                    onSelect={(budget) => setDossier({ ...dossier, budget })}
                    onNext={goToNextStep}
                    lang={lang}
                  />
                )}

                {currentStep === 'silhouette' && (
                  <StepSilhouette
                    selected={dossier.silhouette}
                    onSelect={(silhouette) => setDossier({ ...dossier, silhouette })}
                    onNext={goToNextStep}
                    lang={lang}
                  />
                )}

                {currentStep === 'style' && (
                  <StepStyle
                    selected={dossier.style}
                    onSelect={(style) => setDossier({ ...dossier, style })}
                    onNext={goToNextStep}
                    lang={lang}
                  />
                )}

                {currentStep === 'colours' && (
                  <StepColours
                    selectedColors={dossier.colors}
                    customColorNote={dossier.customColorNote}
                    onUpdate={({ colors, customColorNote }) =>
                      setDossier({
                        ...dossier,
                        colors,
                        customColorNote: customColorNote ?? dossier.customColorNote,
                      })
                    }
                    onNext={goToNextStep}
                    lang={lang}
                  />
                )}

                {currentStep === 'measurements' && (
                  <StepMeasurements
                    measurements={dossier.measurements}
                    onUpdate={(measurements: ClientMeasurements) =>
                      setDossier({ ...dossier, measurements })
                    }
                    onNext={goToNextStep}
                    lang={lang}
                  />
                )}

                {currentStep === 'references' && (
                  <StepReferences
                    references={dossier.references}
                    referenceNotes={dossier.referenceNotes}
                    onUpdate={({ references, referenceNotes }) =>
                      setDossier({ ...dossier, references, referenceNotes })
                    }
                    onNext={goToNextStep}
                    lang={lang}
                  />
                )}

                {currentStep === 'priorities' && (
                  <StepPriorities
                    selected={dossier.priorities}
                    onToggle={(p) => {
                      const next = dossier.priorities.includes(p)
                        ? dossier.priorities.filter((item) => item !== p)
                        : dossier.priorities.length < 3
                        ? [...dossier.priorities, p]
                        : dossier.priorities;
                      setDossier({ ...dossier, priorities: next });
                    }}
                    onNext={goToNextStep}
                    lang={lang}
                  />
                )}

                {currentStep === 'contacts' && (
                  <StepContacts
                    contact={dossier.contact}
                    onUpdate={(contact: ClientContact) =>
                      setDossier({ ...dossier, contact })
                    }
                    onSubmitToSummary={goToNextStep}
                    lang={lang}
                  />
                )}

                {currentStep === 'summary' && (
                  <SummaryView
                    dossier={dossier}
                    onEditStep={(step) => setCurrentStep(step)}
                    onReset={handleReset}
                    onVirtualTryOn={() => setCurrentStep('virtual_tryon')}
                    lang={lang}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>

      {/* Luxury Footer Footnote */}
      <footer
        className={`w-full border-t border-[#EAE3D9] py-4 px-4 text-center text-[10px] tracking-[0.25em] text-[#9A9085] uppercase bg-[#FAF8F5]/80 ${
          hideSiteFooter ? 'hidden' : ''
        }`}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <span>{t.footerSlogan}</span>
        </div>
      </footer>
    </div>
  );
}
