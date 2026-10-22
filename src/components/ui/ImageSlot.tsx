import React from 'react';

interface ImageSlotProps {
  title?: string;
  category?: string;
  className?: string;
}

export const ImageSlot: React.FC<ImageSlotProps> = ({
  title,
  category = 'NOCIBÉ BÉNIN',
  className = '',
}) => {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-[#07142A] via-[#0B1F3A] to-[#162E52] flex flex-col items-center justify-center p-6 text-center select-none ${className}`}
    >
      {/* Filigrane emblème officiel NOCIBÉ */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <img
          src="/images/logo-nocibe-emblem@2x.png"
          alt=""
          className="w-32 h-32 object-contain"
          draggable={false}
        />
      </div>

      {/* Badges et typographie aux couleurs de la marque */}
      <div className="relative z-10 space-y-2">
        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-[#0131FD]/30 text-[#00CCFF] border border-[#00CCFF]/30 backdrop-blur-xs">
          {category}
        </span>

        {title && (
          <h4 className="text-sm sm:text-base font-bold font-playfair text-white max-w-[90%] mx-auto leading-snug line-clamp-2">
            {title}
          </h4>
        )}

        <p className="text-[11px] text-slate-300 font-medium">
          Ouvrage & Réalisation NOCIBÉ
        </p>
      </div>
    </div>
  );
};

export default ImageSlot;

