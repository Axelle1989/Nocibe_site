import React, { useRef, type ReactNode, type HTMLAttributes } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  useReducedMotion,
} from 'motion/react';
import { useFinePointer } from '../../hooks/useFinePointer';

export interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Rayon du halo lumineux en pixels (défaut: 360px) */
  size?: number;
  /** Couleur du halo radial (défaut: bleu NOCIBÉ discret) */
  spotlightColor?: string;
  className?: string;
}

/**
 * Composant <SpotlightCard> : Carte survolable révélant un halo lumineux radial
 * bleu pâle centré sous le curseur de la souris.
 * - Aucune allocation de state pendant le mouvement (useMotionValue + useSpring).
 * - Totalement inerte sur mobile/tactile (useFinePointer) et prefers-reduced-motion.
 */
export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  size = 360,
  spotlightColor = 'rgba(1, 49, 253, 0.08)',
  className = '',
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasFinePointer = useFinePointer();
  const shouldReduceMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const opacity = useMotionValue(0);

  const smoothOpacity = useSpring(opacity, { stiffness: 200, damping: 22 });

  const background = useMotionTemplate`radial-gradient(${size}px circle at ${mouseX}px ${mouseY}px, ${spotlightColor}, transparent 80%)`;

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!hasFinePointer || shouldReduceMotion || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
    opacity.set(1);
  };

  const handleMouseLeave = () => {
    opacity.set(0);
  };

  if (!hasFinePointer || shouldReduceMotion) {
    return (
      <div ref={containerRef} className={`relative overflow-hidden ${className}`} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {/* Halo lumineux en arrière-plan immédiat */}
      <motion.div
        style={{
          background,
          opacity: smoothOpacity,
        }}
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px z-10 rounded-[inherit] transition-opacity duration-300"
      />
      <div className="relative z-20 h-full w-full">{children}</div>
    </div>
  );
};

export default SpotlightCard;

