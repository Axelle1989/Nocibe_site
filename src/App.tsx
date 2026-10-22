import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, useParams, Outlet, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { RequireAuth, RequireVerifiedUser, RequireAdmin } from './components/auth/RequireAuth';
import { ScrollProgress } from './components/motion/ScrollProgress';

// Layouts
import { TopBar } from './components/layout/TopBar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { FloatingActions } from './components/ui/FloatingActions';
import { QuoteWizard } from './components/ui/QuoteWizard';
import { SearchModal } from './components/ui/SearchModal';
import { CartDrawer } from './components/ui/CartDrawer';
import { ClientLayout } from './pages/client/ClientLayout';
import { AdminLayout } from './pages/admin/AdminLayout';

// Public Showcase Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { FactoryPage } from './pages/FactoryPage';
import { HistoryPage } from './pages/HistoryPage';
import { TeamPage } from './pages/TeamPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { Goals2030Page } from './pages/Goals2030Page';
import { SafetyQualityPage } from './pages/SafetyQualityPage';
import { NewsPage } from './pages/NewsPage';
import { OutletsPage } from './pages/OutletsPage';
import { ContactPage } from './pages/ContactPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { LegalPage } from './pages/LegalPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Careers & Talents Pages
import { CareersPage } from './pages/careers/CareersPage';
import { JobOffersPage } from './pages/careers/JobOffersPage';
import { JobDetailPage } from './pages/careers/JobDetailPage';
import { InternshipsPage } from './pages/careers/InternshipsPage';
import { ApplyPage } from './pages/careers/ApplyPage';

// News, Communiques & Events Pages
import { CommuniquesPage } from './pages/news/CommuniquesPage';
import { CommuniqueDetailPage } from './pages/news/CommuniqueDetailPage';
import { EventsPage } from './pages/news/EventsPage';
import { EventDetailPage } from './pages/news/EventDetailPage';

// Client Portal Pages
import { ClientLoginPage } from './pages/client/ClientLoginPage';
import { ClientRegisterPage } from './pages/client/ClientRegisterPage';
import { ClientVerifyEmailPage } from './pages/client/ClientVerifyEmailPage';
import { ClientForgotPasswordPage } from './pages/client/ClientForgotPasswordPage';
import { ClientResetPasswordPage } from './pages/client/ClientResetPasswordPage';
import { ClientDashboardPage } from './pages/client/ClientDashboardPage';
import { ClientOrdersPage } from './pages/client/ClientOrdersPage';
import { ClientOrderDetailPage } from './pages/client/ClientOrderDetailPage';
import { ClientNewsPage } from './pages/client/ClientNewsPage';
import { ClientNotificationsPage } from './pages/client/ClientNotificationsPage';
import { ClientProfilePage } from './pages/client/ClientProfilePage';

// Admin Portal Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminContentPage } from './pages/admin/AdminContentPage';
import { AdminCareersPage } from './pages/admin/AdminCareersPage';

// Public Layout Wrapper
function PublicLayout({ onOpenQuote }: { onOpenQuote: (productId?: string) => void }) {
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const { isCartDrawerOpen, setIsCartDrawerOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [location.pathname, location.hash]);

  const getPageKey = (path: string): string => {
    if (path === '/' || path === '') return 'home';
    if (path.startsWith('/produits')) return 'products';
    if (path.startsWith('/usine-masse')) return 'factory';
    if (path.startsWith('/histoire')) return 'history';
    if (path.startsWith('/equipe-direction')) return 'team';
    if (path.startsWith('/realisations')) return 'realisations';
    if (path.startsWith('/objectifs-2030')) return 'objectifs-2030';
    if (path.startsWith('/securite-qualite')) return 'securite-qualite';
    if (path.startsWith('/carrieres/offres')) return 'job-offers';
    if (path.startsWith('/carrieres/stages')) return 'internships';
    if (path.startsWith('/carrieres/postuler')) return 'apply';
    if (path.startsWith('/carrieres')) return 'careers';
    if (path.startsWith('/actualites/communiques')) return 'communiques';
    if (path.startsWith('/actualites/evenements')) return 'events';
    if (path.startsWith('/actualites')) return 'news';
    if (path.startsWith('/points-de-vente')) return 'outlets';
    if (path.startsWith('/contact')) return 'contact';
    if (path.startsWith('/panier')) return 'panier';
    return '';
  };

  const currentPage = getPageKey(location.pathname);

  const handleNavigate = (page: string, extra?: string) => {
    switch (page) {
      case 'home':
        navigate('/');
        break;
      case 'products':
        navigate('/produits');
        break;
      case 'product-detail':
        navigate(`/produits/${extra || 'ciment-nocibe-cpj-45'}`);
        break;
      case 'specs':
        navigate('/produits#specifications');
        break;
      case 'factory':
      case 'fabrication':
        navigate('/usine-masse');
        break;
      case 'history':
        navigate(extra ? `/histoire#${extra}` : '/histoire');
        break;
      case 'mot-du-directeur':
        navigate('/histoire#mot-du-directeur');
        break;
      case 'team':
        navigate('/equipe-direction');
        break;
      case 'values':
        navigate('/equipe-direction#valeurs');
        break;
      case 'projects':
      case 'realisations':
      case 'clients':
      case 'partners':
        navigate('/realisations');
        break;
      case 'sustainability':
      case 'developpement-durable':
        navigate('/objectifs-2030#developpement-durable');
        break;
      case 'objectifs-2030':
        navigate('/objectifs-2030');
        break;
      case 'securite-qualite':
      case 'security-quality':
        navigate('/securite-qualite');
        break;
      case 'careers':
        navigate('/carrieres');
        break;
      case 'job-offers':
        navigate('/carrieres/offres');
        break;
      case 'internships':
        navigate('/carrieres/stages');
        break;
      case 'apply':
        navigate('/carrieres/postuler');
        break;
      case 'communiques':
        navigate('/actualites/communiques');
        break;
      case 'events':
        navigate('/actualites/evenements');
        break;
      case 'news':
        navigate(extra ? `/actualites/${extra}` : '/actualites');
        break;
      case 'outlets':
        navigate('/points-de-vente');
        break;
      case 'contact':
        navigate('/contact');
        break;
      case 'panier':
        navigate('/panier');
        break;
      case 'legal':
        navigate('/mentions-legales');
        break;
      case 'privacy':
        navigate('/politique-confidentialite');
        break;
      case 'espace-client':
        navigate(extra ? `/espace-client/${extra}` : '/espace-client');
        break;
      case 'admin':
        navigate('/admin');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0F172A] selection:bg-[#0131FD] selection:text-white relative font-sans">
      {/* Barre de progression de lecture globale */}
      <ScrollProgress />

      <TopBar
        language={language}
        onToggleLanguage={() => setLanguage((prev) => (prev === 'fr' ? 'en' : 'fr'))}
      />
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenQuote={() => onOpenQuote()}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      <main className="flex-1 w-full pb-20 md:pb-0 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex-1 flex flex-col"
          >
            <Outlet context={{ handleNavigate, onOpenQuote }} />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer
        onNavigate={handleNavigate}
        onOpenQuote={() => onOpenQuote()}
      />

      <FloatingActions onOpenQuote={() => onOpenQuote()} />

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onNavigate={handleNavigate}
      />

      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        onGoToCart={() => navigate('/panier')}
        onGoToCheckout={() => navigate('/commande')}
      />
    </div>
  );
}

// Router adapter helpers
function ProductDetailRouteWrapper({ onOpenQuote }: { onOpenQuote: (id: string) => void }) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  return (
    <ProductDetailPage
      slug={slug || 'ciment-nocibe-cpj-45'}
      onBackToProducts={() => navigate('/produits')}
      onSelectProduct={(newSlug) => navigate(`/produits/${newSlug}`)}
      onOpenQuote={onOpenQuote}
    />
  );
}

function NewsRouteWrapper({ onOpenQuote }: { onOpenQuote: () => void }) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  return (
    <NewsPage
      currentSlug={slug}
      onSelectArticle={(s) => navigate(`/actualites/${s}`)}
      onBackToList={() => navigate('/actualites')}
      onOpenQuote={onOpenQuote}
    />
  );
}

function HomeRouteWrapper({ onOpenQuote }: { onOpenQuote: () => void }) {
  const navigate = useNavigate();
  return (
    <HomePage
      onNavigate={(page, extra) => {
        if (page === 'products') navigate('/produits');
        else if (page === 'contact') navigate('/contact');
        else if (page === 'factory') navigate('/usine-masse');
        else if (page === 'specs') navigate('/produits#specifications');
        else if (page === 'projects' || page === 'realisations') navigate('/realisations');
        else if (page === 'news') navigate(extra ? `/actualites/${extra}` : '/actualites');
        else if (page === 'outlets') navigate('/points-de-vente');
        else navigate('/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      onOpenQuote={onOpenQuote}
    />
  );
}

function ProductsRouteWrapper({ onOpenQuote }: { onOpenQuote: (id?: string) => void }) {
  const navigate = useNavigate();
  return (
    <ProductsPage
      onViewProductDetail={(slug) => navigate(`/produits/${slug}`)}
      onOpenQuoteWithProduct={(prodId) => onOpenQuote(prodId)}
    />
  );
}

function CartRouteWrapper() {
  const navigate = useNavigate();
  return (
    <CartPage
      onBackToProducts={() => navigate('/produits')}
      onProceedToCheckout={() => navigate('/commande')}
    />
  );
}

function NotFoundRouteWrapper() {
  const navigate = useNavigate();
  return <NotFoundPage onGoHome={() => navigate('/')} />;
}

export function App() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteInitialProduct, setQuoteInitialProduct] = useState('cpj-45');

  const handleOpenQuote = (productId?: string) => {
    if (productId) setQuoteInitialProduct(productId);
    setQuoteModalOpen(true);
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* 1. PUBLIC MARKETING SHOWCASE (Layout with Header + Footer) */}
            <Route element={<PublicLayout onOpenQuote={handleOpenQuote} />}>
              <Route path="/" element={<HomeRouteWrapper onOpenQuote={() => handleOpenQuote()} />} />
              <Route path="/produits" element={<ProductsRouteWrapper onOpenQuote={handleOpenQuote} />} />
              <Route path="/produits/:slug" element={<ProductDetailRouteWrapper onOpenQuote={handleOpenQuote} />} />
              <Route path="/usine-masse" element={<FactoryPage onOpenQuote={() => handleOpenQuote()} />} />
              <Route path="/histoire" element={<HistoryPage />} />
              <Route path="/equipe-direction" element={<TeamPage />} />
              <Route path="/realisations" element={<ProjectsPage onOpenQuote={() => handleOpenQuote()} />} />
              <Route path="/objectifs-2030" element={<Goals2030Page />} />
              <Route path="/securite-qualite" element={<SafetyQualityPage />} />

              {/* Redirections permanentes des pages fusionnées (Phase 1) */}
              <Route path="/mot-du-directeur" element={<Navigate to="/histoire#mot-du-directeur" replace />} />
              <Route path="/nos-valeurs" element={<Navigate to="/equipe-direction#valeurs" replace />} />
              <Route path="/caracteristiques-techniques" element={<Navigate to="/produits#specifications" replace />} />
              <Route path="/partenaires" element={<Navigate to="/realisations" replace />} />
              <Route path="/grands-chantiers" element={<Navigate to="/realisations" replace />} />
              <Route path="/developpement-durable" element={<Navigate to="/objectifs-2030#developpement-durable" replace />} />
              <Route path="/engagements-rse" element={<Navigate to="/objectifs-2030#developpement-durable" replace />} />

              {/* Careers & Talents */}
              <Route path="/carrieres" element={<CareersPage />} />
              <Route path="/carrieres/offres" element={<JobOffersPage />} />
              <Route path="/carrieres/offres/:slug" element={<JobDetailPage />} />
              <Route path="/carrieres/stages" element={<InternshipsPage />} />
              <Route path="/carrieres/postuler" element={<ApplyPage />} />
              <Route path="/carrieres/offres/:slug/postuler" element={<ApplyPage />} />

              {/* News, Communiques & Events */}
              <Route path="/actualites" element={<NewsRouteWrapper onOpenQuote={() => handleOpenQuote()} />} />
              <Route path="/actualites/communiques" element={<CommuniquesPage />} />
              <Route path="/actualites/communiques/:slug" element={<CommuniqueDetailPage />} />
              <Route path="/actualites/evenements" element={<EventsPage />} />
              <Route path="/actualites/evenements/:slug" element={<EventDetailPage />} />
              <Route path="/actualites/:slug" element={<NewsRouteWrapper onOpenQuote={() => handleOpenQuote()} />} />

              <Route path="/points-de-vente" element={<OutletsPage onOpenQuote={() => handleOpenQuote()} />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/panier" element={<CartRouteWrapper />} />
              <Route path="/commande" element={<CheckoutPage />} />
              <Route path="/mentions-legales" element={<LegalPage type="legal" />} />
              <Route path="/politique-confidentialite" element={<LegalPage type="privacy" />} />
            </Route>

            {/* 2. CLIENT AUTH PAGES (Standalone, clean minimal layout) */}
            <Route path="/connexion" element={<ClientLoginPage />} />
            <Route path="/inscription" element={<ClientRegisterPage />} />
            <Route path="/espace-client/connexion" element={<ClientLoginPage />} />
            <Route path="/espace-client/inscription" element={<ClientRegisterPage />} />
            <Route path="/espace-client/verifier-email" element={<ClientVerifyEmailPage />} />
            <Route path="/espace-client/mot-de-passe-oublie" element={<ClientForgotPasswordPage />} />
            <Route path="/espace-client/reinitialiser-mot-de-passe" element={<ClientResetPasswordPage />} />

            {/* 3. SECURE CLIENT PORTAL (Separate Dashboard Layout, verified user required) */}
            <Route
              path="/espace-client"
              element={
                <RequireVerifiedUser>
                  <ClientLayout />
                </RequireVerifiedUser>
              }
            >
              <Route index element={<ClientDashboardPage />} />
              <Route path="commandes" element={<ClientOrdersPage />} />
              <Route path="commandes/:id" element={<ClientOrderDetailPage />} />
              <Route path="actualites" element={<ClientNewsPage />} />
              <Route path="notifications" element={<ClientNotificationsPage />} />
              <Route path="profil" element={<ClientProfilePage />} />
            </Route>

            {/* 4. ADMIN PORTAL (Separate Admin Layout, internal admin role required) */}
            <Route path="/admin/connexion" element={<AdminLoginPage />} />
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminLayout />
                </RequireAdmin>
              }
            >
              <Route index element={<AdminOrdersPage />} />
              <Route path="contenu" element={<AdminContentPage />} />
              <Route path="recrutement" element={<AdminCareersPage />} />
            </Route>

            {/* 5. 404 CATCH-ALL */}
            <Route path="*" element={<NotFoundRouteWrapper />} />
          </Routes>

          {/* Global Quote Wizard Modal */}
          {quoteModalOpen && (
            <div className="fixed inset-0 z-50 bg-[#0B1F3A]/70 backdrop-blur-sm p-4 overflow-y-auto flex items-center justify-center">
              <div className="w-full max-w-2xl my-8">
                <QuoteWizard
                  initialProductId={quoteInitialProduct}
                  onClose={() => setQuoteModalOpen(false)}
                />
              </div>
            </div>
          )}
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
