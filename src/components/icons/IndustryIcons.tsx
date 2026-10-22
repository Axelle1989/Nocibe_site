import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

/**
 * Sac de ciment 50kg étanche avec marquage norme
 */
export const IconCementBag: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <rect x="4" y="5" width="16" height="16" rx="2" fill="currentColor" fillOpacity="0.08" />
    <path d="M7 5V3h10v2" />
    <path d="M4 10h16" />
    <path d="M9 14h6" />
    <path d="M9 17h4" />
    <circle cx="12" cy="7.5" r="0.75" fill="currentColor" />
  </svg>
);

/**
 * Camion toupie / Citerne pulvérulente pour livraison vrac
 */
export const IconTruckCistern: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M3 17V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v9" fill="currentColor" fillOpacity="0.08" />
    <path d="M15 11h4l3 3v3h-7v-6z" fill="currentColor" fillOpacity="0.08" />
    <circle cx="7.5" cy="18.5" r="2.5" />
    <circle cx="17.5" cy="18.5" r="2.5" />
    <path d="M5 11h8" />
    <path d="M7 6l2-2h4l2 2" />
  </svg>
);

/**
 * Silo de stockage vertical clinker / ciment
 */
export const IconSilo: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M6 7a6 6 0 0 1 12 0v10l-6 4-6-4V7z" fill="currentColor" fillOpacity="0.08" />
    <line x1="6" y1="12" x2="18" y2="12" />
    <line x1="6" y1="16" x2="18" y2="16" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

/**
 * Four rotatif industriel incliné (1450°C)
 */
export const IconRotaryKiln: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M3 15l15-6 3 2-15 6-3-2z" fill="currentColor" fillOpacity="0.08" />
    <ellipse cx="4.5" cy="16" rx="1.5" ry="2" transform="rotate(-20 4.5 16)" />
    <ellipse cx="19.5" cy="10" rx="1.5" ry="2" transform="rotate(-20 19.5 10)" />
    <path d="M10 8l-2 5" />
    <path d="M14 6l-2 5" />
    <path d="M7 21v-3" />
    <path d="M17 18v-4" />
    {/* Flamme 1450°C */}
    <path d="M22 8c0-1-1-2-1-2s-.5 1.5-1 1.5c-.5 0-.8-.5-.8-.5S19 8 19 9a1.5 1.5 0 0 0 3 0c0-.3 0-.7 0-.7z" fill="#F26A1B" stroke="#F26A1B" />
  </svg>
);

/**
 * Casque de chantier BTP / Sécurité industrielle
 */
export const IconHardHat: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M3 15h18a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1z" fill="currentColor" fillOpacity="0.12" />
    <path d="M4 15a8 8 0 0 1 16 0" />
    <path d="M10 7v8" />
    <path d="M14 7v8" />
    <path d="M2 17h20" />
  </svg>
);

/**
 * Pont & Ouvrage d'art / Dalot en béton armé
 */
export const IconBridge: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M2 9h20" />
    <path d="M2 13h20" />
    <path d="M4 9v9" />
    <path d="M20 9v9" />
    <path d="M4 18a8 8 0 0 1 16 0" />
    <path d="M12 9v5" />
    <line x1="2" y1="21" x2="22" y2="21" />
  </svg>
);

/**
 * Balance de précision / Éprouvette Laboratoire EN 197-1
 */
export const IconLabScale: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M12 3v18" />
    <path d="M6 7l6-2 6 2" />
    <path d="M6 7v6a3 3 0 0 0 6 0V7" fill="currentColor" fillOpacity="0.08" />
    <path d="M18 7v6a3 3 0 0 0 6 0V7" fill="currentColor" fillOpacity="0.08" />
    <path d="M8 21h8" />
  </svg>
);

/**
 * Carte stylisée de la République du Bénin (Silhouette territoriale)
 */
export const IconBeninMap: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Silhouette géométrique précise du Bénin Nord-Sud */}
    <path
      d="M11 2l4 1 2 4-2 3 1 4-2 3 1 4-3 1-3-1v-3l2-2-1-3 1-3-1-3 1-2z"
      fill="currentColor"
      fillOpacity="0.15"
    />
    <circle cx="12" cy="18" r="1.5" fill="#0131FD" stroke="#0B1F3A" strokeWidth="1" />
    <circle cx="13" cy="20" r="1" fill="#16A34A" stroke="#0B1F3A" strokeWidth="0.5" />
  </svg>
);

