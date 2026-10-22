import React, { useRef, useMemo } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'motion/react';

export interface ScrollWordsProps {
  /** Phrase forte ou paragraphe clé */
  text: string;
  /** Classe CSS du paragraphe */
  className?: string;
  /** Couleur inactive (défaut: gris clair slate-300) */
  inactiveColor?: string;
  /** Couleur active (défaut: bleu marine NOCIBÉ #0B1F3A) */
  activeColor?: string;
}

interface WordProps {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  inactiveColor: string;
  activeColor: string;
  shouldReduceMotion: boolean | null;
}

const Word: React.FC<WordProps> = ({
  children,
  progress,
  range,
  inactiveColor,
  activeColor,
  shouldReduceMotion,
}) => {
  const opacity = useTransform(progress, range, [0.25, 1]);
  const color = useTransform(progress, range, [inactiveColor, activeColor]);

  if (shouldReduceMotion) {
    return (
      <span className="inline-block mr-[0.28em]" style={{ color: activeColor }}>
        {children}
      </span>
    );
  }

  return (
    <span className="relative inline-block mr-[0.28em]">
      {/* Mot fantôme pour conserver la largeur exacte */}
      <span className="opacity-0 select-none" aria-hidden="true">
        {children}
      </span>
      {/* Mot animé superposé */}
      <motion.span
        style={{ opacity, color }}
        className="absolute top-0 left-0 transition-colors duration-75"
        aria-hidden="true"
      >
        {children}
      </motion.span>
    </span>
  );
};

/**
 * Composant <ScrollWords> : Phrase clé dont les mots s'allument progressivement
 * de gris clair vers le bleu marine NOCIBÉ au fur et à mesure du scroll de la page.
 * Utilisé pour une seule phrase forte par page (manifeste, mission, vision).
 */
export const ScrollWords: React.FC<ScrollWordsProps> = ({
  text,
  className = '',
  inactiveColor = '#94A3B8',
  activeColor = '#0B1F3A',
}) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.45'],
  });

  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  return (
    <p
      ref={containerRef}
      className={`leading-relaxed font-medium select-none ${className}`}
      aria-label={text}
    >
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word
            key={`${word}-${i}`}
            progress={scrollYProgress}
            range={[start, end]}
            inactiveColor={inactiveColor}
            activeColor={activeColor}
            shouldReduceMotion={shouldReduceMotion}
          >
            {word}
          </Word>
        );
      })}
    </p>
  );
};

export default ScrollWords;

