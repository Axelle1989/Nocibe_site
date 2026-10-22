import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useClientPortal } from '../../hooks/useClientPortal';
import { SITE_CONFIG } from '../../config/site';
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  ArrowRight,
  ShoppingCart,
  Phone,
  Sparkle,
  FileText,
  ChatCircleText,
} from '@phosphor-icons/react';

export const ClientDashboardPage: React.FC = () => {
  const { profile } = useAuth();
  const { orders, unreadNotifsCount } = useClientPortal();

  const activeOrders = orders.filter(o => o.statut !== 'livree' && o.statut !== 'annulee');
  const deliveredOrders = orders.filter(o => o.statut === 'livree');

  // Calculate approximate tonnage (each bag is 50kg = 0.05 t)
  const totalTonnage = orders.reduce((sum, o) => {
    const bags = (o.items || []).reduce((itemSum, it) => itemSum + it.quantite, 0);
    return sum + (bags * 50) / 1000;
  }, 0);

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'en_attente':
        return <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1"><Clock size={12} /> En attente validation</span>;
      case 'confirmee':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1"><CheckCircle size={12} /> Confirmée usine</span>;
      case 'en_preparation':
        return <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1"><Package size={12} /> Ensachage Massé</span>;
      case 'en_livraison':
        return <span className="bg-indigo-100 text-indigo-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1"><Truck size={12} /> Camion en route</span>;
      case 'livree':
        return <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1"><CheckCircle size={12} weight="fill" /> Réceptionnée</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-full font-bold">{statut}</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0B1F3A] to-[#1E3A5F] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-white/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#0131FD]/20 text-[#00CCFF] text-xs font-bold px-3 py-1 rounded-full border border-[#0131FD]/30 mb-3">
              <Sparkle size={14} />
              <span>Portail Pro NOCIBÉ Bénin</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight">
              Bonjour, {profile?.prenom || 'Client'} {profile?.nom} 👋
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Bienvenue sur votre console de gestion logistique. Suivez vos approvisionnements en ciment certifié en temps réel depuis l'usine de Massé.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/produits"
              className="bg-[#0131FD] hover:bg-[#0026c7] text-white font-bold px-5 py-3 rounded-xl transition-all shadow-lg shadow-[#0131FD]/30 flex items-center gap-2 text-sm"
            >
              <ShoppingCart size={18} weight="bold" />
              <span>Commander du ciment</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0B1F3A] flex items-center justify-center shrink-0">
            <Truck size={24} weight="duotone" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Commandes en cours</div>
            <div className="text-2xl font-black text-[#0B1F3A]">{activeOrders.length}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0131FD] flex items-center justify-center shrink-0">
            <Package size={24} weight="duotone" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tonnage cumulé</div>
            <div className="text-2xl font-black text-[#0B1F3A]">{totalTonnage.toFixed(0)} <span className="text-sm font-semibold text-slate-500">tonnes</span></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle size={24} weight="duotone" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Livraisons effectuées</div>
            <div className="text-2xl font-black text-[#0B1F3A]">{deliveredOrders.length}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <ChatCircleText size={24} weight="duotone" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Alertes logistique</div>
            <div className="text-2xl font-black text-[#0B1F3A]">{unreadNotifsCount} <span className="text-xs font-medium text-slate-400">non lues</span></div>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B1F3A]">Mes commandes récentes</h2>
            <p className="text-xs text-slate-500">Traçabilité des expéditions usine et chantiers</p>
          </div>
          <Link
            to="/espace-client/commandes"
            className="text-xs font-bold text-[#0131FD] hover:underline flex items-center gap-1"
          >
            <span>Voir l'historique complet</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Package size={40} className="text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">Aucune commande enregistrée</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Passez votre première commande pour bénéficier de la tarification directe usine et du transport sécurisé.
            </p>
            <Link
              to="/produits"
              className="inline-flex items-center gap-2 bg-[#0B1F3A] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#132A4C]"
            >
              <ShoppingCart size={16} />
              <span>Consulter le catalogue ciments</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 3).map(order => (
              <div
                key={order.id}
                className="p-4 sm:p-5 rounded-2xl border border-slate-100 hover:border-slate-300 bg-slate-50/50 hover:bg-white transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-[#0B1F3A]">
                      {order.numero_commande}
                    </span>
                    {getStatusBadge(order.statut)}
                  </div>
                  <div className="text-xs text-slate-600">
                    {(order.items || []).map(it => `${it.quantite} sacs de ${it.nom_produit}`).join(', ')}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Destination : {order.adresse_livraison ? `${order.adresse_livraison.quartier}, ${order.adresse_livraison.ville}` : 'Retrait Usine Massé'} &bull; Commandé le {new Date(order.created_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
                  <div className="text-right">
                    <div className="text-sm font-black text-[#0B1F3A]">
                      {order.montant_total.toLocaleString('fr-FR')} FCFA
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">TTC Livré</div>
                  </div>
                  <Link
                    to={`/espace-client/commandes/${order.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B1F3A] bg-white border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <span>Détails & Suivi</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Featured Cement Innovation Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0131FD] uppercase tracking-wider">
            <Sparkle size={14} />
            <span>Nouveauté au catalogue Usine 2026</span>
          </div>
          <h3 className="text-xl font-serif font-black text-[#0B1F3A]">
            Ciment CPA 55 : Très Haute Résistance Initiale
          </h3>
          <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
            Spécifiquement développé pour les ponts, radiers portuaires et dalles à décoffrage rapide. Conforme à la norme européenne EN 197-1. Disponible en sacs de 50 kg et vrac citerne.
          </p>
        </div>
        <Link
          to="/produits/cpa-55-haute-resistance"
          className="shrink-0 bg-[#0B1F3A] hover:bg-[#132A4C] text-white font-bold px-5 py-3 rounded-xl text-xs transition-colors flex items-center gap-2"
        >
          <FileText size={16} />
          <span>Fiche technique & Tarifs</span>
        </Link>
      </div>

      {/* Assistance Usine & Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Phone size={24} weight="duotone" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#0B1F3A]">Permanence Logistique Massé</h4>
            <p className="text-xs text-slate-500 mt-1 mb-3">
              Un imprévu sur votre chantier ou un changement de planning d'approvisionnement ? Contactez directement nos répartiteurs.
            </p>
            <a
              href={`tel:${SITE_CONFIG.phoneMain.replace(/\s+/g, '')}`}
              className="text-xs font-bold text-[#0131FD] hover:underline flex items-center gap-1.5"
            >
              <span>Appeler la permanence usine ({SITE_CONFIG.phoneMain})</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0B1F3A] flex items-center justify-center shrink-0">
            <FileText size={24} weight="duotone" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#0B1F3A]">Fiches de contrôle laboratoire</h4>
            <p className="text-xs text-slate-500 mt-1 mb-3">
              Accédez aux procès-verbaux d'essais mécaniques (écrasement à 2, 7 et 28 jours) pour vos dossiers de recollement chantier.
            </p>
            <Link
              to="/produits#specifications"
              className="text-xs font-bold text-[#0B1F3A] hover:text-[#0131FD] flex items-center gap-1.5"
            >
              <span>Consulter le tableau normatif EN 197-1</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

