import { useRef } from 'react';
import { useInView, type UseInViewOptions } from 'motion/react';

interface UseInViewOnceOptions {
  margin?: UseInViewOptions['margin'];
  amount?: UseInViewOptions['amount'];
}

/**
 * Hook d'intersection mutualisé observant l'élément une seule fois.
 * Dès que l'élément pénètre dans la zone visible (marge par défaut -10%),
 * isInView passe à true et l'observateur se déconnecte pour économiser les ressources.
 */
export function useInViewOnce<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOnceOptions = {}
) {
  const ref = useRef<T | null>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: options.margin ?? '-10%',
    amount: options.amount ?? 0.1,
  });

  return [ref, isInView] as const;
}

export default useInViewOnce;

