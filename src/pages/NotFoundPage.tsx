import React from 'react';
import { ArrowLeft, Buildings } from '@phosphor-icons/react';

export const NotFoundPage: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  return (
    <div className="w-full py-20 bg-[#F5F7FA] flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center space-y-6 card-nocibe p-10 bg-white border-slate-200">
        <span className="text-6xl font-black font-playfair text-[#0131FD] block">404</span>
        <h2 className="text-2xl font-bold font-playfair text-[#0B1F3A]">Page Introuvable</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          La page que vous recherchez n'existe pas ou a été déplacée. Veuillez retourner à l'accueil pour poursuivre votre navigation.
        </p>
        <button
          type="button"
          onClick={onGoHome}
          className="btn-primary px-6 py-3 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2"
        >
          <ArrowLeft size={16} weight="bold" />
          <span>Retour à l'accueil</span>
        </button>
      </div>
    </div>
  );
};
