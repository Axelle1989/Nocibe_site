import React, { useState, useEffect } from 'react';
import type { Order, OrderStatus } from '../../types/auth';
import { api } from '../../lib/api';
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  MagnifyingGlass,
  DownloadSimple,
  PaperPlaneRight,
  ChatCircleDots,
  Funnel,
  XCircle,
} from '@phosphor-icons/react';

const MOCK_ORDERS_KEY = 'nocibe_client_orders_v1';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [adminReply, setAdminReply] = useState('');
  const [statusNote, setStatusNote] = useState('');

  const loadOrders = async () => {
    try {
      const res = await api.orders.getAllOrders();
      if (res.orders && res.orders.length > 0) {
        setOrders(res.orders as any);
        setLoading(false);
        return;
      }
    } catch {
      // Fallback to localStorage
    }

    try {
      const stored = localStorage.getItem(MOCK_ORDERS_KEY);
      if (stored) {
        setOrders(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed loading mock orders', e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    const desc = statusNote.trim() || `Statut mis à jour vers: ${newStatus}`;

    try {
      await api.orders.updateStatus(orderId, newStatus, desc);
      await loadOrders();
      setStatusNote('');
      return;
    } catch {
      // Fallback to local
    }

    const updated = orders.map(o => {
      if (o.id === orderId) {
        const newEvent = {
          id: 'ev-' + Date.now(),
          order_id: orderId,
          statut: newStatus,
          description: desc,
          auteur_role: 'admin',
          created_at: new Date().toISOString(),
        };
        return {
          ...o,
          statut: newStatus,
          events: [...(o.events || []), newEvent],
        };
      }
      return o;
    });

    setOrders(updated);
    localStorage.setItem(MOCK_ORDERS_KEY, JSON.stringify(updated));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(updated.find(o => o.id === orderId) || null);
    }
    setStatusNote('');
  };

  const handleSendAdminMessage = async (orderId: string) => {
    if (!adminReply.trim()) return;

    try {
      await api.orders.sendMessage(orderId, adminReply.trim());
      await loadOrders();
      setAdminReply('');
      return;
    } catch {
      // Fallback to local
    }

    const updated = orders.map(o => {
      if (o.id === orderId) {
        const newMsg = {
          id: 'msg-' + Date.now(),
          order_id: orderId,
          expediteur: 'admin' as const,
          expediteur_nom: 'Logistique NOCIBÉ Massé',
          message: adminReply.trim(),
          lu: true,
          created_at: new Date().toISOString(),
        };
        return {
          ...o,
          messages: [...(o.messages || []), newMsg],
        };
      }
      return o;
    });

    setOrders(updated);
    localStorage.setItem(MOCK_ORDERS_KEY, JSON.stringify(updated));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(updated.find(o => o.id === orderId) || null);
    }
    setAdminReply('');
  };

  const handleExportCSV = () => {
    const headers = ['Numero_Commande', 'Date', 'Statut', 'Client_Id', 'Montant_FCFA', 'Destination', 'Quantite_Sacs'];
    const rows = orders.map(o => [
      o.numero_commande,
      new Date(o.created_at).toISOString().split('T')[0],
      o.statut,
      o.user_id,
      o.montant_total,
      o.adresse_livraison ? `${o.adresse_livraison.ville} - ${o.adresse_livraison.quartier}` : 'Retrait Masse',
      (o.items || []).reduce((s, it) => s + it.quantite, 0),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nocibe-commandes-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = orders.filter(o => {
    const matchStatus = statusFilter === 'all' || o.statut === statusFilter;
    const matchSearch =
      search === '' ||
      o.numero_commande.toLowerCase().includes(search.toLowerCase()) ||
      (o.adresse_livraison?.ville || '').toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Title & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestion des Commandes & Expéditions</h1>
          <p className="text-xs text-slate-400 mt-1">Supervision en direct de l'ensachage et acheminement Usine Massé</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 bg-[#132A4C] hover:bg-[#1A3865] border border-[#1E3A5F] text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm self-start sm:self-auto"
        >
          <DownloadSimple size={16} />
          <span>Exporter CSV</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[#0B1F3A] p-4 rounded-2xl border border-[#1E3A5F] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par n° de commande ou destination..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#132A4C] border border-[#1E3A5F] rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0131FD]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold">
          <Funnel size={14} className="text-slate-400" />
          {[
            { id: 'all', label: 'Toutes' },
            { id: 'en_attente', label: 'En attente' },
            { id: 'confirmee', label: 'Confirmées' },
            { id: 'en_preparation', label: 'Ensachage' },
            { id: 'en_livraison', label: 'En route' },
            { id: 'livree', label: 'Livrées' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                statusFilter === tab.id ? 'bg-[#0131FD] text-white' : 'bg-[#132A4C] text-slate-300 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Orders list */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.length === 0 ? (
            <div className="p-12 text-center bg-[#0B1F3A] rounded-2xl border border-[#1E3A5F] text-slate-400 text-xs">
              Aucune commande trouvée.
            </div>
          ) : (
            filtered.map(order => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  selectedOrder?.id === order.id
                    ? 'bg-[#132A4C] border-[#0131FD] ring-2 ring-[#0131FD]'
                    : 'bg-[#0B1F3A] border-[#1E3A5F] hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="font-mono font-bold text-sm text-white">{order.numero_commande}</span>
                  <span className="text-xs font-black text-[#0131FD]">
                    {order.montant_total.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>

                <div className="text-xs text-slate-300 mb-2">
                  {(order.items || []).map(it => `${it.quantite} sacs de ${it.nom_produit}`).join(', ')}
                </div>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-[#1E3A5F]">
                  <span>Dest: {order.adresse_livraison?.ville || 'Usine Massé'} &bull; {order.mode_paiement}</span>
                  <span className="font-bold text-amber-400">{order.statut}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Order Management Panel */}
        <div className="bg-[#0B1F3A] rounded-2xl border border-[#1E3A5F] p-6 h-fit sticky top-20">
          {selectedOrder ? (
            <div className="space-y-5">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Traitement commande</div>
                <h3 className="font-mono font-bold text-lg text-white">{selectedOrder.numero_commande}</h3>
                <div className="text-xs text-slate-400 mt-0.5">
                  Client ID : {selectedOrder.user_id} &bull; Contact réception : {selectedOrder.telephone_reception || 'N/A'}
                </div>
              </div>

              {/* Status Update Controls */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">Modifier l'état logistique :</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'confirmee')}
                    className="p-2 bg-blue-900/40 hover:bg-blue-900/60 border border-blue-700 text-blue-300 rounded-lg font-bold"
                  >
                    Confirmer Usine
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'en_preparation')}
                    className="p-2 bg-purple-900/40 hover:bg-purple-900/60 border border-purple-700 text-purple-300 rounded-lg font-bold"
                  >
                    Ensachage Massé
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'en_livraison')}
                    className="p-2 bg-indigo-900/40 hover:bg-indigo-900/60 border border-indigo-700 text-indigo-300 rounded-lg font-bold"
                  >
                    Camion en route
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'livree')}
                    className="p-2 bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-700 text-emerald-300 rounded-lg font-bold"
                  >
                    Livré & Réceptionné
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Note / Immatriculation camion (optionnel)..."
                  value={statusNote}
                  onChange={e => setStatusNote(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#132A4C] border border-[#1E3A5F] rounded-lg text-xs text-white placeholder-slate-500 mt-2"
                />
              </div>

              {/* Direct message to client */}
              <div className="space-y-2 pt-3 border-t border-[#1E3A5F]">
                <label className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <ChatCircleDots size={14} className="text-[#0131FD]" />
                  <span>Envoyer un message au client :</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Message pour le client..."
                    value={adminReply}
                    onChange={e => setAdminReply(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-[#132A4C] border border-[#1E3A5F] rounded-lg text-xs text-white placeholder-slate-500"
                  />
                  <button
                    onClick={() => handleSendAdminMessage(selectedOrder.id)}
                    className="bg-[#0131FD] hover:bg-[#0026c7] text-white p-2 rounded-lg"
                  >
                    <PaperPlaneRight size={14} weight="bold" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Sélectionnez une commande dans la liste pour modifier son statut logistique ou répondre au client.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

