import React, { useState, useEffect } from 'react';
import { NEWS_ARTICLES, NewsArticle } from '../data/news';
import { SectionHeader } from '../components/ui/SectionHeader';
import {
  CalendarBlank,
  Clock,
  ArrowLeft,
  ArrowRight,
  ShareNetwork,
  MagnifyingGlass,
  Tag,
  BookOpen,
  CaretRight,
  CheckCircle,
  FileText,
  LinkedinLogo,
  FacebookLogo,
  Copy,
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';

interface NewsPageProps {
  currentSlug?: string;
  onSelectArticle: (slug: string) => void;
  onBackToList: () => void;
  onOpenQuote: () => void;
}

export const NewsPage: React.FC<NewsPageProps> = ({
  currentSlug,
  onSelectArticle,
  onBackToList,
  onOpenQuote,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(4);
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const categories = ['Toutes', 'Usine', 'RSE', 'Chantiers', 'Événements'];

  // If a slug is provided, find the active article
  const activeArticle = currentSlug
    ? NEWS_ARTICLES.find((a) => a.slug === currentSlug)
    : null;

  // Reading progress tracking for article detail view
  useEffect(() => {
    if (!activeArticle) return;
    const updateProgress = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      }
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateProgress);
  }, [activeArticle]);

  const handleShare = (network: 'facebook' | 'linkedin' | 'copy') => {
    const url = window.location.href;

    if (network === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (network === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else if (network === 'copy') {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // ==========================================
  // ARTICLE DETAIL VIEW
  // ==========================================
  if (activeArticle) {
    const currentIndex = NEWS_ARTICLES.findIndex((a) => a.id === activeArticle.id);
    const prevArticle = currentIndex > 0 ? NEWS_ARTICLES[currentIndex - 1] : null;
    const nextArticle = currentIndex < NEWS_ARTICLES.length - 1 ? NEWS_ARTICLES[currentIndex + 1] : null;
    const relatedArticles = NEWS_ARTICLES.filter(
      (a) => a.id !== activeArticle.id && (a.category === activeArticle.category || !a.isFeatured)
    ).slice(0, 3);

    return (
      <div className="w-full bg-[#F5F7FA] min-h-screen">
        {/* Sticky Reading Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-200 z-50">
          <div
            className="h-full bg-[#0131FD] transition-all duration-150 ease-out"
            style={{ width: `${readingProgress}%` }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
          {/* Breadcrumb / Back button */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onBackToList}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#0B1F3A] hover:text-[#0131FD] bg-white px-4 py-2.5 rounded-xl border border-slate-200 transition-colors shadow-xs"
            >
              <ArrowLeft size={16} weight="bold" />
              <span>Retour à toutes les actualités</span>
            </button>

            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
              Temps de lecture estimé : {activeArticle.readTime}
            </span>
          </div>

          {/* 2-Column Article Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Content Column (8 cols) */}
            <article className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              {/* Header Image */}
              <div className="relative h-64 sm:h-96 w-full bg-slate-100 overflow-hidden">
                <img
                  src={activeArticle.image}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#0131FD] text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                  {activeArticle.category}
                </div>
              </div>

              <div className="p-6 sm:p-10 space-y-6">
                {/* Meta info */}
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <CalendarBlank size={16} weight="bold" />
                    <span>{activeArticle.date}</span>
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <Clock size={16} weight="bold" />
                    <span>{activeArticle.readTime}</span>
                  </span>
                  <span>&bull;</span>
                  <span className="text-[#0131FD] font-bold">Par {activeArticle.author}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-playfair text-[#0B1F3A] leading-tight">
                  {activeArticle.title}
                </h1>

                {/* Lead excerpt */}
                <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed border-l-4 border-[#0131FD] pl-4 bg-[#EBF3FF]/40 py-3 rounded-r-xl">
                  {activeArticle.excerpt}
                </p>

                {/* Structured Sections with Section IDs for Sticky TOC */}
                {activeArticle.sections && activeArticle.sections.length > 0 ? (
                  <div className="space-y-8 pt-4 border-t border-slate-100">
                    {activeArticle.sections.map((sec) => (
                      <div key={sec.id} id={sec.id} className="space-y-3 scroll-mt-28">
                        <h2 className="text-lg sm:text-xl font-bold font-playfair text-[#0B1F3A]">
                          {sec.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          {sec.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs sm:text-sm leading-relaxed text-slate-700 space-y-4 pt-4 border-t border-slate-100">
                    {activeArticle.content.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                )}

                {/* Share Strip */}
                <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <ShareNetwork size={18} weight="bold" />
                    <span>Partager cet article :</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleShare('linkedin')}
                      className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-[#0A66C2] hover:text-white text-slate-700 flex items-center justify-center transition-colors"
                      title="Partager sur LinkedIn"
                    >
                      <LinkedinLogo size={18} weight="fill" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleShare('facebook')}
                      className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-[#1877F2] hover:text-white text-slate-700 flex items-center justify-center transition-colors"
                      title="Partager sur Facebook"
                    >
                      <FacebookLogo size={18} weight="fill" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleShare('copy')}
                      className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-[#0131FD] hover:text-white text-slate-700 flex items-center justify-center transition-colors"
                      title="Copier le lien"
                    >
                      <Copy size={18} weight="bold" />
                    </button>
                    {copiedLink && (
                      <span className="text-xs text-[#16A34A] font-semibold animate-in fade-in">
                        Lien copié !
                      </span>
                    )}
                  </div>
                </div>

                {/* Prev / Next Article Navigation */}
                <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {prevArticle ? (
                    <button
                      type="button"
                      onClick={() => onSelectArticle(prevArticle.slug)}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-[#0131FD] text-left transition-colors group"
                    >
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        &larr; Article précédent
                      </span>
                      <span className="text-xs font-bold text-[#0B1F3A] group-hover:text-[#0131FD] line-clamp-2">
                        {prevArticle.title}
                      </span>
                    </button>
                  ) : <div />}

                  {nextArticle && (
                    <button
                      type="button"
                      onClick={() => onSelectArticle(nextArticle.slug)}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-[#0131FD] text-right transition-colors group"
                    >
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Article suivant &rarr;
                      </span>
                      <span className="text-xs font-bold text-[#0B1F3A] group-hover:text-[#0131FD] line-clamp-2">
                        {nextArticle.title}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </article>

            {/* Sidebar Column (4 cols) */}
            <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
              {/* Sticky Table of Contents if article has sections */}
              {activeArticle.sections && activeArticle.sections.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0B1F3A] mb-3">
                    <BookOpen size={16} className="text-[#0131FD]" weight="bold" />
                    <span>Sommaire de l'article</span>
                  </div>
                  <nav className="space-y-2">
                    {activeArticle.sections.map((sec) => (
                      <a
                        key={sec.id}
                        href={`#${sec.id}`}
                        className="text-xs text-slate-600 hover:text-[#0131FD] flex items-center gap-1.5 transition-colors"
                      >
                        <CaretRight size={12} className="text-[#0131FD]" />
                        <span className="truncate">{sec.title}</span>
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* B2B Quote CTA Card */}
              <div className="bg-gradient-to-br from-[#0B1F3A] to-[#162E52] text-white rounded-2xl p-6 shadow-md space-y-3">
                <span className="eyebrow text-[#00CCFF]">Grands Chantiers BTP</span>
                <h4 className="text-base font-bold font-playfair text-white">
                  Besoin d'un approvisionnement en ciment de haute performance ?
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Obtenez une cotation personnalisée pour vos livraisons en vrac ou par palettes avec nos ingénieurs commerciaux.
                </p>
                <button
                  type="button"
                  onClick={onOpenQuote}
                  className="w-full btn-primary py-2.5 px-4 text-xs font-bold uppercase tracking-wider mt-2"
                >
                  Demande de devis B2B
                </button>
              </div>

              {/* Recent Articles in Sidebar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A]">
                  Dernières parutions
                </h4>
                <div className="space-y-3">
                  {NEWS_ARTICLES.filter((a) => a.id !== activeArticle.id).slice(0, 3).map((art) => (
                    <div
                      key={art.id}
                      onClick={() => onSelectArticle(art.slug)}
                      className="cursor-pointer group flex items-start gap-3 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0"
                    >
                      <div className="w-16 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                        <img src={art.image} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 block">{art.date}</span>
                        <h5 className="text-xs font-bold text-[#0B1F3A] group-hover:text-[#0131FD] transition line-clamp-2">
                          {art.title}
                        </h5>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          {/* Related Articles Bottom Grid */}
          {relatedArticles.length > 0 && (
            <div className="pt-8 border-t border-slate-200 space-y-4">
              <div>
                <span className="eyebrow text-[#0131FD]">Poursuivre la lecture</span>
                <h3 className="text-xl font-bold font-playfair text-[#0B1F3A]">
                  Articles Similaires
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectArticle(rel.slug)}
                    className="card-nocibe bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 overflow-hidden bg-slate-100">
                        <img src={rel.image} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <span className="absolute top-3 left-3 bg-[#0B1F3A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {rel.category}
                        </span>
                      </div>
                      <div className="p-5 space-y-2">
                        <span className="text-[11px] text-slate-400">{rel.date}</span>
                        <h4 className="text-sm font-bold text-[#0B1F3A] group-hover:text-[#0131FD] transition line-clamp-2">
                          {rel.title}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2">{rel.excerpt}</p>
                      </div>
                    </div>
                    <div className="px-5 pb-5 pt-0">
                      <span className="text-xs font-bold text-[#0131FD] inline-flex items-center gap-1 group-hover:underline">
                        <span>Lire l'article</span>
                        <ArrowRight size={12} weight="bold" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // LIST VIEW WITH FEATURED & FILTER
  // ==========================================
  const filteredArticles = NEWS_ARTICLES.filter((art) => {
    const matchesCat = selectedCategory === 'Toutes' || art.category === selectedCategory;
    const matchesQuery =
      searchQuery === '' ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const featuredArticle = NEWS_ARTICLES.find((a) => a.isFeatured) || NEWS_ARTICLES[0];
  const gridArticles = filteredArticles
    .filter((a) => selectedCategory !== 'Toutes' || searchQuery !== '' || a.id !== featuredArticle.id)
    .slice(0, visibleCount);

  return (
    <div className="w-full py-8 sm:py-12 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        <SectionHeader
          eyebrow="Espace Presse & Communiqués"
          titleBeforeItalic="Actualités &"
          italicWord="vie"
          titleAfterItalic="de l'entreprise"
          subtitle="Toute l'information sur les investissements, les engagements RSE et les réalisations de la Nouvelle Cimenterie du Bénin."
        />

        {/* 1. ARTICLE À LA UNE (When on 'Toutes' and empty search) */}
        {selectedCategory === 'Toutes' && searchQuery === '' && featuredArticle && (
          <div
            onClick={() => onSelectArticle(featuredArticle.slug)}
            className="card-nocibe overflow-hidden bg-white cursor-pointer group grid grid-cols-1 lg:grid-cols-12 gap-0 border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all"
          >
            <div className="lg:col-span-7 relative h-72 sm:h-96 overflow-hidden bg-slate-100">
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-[#0131FD] text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                À la une &bull; {featuredArticle.category}
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-3">
                  <CalendarBlank size={16} weight="bold" />
                  <span>{featuredArticle.date}</span>
                  <span>&bull;</span>
                  <span>{featuredArticle.readTime}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold font-playfair text-[#0B1F3A] group-hover:text-[#0131FD] transition mb-3 leading-snug">
                  {featuredArticle.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {featuredArticle.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-[#0131FD] inline-flex items-center gap-1.5 group-hover:underline">
                  <span>Lire l'article complet</span>
                  <ArrowRight size={16} weight="bold" />
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{featuredArticle.author}</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. FILTER & SEARCH TOOLBAR */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Animated Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#0131FD] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <MagnifyingGlass size={16} weight="bold" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un article, mot-clé..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0131FD]"
            />
          </div>
        </div>

        {/* 3. ARTICLES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => onSelectArticle(article.slug)}
              className="card-nocibe overflow-hidden bg-white flex flex-col justify-between group cursor-pointer border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-[#0B1F3A] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    {article.category}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
                    <CalendarBlank size={14} weight="bold" />
                    <span>{article.date}</span>
                    <span>&bull;</span>
                    <span>{article.readTime}</span>
                  </div>

                  <h3 className="text-base font-bold text-[#0B1F3A] group-hover:text-[#0131FD] transition mb-2 leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-0">
                <span className="text-xs font-bold text-[#0131FD] flex items-center gap-1 group-hover:underline">
                  <span>Lire la suite</span>
                  <ArrowRight size={14} weight="bold" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty Search Result */}
        {gridArticles.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-sm text-slate-500">
              Aucun article ne correspond à votre filtre ou terme de recherche.
            </p>
          </div>
        )}

        {/* Load More Button */}
        {filteredArticles.length > visibleCount && (
          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 3)}
              className="btn-marine py-3 px-8 text-xs font-bold uppercase tracking-wider"
            >
              Charger plus d'articles
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
