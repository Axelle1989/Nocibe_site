import React, { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';

export interface CountUpProps {
  /** Valeur numérique finale */
  value?: number;
  /** Alias pour compatibilité */
  end?: number;
  /** Durée en secondes du décompte */
  duration?: number;
  /** Nombre de décimales */
  decimals?: number;
  /** Préfixe (ex: "+", "~", "$") */
  prefix?: string;
  /** Suffixe (ex: "%", " M", " t/an") */
  suffix?: string;
  /** Classes CSS */
  className?: string;
}

/**
 * Composant <CountUp> : Compteur numérique animé qui s'incrémente
 * avec fluidité lorsque l'élément devient visible à l'écran.
 * - Respecte prefers-reduced-motion (affiche la valeur cible immédiatement).
 * - Formatage localisé avec espaces insécables pour les milliers.
 */
export const CountUp: React.FC<CountUpProps> = ({
  value,
  end,
  duration = 2,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const target = value !== undefined ? value : (end ?? 0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  const shouldReduceMotion = useReducedMotion();

  const [current, setCurrent] = useState(shouldReduceMotion ? target : 0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (shouldReduceMotion) {
      setCurrent(target);
      return;
    }

    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      const startTime = performance.now();
      const frameDuration = duration * 1000;

      const step = (now: number) => {
        const progress = Math.min((now - startTime) / frameDuration, 1);
        // Easing easeOutExpo pour un ralentissement très naturel en fin de compte
        const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const nextValue = easeOut * target;
        setCurrent(nextValue);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setCurrent(target);
        }
      };

      requestAnimationFrame(step);
    }
  }, [isInView, target, duration, shouldReduceMotion]);

  const formatted = current.toLocaleString('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={`tabular-nums inline-block ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

export default CountUp;

