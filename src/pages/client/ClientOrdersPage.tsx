import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useClientPortal } from '../../hooks/useClientPortal';
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  ArrowRight,
  MagnifyingGlass,
  Funnel,
  ShoppingCart,
  CalendarBlank,
  MapPin,
} from '@phosphor-icons/react';

export const ClientOrdersPage: React.FC = () => {
  const { orders, loading } = useClientPortal();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filterStatus === 'all' || order.statut === filterStatus;
    const matchesSearch =
      search.trim() === '' ||
      order.numero_commande.toLowerCase().includes(search.toLowerCase()) ||
      (order.adresse_livraison?.ville || '').toLowerCase().includes(search.toLowerCase()) ||
      (order.adresse_livraison?.quartier || '').toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'en_attente':
        return <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1"><Clock size={12} /> En attente</span>;
      case 'confirmee':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1"><CheckCircle size={12} /> Confirmée usine</span>;
      case 'en_preparation':
        return <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1"><Package size={12} /> Ensachage Massé</span>;
      case 'en_livraison':
        return <span className="bg-indigo-100 text-indigo-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1"><Truck size={12} /> En livraison</span>;
      case 'livree':
        return <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1"><CheckCircle size={12} weight="fill" /> Livrée</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-full font-bold">{statut}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-black text-[#0B1F3A]">
            Mes Commandes <span className="italic text-[#0131FD]">de Ciment</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivi des enlèvements, bons d'expédition et historique complet des commandes
          </p>
        </div>

        <Link
          to="/produits"
          className="inline-flex items-center gap-2 bg-[#0131FD] hover:bg-[#0026c7] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all self-start sm:self-auto"
        >
          <ShoppingCart size={16} />
          <span>Nouvelle commande</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Rechercher par n° (ex: NOC-2026-...) ou ville"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
          <Funnel size={14} className="text-slate-400 shrink-0 ml-1 mr-1" />
          {[
            { id: 'all', label: 'Toutes' },
            { id: 'en_attente', label: 'En attente' },
            { id: 'confirmee', label: 'Confirmées' },
            { id: 'en_livraison', label: 'En route' },
            { id: 'livree', label: 'Livrées' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap text-xs ${
                filterStatus === tab.id
                  ? 'bg-[#0B1F3A] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Chargement de vos commandes...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80">
          <Package size={48} className="text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#0B1F3A]">Aucune commande trouvée</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            Modifiez vos filtres de recherche ou effectuez une nouvelle commande directe.
          </p>
          <Link
            to="/produits"
            className="inline-flex items-center gap-2 bg-[#0B1F3A] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#132A4C]"
          >
            <ShoppingCart size={16} />
            <span>Accéder au catalogue usine</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 hover:shadow-md transition-shadow flex flex-col lg:flex-row lg:items-center justify-between gap-5"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono font-bold text-base text-[#0B1F3A]">
                    {order.numero_commande}
                  </span>
                  {getStatusBadge(order.statut)}
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <CalendarBlank size={14} />
                    {new Date(order.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="text-sm font-semibold text-slate-700">
                  {(order.items || []).map(it => (
                    <span key={it.id} className="inline-block mr-3">
                      &bull; {it.quantite} sacs de <strong>{it.nom_produit}</strong>
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} className="text-[#0131FD]" />
                    {order.adresse_livraison
                      ? `${order.adresse_livraison.quartier}, ${order.adresse_livraison.ville}`
                      : 'Retrait à l’usine de Massé'}
                  </span>
                  <span>&bull; Mode de règlement : {order.mode_paiement}</span>
                </div>
              </div>

              <div className="flex items-center justify-between lg:justify-end gap-5 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                <div className="text-left lg:text-right">
                  <div className="text-lg font-black text-[#0B1F3A]">
                    {order.montant_total.toLocaleString('fr-FR')} FCFA
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">TTC Livré</div>
                </div>

                <Link
                  to={`/espace-client/commandes/${order.id}`}
                  className="inline-flex items-center gap-2 bg-[#0B1F3A] hover:bg-[#132A4C] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm"
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
  );
};

