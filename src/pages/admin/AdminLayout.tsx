import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  Package,
  Article,
  SignOut,
  ArrowLeft,
  LockKey,
  Users,
  Eye,
} from '@phosphor-icons/react';

export const AdminLayout: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    if (confirm('Déconnexion du portail administration NOCIBÉ ?')) {
      await signOut();
      navigate('/admin/connexion');
    }
  };

  const navLinks = [
    { to: '/admin', label: 'Commandes & Logistique', icon: Package, end: true },
    { to: '/admin/contenu', label: 'Catalogue & Actualités', icon: Article },
    { to: '/admin/recrutement', label: 'Recrutement & Talents', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#07142A] text-slate-100 flex flex-col">
      {/* Top Admin Bar */}
      <header className="bg-[#0B1F3A] border-b border-[#1E3A5F] px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-black tracking-wider text-xl text-white">NOCI<span className="text-[#0131FD]">BÉ</span></span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
              Admin Interne
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1 ml-6">
            {navLinks.map(link => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#0131FD] text-white'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  <Icon size={16} />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/espace-client"
            className="text-xs flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-slate-200 px-3 py-1.5 rounded-xl font-medium transition-colors"
          >
            <Eye size={14} />
            <span className="hidden sm:inline">Vue Client</span>
          </Link>

          <Link
            to="/"
            className="text-xs flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-slate-200 px-3 py-1.5 rounded-xl font-medium transition-colors"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Site Vitrine</span>
          </Link>

          <button
            onClick={handleSignOut}
            className="text-xs flex items-center gap-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 px-3 py-1.5 rounded-xl font-medium transition-colors"
          >
            <SignOut size={14} />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </header>

      {/* TOTP 2FA Security Notice */}
      <div className="bg-amber-950/60 border-b border-amber-800/60 px-4 py-2 text-xs text-amber-300 flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto">
          <LockKey size={14} className="text-amber-400" />
          <span>
            <strong>Recommandation Sécurité :</strong> L'authentification à deux facteurs (TOTP / Google Authenticator) est vivement recommandée pour les comptes administrateurs.
          </span>
        </div>
      </div>

      {/* Admin Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

