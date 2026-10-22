import React from 'react';
import { PRODUCTS } from '../data/products';
import { PROJECTS } from '../data/projects';
import { NEWS_ARTICLES } from '../data/news';
import { SITE_CONFIG } from '../config/site';
import { SectionHeader } from '../components/ui/SectionHeader';
import { CountUp } from '../components/ui/CountUp';
import { CTA } from '../components/home/CTA';
import { SafeImage } from '../components/ui/SafeImage';
import { CurvedDivider } from '../components/motion/CurvedDivider';
import { NavPage } from '../components/layout/Header';
import {
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Truck,
  Sparkle,
  Factory,
  Users,
  Trophy,
  ChartLineUp,
  MapPin,
  CalendarBlank,
  FilePdf,
  Quotes
} from '@phosphor-icons/react';
import {
  IconCementBag,
  IconTruckCistern,
  IconSilo,
  IconRotaryKiln,
  IconHardHat,
  IconBridge,
  IconLabScale,
  IconBeninMap
} from '../components/icons/IndustryIcons';

interface HomePageProps {
  onNavigate: (page: NavPage, extra?: string) => void;
  onOpenQuote: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenQuote }) => {
  return (
    <div className="w-full">
      {/* =========================================================
          SECTION 1 : HERO
          Photo aérienne, overlay dégradé marine, sur-titre, H1 serif,
          2 CTA, bandeau de 3 garanties en bas
         ========================================================= */}
      <section className="relative bg-[#0B1F3A] text-white overflow-hidden min-h-[620px] lg:min-h-[720px] flex flex-col justify-between">
        {/* Background photo with clean marine overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/vue-aerienne-usine-hd.jpg"
            alt="Vue aérienne de la cimenterie intégrée NOCIBÉ à Massé"
            className="w-full h-full object-cover object-center scale-100 filter brightness-[0.7] contrast-[1.05]"
          />
          {/* Subtle industrial grid and marine linear gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/95 via-[#0B1F3A]/85 to-[#0B1F3A]/40 lg:w-3/4" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-black/30" />
          <div className="absolute inset-0 bg-grid-marine opacity-30 pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-36 pb-12 flex-1 flex items-center">
          <div className="max-w-2xl lg:max-w-3xl">
            {/* Sur-titre / Eyebrow */}
            <div className="eyebrow bg-white/10 backdrop-blur-md text-slate-200 border border-white/15 px-3.5 py-1 rounded-full mb-6 inline-flex">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-white font-bold tracking-wider">Cimenterie Intégrée au Bénin</span>
            </div>

            {/* H1 Serif avec mot en cyan issu de l'emblème */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-playfair tracking-tight leading-[1.1] mb-6 text-white">
              Bâtir l'avenir avec{' '}
              <span className="italic font-normal text-[#00CCFF] font-serif">
                solidité
              </span>{' '}
              & fierté béninoise
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-200 leading-relaxed mb-8 max-w-2xl">
              De notre gisement calcaire à l'usine intégrée de Massé, NOCIBÉ produit des ciments certifiés <strong className="text-white">EN 197-1</strong> pour pérenniser les grands chantiers et les fondations de la nation.
            </p>

            {/* Deux CTA : Bouton principal orange comme ACCENT RARE #1 */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* JUSTIFICATION ACCENT RARE #1 : Seul et unique bouton d'appel à l'action principal du Hero */}
              <button
                type="button"
                onClick={onOpenQuote}
                className="btn-orange px-8 py-4 text-sm font-bold uppercase tracking-wider shadow-xl flex items-center justify-center gap-3"
              >
                <span>Commander / Devis B2B</span>
                <ArrowRight size={18} weight="bold" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('products')}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 backdrop-blur-sm transition flex items-center justify-center gap-2"
              >
                <span>Découvrir la gamme</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bandeau de 3 Garanties en bas du Hero */}
        <div className="relative z-10 w-full bg-[#071528]/90 backdrop-blur-md border-t border-white/10 py-4 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="flex items-center gap-3 text-slate-200">
              <div className="w-8 h-8 rounded-lg bg-[#16A34A]/20 text-[#4ADE80] flex items-center justify-center shrink-0">
                <ShieldCheck size={20} weight="bold" />
              </div>
              <div>
                <strong className="block text-white font-semibold">Certification EN 197-1</strong>
                <span className="text-slate-400">Contrôle qualité continu certifié ISO 9001</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-200">
              <div className="w-8 h-8 rounded-lg bg-[#EBF3FF] text-[#0131FD] flex items-center justify-center shrink-0">
                <IconTruckCistern size={20} className="text-[#0131FD]" />
              </div>
              <div>
                <strong className="block text-white font-semibold">Flotte Logistique Dédiée</strong>
                <span className="text-slate-400">Livraison sur chantier en vrac ou en sacs 50 kg</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-200">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
                <IconRotaryKiln size={20} className="text-blue-300" />
              </div>
              <div>
                <strong className="block text-white font-semibold">Cuisson Four à 1 450 °C</strong>
                <span className="text-slate-400">Clinker 100% produit localement à Massé</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transition courbe vers la section suivante */}
        <CurvedDivider variant="convex" color="#FFFFFF" height={44} position="bottom" />
      </section>

      {/* =========================================================
          SECTION 2 : CHIFFRES CLÉS ANIMÉS (Compteurs)
         ========================================================= */}
      <section className="py-14 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Stat 1 */}
            <div className="card-nocibe p-6 text-center border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-[#0B1F3A] mx-auto flex items-center justify-center mb-4">
                <Factory size={26} weight="duotone" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-playfair text-[#0B1F3A] mb-1">
                <CountUp end={1.5} decimals={1} suffix=" M" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A]">
                Tonnes / an
              </div>
              <p className="text-xs text-slate-500 mt-2">Capacité de production de clinker & ciment</p>
            </div>

            {/* Stat 2 */}
            <div className="card-nocibe p-6 text-center border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0B1F3A] mx-auto flex items-center justify-center mb-4">
                <Users size={26} weight="duotone" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-playfair text-[#0B1F3A] mb-1">
                <CountUp end={500} decimals={0} suffix="+" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A]">
                Emplois directs
              </div>
              <p className="text-xs text-slate-500 mt-2">Collaborateurs et techniciens béninois</p>
            </div>

            {/* Stat 3 */}
            <div className="card-nocibe p-6 text-center border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-green-50 text-[#16A34A] mx-auto flex items-center justify-center mb-4">
                <Trophy size={26} weight="duotone" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-playfair text-[#0B1F3A] mb-1">
                <CountUp end={100} decimals={0} suffix=" Md" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#16A34A]">
                FCFA d'investissement
              </div>
              <p className="text-xs text-slate-500 mt-2">Usine ultramoderne et équipements européens</p>
            </div>

            {/* Stat 4 */}
            <div className="card-nocibe p-6 text-center border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center mb-4">
                <ChartLineUp size={26} weight="duotone" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-playfair text-[#0B1F3A] mb-1">
                <CountUp end={50} decimals={0} suffix="+" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Ouvrages majeurs
              </div>
              <p className="text-xs text-slate-500 mt-2">Ponts, quais et autoroutes au Bénin</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 3 : GAMME DE CIMENTS CERTIFIÉS
          3 cartes (CPJ 35, CPJ 45, CPA 55) avec badge Recommandé
         ========================================================= */}
      <section className="py-16 sm:py-24 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Norme Européenne EN 197-1"
            titleBeforeItalic="Notre gamme de"
            italicWord="produits"
            titleAfterItalic="certifiés"
            subtitle="Des ciments haute performance formulés pour résister aux agressions climatiques et aux contraintes mécaniques sévères du Bénin."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {PRODUCTS.map((prod) => (
              <div
                key={prod.id}
                className={`card-nocibe p-7 flex flex-col justify-between relative ${
                  prod.isFeatured
                    ? 'border-2 border-[#0131FD] shadow-xl ring-4 ring-[#0131FD]/10 bg-white'
                    : 'bg-white'
                }`}
              >
                {/* JUSTIFICATION ACCENT RARE #3 : Badge d'accroche "Recommandé Génie Civil & Bâtiment" sur le ciment star */}
                {prod.isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#F26A1B] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow">
                    Recommandé Génie Civil & Bâtiment
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-extrabold text-[#0B1F3A] font-playfair">
                      {prod.shortGrade}
                    </span>
                    <span className="text-xs font-bold bg-[#DCFCE7] text-[#16A34A] px-2.5 py-1 rounded-full">
                      {prod.resistance28d}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0B1F3A] mb-2">{prod.name}</h3>
                  <p className="text-xs text-slate-500 mb-5 leading-relaxed">{prod.targetUse}</p>

                  <div className="border-t border-slate-100 pt-4 space-y-2.5 text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <CheckCircle size={16} weight="fill" className="text-[#16A34A] shrink-0" />
                      <span><strong>Prise initiale :</strong> {prod.technicalData.initialSet}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <CheckCircle size={16} weight="fill" className="text-[#16A34A] shrink-0" />
                      <span><strong>Finesse Blaine :</strong> {prod.technicalData.blaineFineness}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <CheckCircle size={16} weight="fill" className="text-[#16A34A] shrink-0" />
                      <span><strong>Conditionnement :</strong> Sacs 50kg & Vrac</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={onOpenQuote}
                    className="text-xs font-bold text-[#0131FD] hover:text-[#0026C7] flex items-center gap-1 transition"
                  >
                    <span>Commander ce ciment</span>
                    <ArrowRight size={14} weight="bold" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('products', prod.id)}
                    className="text-xs text-slate-500 hover:text-[#0B1F3A] font-medium"
                  >
                    Fiche technique &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => onNavigate('products')}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#0B1F3A] hover:text-[#0131FD] transition underline underline-offset-4"
            >
              <span>Accéder au tableau comparatif complet et au calculateur de béton</span>
              <ArrowRight size={16} weight="bold" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 4 : GRANDS CHANTIERS & RÉALISATIONS
          Cartes photo (Port Autonome, GDIZ, Massé) + bandeau 50 ponts
         ========================================================= */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Références & Projets Structurants"
            titleBeforeItalic="Nos"
            italicWord="Réalisations"
            titleAfterItalic="au Bénin"
            subtitle="Du Port Autonome de Cotonou à la zone industrielle de Glo-Djigbé, le ciment NOCIBÉ constitue l'ossature des grandes infrastructures béninoises."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {PROJECTS.slice(0, 3).map((proj) => (
              <div
                key={proj.id}
                className="card-nocibe overflow-hidden group flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 select-none">
                    <SafeImage
                      src={proj.image}
                      alt={proj.title}
                      fallbackTitle={proj.title}
                      fallbackCategory={proj.category}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105 pointer-events-none select-none"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-[#0B1F3A]/90 text-white text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                      {proj.category}
                    </div>
                    {proj.chiffreCle && (
                      <div className="absolute bottom-3 right-3 bg-[#0131FD] text-white text-xs font-bold px-3 py-1 rounded-lg shadow">
                        {proj.chiffreCle}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                      <MapPin size={14} weight="fill" className="text-[#0131FD]" />
                      <span>{proj.location}</span>
                    </div>

                    <h3 className="text-base font-bold text-[#0B1F3A] mb-2 leading-snug group-hover:text-[#0131FD] transition">
                      {proj.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0">
                  <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] font-semibold text-[#0B1F3A] flex items-center justify-between">
                    <span>Grade : {proj.cimentUtilise}</span>
                    <span className="text-slate-400">{proj.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bandeau : Plus de 50 ponts, dalots et voies asphaltées */}
          <div className="mt-12 bg-[#0B1F3A] text-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0131FD] text-white flex items-center justify-center shrink-0">
                <IconBridge size={32} />
              </div>
              <div>
                <span className="text-xs uppercase font-bold text-[#0131FD] tracking-wider block">
                  Impact National
                </span>
                <h4 className="text-xl md:text-2xl font-bold font-playfair text-white">
                  Plus de 50 ponts, dalots et voies asphaltées au Bénin
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Une contribution active à la modernisation du réseau routier et des ouvrages d'art.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('projects')}
              className="btn-primary px-6 py-3 text-xs font-bold uppercase tracking-wider shrink-0"
            >
              Voir toutes les réalisations
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 5 : À PROPOS / DIRECTION GÉNÉRALE
          Photo + carte flottante, citation, 2 mini cartes
         ========================================================= */}
      <section className="py-16 sm:py-24 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual with Floating Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
                <img
                  src="/images/batiment-siege-hd.jpg"
                  alt="Direction générale NOCIBÉ à Cotonou"
                  className="w-full h-[440px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/70 via-transparent to-transparent" />
              </div>

              {/* Real Floating Card */}
              <div className="absolute -bottom-6 -right-4 sm:right-6 bg-white p-5 rounded-2xl shadow-2xl border border-slate-200 max-w-xs">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0B1F3A] flex items-center justify-center font-bold text-sm">
                    100%
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0B1F3A] block">Clinker Béninois</span>
                    <span className="text-[11px] text-slate-500">Zéro dépendance d'importation</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 leading-tight">
                  Toute la chaîne, de la roche au sac, est maîtrisée à Massé.
                </p>
              </div>
            </div>

            {/* Content & Citation */}
            <div className="lg:col-span-7 space-y-6">
              <div className="eyebrow text-[#0B1F3A]">
                <span className="w-5 h-[2px] bg-[#0B1F3A] rounded-full inline-block"></span>
                <span>Vision Industrielle & Direction</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold font-playfair text-[#0B1F3A] leading-tight">
                Une industrie au service de la{' '}
                <span className="italic font-normal text-[#0131FD] font-serif">
                  souveraineté
                </span>{' '}
                béninoise
              </h2>

              <blockquote className="border-l-4 border-[#0B1F3A] pl-4 py-1 italic text-slate-700 text-sm md:text-base leading-relaxed bg-white/60 rounded-r-xl">
                « NOCIBÉ est née de la volonté d'offrir au Bénin son autonomie cimentière complète. Chaque sac de ciment qui sort de l'usine de Massé est le garant de structures durables qui résisteront aux décennies futures. »
                <span className="block mt-2 font-bold not-italic text-xs text-[#0B1F3A]">
                  &mdash; La Direction Générale NOCIBÉ
                </span>
              </blockquote>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Mini Card 1 */}
                <div className="card-nocibe p-4 bg-white border-slate-200">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#0B1F3A] flex items-center justify-center mb-3">
                    <IconBeninMap size={22} className="text-[#0B1F3A]" />
                  </div>
                  <h4 className="text-sm font-bold text-[#0B1F3A] mb-1">Souveraineté Économique</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Valorisation de notre calcaire national pour bâtir les ponts, routes et hôpitaux du Bénin.
                  </p>
                </div>

                {/* Mini Card 2 */}
                <div className="card-nocibe p-4 bg-white border-slate-200">
                  <div className="w-9 h-9 rounded-lg bg-green-50 text-[#16A34A] flex items-center justify-center mb-3">
                    <Users size={22} weight="duotone" />
                  </div>
                  <h4 className="text-sm font-bold text-[#0B1F3A] mb-1">Capital Humain Local</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Plus de 95% des ingénieurs, techniciens et opérateurs du site de Massé sont des nationaux.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('history', 'mot-du-directeur')}
                  className="px-6 py-3 rounded-xl bg-[#0131FD] hover:bg-[#0026C7] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm inline-flex items-center gap-2"
                >
                  <span>Lire le Mot du Directeur Général</span>
                  <ArrowRight size={14} weight="bold" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('history')}
                  className="px-6 py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider transition"
                >
                  <span>Notre histoire</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 6 : ACTUALITÉS & VIE DE L'ENTREPRISE (3 cartes)
         ========================================================= */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Actualités & Presse"
            titleBeforeItalic="Dernières"
            italicWord="nouvelles"
            titleAfterItalic="de l'entreprise"
            subtitle="Suivez la vie industrielle, nos engagements environnementaux et le développement du réseau NOCIBÉ."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {NEWS_ARTICLES.slice(0, 3).map((article) => (
              <div
                key={article.id}
                className="card-nocibe overflow-hidden flex flex-col justify-between group cursor-pointer"
                onClick={() => onNavigate('news', article.slug)}
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

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0">
                  <span className="text-xs font-bold text-[#0131FD] flex items-center gap-1 group-hover:underline">
                    Lire l'article complet &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => onNavigate('news')}
              className="px-6 py-3 rounded-xl border border-slate-300 text-xs font-bold text-[#0B1F3A] hover:bg-slate-50 transition"
            >
              Consulter toutes les actualités &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 7 : BANDEAU CTA EN CARTE FLOTTANTE ARRONDIE
          Posée sur fond clair #F5F7FA, séparée du footer par 64-96px
         ========================================================= */}
      <CTA
        onOpenQuote={onOpenQuote}
        onNavigateContact={() => onNavigate('contact')}
      />
    </div>
  );
};

