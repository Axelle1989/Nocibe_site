import React, { useState, useEffect, useRef } from 'react';
import { Logo } from '../ui/Logo';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import {
  List,
  X,
  CaretDown,
  MagnifyingGlass,
  ShoppingCart,
  UserCircle,
  FileText,
  Buildings,
  Factory,
  HardHat,
  ShieldCheck,
  Newspaper,
  Tree,
  MapPinLine,
  EnvelopeSimple,
  Users,
  Scroll,
  ArrowsClockwise,
  SignOut,
  User,
  Briefcase,
  GraduationCap,
  PaperPlaneTilt,
  Quotes,
} from '@phosphor-icons/react';

export type Page = string;
export type NavPage = string;
export type Language = 'fr' | 'en';

export interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string, extra?: string) => void;
  onOpenQuote: () => void;
  onOpenSearch: () => void;
  isAuthenticated?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onOpenQuote,
  onOpenSearch,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { itemCount, setIsCartDrawerOpen } = useCart();
  const { user, profile, signOut } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const desktopNavRef = useRef<HTMLDivElement>(null);
  const [cartPulsing, setCartPulsing] = useState(false);

  useEffect(() => {
    const handleCartPulse = () => {
      setCartPulsing(true);
      setTimeout(() => setCartPulsing(false), 800);
    };
    window.addEventListener('nocibe:cart-pulse', handleCartPulse);
    return () => window.removeEventListener('nocibe:cart-pulse', handleCartPulse);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
        setUserDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (desktopNavRef.current && !desktopNavRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (page: string, extra?: string) => {
    onNavigate(page, extra);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleMobileAccordion = (name: string) => {
    setMobileAccordion(mobileAccordion === name ? null : name);
  };

  const userDisplayName = profile?.prenom || user?.email?.split('@')[0] || 'Client';
  const userInitials = (profile?.prenom?.charAt(0) || user?.email?.charAt(0) || 'C').toUpperCase();

  return (
    <header
      className={`sticky top-0 z-40 bg-white transition-all duration-300 border-b ${
        isScrolled
          ? 'shadow-md border-slate-200/80 h-[72px] lg:h-24'
          : 'border-slate-100 h-[72px] lg:h-24'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-6 h-full flex items-center justify-between gap-1 sm:gap-2 min-w-0">
        {/* Brand Logo (Visible ≥ 80px desktop, ≥ 56px tablet, ≥ 48px mobile) */}
        <Logo variant="header" />

        {/* Desktop Navigation (switches to mobile burger under 1280px to avoid text wrap) */}
        <nav
          ref={desktopNavRef}
          aria-label="Navigation principale"
          className="hidden xl:flex items-center gap-0.5 2xl:gap-1 text-[12px] 2xl:text-[13px] font-semibold text-slate-700 whitespace-nowrap"
        >
          {/* Accueil */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className={`px-1.5 2xl:px-2.5 py-1 2xl:py-1.5 rounded-lg transition whitespace-nowrap ${
              currentPage === 'home'
                ? 'text-[#0B1F3A] bg-slate-100 font-bold'
                : 'hover:text-[#0B1F3A] hover:bg-slate-50'
            }`}
          >
            Accueil
          </button>

          {/* À propos ▾ (clic libellé = /histoire, chevron = sous-menu) */}
          <div
            className="relative flex items-center"
            onMouseEnter={() => setActiveDropdown('about')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              type="button"
              onClick={() => handleNavClick('history')}
              className={`px-1.5 2xl:px-2 py-1 2xl:py-1.5 rounded-l-lg transition whitespace-nowrap ${
                ['history', 'team', 'factory'].includes(currentPage)
                  ? 'text-[#0B1F3A] bg-slate-100 font-bold'
                  : 'hover:text-[#0B1F3A] hover:bg-slate-50'
              }`}
            >
              À propos
            </button>
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'about' ? null : 'about')}
              aria-expanded={activeDropdown === 'about'}
              aria-haspopup="menu"
              aria-label="Sous-menu À propos"
              className={`p-1 2xl:p-1.5 rounded-r-lg transition ${
                activeDropdown === 'about' ? 'text-[#0131FD] bg-slate-100' : 'text-slate-500 hover:text-[#0B1F3A] hover:bg-slate-50'
              }`}
            >
              <CaretDown size={11} weight="bold" className={activeDropdown === 'about' ? 'rotate-180 text-[#0131FD]' : ''} />
            </button>

            {activeDropdown === 'about' && (
              <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={() => handleNavClick('history')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-3 group transition"
                >
                  <Scroll size={18} className="text-[#0B1F3A] group-hover:text-[#0131FD]" />
                  <div>
                    <div className="text-xs font-bold text-[#0B1F3A] group-hover:text-[#0131FD]">Notre histoire</div>
                    <div className="text-[11px] text-slate-500">De 2013 à nos jours & Mot du DG</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('team')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-3 group transition"
                >
                  <Users size={18} className="text-[#0B1F3A] group-hover:text-[#0131FD]" />
                  <div>
                    <div className="text-xs font-bold text-[#0B1F3A] group-hover:text-[#0131FD]">Notre équipe</div>
                    <div className="text-[11px] text-slate-500">Direction, Missions & Valeurs</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('factory')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-3 group transition"
                >
                  <Factory size={18} className="text-[#0B1F3A] group-hover:text-[#0131FD]" />
                  <div>
                    <div className="text-xs font-bold text-[#0B1F3A] group-hover:text-[#0131FD]">L'usine de Massé</div>
                    <div className="text-[11px] text-slate-500">Four à 1 450 °C & Laboratoire</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Produits ▾ (clic libellé = /produits, chevron = sous-menu) */}
          <div
            className="relative flex items-center"
            onMouseEnter={() => setActiveDropdown('products')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              type="button"
              onClick={() => handleNavClick('products')}
              className={`px-1.5 2xl:px-2 py-1 2xl:py-1.5 rounded-l-lg transition whitespace-nowrap ${
                ['products', 'product-detail'].includes(currentPage)
                  ? 'text-[#0B1F3A] bg-slate-100 font-bold'
                  : 'hover:text-[#0B1F3A] hover:bg-slate-50'
              }`}
            >
              Produits
            </button>
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'products' ? null : 'products')}
              aria-expanded={activeDropdown === 'products'}
              aria-haspopup="menu"
              aria-label="Sous-menu Produits"
              className={`p-1 2xl:p-1.5 rounded-r-lg transition ${
                activeDropdown === 'products' ? 'text-[#0131FD] bg-slate-100' : 'text-slate-500 hover:text-[#0B1F3A] hover:bg-slate-50'
              }`}
            >
              <CaretDown size={11} weight="bold" className={activeDropdown === 'products' ? 'rotate-180 text-[#0131FD]' : ''} />
            </button>

            {activeDropdown === 'products' && (
              <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={() => handleNavClick('products')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-3 group transition"
                >
                  <ShieldCheck size={18} className="text-[#0B1F3A] group-hover:text-[#0131FD]" />
                  <div>
                    <div className="text-xs font-bold text-[#0B1F3A] group-hover:text-[#0131FD]">Notre gamme</div>
                    <div className="text-[11px] text-slate-500">CPJ 35, CPJ 45, CPA 55, Vrac</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('specs')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-3 group transition"
                >
                  <FileText size={18} className="text-[#0B1F3A] group-hover:text-[#0131FD]" />
                  <div>
                    <div className="text-xs font-bold text-[#0B1F3A] group-hover:text-[#0131FD]">Spécifications techniques</div>
                    <div className="text-[11px] text-slate-500">Tableau comparatif & Fiches PDF</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Nos réalisations (remplace « Nos clients ») */}
          <button
            type="button"
            onClick={() => handleNavClick('realisations')}
            className={`px-1.5 2xl:px-2.5 py-1 2xl:py-1.5 rounded-lg transition whitespace-nowrap ${
              currentPage === 'realisations'
                ? 'text-[#0B1F3A] bg-slate-100 font-bold'
                : 'hover:text-[#0B1F3A] hover:bg-slate-50'
            }`}
          >
            Nos réalisations
          </button>

          {/* Engagement ▾ (clic libellé = /objectifs-2030, chevron = sous-menu) */}
          <div
            className="relative flex items-center"
            onMouseEnter={() => setActiveDropdown('engagement')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              type="button"
              onClick={() => handleNavClick('objectifs-2030')}
              className={`px-1.5 2xl:px-2 py-1 2xl:py-1.5 rounded-l-lg transition whitespace-nowrap ${
                ['objectifs-2030', 'securite-qualite'].includes(currentPage)
                  ? 'text-[#0131FD] bg-[#EBF3FF] font-bold'
                  : 'hover:text-[#0131FD] hover:bg-slate-50'
              }`}
            >
              Engagement
            </button>
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'engagement' ? null : 'engagement')}
              aria-expanded={activeDropdown === 'engagement'}
              aria-haspopup="menu"
              aria-label="Sous-menu Engagement"
              className={`p-1 2xl:p-1.5 rounded-r-lg transition ${
                activeDropdown === 'engagement' ? 'text-[#0131FD] bg-[#EBF3FF]' : 'text-slate-500 hover:text-[#0131FD] hover:bg-slate-50'
              }`}
            >
              <CaretDown size={11} weight="bold" className={activeDropdown === 'engagement' ? 'rotate-180 text-[#0131FD]' : ''} />
            </button>

            {activeDropdown === 'engagement' && (
              <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={() => handleNavClick('objectifs-2030')}
                  className={`w-full text-left p-2.5 rounded-xl flex items-center gap-3 group transition ${
                    currentPage === 'objectifs-2030' ? 'bg-[#EBF3FF] text-[#0131FD]' : 'hover:bg-slate-50'
                  }`}
                >
                  <ArrowsClockwise size={18} className="text-[#0131FD]" />
                  <div>
                    <div className="text-xs font-bold text-[#0B1F3A] group-hover:text-[#0131FD]">Objectifs 2030</div>
                    <div className="text-[11px] text-slate-500">Jauges & Décarbonation</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('sustainability')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-3 group transition"
                >
                  <Tree size={18} className="text-[#0131FD]" />
                  <div>
                    <div className="text-xs font-bold text-[#0B1F3A] group-hover:text-[#0131FD]">Actions de terrain</div>
                    <div className="text-[11px] text-slate-500">Reboisement & Forages Massé</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('securite-qualite')}
                  className={`w-full text-left p-2.5 rounded-xl flex items-center gap-3 group transition ${
                    currentPage === 'securite-qualite' ? 'bg-[#EBF3FF] text-[#0131FD]' : 'hover:bg-slate-50'
                  }`}
                >
                  <ShieldCheck size={18} className="text-[#0131FD]" />
                  <div>
                    <div className="text-xs font-bold text-[#0B1F3A] group-hover:text-[#0131FD]">Sécurité & qualité</div>
                    <div className="text-[11px] text-slate-500">Zéro accident & Norme EN 197-1</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Carrières ▾ (clic libellé = /carrieres, chevron = sous-menu) */}
          <div
            className="relative flex items-center"
            onMouseEnter={() => setActiveDropdown('careers')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              type="button"
              onClick={() => handleNavClick('careers')}
              className={`px-1.5 2xl:px-2 py-1 2xl:py-1.5 rounded-l-lg transition whitespace-nowrap ${
                ['careers', 'job-offers', 'internships', 'apply'].includes(currentPage)
                  ? 'text-[#0B1F3A] bg-slate-100 font-bold'
                  : 'hover:text-[#0B1F3A] hover:bg-slate-50'
              }`}
            >
              Carrières
            </button>
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'careers' ? null : 'careers')}
              aria-expanded={activeDropdown === 'careers'}
              aria-haspopup="menu"
              aria-label="Sous-menu Carrières"
              className={`p-1 2xl:p-1.5 rounded-r-lg transition ${
                activeDropdown === 'careers' ? 'text-[#0131FD] bg-slate-100' : 'text-slate-500 hover:text-[#0B1F3A] hover:bg-slate-50'
              }`}
            >
              <CaretDown size={11} weight="bold" className={activeDropdown === 'careers' ? 'rotate-180 text-[#0131FD]' : ''} />
            </button>

            {activeDropdown === 'careers' && (
              <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={() => handleNavClick('careers')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-3 group transition"
                >
                  <Briefcase size={18} className="text-[#0B1F3A] group-hover:text-[#0131FD]" />
                  <div>
                    <div className="text-xs font-bold text-[#0B1F3A] group-hover:text-[#0131FD]">Hub Carrières</div>
                    <div className="text-[11px] text-slate-500">Chiffres RH & culture</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('job-offers')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-3 group transition"
                >
                  <HardHat size={18} className="text-[#0B1F3A] group-hover:text-[#0131FD]" />
                  <div>
                    <div className="text-xs font-bold text-[#0B1F3A] group-hover:text-[#0131FD]">Offres d'emploi</div>
                    <div className="text-[11px] text-slate-500">Postes en CDI / CDD</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('internships')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-3 group transition"
                >
                  <GraduationCap size={18} className="text-[#0B1F3A] group-hover:text-[#0131FD]" />
                  <div>
                    <div className="text-xs font-bold text-[#0B1F3A] group-hover:text-[#0131FD]">Stages & Étudiants</div>
                    <div className="text-[11px] text-slate-500">PFE & Stages tremplin</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('apply')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-3 group transition"
                >
                  <PaperPlaneTilt size={18} className="text-[#0B1F3A] group-hover:text-[#0131FD]" />
                  <div>
                    <div className="text-xs font-bold text-[#0B1F3A] group-hover:text-[#0131FD]">Candidature spontanée</div>
                    <div className="text-[11px] text-slate-500">Rejoindre le vivier talents</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Actualités ▾ (clic libellé = /actualites, chevron = sous-menu) */}
          <div
            className="relative flex items-center"
            onMouseEnter={() => setActiveDropdown('news')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              type="button"
              onClick={() => handleNavClick('news')}
              className={`px-1.5 2xl:px-2 py-1 2xl:py-1.5 rounded-l-lg transition whitespace-nowrap ${
                ['news', 'communiques', 'events'].includes(currentPage)
                  ? 'text-[#0B1F3A] bg-slate-100 font-bold'
                  : 'hover:text-[#0B1F3A] hover:bg-slate-50'
              }`}
            >
              Actualités
            </button>
            <button
              type="button"
              onClick={() => setActiveDropdown(activeDropdown === 'news' ? null : 'news')}
              aria-expanded={activeDropdown === 'news'}
              aria-haspopup="menu"
              aria-label="Sous-menu Actualités"
              className={`p-1 2xl:p-1.5 rounded-r-lg transition ${
                activeDropdown === 'news' ? 'text-[#0131FD] bg-slate-100' : 'text-slate-500 hover:text-[#0B1F3A] hover:bg-slate-50'
              }`}
            >
              <CaretDown size={11} weight="bold" className={activeDropdown === 'news' ? 'rotate-180 text-[#0131FD]' : ''} />
            </button>

            {activeDropdown === 'news' && (
              <div className="absolute top-full left-0 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={() => handleNavClick('news')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-3 group transition"
                >
                  <Newspaper size={18} className="text-[#0B1F3A] group-hover:text-[#0131FD]" />
                  <div>
                    <div className="text-xs font-bold text-[#0B1F3A] group-hover:text-[#0131FD]">Dernières actualités</div>
                    <div className="text-[11px] text-slate-500">Vie de l'entreprise</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('communiques')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-3 group transition"
                >
                  <FileText size={18} className="text-[#0B1F3A] group-hover:text-[#0131FD]" />
                  <div>
                    <div className="text-xs font-bold text-[#0B1F3A] group-hover:text-[#0131FD]">Communiqués officiels</div>
                    <div className="text-[11px] text-slate-500">Notes & déclarations</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('events')}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-3 group transition"
                >
                  <HardHat size={18} className="text-[#0B1F3A] group-hover:text-[#0131FD]" />
                  <div>
                    <div className="text-xs font-bold text-[#0B1F3A] group-hover:text-[#0131FD]">Événements</div>
                    <div className="text-[11px] text-slate-500">Salons & Rencontres</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Où acheter */}
          <button
            type="button"
            onClick={() => handleNavClick('outlets')}
            className={`px-1.5 2xl:px-2.5 py-1 2xl:py-1.5 rounded-lg transition whitespace-nowrap ${
              currentPage === 'outlets'
                ? 'text-[#0B1F3A] bg-slate-100 font-bold'
                : 'hover:text-[#0B1F3A] hover:bg-slate-50'
            }`}
          >
            Où acheter
          </button>

          {/* Contact */}
          <button
            type="button"
            onClick={() => handleNavClick('contact')}
            className={`px-1.5 2xl:px-2.5 py-1 2xl:py-1.5 rounded-lg transition whitespace-nowrap ${
              currentPage === 'contact'
                ? 'text-[#0B1F3A] bg-slate-100 font-bold'
                : 'hover:text-[#0B1F3A] hover:bg-slate-50'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Right Action Utilities (Search, Cart, Client Auth, CTA Devis, Burger) */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Client-side Search Icon (desktop & tablet, available inside drawer on mobile) */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="hidden sm:flex p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-[#0B1F3A] hover:bg-slate-100 transition"
            title="Rechercher sur le site"
          >
            <MagnifyingGlass size={18} weight="bold" />
          </button>

          {/* Shopping Cart Icon with animated pulse & brand blue badge */}
          <button
            type="button"
            onClick={() => setIsCartDrawerOpen(true)}
            className={`relative p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-[#0B1F3A] hover:bg-slate-100 transition-all duration-300 ${
              cartPulsing ? 'scale-115 ring-2 ring-[#0131FD] bg-[#EBF3FF] text-[#0131FD]' : ''
            }`}
            title="Mon panier"
          >
            <ShoppingCart size={18} weight="bold" />
            {itemCount > 0 && (
              <span className={`absolute -top-1 -right-1 w-4.5 h-4.5 bg-[#0131FD] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow transition-transform ${
                cartPulsing ? 'scale-125' : ''
              }`}>
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>

          {/* Real Auth Status Area */}
          {user ? (
            /* Connected: User Pill with Avatar & Dropdown */
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#0B1F3A] transition"
              >
                <div className="w-6 h-6 rounded-full bg-[#0B1F3A] text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                  {userInitials}
                </div>
                <span className="hidden md:inline max-w-[80px] truncate">{userDisplayName}</span>
                <CaretDown size={11} weight="bold" className={userDropdownOpen ? 'rotate-180' : ''} />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-[#0B1F3A] truncate">
                      {profile?.prenom ? `${profile.prenom} ${profile.nom}` : user.email}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNavClick('espace-client')}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 transition"
                  >
                    <UserCircle size={16} className="text-[#0B1F3A]" />
                    <span>Mon espace client</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavClick('espace-client', 'commandes')}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 transition"
                  >
                    <ShoppingCart size={16} className="text-[#0B1F3A]" />
                    <span>Mes commandes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavClick('espace-client', 'profil')}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 transition"
                  >
                    <User size={16} className="text-[#0B1F3A]" />
                    <span>Mon profil</span>
                  </button>
                  <div className="border-t border-slate-100 my-1" />
                  <button
                    type="button"
                    onClick={async () => {
                      setUserDropdownOpen(false);
                      await signOut();
                      handleNavClick('home');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-rose-50 text-rose-600 flex items-center gap-2.5 transition"
                  >
                    <SignOut size={16} />
                    <span>Se déconnecter</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Disconnected: Distinct "Se connecter" (outline) and "S'inscrire" (filled) on desktop */
            <div className="hidden lg:flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleNavClick('espace-client', 'connexion')}
                className="px-2 py-1 rounded-lg text-xs font-bold border border-[#0B1F3A] text-[#0B1F3A] hover:bg-slate-50 transition whitespace-nowrap"
              >
                Se connecter
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('espace-client', 'inscription')}
                className="hidden 2xl:inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0B1F3A] text-white hover:bg-[#132A4C] transition whitespace-nowrap"
              >
                S'inscrire
              </button>
            </div>
          )}

          {/* Brand Blue B2B Quote Button (Primary Conversion CTA) */}
          <button
            type="button"
            onClick={onOpenQuote}
            className="hidden sm:inline-flex btn-primary px-2.5 2xl:px-3 py-1 2xl:py-1.5 text-[11px] 2xl:text-xs font-bold uppercase tracking-wider shadow-sm items-center gap-1 whitespace-nowrap"
          >
            <FileText size={14} weight="bold" />
            <span className="hidden 2xl:inline">Demander un devis B2B</span>
            <span className="2xl:hidden">Devis B2B</span>
          </button>

          {/* Mobile Hamburger Button (visible under 1280px / xl) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-1.5 sm:p-2 rounded-xl border border-slate-200 text-[#0B1F3A] hover:bg-slate-100 transition ml-0.5"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation with Collapsible Accordions */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 top-[72px] lg:top-24 z-50 bg-[#0B1F3A]/70 backdrop-blur-sm flex justify-end">
          <div className="w-5/6 max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Navigation
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X size={20} weight="bold" />
                </button>
              </div>

              {/* Mobile Search Button */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSearch();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 flex items-center gap-2 hover:bg-slate-100 transition"
              >
                <MagnifyingGlass size={16} className="text-[#0B1F3A]" />
                <span>Rechercher un produit, une fiche...</span>
              </button>

              {/* Accordions */}
              <div className="space-y-1 text-sm font-semibold text-slate-800">
                <button
                  type="button"
                  onClick={() => handleNavClick('home')}
                  className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-slate-100"
                >
                  Accueil
                </button>

                {/* À propos Accordion (clic libellé = /histoire, chevron = accordéon) */}
                <div>
                  <div className="flex items-center justify-between rounded-xl hover:bg-slate-100 pr-2">
                    <button
                      type="button"
                      onClick={() => handleNavClick('history')}
                      className={`flex-1 text-left py-2.5 px-3 ${['history', 'team', 'factory'].includes(currentPage) ? 'text-[#0131FD] font-bold' : ''}`}
                    >
                      À propos
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMobileAccordion('about');
                      }}
                      aria-expanded={mobileAccordion === 'about'}
                      aria-label="Ouvrir le sous-menu À propos"
                      className="p-2 text-slate-500 hover:text-[#0131FD]"
                    >
                      <CaretDown size={14} className={mobileAccordion === 'about' ? 'rotate-180 text-[#0131FD]' : ''} />
                    </button>
                  </div>
                  {mobileAccordion === 'about' && (
                    <div className="pl-6 py-1 space-y-1 text-xs text-slate-600 bg-slate-50 rounded-xl">
                      <button onClick={() => handleNavClick('history')} className="w-full text-left py-2 hover:text-[#0131FD]">Notre histoire & Mot du DG</button>
                      <button onClick={() => handleNavClick('team')} className="w-full text-left py-2 hover:text-[#0131FD]">Notre équipe & Valeurs</button>
                      <button onClick={() => handleNavClick('factory')} className="w-full text-left py-2 hover:text-[#0131FD]">L'usine de Massé (1450°C)</button>
                    </div>
                  )}
                </div>

                {/* Produits Accordion (clic libellé = /produits, chevron = accordéon) */}
                <div>
                  <div className="flex items-center justify-between rounded-xl hover:bg-slate-100 pr-2">
                    <button
                      type="button"
                      onClick={() => handleNavClick('products')}
                      className={`flex-1 text-left py-2.5 px-3 ${['products', 'product-detail'].includes(currentPage) ? 'text-[#0131FD] font-bold' : ''}`}
                    >
                      Produits
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMobileAccordion('products');
                      }}
                      aria-expanded={mobileAccordion === 'products'}
                      aria-label="Ouvrir le sous-menu Produits"
                      className="p-2 text-slate-500 hover:text-[#0131FD]"
                    >
                      <CaretDown size={14} className={mobileAccordion === 'products' ? 'rotate-180 text-[#0131FD]' : ''} />
                    </button>
                  </div>
                  {mobileAccordion === 'products' && (
                    <div className="pl-6 py-1 space-y-1 text-xs text-slate-600 bg-slate-50 rounded-xl">
                      <button onClick={() => handleNavClick('products')} className="w-full text-left py-2 hover:text-[#0131FD]">Notre gamme de ciments</button>
                      <button onClick={() => handleNavClick('specs')} className="w-full text-left py-2 hover:text-[#0131FD]">Spécifications techniques</button>
                    </div>
                  )}
                </div>

                {/* Nos réalisations (remplace « Nos clients ») */}
                <button
                  type="button"
                  onClick={() => handleNavClick('realisations')}
                  className={`w-full text-left py-2.5 px-3 rounded-xl hover:bg-slate-100 ${currentPage === 'realisations' ? 'text-[#0131FD] font-bold' : ''}`}
                >
                  Nos réalisations
                </button>

                {/* Engagement Accordion (clic libellé = /objectifs-2030, chevron = accordéon) */}
                <div>
                  <div className="flex items-center justify-between rounded-xl hover:bg-slate-100 pr-2">
                    <button
                      type="button"
                      onClick={() => handleNavClick('objectifs-2030')}
                      className={`flex-1 text-left py-2.5 px-3 ${['objectifs-2030', 'securite-qualite'].includes(currentPage) ? 'text-[#0131FD] font-bold' : ''}`}
                    >
                      Engagement
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMobileAccordion('engagement');
                      }}
                      aria-expanded={mobileAccordion === 'engagement'}
                      aria-label="Ouvrir le sous-menu Engagement"
                      className="p-2 text-slate-500 hover:text-[#0131FD]"
                    >
                      <CaretDown size={14} className={mobileAccordion === 'engagement' ? 'rotate-180 text-[#0131FD]' : ''} />
                    </button>
                  </div>
                  {mobileAccordion === 'engagement' && (
                    <div className="pl-6 py-1 space-y-1 text-xs text-slate-600 bg-slate-50 rounded-xl">
                      <button onClick={() => handleNavClick('objectifs-2030')} className="w-full text-left py-2 hover:text-[#0131FD]">Objectifs 2030 & Jauges</button>
                      <button onClick={() => handleNavClick('sustainability')} className="w-full text-left py-2 hover:text-[#0131FD]">Actions de terrain & Reboisement</button>
                      <button onClick={() => handleNavClick('securite-qualite')} className="w-full text-left py-2 hover:text-[#0131FD]">Sécurité & Qualité ISO</button>
                    </div>
                  )}
                </div>

                {/* Carrières Accordion (clic libellé = /carrieres, chevron = accordéon) */}
                <div>
                  <div className="flex items-center justify-between rounded-xl hover:bg-slate-100 pr-2">
                    <button
                      type="button"
                      onClick={() => handleNavClick('careers')}
                      className={`flex-1 text-left py-2.5 px-3 ${['careers', 'job-offers', 'internships', 'apply'].includes(currentPage) ? 'text-[#0131FD] font-bold' : ''}`}
                    >
                      Carrières
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMobileAccordion('careers');
                      }}
                      aria-expanded={mobileAccordion === 'careers'}
                      aria-label="Ouvrir le sous-menu Carrières"
                      className="p-2 text-slate-500 hover:text-[#0131FD]"
                    >
                      <CaretDown size={14} className={mobileAccordion === 'careers' ? 'rotate-180 text-[#0131FD]' : ''} />
                    </button>
                  </div>
                  {mobileAccordion === 'careers' && (
                    <div className="pl-6 py-1 space-y-1 text-xs text-slate-600 bg-slate-50 rounded-xl">
                      <button onClick={() => handleNavClick('careers')} className="w-full text-left py-2 hover:text-[#0131FD]">Hub Carrières & Chiffres RH</button>
                      <button onClick={() => handleNavClick('job-offers')} className="w-full text-left py-2 hover:text-[#0131FD]">Offres d'emploi</button>
                      <button onClick={() => handleNavClick('internships')} className="w-full text-left py-2 hover:text-[#0131FD]">Stages & Étudiants</button>
                      <button onClick={() => handleNavClick('apply')} className="w-full text-left py-2 hover:text-[#0131FD]">Candidature spontanée</button>
                    </div>
                  )}
                </div>

                {/* Actualités Accordion (clic libellé = /actualites, chevron = accordéon) */}
                <div>
                  <div className="flex items-center justify-between rounded-xl hover:bg-slate-100 pr-2">
                    <button
                      type="button"
                      onClick={() => handleNavClick('news')}
                      className={`flex-1 text-left py-2.5 px-3 ${['news', 'communiques', 'events'].includes(currentPage) ? 'text-[#0131FD] font-bold' : ''}`}
                    >
                      Actualités
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMobileAccordion('news');
                      }}
                      aria-expanded={mobileAccordion === 'news'}
                      aria-label="Ouvrir le sous-menu Actualités"
                      className="p-2 text-slate-500 hover:text-[#0131FD]"
                    >
                      <CaretDown size={14} className={mobileAccordion === 'news' ? 'rotate-180 text-[#0131FD]' : ''} />
                    </button>
                  </div>
                  {mobileAccordion === 'news' && (
                    <div className="pl-6 py-1 space-y-1 text-xs text-slate-600 bg-slate-50 rounded-xl">
                      <button onClick={() => handleNavClick('news')} className="w-full text-left py-2 hover:text-[#0131FD]">Dernières actualités</button>
                      <button onClick={() => handleNavClick('communiques')} className="w-full text-left py-2 hover:text-[#0131FD]">Communiqués officiels</button>
                      <button onClick={() => handleNavClick('events')} className="w-full text-left py-2 hover:text-[#0131FD]">Événements & Agenda</button>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleNavClick('outlets')}
                  className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-slate-100"
                >
                  Où acheter
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick('contact')}
                  className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-slate-100"
                >
                  Contact
                </button>
              </div>

              {/* Mobile Auth Drawer Section */}
              <div className="pt-4 border-t border-slate-100">
                {user ? (
                  <div className="space-y-2">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-xs font-bold text-[#0B1F3A]">
                        {profile?.prenom ? `${profile.prenom} ${profile.nom}` : user.email}
                      </p>
                      <span className="text-[11px] text-slate-500 block truncate">{user.email}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNavClick('espace-client')}
                      className="w-full text-left py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                    >
                      <UserCircle size={16} className="text-[#0B1F3A]" />
                      <span>Mon espace client</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNavClick('espace-client', 'commandes')}
                      className="w-full text-left py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                    >
                      <ShoppingCart size={16} className="text-[#0B1F3A]" />
                      <span>Mes commandes</span>
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        setMobileMenuOpen(false);
                        await signOut();
                      }}
                      className="w-full text-left py-2 px-3 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <SignOut size={16} />
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleNavClick('espace-client', 'connexion')}
                      className="py-2.5 px-3 text-center rounded-xl text-xs font-bold border border-[#0B1F3A] text-[#0B1F3A] hover:bg-slate-50"
                    >
                      Se connecter
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNavClick('espace-client', 'inscription')}
                      className="py-2.5 px-3 text-center rounded-xl text-xs font-bold bg-[#0B1F3A] text-white hover:bg-[#132A4C]"
                    >
                      S'inscrire
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuote();
                }}
                className="w-full btn-primary py-3.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
              >
                <FileText size={18} weight="bold" />
                <span>Demander un devis B2B</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
