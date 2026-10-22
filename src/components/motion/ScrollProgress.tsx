import React from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'motion/react';

export interface ScrollProgressProps {
  /** Couleur personnalisée de la jauge (défaut: bleu emblématique NOCIBÉ #0131FD) */
  color?: string;
  /** Épaisseur de la barre en pixels (défaut: 3px) */
  height?: number;
  /** Classes CSS supplémentaires */
  className?: string;
  /** Index de superposition z-index (défaut: z-[60]) */
  zIndex?: number;
}

/**
 * Composant <ScrollProgress> : Fine barre de progression de lecture
 * fixée au sommet de l'écran, synchronisée avec le défilement de la page.
 * - Teinte bleu vif officiel du logo NOCIBÉ.
 * - Lissage par ressort pour éviter les micro-saccades lors des scrolls rapides.
 * - Masqué automatiquement si prefers-reduced-motion est activé.
 */
export const ScrollProgress: React.FC<ScrollProgressProps> = ({
  color = '#0131FD',
  height = 3,
  className = '',
  zIndex = 60,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Ressort très réactif pour un suivi fluide sans traîne excessive
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 35,
    restDelta: 0.001,
  });

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <motion.div
      style={{
        scaleX,
        backgroundColor: color,
        height: `${height}px`,
        zIndex,
      }}
      aria-hidden="true"
      className={`fixed top-0 left-0 right-0 origin-left pointer-events-none shadow-sm shadow-blue-600/30 will-change-transform ${className}`}
    />
  );
};

export default ScrollProgress;

