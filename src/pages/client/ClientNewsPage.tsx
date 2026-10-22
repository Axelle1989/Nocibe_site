import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNews } from '../../hooks/useNews';
import { Sparkle, CalendarBlank, ArrowRight, Tag, BookmarkSimple } from '@phosphor-icons/react';

export const ClientNewsPage: React.FC = () => {
  const { news } = useNews();
  const [filter, setFilter] = useState<'all' | 'nouveau_produit' | 'technique'>('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const filteredNews = news.filter(item => {
    if (filter === 'nouveau_produit') return item.categorie.toLowerCase().includes('produit') || item.titre.toLowerCase().includes('ciment');
    if (filter === 'technique') return item.categorie.toLowerCase().includes('technique') || item.categorie.toLowerCase().includes('usine');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-black text-[#0B1F3A]">
            Actualités Usine & <span className="italic text-[#0131FD]">Nouveaux Ciments</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dernières évolutions techniques, extensions de gamme et avis aux distributeurs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'all'
                ? 'bg-[#0B1F3A] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilter('nouveau_produit')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filter === 'nouveau_produit'
                ? 'bg-[#0131FD] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Sparkle size={14} />
            <span>Nouveaux ciments</span>
          </button>
          <button
            onClick={() => setFilter('technique')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'technique'
                ? 'bg-[#0B1F3A] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Technique & Usine
          </button>
        </div>
      </div>

      {/* Grid of News Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map(item => (
          <article
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.titre}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e: any) => {
                    e.target.src = '/hero-factory.jpg';
                  }}
                />
                <div className="absolute top-3 left-3 bg-[#0B1F3A]/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Tag size={12} className="text-[#0131FD]" />
                  <span>{item.categorie}</span>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                  <CalendarBlank size={13} />
                  <span>{item.date}</span>
                </div>

                <h3 className="font-bold text-[#0B1F3A] text-base leading-snug line-clamp-2 mb-2">
                  {item.titre}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {item.resume}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
              <Link
                to={`/actualites/${item.slug}`}
                className="text-xs font-bold text-[#0B1F3A] hover:text-[#0131FD] flex items-center gap-1.5 transition-colors"
              >
                <span>Lire la note officielle</span>
                <ArrowRight size={14} />
              </Link>

              <button
                type="button"
                onClick={() => toggleBookmark(item.id)}
                title={bookmarkedIds.includes(item.id) ? "Retirer des favoris" : "Conserver en favori"}
                className={`p-1 transition-colors ${
                  bookmarkedIds.includes(item.id) ? "text-[#0131FD]" : "text-slate-400 hover:text-[#0131FD]"
                }`}
              >
                <BookmarkSimple size={16} weight={bookmarkedIds.includes(item.id) ? "fill" : "regular"} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

