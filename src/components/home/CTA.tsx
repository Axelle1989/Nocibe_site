import React from 'react';
import { ArrowRight, PhoneCall } from '@phosphor-icons/react';

interface CTAProps {
  onOpenQuote: () => void;
  onNavigateContact: () => void;
}

export const CTA: React.FC<CTAProps> = ({ onOpenQuote, onNavigateContact }) => {
  return (
    <section className="py-16 sm:py-24 bg-[#F5F7FA] overflow-hidden relative z-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Floating Rounded Card (rayon 28px, ombre douce) isolée du footer par le fond clair */}
        <div className="relative rounded-[28px] bg-gradient-to-br from-[#0B1F3A] via-[#0E2442] to-[#162E52] text-white p-8 sm:p-12 md:p-16 shadow-2xl border border-slate-700/40 overflow-hidden text-center">
          {/* Subtle industrial grid and lighting */}
          <div className="absolute inset-0 bg-grid-marine opacity-25 pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#162E52] blur-3xl opacity-60 pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[#0131FD] blur-3xl opacity-20 pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="eyebrow text-slate-300 justify-center">
              <span className="w-5 h-[2px] bg-slate-400 rounded-full inline-block"></span>
              <span>Disponibilité Continue &bull; Logistique Directe</span>
              <span className="w-5 h-[2px] bg-slate-400 rounded-full inline-block"></span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-playfair tracking-tight leading-[1.15] text-white">
              Prêt pour votre prochain{' '}
              <span className="italic font-normal text-[#00CCFF] font-serif">
                projet
              </span>{' '}
              au Bénin ?
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Particuliers, promoteurs et majors du BTP : profitez de nos prix direct usine, d'un approvisionnement continu garanti et de l'assistance de nos ingénieurs matériaux.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={onOpenQuote}
                className="w-full sm:w-auto btn-primary px-8 py-4 text-xs font-bold uppercase tracking-wider shadow-xl flex items-center justify-center gap-2.5"
              >
                <span>Demander un devis B2B</span>
                <ArrowRight size={16} weight="bold" />
              </button>

              <button
                type="button"
                onClick={onNavigateContact}
                className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/25 bg-white/5 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <PhoneCall size={16} weight="fill" className="text-[#00CCFF]" />
                <span>Contacter la direction commerciale</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
