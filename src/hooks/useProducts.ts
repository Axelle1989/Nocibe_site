import { useState, useEffect } from 'react';
import { PRODUCTS, Product } from '../data/products';
import { api } from '../lib/api';

export interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  isFallback: boolean;
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const res = await api.products.getAll();
        if (isMounted && res.products && res.products.length > 0) {
          // Map API products to UI Product format
          const mapped: Product[] = res.products.map(p => ({
            id: p.id,
            slug: p.slug,
            name: p.name,
            title: p.name,
            shortGrade: p.shortGrade,
            classe: p.classe,
            designation: p.designation,
            targetUse: p.targetUse,
            shortDesc: p.targetUse,
            description: p.description,
            resistance2d: p.resistance2d,
            resistance28d: p.resistance28d,
            packaging: p.packaging,
            unit: (p.unit || 'sacs') as 'sacs' | 'tonnes',
            unitPrice: p.unitPrice,
            priceDisplay: p.priceDisplay,
            standard: p.standard,
            isFeatured: p.isFeatured,
            isRecommended: p.isRecommended,
            nouveau: p.nouveau,
            badge: p.badge || undefined,
            image: p.image || '/images/produits/cpj-35-palette-fond-blanc.webp',
            gallery: (p.gallery as string[]) || ['/images/produits/cpj-35-palette-fond-blanc.webp'],
            technicalData: (p.technicalData as any) || {
              blaineFineness: '4 100 cm²/g',
              initialSet: '≥ 60 min',
              resistance2j: p.resistance2d,
              resistance28j: p.resistance28d,
              priseDebut: '≥ 60 min',
              stabilite: '≤ 5 mm',
              perteFeu: '≤ 3.5 %',
            },
            pdfFile: p.pdfName
              ? { name: p.pdfName, size: '260 Ko', url: p.pdfUrl || '#' }
              : undefined,
            applications: [p.targetUse],
            strengths: ['Qualité certifiée EN 197-1'],
            fictif: false,
          }));
          setProducts(mapped);
          setIsFallback(false);
        }
      } catch {
        // Fallback to local dataset
        if (isMounted) {
          setProducts(PRODUCTS);
          setIsFallback(true);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, loading, error, isFallback };
}
