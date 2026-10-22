/**
 * NOCIBÉ Motion System Tokens & Variants
 * Conçu pour un rendu fluide, sobre et performant (transforms & opacity uniquement).
 * Entièrement compatible avec prefers-reduced-motion.
 */

import type { Transition, Variants } from 'motion/react';

// ==========================================
// TOKENS DE TEMPS ET COURBES D'ACCÉLÉRATION
// ==========================================

export const motionTokens = {
  duration: {
    fast: 0.2,   // Micro-interactions, hover, toggles (200ms)
    normal: 0.5, // Transitions standards, reveals de blocs (500ms)
    slow: 0.8,   // Héros, grandes images, révélations solennelles (800ms)
  },
  ease: {
    // Courbe douce avec décélération naturelle (industrial premium)
    easeOut: [0.16, 1, 0.3, 1] as [number, number, number, number],
    easeInOut: [0.65, 0, 0.35, 1] as [number, number, number, number],
    anticipate: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  },
  spring: {
    gentle: { stiffness: 120, damping: 14, mass: 1 },
    smooth: { stiffness: 150, damping: 20, mass: 0.8 },
    responsive: { stiffness: 300, damping: 25, mass: 0.5 },
    snappy: { stiffness: 350, damping: 28, mass: 0.4 },
    magnetic: { stiffness: 220, damping: 18, mass: 0.4 },
  },
} as const;

// Transitions prêtes à l'emploi
export const transitions = {
  fast: {
    duration: motionTokens.duration.fast,
    ease: motionTokens.ease.easeOut,
  } satisfies Transition,
  normal: {
    duration: motionTokens.duration.normal,
    ease: motionTokens.ease.easeOut,
  } satisfies Transition,
  slow: {
    duration: motionTokens.duration.slow,
    ease: motionTokens.ease.easeOut,
  } satisfies Transition,
  springSmooth: {
    type: 'spring',
    ...motionTokens.spring.smooth,
  } satisfies Transition,
  springMagnetic: {
    type: 'spring',
    ...motionTokens.spring.magnetic,
  } satisfies Transition,
};

// ==========================================
// VARIANTES D'APPARITION (REVEAL)
// ==========================================

export type RevealVariant = 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'zoomIn';

export const revealVariants: Record<RevealVariant, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: transitions.normal,
    },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: transitions.normal,
    },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: transitions.normal,
    },
  },
  slideRight: {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: transitions.normal,
    },
  },
  zoomIn: {
    hidden: { opacity: 0, scale: 0.94 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: transitions.normal,
    },
  },
};

// Variante de repli pour prefers-reduced-motion
export const reducedRevealVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: motionTokens.duration.fast },
  },
};

// ==========================================
// VARIANTES EN CASCADE (STAGGER)
// ==========================================

export const createStaggerContainer = (
  staggerChildren = 0.08,
  delayChildren = 0.05
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.normal,
  },
};

export const reducedStaggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.1 },
  },
};

export const reducedStaggerItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: motionTokens.duration.fast },
  },
};

