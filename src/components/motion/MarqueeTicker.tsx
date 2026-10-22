import React, { type ReactNode, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export interface MarqueeTickerProps {
  /** Éléments à faire défiler dans le bandeau */
  items: ReactNode[];
  /** Durée en secondes pour un défilement complet (défaut: 28s) */
  duration?: number;
  /** Direction du défilement */
  direction?: 'left' | 'right';
  /** Mettre en pause lors du survol de la souris */
  pauseOnHover?: boolean;
  /** Espacement entre chaque élément (classe Tailwind ou valeur CSS) */
  gapClassName?: string;
  className?: string;
}

/**
 * Composant <MarqueeTicker> : Bandeau de défilement horizontal continu et fluide.
 * Utilisé pour la barre supérieure d'informations et les bandes de partenaires/certifications.
 * - Boucle infinie fluide sans saut visuel.
 * - Pause automatique au survol du curseur.
 * - Respecte prefers-reduced-motion (stoppe le défilement et affiche les éléments de façon posée).
 */
export const MarqueeTicker: React.FC<MarqueeTickerProps> = ({
  items,
  duration = 28,
  direction = 'left',
  pauseOnHover = true,
  gapClassName = 'gap-8',
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);

  if (shouldReduceMotion) {
    return (
      <div className={`flex flex-wrap items-center justify-center ${gapClassName} ${className}`}>
        {items.map((item, index) => (
          <div key={`static-${index}`} className="flex-shrink-0">
            {item}
          </div>
        ))}
      </div>
    );
  }

  const initialX = direction === 'left' ? '0%' : '-50%';
  const animateX = direction === 'left' ? '-50%' : '0%';

  return (
    <div
      className={`relative overflow-hidden whitespace-nowrap ${className}`}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <motion.div
        className={`inline-flex items-center ${gapClassName}`}
        animate={{
          x: isPaused ? undefined : [initialX, animateX],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration,
            ease: 'linear',
          },
        }}
      >
        {/* Premier jeu d'éléments */}
        {items.map((item, index) => (
          <div key={`item-a-${index}`} className="inline-flex flex-shrink-0 items-center">
            {item}
          </div>
        ))}
        {/* Duplication pour transition continue et sans raccord */}
        {items.map((item, index) => (
          <div key={`item-b-${index}`} className="inline-flex flex-shrink-0 items-center">
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default MarqueeTicker;

