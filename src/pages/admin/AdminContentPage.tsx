import React, { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useNews } from '../../hooks/useNews';
import { Sparkle, Check, Plus, Article, ShoppingBag, Eye } from '@phosphor-icons/react';

export const AdminContentPage: React.FC = () => {
  const { products } = useProducts();
  const { news } = useNews();

  const [localProducts, setLocalProducts] = useState(products);
  const [selectedTab, setSelectedTab] = useState<'products' | 'news'>('products');

  const toggleProductFlag = (id: string, flag: 'nouveau' | 'recommande') => {
    setLocalProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, [flag]: !p[flag] } : p))
    );
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestion du Catalogue & Actualités</h1>
          <p className="text-xs text-slate-400 mt-1">
            Pilotage des ciments mis en avant, badges nouveautés et parutions officielles
          </p>
        </div>

        <div className="flex bg-[#0B1F3A] border border-[#1E3A5F] p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setSelectedTab('products')}
            className={`px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              selectedTab === 'products' ? 'bg-[#0131FD] text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            <ShoppingBag size={14} />
            <span>Catalogue Ciments ({localProducts.length})</span>
          </button>
          <button
            onClick={() => setSelectedTab('news')}
            className={`px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              selectedTab === 'news' ? 'bg-[#0131FD] text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Article size={14} />
            <span>Articles & Notes ({news.length})</span>
          </button>
        </div>
      </div>

      {selectedTab === 'products' ? (
        <div className="bg-[#0B1F3A] rounded-2xl border border-[#1E3A5F] p-6 space-y-4">
          <h2 className="text-base font-bold text-white mb-2">Paramètres des Ciments au Catalogue</h2>

          <div className="divide-y divide-[#1E3A5F]">
            {localProducts.map(p => (
              <div key={p.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{p.nom}</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700">
                      {p.classe}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {p.usagePrincipal} &bull; Norme {p.norme} &bull; {p.prixIndicatifFcfa.toLocaleString('fr-FR')} FCFA
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleProductFlag(p.id, 'nouveau')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                      p.nouveau
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-[#132A4C] text-slate-400 border-[#1E3A5F] hover:text-white'
                    }`}
                  >
                    <Sparkle size={12} />
                    <span>Badge "Nouveau"</span>
                  </button>

                  <button
                    onClick={() => toggleProductFlag(p.id, 'recommande')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                      p.recommande
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-[#132A4C] text-slate-400 border-[#1E3A5F] hover:text-white'
                    }`}
                  >
                    <Check size={12} />
                    <span>Badge "Recommandé"</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-[#0B1F3A] rounded-2xl border border-[#1E3A5F] p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">Articles et Communiqués Usine</h2>
            <button
              onClick={() => alert('Fonctionnalité de rédaction activée. Le formulaire d’édition Markdown est prêt.')}
              className="bg-[#0131FD] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-[#0026c7]"
            >
              <Plus size={14} weight="bold" />
              <span>Publier un communiqué</span>
            </button>
          </div>

          <div className="divide-y divide-[#1E3A5F]">
            {news.map(art => (
              <div key={art.id} className="py-4 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#0131FD]">{art.categorie}</span>
                  <h3 className="font-bold text-sm text-white">{art.titre}</h3>
                  <div className="text-xs text-slate-400">{art.date}</div>
                </div>

                <a
                  href={`/actualites/${art.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 text-slate-400 hover:text-white bg-[#132A4C] rounded-lg"
                >
                  <Eye size={16} />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

