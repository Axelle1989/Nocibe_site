import React from 'react';

interface SectionHeaderProps {
  eyebrow: string;
  titleBeforeItalic: string;
  italicWord: string;
  titleAfterItalic?: string;
  subtitle?: string;
  centered?: boolean;
  theme?: 'light' | 'dark';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  titleBeforeItalic,
  italicWord,
  titleAfterItalic = '',
  subtitle,
  centered = true,
  theme = 'light',
  className = '',
}) => {
  const isDark = theme === 'dark';

  return (
    <div className={`max-w-3xl ${centered ? 'mx-auto text-center' : ''} ${className}`}>
      {/* Eyebrow / Sur-titre (Marine ou Ardoise selon 60/30/10) */}
      <div
        className={`eyebrow mb-3 ${
          isDark ? 'text-slate-300' : 'text-[#0B1F3A]'
        } ${centered ? 'justify-center' : 'justify-start'}`}
      >
        <span className={`w-5 h-[2px] rounded-full inline-block ${isDark ? 'bg-slate-400' : 'bg-[#0B1F3A]'}`}></span>
        <span>{eyebrow}</span>
        {centered && <span className={`w-5 h-[2px] rounded-full inline-block ${isDark ? 'bg-slate-400' : 'bg-[#0B1F3A]'}`}></span>}
      </div>

      {/* Main Title with Playfair Display & ONE Italic Word */}
      <h2
        className={`text-3xl md:text-4xl lg:text-[42px] font-bold font-playfair tracking-tight leading-[1.2] ${
          isDark ? 'text-white' : 'text-[#0B1F3A]'
        }`}
      >
        {titleBeforeItalic}{' '}
        <span className={`italic font-normal font-serif ${isDark ? 'text-[#00CCFF]' : 'text-[#0131FD]'}`}>
          {italicWord}
        </span>
        {titleAfterItalic ? ` ${titleAfterItalic}` : ''}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p
          className={`mt-4 text-base md:text-lg leading-relaxed ${
            isDark ? 'text-slate-300' : 'text-[#475569]'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

