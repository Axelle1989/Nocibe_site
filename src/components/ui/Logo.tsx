import React from 'react';

export const handleLogoRefresh = (e?: React.MouseEvent) => {
  if (e) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) {
      return; // allow opening in new tab
    }
    e.preventDefault();
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const path = window.location.pathname;
  if (path === '/' || path === '') {
    window.location.reload();
  } else {
    window.location.assign('/');
  }
};

interface LogoProps {
  variant?: 'header' | 'footer' | 'standalone' | 'on-dark' | 'on-light' | 'auth';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'header', className = '', onClick }) => {
  const isDark = variant === 'footer' || variant === 'on-dark';
  const isAuth = variant === 'auth';
  const clickHandler = onClick || handleLogoRefresh;

  // 1. Footer variant: Pastille blanche arrondie protégeant l'emblème (≥ 80px desktop, compacte mobile 320px)
  if (variant === 'footer') {
    return (
      <a
        href="/"
        onClick={clickHandler}
        className={`flex items-center gap-3 sm:gap-4 cursor-pointer select-none group max-w-full focus:outline-none focus:ring-2 focus:ring-[#0131FD] rounded-2xl ${className}`}
        title="NOCIBÉ - Retour à l'accueil"
      >
        <div className="w-20 h-20 sm:w-24 sm:h-24 min-w-[76px] min-h-[76px] sm:min-w-[88px] sm:min-h-[88px] rounded-2xl bg-white p-2 flex items-center justify-center shadow-xl border border-slate-200/40 transition-transform group-hover:scale-105 shrink-0">
          <img
            src="/images/logo-nocibe-emblem@2x.png"
            srcSet="/images/logo-nocibe-emblem.png 1x, /images/logo-nocibe-emblem@2x.png 2x"
            alt="Emblème officiel NOCIBÉ"
            className="h-16 sm:h-20 w-auto max-h-[80px] object-contain select-none"
            draggable={false}
          />
        </div>

        <div className="flex flex-col justify-center min-w-0">
          <div className="flex items-center text-white font-playfair font-black text-xl sm:text-3xl lg:text-4xl tracking-wider leading-none">
            <span>NOCI</span>
            <span className="text-[#0131FD]">BÉ</span>
          </div>
          <span className="text-[11px] sm:text-sm font-semibold text-slate-200 tracking-wide leading-none mt-1.5 whitespace-nowrap">
            Nouvelle Cimenterie du Bénin
          </span>
          <span className="text-[10px] sm:text-xs text-slate-400 mt-1 whitespace-nowrap">
            Usine intégrée de Massé · Siège Cotonou
          </span>
        </div>
      </a>
    );
  }

  // 2. Auth / Standalone variant (Emblème ≥ 72px)
  if (isAuth || variant === 'standalone') {
    return (
      <a
        href="/"
        onClick={clickHandler}
        className={`inline-flex items-center gap-3 sm:gap-4 select-none cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#0131FD] rounded-xl ${className}`}
        title="NOCIBÉ - Retour à l'accueil"
      >
        <div className="h-[72px] sm:h-20 w-auto flex items-center justify-center shrink-0 transition-transform group-hover:scale-102">
          <img
            src="/images/logo-nocibe-emblem@2x.png"
            srcSet="/images/logo-nocibe-emblem.png 1x, /images/logo-nocibe-emblem@2x.png 2x"
            alt="Emblème officiel NOCIBÉ"
            className="h-[72px] sm:h-20 w-auto object-contain select-none"
            draggable={false}
          />
        </div>

        <div className="flex flex-col justify-center text-left min-w-0">
          <div className={`font-playfair font-black text-2xl sm:text-3xl lg:text-4xl tracking-wider leading-none ${isDark ? 'text-white' : 'text-[#0B1F3A]'}`}>
            <span>NOCI</span>
            <span className="text-[#0131FD]">BÉ</span>
          </div>
          <span className={`text-xs sm:text-sm font-semibold tracking-normal leading-tight mt-1 whitespace-nowrap ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Nouvelle Cimenterie du Bénin
          </span>
        </div>
      </a>
    );
  }

  // 3. Header / Default variant
  return (
    <a
      href="/"
      onClick={clickHandler}
      className={`flex items-center gap-2 sm:gap-2.5 lg:gap-3 select-none shrink-0 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#0131FD] rounded-xl ${className}`}
      title="NOCIBÉ - Retour à l'accueil"
    >
      <div className="h-12 sm:h-14 lg:h-20 w-auto flex items-center justify-center shrink-0 transition-transform group-hover:scale-102">
        <img
          src="/images/logo-nocibe-emblem@2x.png"
          srcSet="/images/logo-nocibe-emblem.png 1x, /images/logo-nocibe-emblem@2x.png 2x"
          alt="Emblème officiel NOCIBÉ"
          className="h-12 sm:h-14 lg:h-20 w-auto object-contain select-none"
          draggable={false}
        />
      </div>

      <div className="flex flex-col justify-center min-w-0">
        <div className={`font-playfair font-black text-xl sm:text-2xl lg:text-[28px] tracking-wider leading-none ${isDark ? 'text-white' : 'text-[#0B1F3A]'}`}>
          <span>NOCI</span>
          <span className="text-[#0131FD]">BÉ</span>
        </div>

        <span className={`text-[10px] sm:text-xs lg:text-[12px] font-semibold tracking-normal leading-tight mt-1 whitespace-nowrap ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          Nouvelle Cimenterie du Bénin
        </span>
      </div>
    </a>
  );
};

export default Logo;
