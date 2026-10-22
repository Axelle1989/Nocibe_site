import React from 'react';
import { MapPin, ShieldCheck, Globe, CheckCircle, Truck, Factory, Sparkle } from '@phosphor-icons/react';
import { handleLogoRefresh } from '../ui/Logo';
import { MarqueeTicker } from '../motion/MarqueeTicker';

interface TopBarProps {
  language: 'fr' | 'en';
  onToggleLanguage: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ language, onToggleLanguage }) => {
  const marqueeItems = [
    <span key="item-1" className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition">
      <ShieldCheck size={14} weight="bold" className="text-[#4ADE80]" />
      <span>Ciment certifié EN 197-1</span>
    </span>,
    <span key="item-2" className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition">
      <Factory size={14} weight="bold" className="text-[#00CCFF]" />
      <span>Usine intégrée de Massé (Plateau)</span>
    </span>,
    <span key="item-3" className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition">
      <Truck size={14} weight="bold" className="text-[#F26A1B]" />
      <span>Livraison en sacs et en vrac</span>
    </span>,
    <span key="item-4" className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition">
      <CheckCircle size={14} weight="bold" className="text-[#4ADE80]" />
      <span>Normes ISO 9001 & ISO 14001</span>
    </span>,
    <span key="item-5" className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition">
      <Sparkle size={14} weight="fill" className="text-[#0131FD]" />
      <span>Capacité industrielle : 1,5 M tonnes / an</span>
    </span>,
  ];

  return (
    <div className="relative z-30 bg-[#07142A] text-slate-300 text-xs py-2 px-3 sm:px-6 border-b border-slate-800/80">
      <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
        {/* Left: Brand name + Locations */}
        <div className="flex items-center gap-2 sm:gap-3 text-slate-200 text-[11px] sm:text-xs shrink-0">
          <a
            href="/"
            onClick={handleLogoRefresh}
            className="font-playfair font-black text-white hover:text-[#00CCFF] tracking-wider transition-colors inline-flex items-center gap-0.5"
            title="NOCIBÉ - Accueil"
          >
            <span>NOCI</span>
            <span className="text-[#0131FD]">BÉ</span>
          </a>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <div className="hidden sm:flex items-center gap-1.5 text-slate-300 text-[11px] sm:text-xs">
            <MapPin size={14} weight="fill" className="text-[#0131FD] shrink-0" />
            <span className="font-medium">
              Usine de Massé &bull; Siège Cotonou
            </span>
          </div>
        </div>

        {/* Center: MarqueeTicker for brand proof points */}
        <div className="hidden md:flex flex-1 max-w-xl mx-auto px-4 overflow-hidden">
          <MarqueeTicker
            items={marqueeItems}
            duration={25}
            pauseOnHover={true}
            gapClassName="gap-8"
            className="w-full text-[11px]"
          />
        </div>

        {/* Right: Certification & Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto text-[11px] sm:text-xs shrink-0">
          <div className="hidden sm:inline-flex items-center gap-1.5 bg-[#16A34A]/20 text-[#4ADE80] px-2.5 py-0.5 rounded-full font-semibold border border-[#16A34A]/30">
            <ShieldCheck size={13} weight="bold" />
            <span>EN 197-1</span>
          </div>

          <button
            type="button"
            onClick={onToggleLanguage}
            className="flex items-center gap-1 hover:text-white transition font-bold uppercase text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10"
            title="Changer de langue / Switch language"
          >
            <Globe size={13} weight="bold" />
            <span>{language.toUpperCase()}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
