import React from 'react';

export type DividerVariant = 'concave' | 'convex' | 'wave' | 'diagonal';

export interface CurvedDividerProps {
  /** Type de transition géométrique */
  variant?: DividerVariant;
  /** Couleur de remplissage SVG (code hex, rgb ou classe CSS) */
  color?: string;
  /** Inverser verticalement le tracé */
  invert?: boolean;
  /** Inverser horizontalement */
  flipX?: boolean;
  /** Hauteur en pixels sur desktop (défaut: 64) */
  height?: number;
  /** Classes CSS supplémentaires */
  className?: string;
  /** Position absolue en haut ou en bas d'une section */
  position?: 'top' | 'bottom' | 'relative';
}

/**
 * Composant <CurvedDivider> : Séparateur décoratif de section en SVG fluide
 * (courbes concaves, convexes, vagues ou diagonales industrielles).
 * - La couleur de remplissage épouse parfaitement le fond de la section suivante.
 * - Zéro trait blanc parasite entre sections grâce à geometricPrecision et preserveAspectRatio="none".
 * - Masqué aux technologies d'assistance (aria-hidden).
 */
export const CurvedDivider: React.FC<CurvedDividerProps> = ({
  variant = 'convex',
  color = '#FFFFFF',
  invert = false,
  flipX = false,
  height = 64,
  className = '',
  position = 'relative',
}) => {
  // Tracés SVG normalisés en viewBox 0 0 1440 100
  const paths: Record<DividerVariant, string> = {
    // Courbe bombée vers le haut
    convex: 'M0,100 C480,0 960,0 1440,100 L1440,100 L0,100 Z',
    // Courbe rentrante vers le bas
    concave: 'M0,0 C480,100 960,100 1440,0 L1440,100 L0,100 Z',
    // Vague asymétrique dynamique
    wave: 'M0,32 C360,96 720,0 1080,64 C1260,96 1380,80 1440,64 L1440,100 L0,100 Z',
    // Diagonale industrielle en biseau
    diagonal: 'M0,100 L1440,24 L1440,100 L0,100 Z',
  };

  const selectedPath = paths[variant];

  // Calcul du transform pour inversion
  const transform = [
    invert ? 'scaleY(-1)' : '',
    flipX ? 'scaleX(-1)' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const positionClasses = {
    top: 'absolute top-0 left-0 right-0 -translate-y-[99%] z-10',
    bottom: 'absolute bottom-0 left-0 right-0 translate-y-[99%] z-10',
    relative: 'relative block w-full -mb-[1px]',
  }[position];

  return (
    <div
      className={`pointer-events-none select-none overflow-hidden leading-none ${positionClasses} ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        style={{
          height: `${height}px`,
          transform: transform || undefined,
          transformOrigin: 'center',
        }}
        className="block w-full"
        shapeRendering="geometricPrecision"
      >
        <path d={selectedPath} fill={color} />
      </svg>
    </div>
  );
};

export default CurvedDivider;

