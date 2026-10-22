import React, { useRef, type ReactNode, type ElementType } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useSpring,
} from 'motion/react';

export interface ParallaxProps {
  children: ReactNode;
  /**
   * Vitesse de défilement relative (entre -0.3 et 0.3).
   * Valeur positive = défilement plus rapide que la page.
   * Valeur négative = décalage inverse (flottement aérien).
   */
  speed?: number;
  /** Amplitude maximale de déplacement en pixels (défaut: 120px) */
  range?: number;
  className?: string;
  as?: ElementType;
}

/**
 * Composant <Parallax> : Anime un élément décoratif ou visuel en translation verticale
 * proportionnelle à la vitesse de défilement (de -0,3 à 0,3).
 * Respecte prefers-reduced-motion (translation neutralisée à 0).
 */
export const Parallax: React.FC<ParallaxProps> = ({
  children,
  speed = 0.15,
  range = 120,
  className = '',
  as: Component = 'div',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Clamp speed between -0.3 and 0.3
  const clampedSpeed = Math.max(-0.3, Math.min(0.3, speed));
  const offset = clampedSpeed * range;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [-offset, offset]);
  const smoothY = useSpring(rawY, { stiffness: 120, damping: 20, mass: 0.5 });

  const MotionComponent = motion.create(Component);

  if (shouldReduceMotion) {
    return (
      <MotionComponent ref={ref} className={className}>
        {children}
      </MotionComponent>
    );
  }

  return (
    <MotionComponent
      ref={ref}
      style={{ y: smoothY }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </MotionComponent>
  );
};

export default Parallax;

