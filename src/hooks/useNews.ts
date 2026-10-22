import { useState, useEffect } from 'react';
import { NEWS_ARTICLES, NewsArticle } from '../data/news';

export function useNews() {
  const [news] = useState<NewsArticle[]>(NEWS_ARTICLES);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return { news, loading, isFallback: true };
}
