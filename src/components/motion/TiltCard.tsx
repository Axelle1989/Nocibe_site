import React, { useRef, type ReactNode, type HTMLAttributes } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from 'motion/react';
import { useFinePointer } from '../../hooks/useFinePointer';
import { motionTokens } from '../../lib/motion';

export interface TiltCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Angle maximal d'inclinaison en degrés (entre 4° et 10°, défaut 7°) */
  maxTilt?: number;
  /** Perspective CSS en pixels (défaut: 1000) */
  perspective?: number;
  /** Afficher le reflet lumineux dynamique suivant le curseur */
  showGlare?: boolean;
  className?: string;
}

/**
 * Composant <TiltCard> : Carte interactive avec inclinaison 3D subtile (6 à 10° max)
 * et reflet de lumière qui suit la position du curseur.
 * - Aucune allocation de state pendant le mouvement de souris (useMotionValue + useSpring).
 * - Retour progressif à plat à la sortie du curseur.
 * - Entièrement désactivé sur tactile (useFinePointer) et prefers-reduced-motion.
 */
export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  maxTilt = 7,
  perspective = 1000,
  showGlare = true,
  className = '',
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const hasFinePointer = useFinePointer();
  const shouldReduceMotion = useReducedMotion();

  // Angle clampé entre 4 et 10 degrés conformément au cahier des charges
  const tiltLimit = Math.max(4, Math.min(10, maxTilt));

  // Motion values pour la position relative (-0.5 à 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Position du reflet en pourcentage (0 à 100)
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacity = useMotionValue(0);

  // Ressorts doux
  const rotateX = useSpring(
    useTransform(y, [-0.5, 0.5], [tiltLimit, -tiltLimit]),
    motionTokens.spring.gentle
  );
  const rotateY = useSpring(
    useTransform(x, [-0.5, 0.5], [-tiltLimit, tiltLimit]),
    motionTokens.spring.gentle
  );
  const smoothGlareOpacity = useSpring(glareOpacity, { stiffness: 200, damping: 20 });

  const glareBackground = useMotionTemplate`radial-gradient(circle 320px at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.18) 0%, transparent 65%)`;

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!hasFinePointer || shouldReduceMotion || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);

    glareX.set((mouseX / rect.width) * 100);
    glareY.set((mouseY / rect.height) * 100);
    glareOpacity.set(1);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    glareOpacity.set(0);
  };

  if (!hasFinePointer || shouldReduceMotion) {
    return (
      <div ref={cardRef} className={`relative ${className}`} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: `${perspective}px` }}
      className="relative will-change-transform"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className={`relative ${className}`}
        {...props}
      >
        {children}

        {/* Reflet lumineux qui suit le curseur */}
        {showGlare && (
          <motion.div
            style={{
              background: glareBackground,
              opacity: smoothGlareOpacity,
            }}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] transition-opacity duration-300"
          />
        )}
      </motion.div>
    </div>
  );
};

export default TiltCard;

