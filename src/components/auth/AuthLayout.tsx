import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { Truck, FileText, Tag, ArrowLeft } from '@phosphor-icons/react';
import { Logo } from '../ui/Logo';
import { CountUp } from '../ui/CountUp';
import { KEY_FIGURES } from '../../data/keyFigures';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'md' | 'lg';
  hasError?: boolean;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  children,
  maxWidth = 'md',
  hasError = false,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const primaryFigure = KEY_FIGURES[0]; // 2,1 M Tonnes / an

  const advantages = [
    {
      icon: Truck,
      title: 'Suivi de vos commandes en temps réel',
      desc: 'Traçabilité des enlèvements et plannings de livraison depuis Massé.',
    },
    {
      icon: FileText,
      title: 'Factures et fiches techniques en ligne',
      desc: 'Accès instantané aux certificats de conformité EN 197-1 et bordereaux.',
    },
    {
      icon: Tag,
      title: 'Tarifs usine et devis dédiés',
      desc: 'Conditions préférentielles B2B adaptées aux majors et distributeurs.',
    },
  ];

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden flex flex-col lg:flex-row bg-[#F8FAFC] text-slate-800">
      {/* ========================================================
          PANNEAU GAUCHE (Desktop ≥ 1024px)
          Panneau de marque : dégradé bleu marine → bleu vif
         ======================================================== */}
      <aside className="hidden lg:flex lg:w-[45%] xl:w-[42%] flex-col justify-between p-8 xl:p-12 relative overflow-hidden bg-gradient-to-br from-[#07142A] via-[#0B1F3A] to-[#0131FD] text-white shrink-0 select-none">
        {/* Filigrane géométrique et grille fine */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="auth-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#FFFFFF" strokeWidth="0.75" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#auth-grid)" />
          </svg>
        </div>

        {/* Lignes diagonales rappelant la dynamique du logo */}
        <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-[#0131FD]/20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-[#00CCFF]/10 blur-3xl pointer-events-none" />

        {/* Haut : Logo NOCIBÉ */}
        <div className="relative z-10">
          <Logo variant="on-dark" size="md" />
        </div>

        {/* Centre : Titre, 3 avantages & chiffre-clé */}
        <div className="relative z-10 space-y-6 my-auto py-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#00CCFF] block mb-1">
              Plateforme Industrielle B2B
            </span>
            <h2 className="text-2xl xl:text-3xl font-serif font-black tracking-tight leading-snug">
              Votre espace client <span className="italic text-[#00CCFF]">NOCIBÉ</span>
            </h2>
          </div>

          {/* 3 Avantages avec icônes (animation échelonnée légère) */}
          <div className="space-y-4">
            {advantages.map((adv, idx) => {
              const Icon = adv.icon;
              return (
                <motion.div
                  key={idx}
                  initial={shouldReduceMotion ? false : { opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * (idx + 1), duration: 0.3 }}
                  className="flex items-start gap-3.5 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0 text-[#00CCFF] shadow-xs group-hover:bg-[#0131FD] transition-colors">
                    <Icon size={18} weight="bold" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-white tracking-wide">
                      {adv.title}
                    </h3>
                    <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
                      {adv.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Chiffre-clé animé tiré de keyFigures.ts */}
          <div className="pt-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex items-center justify-between gap-4">
              <div>
                <div className="text-2xl xl:text-3xl font-black font-playfair tracking-tight text-white flex items-baseline gap-1">
                  <CountUp end={primaryFigure.value} decimals={primaryFigure.decimals} suffix={primaryFigure.suffix} />
                  <span className="text-xs font-bold text-slate-200">
                    {primaryFigure.label}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  {primaryFigure.description}
                </p>
              </div>
              <div className="hidden xl:block px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold uppercase tracking-wider shrink-0">
                100% Massé
              </div>
            </div>
          </div>
        </div>

        {/* Bas : Lien retour au site */}
        <div className="relative z-10 pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors focus-visible:outline-hidden focus-visible:underline"
          >
            <ArrowLeft size={14} weight="bold" />
            <span>&larr; Retour au site vitrine</span>
          </Link>
        </div>
      </aside>

      {/* ========================================================
          BANDEAU SUPÉRIEUR MOBILE & TABLETTE (< 1024px)
          Compact (~100-120px) sans gaspillage d'espace
         ======================================================== */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3.5 sm:px-6 bg-gradient-to-r from-[#07142A] via-[#0B1F3A] to-[#0131FD] text-white shrink-0 shadow-md">
        <Logo variant="on-dark" size="sm" />
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} weight="bold" />
          <span className="hidden sm:inline">Retour au site</span>
        </Link>
      </header>

      {/* ========================================================
          COLONNE DROITE : FORMULAIRE
          Fond clair, centré verticalement, marges maîtrisées
         ======================================================== */}
      <main className="w-full lg:w-[55%] xl:w-[58%] flex-1 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 xl:p-10 bg-[#F8FAFC] lg:overflow-y-auto">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={
            hasError && !shouldReduceMotion
              ? { opacity: 1, y: 0, x: [-6, 6, -5, 5, -2, 2, 0] }
              : { opacity: 1, y: 0, x: 0 }
          }
          transition={{
            y: { duration: 0.25 },
            opacity: { duration: 0.25 },
            x: { duration: 0.35, ease: 'easeInOut' },
          }}
          className={`w-full ${
            maxWidth === 'lg' ? 'max-w-[520px]' : 'max-w-[460px]'
          } bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 my-auto`}
        >
          {/* En-tête court du formulaire */}
          <div className="mb-5 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-serif font-black text-[#0B1F3A] tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-1">
                {subtitle}
              </p>
            )}
          </div>

          {/* Corps du formulaire injecté */}
          {children}
        </motion.div>
      </main>
    </div>
  );
};

