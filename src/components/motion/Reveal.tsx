import React, { type ReactNode, type ElementType } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  revealVariants,
  reducedRevealVariants,
  type RevealVariant,
  transitions,
} from '../../lib/motion';

export interface RevealProps {
  children: ReactNode;
  /** Variante d'animation d'apparition */
  variant?: RevealVariant;
  /** Délai en secondes avant le déclenchement */
  delay?: number;
  /** Durée en secondes */
  duration?: number;
  /** Classe CSS appliquée au conteneur */
  className?: string;
  /** Élément HTML utilisé (div par défaut) */
  as?: ElementType;
  /** Marge de viewport pour déclencher l'animation (ex: "-10%" ou "-50px") */
  viewportMargin?: string;
  /** Seuil de visibilité (0 à 1) */
  threshold?: number;
}

/**
 * Composant <Reveal> : Anime l'apparition d'un bloc quand il entre dans la fenêtre.
 * Se déclenche une seule fois (once: true, marge -10%).
 * Respecte prefers-reduced-motion en remplaçant le mouvement par un simple fondu rapide.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration,
  className = '',
  as: Component = 'div',
  viewportMargin = '-10%',
  threshold = 0.1,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const MotionComponent = motion.create(Component);

  if (shouldReduceMotion) {
    return (
      <MotionComponent
        variants={reducedRevealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: viewportMargin }}
        className={className}
      >
        {children}
      </MotionComponent>
    );
  }

  const selectedVariant = revealVariants[variant];
  const customTransition = {
    ...transitions.normal,
    ...(duration !== undefined ? { duration } : {}),
    delay,
  };

  return (
    <MotionComponent
      variants={selectedVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: viewportMargin, amount: threshold }}
      transition={customTransition}
      className={className}
    >
      {children}
    </MotionComponent>
  );
};

export default Reveal;

