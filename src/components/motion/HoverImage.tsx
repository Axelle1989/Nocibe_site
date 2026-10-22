import React, { useRef, type ReactNode } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'motion/react';
import { useFinePointer } from '../../hooks/useFinePointer';
import { motionTokens } from '../../lib/motion';

export interface HoverImageProps {
  /** URL de l'image */
  src: string;
  /** Texte alternatif pour l'accessibilité */
  alt: string;
  /** Facteur d'agrandissement au survol (défaut: 1.06) */
  zoomScale?: number;
  /** Texte de la pastille flottante qui suit le curseur (ex: "Voir", "Explorer") */
  badgeText?: string;
  /** Classes CSS pour le conteneur externe */
  className?: string;
  /** Classes CSS appliquées directement à la balise img */
  imageClassName?: string;
  /** Éléments enfants (superposition de texte, tags de catégorie, etc.) */
  children?: ReactNode;
  /** Attribut de chargement d'image */
  loading?: 'lazy' | 'eager';
}

/**
 * Composant <HoverImage> : Image interactive qui zoome subtilement (1.06)
 * et se décale dans la direction du curseur lors du survol.
 * Dispose d'une option de pastille fluide « Voir » qui suit le pointeur de la souris.
 * - Désactivé sur tactile (useFinePointer) et en mouvement réduit.
 */
export const HoverImage: React.FC<HoverImageProps> = ({
  src,
  alt,
  zoomScale = 1.06,
  badgeText,
  className = '',
  imageClassName = '',
  children,
  loading = 'lazy',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasFinePointer = useFinePointer();
  const shouldReduceMotion = useReducedMotion();

  // Déplacement relatif de l'image (±8 px)
  const imgX = useMotionValue(0);
  const imgY = useMotionValue(0);
  const imgScale = useMotionValue(1);

  // Position du badge flottant
  const badgeX = useMotionValue(0);
  const badgeY = useMotionValue(0);
  const badgeOpacity = useMotionValue(0);

  const smoothImgX = useSpring(imgX, motionTokens.spring.gentle);
  const smoothImgY = useSpring(imgY, motionTokens.spring.gentle);
  const smoothImgScale = useSpring(imgScale, motionTokens.spring.gentle);

  const smoothBadgeX = useSpring(badgeX, { stiffness: 350, damping: 25 });
  const smoothBadgeY = useSpring(badgeY, { stiffness: 350, damping: 25 });
  const smoothBadgeOpacity = useSpring(badgeOpacity, { stiffness: 300, damping: 25 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!hasFinePointer || shouldReduceMotion || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const relX = mouseX / rect.width - 0.5;
    const relY = mouseY / rect.height - 0.5;

    // Décalage léger dans le sens opposé pour un effet de lentille
    imgX.set(relX * -12);
    imgY.set(relY * -12);
    imgScale.set(zoomScale);

    if (badgeText) {
      badgeX.set(mouseX);
      badgeY.set(mouseY);
      badgeOpacity.set(1);
    }
  };

  const handleMouseEnter = () => {
    if (!hasFinePointer || shouldReduceMotion) return;
    imgScale.set(zoomScale);
    if (badgeText) badgeOpacity.set(1);
  };

  const handleMouseLeave = () => {
    imgX.set(0);
    imgY.set(0);
    imgScale.set(1);
    badgeOpacity.set(0);
  };

  if (!hasFinePointer || shouldReduceMotion) {
    return (
      <div className={`relative overflow-hidden group ${className}`}>
        <img
          src={src}
          alt={alt}
          loading={loading}
          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${imageClassName}`}
        />
        {children}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
    >
      <motion.div
        style={{
          x: smoothImgX,
          y: smoothImgY,
          scale: smoothImgScale,
        }}
        className="h-full w-full will-change-transform"
      >
        <img
          src={src}
          alt={alt}
          loading={loading}
          className={`h-full w-full object-cover ${imageClassName}`}
        />
      </motion.div>

      {/* Pastille flottante "Voir" */}
      {badgeText && (
        <motion.div
          style={{
            x: smoothBadgeX,
            y: smoothBadgeY,
            opacity: smoothBadgeOpacity,
            translateX: '-50%',
            translateY: '-50%',
          }}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 z-30 flex items-center justify-center rounded-full bg-[#0131FD] px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-blue-900/30 ring-2 ring-white/50 backdrop-blur-sm"
        >
          {badgeText}
        </motion.div>
      )}

      {children}
    </div>
  );
};

export default HoverImage;

