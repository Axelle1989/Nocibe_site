import React from 'react';
import { MapPin, ShieldCheck, Globe } from '@phosphor-icons/react';
import { handleLogoRefresh } from '../ui/Logo';

interface TopBarProps {
  language: 'fr' | 'en';
  onToggleLanguage: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ language, onToggleLanguage }) => {
  return (
    <div className="bg-[#0B1F3A] text-slate-300 text-xs py-2 px-4 sm:px-6 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-2">
        {/* Left: Brand name + Locations */}
        <div className="flex items-center gap-2 sm:gap-3 text-slate-200 text-[11px] sm:text-xs">
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
          <div className="flex items-center gap-1.5 text-slate-200 text-[11px] sm:text-xs">
            <MapPin size={15} weight="fill" className="text-[#0131FD] shrink-0" />
            <span className="font-medium">
              Usine de Massé (Plateau) &bull; Siège Cotonou
            </span>
          </div>
        </div>

        {/* Right: Certification & Language Toggle */}
        <div className="flex items-center gap-3 sm:gap-4 ml-auto sm:ml-0 text-[11px] sm:text-xs">
          {/* Certification Badge */}
          <div className="flex items-center gap-1.5 bg-[#16A34A]/20 text-[#4ADE80] px-2.5 py-0.5 rounded-full font-semibold border border-[#16A34A]/30">
            <ShieldCheck size={14} weight="bold" />
            <span>Ciment Certifié EN 197-1</span>
          </div>

          {/* Language switcher */}
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
