import React, { useRef, type ReactNode, type HTMLAttributes } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'motion/react';
import { useFinePointer } from '../../hooks/useFinePointer';
import { motionTokens } from '../../lib/motion';

export interface MagneticButtonProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Force maximale de déplacement en pixels (6 à 10 px recommandé) */
  strength?: number;
  className?: string;
}

/**
 * Composant <MagneticButton> : Enveloppe un bouton principal pour qu'il soit subtilement
 * attiré vers le curseur de la souris (6 à 10 px d'amplitude).
 * - Utilise useMotionValue et un ressort amorti (aucun setState).
 * - Désactivé sur les appareils tactiles et en mode mouvement réduit.
 */
export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  strength = 8,
  className = '',
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const hasFinePointer = useFinePointer();
  const shouldReduceMotion = useReducedMotion();

  const maxOffset = Math.max(4, Math.min(12, strength));

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const smoothX = useSpring(x, motionTokens.spring.magnetic);
  const smoothY = useSpring(y, motionTokens.spring.magnetic);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!hasFinePointer || shouldReduceMotion || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = (event.clientX - centerX) / (rect.width / 2);
    const distanceY = (event.clientY - centerY) / (rect.height / 2);

    x.set(distanceX * maxOffset);
    y.set(distanceY * maxOffset);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (!hasFinePointer || shouldReduceMotion) {
    return (
      <div ref={ref} className={`inline-block ${className}`} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: smoothX, y: smoothY }}
      className={`inline-block will-change-transform ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default MagneticButton;

