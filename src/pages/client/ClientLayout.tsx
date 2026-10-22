import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useClientPortal } from '../../hooks/useClientPortal';
import Logo from '../../components/ui/Logo';
import { SITE_CONFIG } from '../../config/site';
import {
  SquaresFour,
  Package,
  Newspaper,
  Bell,
  User,
  ArrowLeft,
  SignOut,
  List,
  X,
  CheckCircle,
  WarningCircle,
  ShoppingCart,
  Phone,
  ShieldCheck,
  Building,
} from '@phosphor-icons/react';

export const ClientLayout: React.FC = () => {
  const { user, profile, isEmailVerified, signOut } = useAuth();
  const { unreadNotifsCount } = useClientPortal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    if (confirm('Voulez-vous vraiment vous déconnecter de votre espace client NOCIBÉ ?')) {
      await signOut();
      navigate('/');
    }
  };

  const navItems = [
    { to: '/espace-client', label: 'Tableau de bord', icon: SquaresFour, end: true },
    { to: '/espace-client/commandes', label: 'Mes commandes', icon: Package },
    { to: '/espace-client/actualites', label: 'Nouveaux ciments & Actus', icon: Newspaper },
    { to: '/espace-client/notifications', label: 'Notifications', icon: Bell, badge: unreadNotifsCount },
    { to: '/espace-client/profil', label: 'Mon profil & Chantiers', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col lg:flex-row text-[#0F172A]">
      {/* Mobile Top Header */}
      <header className="lg:hidden bg-[#0B1F3A] text-white px-4 py-3 flex items-center justify-between border-b border-[#1E3A5F] sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 -ml-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <List size={24} />}
          </button>
          <Link to="/espace-client" className="flex items-center gap-2">
            <span className="font-serif font-black tracking-wider text-xl text-white">NOCI<span className="text-[#0131FD]">BÉ</span></span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-[#0131FD]/20 text-[#00CCFF] border border-[#0131FD]/40">Client</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/espace-client/notifications"
            className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
            title="Notifications"
          >
            <Bell size={20} />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#0131FD] rounded-full" />
            )}
          </Link>
          <Link
            to="/"
            className="text-xs flex items-center gap-1 bg-white/10 hover:bg-white/20 text-slate-200 px-2.5 py-1.5 rounded-lg transition-colors font-medium"
          >
            <ArrowLeft size={14} />
            <span>Site</span>
          </Link>
        </div>
      </header>

      {/* Sidebar Navigation (Desktop) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0B1F3A] text-white flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top brand */}
        <div className="p-6 border-b border-[#1E3A5F]">
          <div className="flex items-center justify-between mb-4">
            <Logo variant="on-dark" size="sm" />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs text-slate-300 hover:text-white bg-[#132A4C] hover:bg-[#1A3865] px-3 py-2 rounded-lg transition-colors border border-slate-700/60 w-full"
          >
            <ArrowLeft size={14} className="text-[#00CCFF]" />
            <span>Retour au site vitrine NOCIBÉ</span>
          </Link>
        </div>

        {/* Client identity badge */}
        <div className="px-6 py-4 bg-[#08172C] border-b border-[#1E3A5F]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0131FD]/20 border border-[#0131FD] text-[#00CCFF] font-bold flex items-center justify-center text-sm">
              {profile?.prenom?.charAt(0) || 'C'}{profile?.nom?.charAt(0) || 'N'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-white truncate">
                {profile?.prenom} {profile?.nom}
              </div>
              <div className="text-xs text-slate-400 truncate flex items-center gap-1">
                {profile?.entreprise ? (
                  <>
                    <Building size={12} className="shrink-0" />
                    <span>{profile.entreprise}</span>
                  </>
                ) : (
                  <span>{user?.email}</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800">
            <span className="text-slate-400">Statut compte :</span>
            {isEmailVerified ? (
              <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800 text-[11px]">
                <CheckCircle size={12} weight="fill" />
                Vérifié
              </span>
            ) : (
              <Link
                to="/espace-client/verifier-email"
                className="inline-flex items-center gap-1 text-amber-400 font-semibold bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800 text-[11px] hover:underline"
              >
                <WarningCircle size={12} weight="fill" />
                À vérifier
              </Link>
            )}
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#0131FD] text-white shadow-lg shadow-[#0131FD]/25'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} weight="duotone" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-800">
            <Link
              to="/produits"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ShoppingCart size={20} className="text-[#00CCFF]" />
              <span>Commander du ciment</span>
            </Link>
          </div>
        </nav>



        {/* Direct Contact Support Massé */}
        <div className="px-6 py-3 bg-[#08172C] border-t border-[#1E3A5F]">
          <div className="text-[11px] text-slate-400 mb-1">Assistance Commandes Massé :</div>
          <a
            href={`tel:${SITE_CONFIG.phoneMain.replace(/\s+/g, '')}`}
            className="flex items-center gap-2 text-xs font-semibold text-blue-300 hover:text-white"
          >
            <Phone size={14} />
            <span>{SITE_CONFIG.phoneMain}</span>
          </a>
        </div>

        {/* Bottom sign out */}
        <div className="p-4 border-t border-[#1E3A5F]">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 py-2.5 px-3 rounded-xl transition-colors font-semibold"
          >
            <SignOut size={16} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile drawer */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* Main Content Dashboard Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Verification banner if email is NOT confirmed */}
        {!isEmailVerified && location.pathname !== '/espace-client/verifier-email' && (
          <div className="bg-amber-500 text-white px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-sm shadow-md">
            <div className="flex items-center gap-2">
              <WarningCircle size={20} weight="fill" className="text-white shrink-0" />
              <span>
                <strong>Adresse email non vérifiée :</strong> Confirmez votre adresse pour débloquer la commande directe et la facturation usine.
              </span>
            </div>
            <Link
              to="/espace-client/verifier-email"
              className="bg-white text-amber-900 font-bold px-3 py-1 rounded-lg text-xs hover:bg-amber-50 transition-colors shrink-0"
            >
              Vérifier maintenant
            </Link>
          </div>
        )}

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

