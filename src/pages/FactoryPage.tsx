import React from 'react';
import { MANUFACTURING_PROCESS, DID_YOU_KNOW } from '../data/process';
import { SectionHeader } from '../components/ui/SectionHeader';
import {
  Fire,
  CheckCircle,
  Lightbulb,
  ShieldCheck,
  Thermometer,
  Plant,
  Sparkle
} from '@phosphor-icons/react';
import { IconRotaryKiln, IconSilo, IconCementBag } from '../components/icons/IndustryIcons';

interface FactoryPageProps {
  onOpenQuote: () => void;
}

export const FactoryPage: React.FC<FactoryPageProps> = ({ onOpenQuote }) => {
  return (
    <div className="w-full py-12 sm:py-16 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
        {/* Section Header */}
        <div>
          <SectionHeader
            eyebrow="Complexe Industriel Intégré de Massé (Plateau)"
            titleBeforeItalic="Processus de"
            italicWord="fabrication"
            titleAfterItalic="de haute précision"
            subtitle="Découvrez les 5 étapes d'ingénierie lourde qui transforment notre calcaire béninois en clinker hydraulique pur et en ciment certifié EN 197-1."
          />
        </div>

        {/* Layout: Vertical Timeline (left) + Sticky "Did You Know" card (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* TIMELINE VERTICALE DES 5 ÉTAPES (8 cols) */}
          <div className="lg:col-span-8 space-y-10 relative">
            {/* Vertical timeline spine */}
            <div className="absolute left-6 top-8 bottom-8 w-1 bg-slate-200 hidden sm:block" />

            {MANUFACTURING_PROCESS.map((step) => (
              <div
                key={step.step}
                className="relative flex flex-col sm:flex-row gap-6 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm"
              >
                {/* Step circle indicator */}
                <div className="w-12 h-12 rounded-2xl bg-[#0B1F3A] text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-md ring-4 ring-white z-10">
                  0{step.step}
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-xl font-bold font-playfair text-[#0B1F3A]">
                      {step.title}
                    </h3>
                    {step.temperature && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold bg-slate-100 text-[#0B1F3A] px-3 py-1 rounded-full border border-slate-200">
                        <Thermometer size={14} weight="bold" />
                        <span>{step.temperature}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Step Image */}
                  <div className="relative h-48 sm:h-64 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute bottom-2 left-2 bg-[#0B1F3A]/85 text-white text-[11px] font-semibold px-3 py-1 rounded-lg backdrop-blur-sm">
                      {step.highlight}
                    </div>
                  </div>

                  {/* Detailed specs */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {step.details.map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle size={15} weight="fill" className="text-[#16A34A] shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* STICKY "LE SAVIEZ-VOUS ?" (4 cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <div className="bg-[#0B1F3A] text-white p-7 rounded-2xl shadow-xl border border-slate-800 space-y-5">
              <div className="flex items-center gap-2 text-slate-300">
                <Lightbulb size={24} weight="fill" className="text-amber-400" />
                <span className="eyebrow text-slate-300">{DID_YOU_KNOW.title}</span>
              </div>

              <div className="bg-white/10 rounded-xl p-4 text-center border border-white/10">
                <span className="text-xs uppercase text-slate-300 font-semibold block">
                  Cœur thermique du four
                </span>
                <span className="text-4xl font-extrabold font-playfair text-[#00CCFF] block mt-1">
                  {DID_YOU_KNOW.stat}
                </span>
                <p className="text-xs text-slate-300 mt-2 font-medium">
                  {DID_YOU_KNOW.fact}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {DID_YOU_KNOW.description}
              </p>

              <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-200">
                <strong className="block text-emerald-300 font-semibold mb-1 flex items-center gap-1.5">
                  <Plant size={16} weight="fill" />
                  <span>Cycle Éco-énergétique Fermé</span>
                </strong>
                {DID_YOU_KNOW.ecoFact}
              </div>

              <button
                type="button"
                onClick={onOpenQuote}
                className="w-full btn-primary py-3.5 text-xs font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
              >
                <span>Commander du clinker ou ciment</span>
              </button>
            </div>

            {/* Quality lab mini-card */}
            <div className="card-nocibe p-6 bg-white border-slate-200 text-xs text-slate-600 space-y-3">
              <div className="flex items-center gap-2 text-[#0B1F3A] font-bold text-sm">
                <ShieldCheck size={20} weight="fill" className="text-[#16A34A]" />
                <span>Laboratoire Robotisé 24h/24</span>
              </div>
              <p>
                Un prélèvement horaire automatique contrôle par spectrométrie de fluorescence X (XRF) et diffractométrie chaque tonne produite avant ensachage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

