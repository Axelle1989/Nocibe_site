import React, { useState } from 'react';
import { PRODUCTS, Product } from '../data/products';
import { FAQS } from '../data/faq';
import { SectionHeader } from '../components/ui/SectionHeader';
import { ProductCard } from '../components/ui/ProductCard';
import { CementCalculator } from '../components/ui/CementCalculator';
import {
  CaretDown,
  DownloadSimple,
  ShieldCheck,
  CheckCircle,
  FilePdf
} from '@phosphor-icons/react';

interface ProductsPageProps {
  onViewProductDetail: (slug: string) => void;
  onOpenQuoteWithProduct: (productId: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  onViewProductDetail,
  onOpenQuoteWithProduct,
}) => {
  const [filterCategory, setFilterCategory] = useState<'Tous' | 'sacs' | 'vrac'>('Tous');
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQS[0]?.id || null);

  const filteredProducts = PRODUCTS.filter((p) => {
    if (filterCategory === 'Tous') return true;
    return p.unit === filterCategory;
  });

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div className="w-full py-12 sm:py-16 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div>
          <SectionHeader
            eyebrow="Gamme Norme Européenne EN 197-1"
            titleBeforeItalic="Notre gamme de"
            italicWord="produits"
            titleAfterItalic="cimentiers"
            subtitle="Du ciment courant de maçonnerie aux formulations spéciales pour fondations en nappe phréatique et grands ouvrages portuaires."
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setFilterCategory('Tous')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition ${
              filterCategory === 'Tous'
                ? 'bg-[#0B1F3A] text-white shadow'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Tous les ciments ({PRODUCTS.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('sacs')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition ${
              filterCategory === 'sacs'
                ? 'bg-[#0B1F3A] text-white shadow'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Sacs de 50 kg
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('vrac')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition ${
              filterCategory === 'vrac'
                ? 'bg-[#0B1F3A] text-white shadow'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Vrac Citerne & Tonnes
          </button>
        </div>

        {/* 1. GRILLE DES PRODUITS AVEC SÉLECTEUR DE QUANTITÉ & PANIER */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onViewDetail={onViewProductDetail}
              onOpenQuote={onOpenQuoteWithProduct}
            />
          ))}
        </div>

        {/* 2. SPÉCIFICATIONS TECHNIQUES & TABLEAU COMPARATIF (ancre #specifications) */}
        <section id="specifications" className="scroll-mt-28 space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
            <div className="bg-[#0B1F3A] text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="eyebrow text-slate-300">Laboratoire de Contrôle de Massé</span>
                <h3 className="text-xl sm:text-2xl font-bold font-playfair text-white mt-1">
                  Tableau comparatif des ciments NOCIBÉ
                </h3>
              </div>
              <div className="text-xs text-slate-300">
                Essais certifiés selon les méthodes EN 196-1 & EN 197-1
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100 text-[#0B1F3A] border-b border-slate-200 font-bold">
                    <th className="p-4 sm:p-5">Critères</th>
                    <th className="p-4 sm:p-5">CPJ 35</th>
                    <th className="p-4 sm:p-5 bg-slate-200/80 text-[#0B1F3A]">CPJ 45 (Phare)</th>
                    <th className="p-4 sm:p-5">CPA 55</th>
                    <th className="p-4 sm:p-5">Spécial PM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  <tr className="hover:bg-slate-50 transition">
                    <td className="p-4 font-bold text-[#0B1F3A] bg-slate-50/50">Résistance 2 jours</td>
                    <td className="p-4">≥ 12 MPa</td>
                    <td className="p-4 bg-slate-50/80 font-semibold text-[#0B1F3A]">≥ 20 MPa</td>
                    <td className="p-4 font-semibold text-[#0B1F3A]">≥ 30 MPa</td>
                    <td className="p-4">≥ 22 MPa</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition">
                    <td className="p-4 font-bold text-[#0B1F3A] bg-slate-50/50">Résistance 28 jours</td>
                    <td className="p-4 font-semibold text-[#16A34A]">32,5 à 52,5 MPa</td>
                    <td className="p-4 bg-slate-50/80 font-semibold text-[#16A34A]">42,5 à 62,5 MPa</td>
                    <td className="p-4 font-semibold text-[#16A34A]">≥ 52,5 MPa</td>
                    <td className="p-4 font-semibold text-[#16A34A]">≥ 45,0 MPa</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition">
                    <td className="p-4 font-bold text-[#0B1F3A] bg-slate-50/50">Finesse Blaine</td>
                    <td className="p-4">3 600 cm²/g</td>
                    <td className="p-4 bg-slate-50/80 font-medium">4 100 cm²/g</td>
                    <td className="p-4 font-medium">4 800 cm²/g</td>
                    <td className="p-4">4 300 cm²/g</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition">
                    <td className="p-4 font-bold text-[#0B1F3A] bg-slate-50/50">Début de prise</td>
                    <td className="p-4">≥ 75 min</td>
                    <td className="p-4 bg-slate-50/80">≥ 60 min</td>
                    <td className="p-4">≥ 45 min</td>
                    <td className="p-4">≥ 70 min</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition">
                    <td className="p-4 font-bold text-[#0B1F3A] bg-slate-50/50">Usage préconisé</td>
                    <td className="p-4">Maçonnerie, enduits, chape</td>
                    <td className="p-4 bg-slate-50/80 font-bold text-[#0B1F3A]">Béton armé, dalles, R+1/R+8</td>
                    <td className="p-4 font-bold text-[#0B1F3A]">Ponts, quais, précontraint</td>
                    <td className="p-4">Ouvrages maritimes & salins</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Fiches Techniques PDF */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-lg font-bold text-[#0B1F3A] font-playfair">
                  Fiches techniques officielles (PDF)
                </h4>
                <p className="text-xs text-slate-500">
                  Courbes granulométriques, compositions d'oxydes et certificats de conformité EN 197-1.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PRODUCTS.slice(0, 3).map((prod) => (
                <div
                  key={prod.id}
                  className="card-nocibe p-5 bg-white border-slate-200 flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                      <FilePdf size={22} weight="duotone" />
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-[#0B1F3A] truncate">{prod.name}</h5>
                      <span className="text-[11px] text-slate-400 block">{prod.pdfFile.name} &bull; {prod.pdfFile.size}</span>
                    </div>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-100 flex justify-end">
                    <a
                      href={`/docs/${prod.pdfFile.name}`}
                      download={prod.pdfFile.name}
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(`/docs/${prod.pdfFile.name}`, '_blank');
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0131FD] hover:text-[#0026C7] transition"
                    >
                      <DownloadSimple size={14} weight="bold" />
                      <span>Télécharger</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. CALCULATEUR DE BÉTON & CIMENT */}
        <div>
          <CementCalculator />
        </div>

        {/* 4. FAQ TECHNIQUE EN ACCORDÉON */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <span className="eyebrow text-[#0B1F3A]">Questions Fréquentes</span>
            <h3 className="text-2xl sm:text-3xl font-bold font-playfair text-[#0B1F3A] mt-1">
              Tout savoir sur le ciment et le dosage béton
            </h3>
          </div>

          <div className="space-y-3">
            {FAQS.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs transition"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(item.id)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-[#0B1F3A] text-sm hover:text-[#0131FD] transition"
                >
                  <span>{item.question}</span>
                  <CaretDown
                    size={18}
                    weight="bold"
                    className={`shrink-0 transition-transform duration-200 ${
                      openFaqId === item.id ? 'rotate-180 text-[#0131FD]' : 'text-slate-400'
                    }`}
                  />
                </button>

                {openFaqId === item.id && (
                  <div className="px-5 pb-5 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100">
                    <p>{item.answer}</p>
                    <span className="inline-block mt-2 text-[10px] uppercase font-bold text-slate-400">
                      Catégorie : {item.category}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
