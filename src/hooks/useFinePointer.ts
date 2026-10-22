import { useEffect, useState } from 'react';

/**
 * Hook détectant si le périphérique pointeur principal est précis (souris / trackpad).
 * Retourne false sur écrans tactiles purs (smartphones, tablettes), ce qui permet
 * de désactiver automatiquement les effets de suivi de curseur lourds (Tilt, Halo, Aimant).
 */
export function useFinePointer(): boolean {
  const [hasFinePointer, setHasFinePointer] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(pointer: fine)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(pointer: fine)');
    setHasFinePointer(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setHasFinePointer(event.matches);
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      // Compatibilité navigateurs plus anciens
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, []);

  return hasFinePointer;
}

export default useFinePointer;

