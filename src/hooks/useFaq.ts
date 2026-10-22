import { useState, useEffect } from 'react';
import { FAQS, FAQItem } from '../data/faq';

export function useFaq() {
  const [faqs] = useState<FAQItem[]>(FAQS);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return { faqs, loading, isFallback: true };
}
