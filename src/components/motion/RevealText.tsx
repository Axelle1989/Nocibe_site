import React, { useMemo } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { motionTokens } from '../../lib/motion';

export type TextHeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';

export interface RevealTextProps {
  /** Texte à afficher et animer */
  text: string;
  /** Balise sémantique à générer (h1, h2, p...) */
  as?: TextHeadingTag;
  /** Découpage par mot ou par ligne */
  by?: 'words' | 'lines';
  /** Délai avant le démarrage de l'animation en secondes */
  delay?: number;
  /** Décalage entre chaque mot (en secondes, par défaut 0.04s) */
  staggerDelay?: number;
  /** Classes CSS supplémentaires */
  className?: string;
}

/**
 * Composant <RevealText> : Anime l'apparition d'un titre mot par mot ou ligne par ligne
 * depuis un masque invisible (effet de levée élégant).
 * - Accessible : aria-label complet sur le conteneur, éléments découpés masqués (aria-hidden).
 * - Responsive : préserve le wrapping naturel des mots sur mobile sans césure brute.
 * - Respecte prefers-reduced-motion.
 */
export const RevealText: React.FC<RevealTextProps> = ({
  text,
  as: Component = 'h2',
  by = 'words',
  delay = 0,
  staggerDelay = 0.035,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Découpage selon l'option
  const segments = useMemo(() => {
    if (by === 'lines') {
      return text.split('\n').filter((line) => line.trim().length > 0);
    }
    return text.split(' ');
  }, [text, by]);

  const containerVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
      },
    },
  };

  const itemVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { duration: motionTokens.duration.fast },
        },
      }
    : {
        hidden: {
          y: '115%',
          opacity: 0,
        },
        visible: {
          y: '0%',
          opacity: 1,
          transition: {
            duration: motionTokens.duration.normal,
            ease: motionTokens.ease.easeOut,
          },
        },
      };

  const MotionComponent = motion.create(Component);

  return (
    <MotionComponent
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10%' }}
      aria-label={text}
    >
      {segments.map((segment, index) => (
        <span
          key={`${segment}-${index}`}
          className="inline-block overflow-hidden align-top"
          aria-hidden="true"
        >
          <motion.span
            variants={itemVariants}
            className="inline-block whitespace-nowrap"
          >
            {segment}
          </motion.span>
          {/* Espace après chaque mot */}
          {index < segments.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </MotionComponent>
  );
};

export default RevealText;

