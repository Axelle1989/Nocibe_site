import React from 'react';

interface CementBagGraphicProps {
  grade: string;
  className?: string;
  accentColor?: string;
}

export const CementBagGraphic: React.FC<CementBagGraphicProps> = ({
  grade,
  className = 'w-full h-48',
  accentColor = '#0131FD'
}) => {
  return (
    <div className={`relative flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100/80 rounded-xl overflow-hidden ${className}`}>
      {/* Background shadow */}
      <div className="absolute bottom-3 w-32 h-4 bg-slate-300/60 rounded-full blur-md" />

      {/* SVG 3D-styled Kraft Cement Bag */}
      <svg
        viewBox="0 0 160 210"
        className="w-auto h-full max-h-44 drop-shadow-md select-none transition-transform duration-300 group-hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main Bag Body (Kraft paper tone) */}
        <path
          d="M28 32 C30 20, 130 20, 132 32 L138 185 C138 198, 22 198, 22 185 Z"
          fill="#D9B78A"
          stroke="#B58F5B"
          strokeWidth="2"
        />

        {/* Paper texture highlights */}
        <path
          d="M32 35 C50 28, 110 28, 128 35 L132 182 C120 188, 40 188, 28 182 Z"
          fill="#E8CA9E"
        />

        {/* Top stitch / seal */}
        <path d="M22 32 Q80 24 138 32" stroke="#8C6839" strokeWidth="4" strokeDasharray="3 3" />
        <rect x="25" y="29" width="110" height="6" fill="#B58F5B" rx="2" />

        {/* Brand header band (Industrial Navy #0B1F3A) */}
        <path
          d="M26 50 L134 50 L135 98 L25 98 Z"
          fill="#0B1F3A"
        />

        {/* Brand Name on Bag */}
        <text
          x="80"
          y="74"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="16"
          fontWeight="900"
          fontFamily="Playfair Display, serif"
          letterSpacing="1"
        >
          NOCIBÉ
        </text>

        <text
          x="80"
          y="88"
          textAnchor="middle"
          fill="#00CCFF"
          fontSize="6.5"
          fontWeight="700"
          fontFamily="Inter, sans-serif"
          letterSpacing="0.5"
        >
          RÉPUBLIQUE DU BÉNIN
        </text>

        {/* Central Cement Grade Badge */}
        <rect x="38" y="106" width="84" height="42" rx="6" fill="#FFFFFF" stroke="#0B1F3A" strokeWidth="1.5" />
        <rect x="40" y="108" width="80" height="8" rx="2" fill={accentColor} />
        
        <text
          x="80"
          y="114"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="5.5"
          fontWeight="800"
          fontFamily="Inter, sans-serif"
        >
          NORME EN 197-1
        </text>

        <text
          x="80"
          y="136"
          textAnchor="middle"
          fill="#0B1F3A"
          fontSize="17"
          fontWeight="900"
          fontFamily="Inter, sans-serif"
        >
          {grade}
        </text>

        {/* Net Weight Pill (50 kg) */}
        <rect x="52" y="156" width="56" height="18" rx="9" fill="#0B1F3A" />
        <text
          x="80"
          y="169"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="9"
          fontWeight="800"
          fontFamily="Inter, sans-serif"
        >
          POIDS NET 50 KG
        </text>

        {/* Bottom stitch */}
        <path d="M22 188 Q80 196 138 188" stroke="#8C6839" strokeWidth="4" strokeDasharray="3 3" />
      </svg>
    </div>
  );
};
