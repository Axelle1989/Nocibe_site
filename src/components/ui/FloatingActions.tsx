import React from 'react';
import { SITE_CONFIG } from '../../config/site';
import { PhoneCall, FileText, EnvelopeSimple } from '@phosphor-icons/react';

interface FloatingActionsProps {
  onOpenQuote: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({ onOpenQuote }) => {
  return (
    <>
      {/* Mobile Fixed Bottom Action Bar (<= 768px, buttons >= 48px height) */}
      <nav aria-label="Actions rapides mobiles" className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#07142A]/95 backdrop-blur-md border-t border-slate-700/60 px-3 py-2 flex items-center justify-around gap-2 shadow-[0_-4px_20px_rgba(0,0,0,0.25)]">
        {/* Call Button */}
        <a
          href={`tel:${SITE_CONFIG.phoneMain.replace(/\s+/g, '')}`}
          className="flex-1 min-h-[48px] bg-white/10 hover:bg-white/20 active:bg-white/30 text-white rounded-xl flex items-center justify-center gap-2 text-xs font-semibold px-2 transition"
        >
          <PhoneCall size={20} weight="fill" className="text-[#00CCFF]" />
          <span>Appeler</span>
        </a>

        {/* Contact Email Button */}
        <a
          href={`mailto:${SITE_CONFIG.email}`}
          className="flex-1 min-h-[48px] bg-[#0131FD]/20 hover:bg-[#0131FD]/30 border border-[#0131FD]/50 text-white rounded-xl flex items-center justify-center gap-2 text-xs font-semibold px-2 transition"
        >
          <EnvelopeSimple size={20} weight="bold" className="text-[#00CCFF]" />
          <span>Email</span>
        </a>

        {/* Quote Button */}
        <button
          type="button"
          onClick={onOpenQuote}
          className="flex-1 min-h-[48px] bg-[#0131FD] hover:bg-[#0026C7] text-white rounded-xl flex items-center justify-center gap-2 text-xs font-bold px-2 shadow transition"
        >
          <FileText size={20} weight="bold" />
          <span>Devis B2B</span>
        </button>
      </nav>
    </>
  );
};
