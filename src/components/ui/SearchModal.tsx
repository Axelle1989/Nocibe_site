import React, { useState, useMemo } from 'react';
import { PRODUCTS } from '../../data/products';
import { NEWS_ARTICLES } from '../../data/news';
import { PROJECTS } from '../../data/projects';
import { MagnifyingGlass, X, ArrowRight, ShieldCheck, Newspaper, HardHat, FileText } from '@phosphor-icons/react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string, extra?: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    const q = query.toLowerCase();

    const matches: Array<{
      type: 'Produit' | 'Actualité' | 'Réalisation' | 'Page';
      title: string;
      subtitle: string;
      page: string;
      extra?: string;
    }> = [];

    // Products
    PRODUCTS.forEach((p) => {
      if (
        p.name.toLowerCase().includes(q) ||
        p.shortGrade.toLowerCase().includes(q) ||
        p.targetUse.toLowerCase().includes(q) ||
        p.classe.toLowerCase().includes(q)
      ) {
        matches.push({
          type: 'Produit',
          title: p.name,
          subtitle: `${p.shortGrade} • ${p.targetUse}`,
          page: 'product-detail',
          extra: p.slug
        });
      }
    });

    // News
    NEWS_ARTICLES.forEach((n) => {
      if (
        n.title.toLowerCase().includes(q) ||
        n.excerpt.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q)
      ) {
        matches.push({
          type: 'Actualité',
          title: n.title,
          subtitle: `${n.category} • ${n.date}`,
          page: 'news',
          extra: n.slug
        });
      }
    });

    // Projects
    PROJECTS.forEach((pr) => {
      if (
        pr.title.toLowerCase().includes(q) ||
        pr.location.toLowerCase().includes(q) ||
        pr.cimentUtilise.toLowerCase().includes(q)
      ) {
        matches.push({
          type: 'Réalisation',
          title: pr.title,
          subtitle: `${pr.location} • ${pr.cimentUtilise}`,
          page: 'projects'
        });
      }
    });

    // Core Pages
    const pages = [
      { name: 'Notre histoire', sub: 'Historique et fondation de l\'usine de Massé', page: 'history' },
      { name: 'Notre équipe', sub: 'Direction générale et ingénieurs', page: 'team' },
      { name: 'Valeurs et missions', sub: 'Piliers d\'excellence industrielle', page: 'values' },
      { name: 'L\'usine de Massé', sub: 'Four rotatif à 1450°C et broyage', page: 'factory' },
      { name: 'Spécifications techniques', sub: 'Tableau comparatif EN 197-1 et PDF', page: 'specs' },
      { name: 'Développement durable', sub: 'RSE, Objectifs 2030 et sécurité', page: 'sustainability' },
      { name: 'Où acheter', sub: 'Dépôts et distributeurs agréés au Bénin', page: 'outlets' },
      { name: 'Contact', sub: 'Coordonnées usine et direction commerciale', page: 'contact' },
      { name: 'Panier', sub: 'Consulter vos articles sélectionnés', page: 'panier' },
      { name: 'Espace client', sub: 'Suivi de commande et compte sécurisé', page: 'espace-client' }
    ];

    pages.forEach((pg) => {
      if (pg.name.toLowerCase().includes(q) || pg.sub.toLowerCase().includes(q)) {
        matches.push({
          type: 'Page',
          title: pg.name,
          subtitle: pg.sub,
          page: pg.page
        });
      }
    });

    return matches.slice(0, 8);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1F3A]/70 backdrop-blur-sm p-4 flex items-start justify-center pt-20">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center gap-3">
          <MagnifyingGlass size={22} weight="bold" className="text-[#0131FD] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un ciment, un projet, une actualité ou une page..."
            className="w-full text-base sm:text-lg font-medium text-[#0B1F3A] placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 sm:p-4 max-h-[60vh] overflow-y-auto">
          {query.trim().length < 2 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              Tapez au moins 2 caractères pour rechercher dans tout le site NOCIBÉ...
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              Aucun résultat pour « <strong className="text-[#0B1F3A]">{query}</strong> ».
            </div>
          ) : (
            <div className="space-y-1.5">
              {results.map((res, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onNavigate(res.page, res.extra);
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0B1F3A] flex items-center justify-center shrink-0">
                      {res.type === 'Produit' && <ShieldCheck size={18} weight="bold" />}
                      {res.type === 'Actualité' && <Newspaper size={18} weight="bold" />}
                      {res.type === 'Réalisation' && <HardHat size={18} weight="bold" />}
                      {res.type === 'Page' && <FileText size={18} weight="bold" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0B1F3A] group-hover:text-[#0131FD] transition">
                        {res.title}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">
                        {res.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {res.type}
                    </span>
                    <ArrowRight size={14} weight="bold" className="text-slate-300 group-hover:text-[#0131FD] transition" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
