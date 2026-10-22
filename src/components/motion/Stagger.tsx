import React, { type ReactNode, type ElementType } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import {
  createStaggerContainer,
  staggerItemVariants,
  reducedStaggerContainer,
  reducedStaggerItemVariants,
} from '../../lib/motion';

export interface StaggerProps {
  children: ReactNode;
  /** Écart en secondes entre l'apparition de chaque enfant (défaut: 0.08s = 80ms) */
  staggerDelay?: number;
  /** Délai initial avant le premier enfant */
  delayChildren?: number;
  className?: string;
  as?: ElementType;
  viewportMargin?: string;
}

export interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  variants?: Variants;
}

/**
 * Composant <Stagger> : Fait apparaître les éléments enfants en cascade (l'un après l'autre).
 * Espace les révélations de 60 à 100 ms pour un rythme visuel fluide.
 * Respecte prefers-reduced-motion en supprimant la temporisation échelonnée.
 */
export const Stagger: React.FC<StaggerProps> = ({
  children,
  staggerDelay = 0.08,
  delayChildren = 0.05,
  className = '',
  as: Component = 'div',
  viewportMargin = '-10%',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const MotionComponent = motion.create(Component);

  const containerVariants = shouldReduceMotion
    ? reducedStaggerContainer
    : createStaggerContainer(staggerDelay, delayChildren);

  return (
    <MotionComponent
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: viewportMargin }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
};

/**
 * Composant enfant <StaggerItem> à utiliser dans un conteneur <Stagger>.
 */
export const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  className = '',
  as: Component = 'div',
  variants,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const MotionComponent = motion.create(Component);

  const itemVariants = variants || (shouldReduceMotion ? reducedStaggerItemVariants : staggerItemVariants);

  return (
    <MotionComponent variants={itemVariants} className={className}>
      {children}
    </MotionComponent>
  );
};

export default Stagger;

