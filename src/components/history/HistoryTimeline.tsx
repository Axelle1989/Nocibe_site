import React, { useState, useEffect, useRef, useTransition } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  CaretLeft,
  CaretRight,
  ClockCountdown,
  Hammer,
  Flame,
  ShieldCheck,
  Buildings,
  Cpu,
  Sparkle,
  CheckCircle,
} from '@phosphor-icons/react';
import { HistoryMilestone, HISTORY_MILESTONES } from '../../data/history';

interface HistoryTimelineProps {
  milestones?: HistoryMilestone[];
  className?: string;
}

const MilestoneIcon: React.FC<{ icon: string; className?: string }> = ({ icon, className = 'w-6 h-6' }) => {
  switch (icon) {
    case 'Hammer':
      return <Hammer className={className} weight="duotone" />;
    case 'Flame':
      return <Flame className={className} weight="duotone" />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} weight="duotone" />;
    case 'Buildings':
      return <Buildings className={className} weight="duotone" />;
    case 'Cpu':
      return <Cpu className={className} weight="duotone" />;
    case 'Sparkle':
    default:
      return <Sparkle className={className} weight="duotone" />;
  }
};

const AnimatedYear: React.FC<{ year: string; reduceMotion: boolean }> = ({ year, reduceMotion }) => {
  const numericYear = parseInt(year, 10);
  const [displayYear, setDisplayYear] = useState<number>(numericYear);
  const prevYearRef = useRef<number>(numericYear);

  useEffect(() => {
    if (reduceMotion || isNaN(numericYear)) {
      setDisplayYear(numericYear);
      prevYearRef.current = numericYear;
      return;
    }

    const start = prevYearRef.current;
    const end = numericYear;
    prevYearRef.current = numericYear;

    if (start === end) {
      setDisplayYear(end);
      return;
    }

    const duration = 400;
    const startTime = performance.now();

    let animationFrameId: number;
    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * ease);
      setDisplayYear(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(frame);
      }
    };

    animationFrameId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animationFrameId);
  }, [numericYear, reduceMotion]);

  return <span>{displayYear}</span>;
};

export const HistoryTimeline: React.FC<HistoryTimelineProps> = ({
  milestones = HISTORY_MILESTONES,
  className = '',
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [, startTransition] = useTransition();
  const shouldReduceMotion = useReducedMotion();

  const tabListRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // URL Hash synchronization (#2018)
  useEffect(() => {
    const handleHash = () => {
      const rawHash = window.location.hash.replace('#', '').trim();
      if (rawHash) {
        const found = milestones.findIndex(
          (m) => m.year === rawHash || m.id === rawHash
        );
        if (found !== -1) {
          setActiveIndex((prev) => {
            if (found !== prev) {
              setDirection(found > prev ? 1 : -1);
            }
            return found;
          });
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [milestones]);

  const selectMilestone = (newIndex: number) => {
    if (newIndex === activeIndex || newIndex < 0 || newIndex >= milestones.length) return;
    setDirection(newIndex > activeIndex ? 1 : -1);
    startTransition(() => {
      setActiveIndex(newIndex);
    });
    const targetYear = milestones[newIndex].year;
    window.history.replaceState(null, '', `#${targetYear}`);
  };

  const handlePrev = () => {
    const newIndex = activeIndex === 0 ? milestones.length - 1 : activeIndex - 1;
    setDirection(-1);
    startTransition(() => {
      setActiveIndex(newIndex);
    });
    window.history.replaceState(null, '', `#${milestones[newIndex].year}`);
  };

  const handleNext = () => {
    const newIndex = activeIndex === milestones.length - 1 ? 0 : activeIndex + 1;
    setDirection(1);
    startTransition(() => {
      setActiveIndex(newIndex);
    });
    window.history.replaceState(null, '', `#${milestones[newIndex].year}`);
  };

  // Auto-center active tab button when activeIndex changes
  useEffect(() => {
    const currentTab = tabRefs.current[activeIndex];
    if (currentTab && tabListRef.current) {
      currentTab.scrollIntoView({
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [activeIndex, shouldReduceMotion]);

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 45) {
      if (diff < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setTouchStartX(null);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'Home') {
      e.preventDefault();
      selectMilestone(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      selectMilestone(milestones.length - 1);
    }
  };

  const current = milestones[activeIndex] || milestones[0];
  const progressPercent = ((activeIndex + 1) / milestones.length) * 100;

  const panelVariants = {
    enter: (dir: number) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? 35 : -35,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 350, damping: 30 },
        opacity: { duration: 0.25 },
      },
    },
    exit: (dir: number) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? -35 : 35,
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 350, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  return (
    <section
      aria-label="Frise chronologique de NOCIBÉ"
      className={`space-y-6 sm:space-y-8 ${className}`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* 1. En-tête de section avec navigation rapide */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0131FD] bg-[#EBF3FF] px-3.5 py-1.5 rounded-full border border-[#0131FD]/20">
          <ClockCountdown size={16} weight="bold" className="shrink-0" />
          <span>Sélectionnez un jalon clé</span>
        </div>

        {/* Boutons circulaires Suivant / Précédent */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Jalon précédent"
            className="w-11 h-11 rounded-full bg-white hover:bg-slate-100 text-[#0B1F3A] hover:text-[#0131FD] border border-slate-200 shadow-xs flex items-center justify-center transition hover:scale-105 active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0131FD]"
          >
            <CaretLeft size={18} weight="bold" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Jalon suivant"
            className="w-11 h-11 rounded-full bg-white hover:bg-slate-100 text-[#0B1F3A] hover:text-[#0131FD] border border-slate-200 shadow-xs flex items-center justify-center transition hover:scale-105 active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0131FD]"
          >
            <CaretRight size={18} weight="bold" />
          </button>
        </div>
      </div>

      {/* 2. Barre d'onglets horizontale */}
      <div
        ref={tabListRef}
        role="tablist"
        aria-label="Jalons chronologiques de NOCIBÉ"
        className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory scroll-smooth"
      >
        {milestones.map((m, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={m.id}
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
              role="tab"
              id={`tab-${m.id}`}
              aria-controls={`panel-${m.id}`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => selectMilestone(idx)}
              className={`relative px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap snap-center shrink-0 min-h-[44px] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0131FD] select-none ${
                isActive
                  ? 'text-white shadow-md'
                  : 'bg-white text-slate-600 hover:text-[#0B1F3A] hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeHistoryTab"
                  className="absolute inset-0 bg-[#0B1F3A] rounded-full z-0"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <span
                className={`relative z-10 px-2.5 py-0.5 rounded-full text-[11px] font-black transition-colors ${
                  isActive
                    ? 'bg-[#0131FD] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {m.year}
              </span>
              <span className="relative z-10 font-bold">{m.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Grand panneau de détail du jalon actif */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-md p-6 sm:p-10 min-h-[380px] flex flex-col justify-center"
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current.id}
            custom={direction}
            variants={panelVariants}
            initial="enter"
            animate="center"
            exit="exit"
            role="tabpanel"
            id={`panel-${current.id}`}
            aria-labelledby={`tab-${current.id}`}
            aria-live="polite"
            className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            {/* Colonne Gauche : Badges, Année géante & Titre */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-[#EBF3FF] text-[#0131FD] border border-[#0131FD]/20">
                  {current.category}
                </span>

                {current.validated && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Jalon validé</span>
                  </span>
                )}
              </div>

              {/* Année en très grand */}
              <div className="text-6xl sm:text-7xl lg:text-8xl font-black font-playfair text-[#0B1F3A] tracking-tight leading-none select-none">
                <AnimatedYear
                  year={current.year}
                  reduceMotion={Boolean(shouldReduceMotion)}
                />
              </div>

              {/* Titre du jalon */}
              <h3 className="text-xl sm:text-2xl font-bold font-playfair text-[#0B1F3A] leading-snug line-clamp-2">
                {current.title}
              </h3>
            </div>

            {/* Colonne Droite : Carte intérieure « DÉTAIL DU JALON » */}
            <div className="lg:col-span-7">
              <div className="bg-[#F8FAFC] rounded-2xl p-6 sm:p-8 border border-slate-200/80 space-y-5 shadow-xs">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Détail du Jalon
                  </span>

                  <motion.div
                    key={`icon-${current.id}`}
                    initial={shouldReduceMotion ? false : { scale: 0.75, rotate: -8 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                    className="w-12 h-12 rounded-xl bg-[#0131FD] text-white flex items-center justify-center shadow-md shadow-[#0131FD]/20 shrink-0"
                  >
                    <MilestoneIcon icon={current.icon} className="w-6 h-6" />
                  </motion.div>
                </div>

                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-sans font-normal">
                  {current.description}
                </p>

                <div className="border-t border-slate-200" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <span className="text-xs font-bold text-slate-500">
                    Étape {activeIndex + 1} sur {milestones.length}
                  </span>

                  <div className="flex items-center gap-2">
                    <div className="h-2 w-36 sm:w-48 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0131FD] rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-extrabold text-[#0131FD]">
                      {Math.round(progressPercent)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 4. Rangée « OU EXPLOREZ L'ENSEMBLE DE LA FRISE EN UN COUP D'ŒIL » */}
      <div className="space-y-3 pt-2">
        <div className="text-center">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-slate-500">
            Ou explorez l'ensemble de la frise en un coup d'œil
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {milestones.map((m, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={`mini-${m.id}`}
                type="button"
                onClick={() => selectMilestone(idx)}
                aria-label={`Accéder au jalon ${m.year} : ${m.title}`}
                className={`p-3.5 sm:p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center min-h-[64px] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0131FD] select-none ${
                  isActive
                    ? 'bg-[#EBF3FF] border-[#0131FD] text-[#0131FD] shadow-xs ring-1 ring-[#0131FD]/30 scale-[1.02]'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span
                  className={`text-[11px] font-semibold block truncate w-full transition-colors ${
                    isActive ? 'text-[#0131FD]' : 'text-slate-500'
                  }`}
                >
                  {m.shortLabel}
                </span>
                <span
                  className={`text-base sm:text-lg font-black font-playfair block mt-0.5 transition-colors ${
                    isActive ? 'text-[#0B1F3A]' : 'text-slate-800'
                  }`}
                >
                  {m.year}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

