import { useState, useEffect } from 'react';
import { OUTLETS, Outlet } from '../data/outlets';

export function useOutlets() {
  const [outlets] = useState<Outlet[]>(OUTLETS);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return { outlets, loading, isFallback: true };
}
