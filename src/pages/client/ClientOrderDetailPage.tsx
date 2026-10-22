import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useClientPortal } from '../../hooks/useClientPortal';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  Truck,
  MapPin,
  CalendarBlank,
  PaperPlaneRight,
  DownloadSimple,
  ShoppingCart,
  User,
  ChatCircleDots,
  ShieldCheck,
} from '@phosphor-icons/react';

export const ClientOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders, sendMessage } = useClientPortal();
  const { profile } = useAuth();
  const { addToCart } = useCart();

  const [newMessage, setNewMessage] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  const order = orders.find(o => o.id === id || o.numero_commande === id);

  if (!order) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
        <Package size={48} className="text-slate-300 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-[#0B1F3A]">Commande introuvable</h2>
        <p className="text-xs text-slate-500 mb-6">Cette commande n'existe pas ou ne vous appartient pas.</p>
        <Link
          to="/espace-client/commandes"
          className="inline-flex items-center gap-2 bg-[#0B1F3A] text-white text-xs font-bold px-4 py-2 rounded-xl"
        >
          <ArrowLeft size={14} />
          <span>Retour aux commandes</span>
        </Link>
      </div>
    );
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setSendingMsg(true);
    const senderName = `${profile?.prenom || 'Client'} ${profile?.nom || ''}`.trim();
    await sendMessage(order.id, newMessage, senderName);
    setNewMessage('');
    setSendingMsg(false);
  };

  const handleReorder = () => {
    if (order.items) {
      order.items.forEach(it => {
        addToCart(
          {
            productId: it.product_id || it.id,
            slug: 'ciment-nocibe-cpj-45',
            name: it.nom_produit,
            shortGrade: 'CPJ 45',
            packaging: 'Sac 50kg',
            unitPrice: it.prix_unitaire,
            priceDisplay: `${it.prix_unitaire.toLocaleString('fr-FR')} FCFA`,
            unit: 'sacs',
            image: '/images/produits/cpj-35-palette-fond-blanc.webp',
          },
          it.quantite
        );
      });
      alert('Les produits de cette commande ont été ajoutés à votre panier !');
    }
  };

  const handleDownloadInvoice = () => {
    alert(`Génération du récapitulatif proforma pour la commande ${order.numero_commande}... Document prêt.`);
  };

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'en_attente':
        return <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5"><Clock size={14} /> En attente validation usine</span>;
      case 'confirmee':
        return <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5"><CheckCircle size={14} /> Validée par NOCIBÉ</span>;
      case 'en_preparation':
        return <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5"><Package size={14} /> Chargement à l'usine de Massé</span>;
      case 'en_livraison':
        return <span className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5"><Truck size={14} /> En cours d’acheminement camion</span>;
      case 'livree':
        return <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5"><CheckCircle size={14} weight="fill" /> Livrée et réceptionnée</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 text-xs px-3 py-1 rounded-full font-bold">{statut}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top back & actions bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/espace-client/commandes"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#0B1F3A]"
        >
          <ArrowLeft size={16} />
          <span>Retour à la liste des commandes</span>
        </Link>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleDownloadInvoice}
            className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl shadow-sm transition-colors"
          >
            <DownloadSimple size={16} />
            <span>Bon de commande (PDF)</span>
          </button>
          <button
            onClick={handleReorder}
            className="inline-flex items-center gap-1.5 bg-[#0B1F3A] hover:bg-[#132A4C] text-white text-xs font-bold px-3 py-2 rounded-xl shadow-sm transition-colors"
          >
            <ShoppingCart size={16} />
            <span>Re-commander</span>
          </button>
        </div>
      </div>

      {/* Main Order Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">
              Commande Officielle NOCIBÉ
            </div>
            <h1 className="text-2xl sm:text-3xl font-mono font-black text-[#0B1F3A]">
              {order.numero_commande}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
              <span className="flex items-center gap-1">
                <CalendarBlank size={14} />
                Passée le {new Date(order.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span>&bull; Mode : {order.mode_livraison === 'livraison' ? 'Livraison sur chantier' : 'Enlèvement usine Massé'}</span>
              <span>&bull; Paiement : {order.mode_paiement}</span>
            </div>
          </div>

          <div className="text-left lg:text-right flex flex-col items-start lg:items-end gap-2">
            <div>{getStatusBadge(order.statut)}</div>
            <div className="text-2xl sm:text-3xl font-black text-[#0B1F3A]">
              {order.montant_total.toLocaleString('fr-FR')} FCFA
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 text-xs text-slate-600">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="font-bold text-[#0B1F3A] mb-2 flex items-center gap-1.5 text-xs">
              <MapPin size={16} className="text-[#0131FD]" />
              <span>Adresse & Destination</span>
            </div>
            {order.adresse_livraison ? (
              <div className="space-y-1">
                <p><strong>Ville :</strong> {order.adresse_livraison.ville}</p>
                <p><strong>Quartier :</strong> {order.adresse_livraison.quartier}</p>
                {order.adresse_livraison.precision && (
                  <p><strong>Repère / Précision :</strong> {order.adresse_livraison.precision}</p>
                )}
              </div>
            ) : (
              <p>Retrait direct au centre d’expédition de l’usine de Massé (Plateau, Bénin).</p>
            )}
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="font-bold text-[#0B1F3A] mb-2 flex items-center gap-1.5 text-xs">
              <ShieldCheck size={16} className="text-emerald-600" />
              <span>Contact & Instructions de livraison</span>
            </div>
            <div className="space-y-1">
              <p><strong>Contact réception :</strong> {order.telephone_reception || '+229 non précisé'}</p>
              {order.date_livraison_souhaitee && (
                <p><strong>Date souhaitée :</strong> {order.date_livraison_souhaitee}</p>
              )}
              {order.notes && <p><strong>Instructions :</strong> {order.notes}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Items Breakdown Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <h2 className="text-base sm:text-lg font-bold text-[#0B1F3A] mb-4">
          Détail des ciments commandés
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Produit & Spécification</th>
                <th className="py-3 px-4 text-center">Quantité</th>
                <th className="py-3 px-4 text-right">Prix Unitaire</th>
                <th className="py-3 px-4 text-right">Total FCFA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(order.items || []).map(it => (
                <tr key={it.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {it.nom_produit}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-[#0B1F3A]">
                    {it.quantite} sacs <span className="text-[11px] text-slate-400">({(it.quantite * 50) / 1000} T)</span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-600">
                    {it.prix_unitaire.toLocaleString('fr-FR')} FCFA
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-[#0B1F3A]">
                    {it.prix_total.toLocaleString('fr-FR')} FCFA
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-slate-200 font-bold">
              <tr>
                <td colSpan={3} className="py-3 px-4 text-right text-slate-600">
                  Total Général TTC Livré :
                </td>
                <td className="py-3 px-4 text-right text-base font-black text-[#0B1F3A]">
                  {order.montant_total.toLocaleString('fr-FR')} FCFA
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logistics Timeline */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <h2 className="text-base font-bold text-[#0B1F3A] mb-4 flex items-center gap-2">
            <Truck size={20} className="text-[#0131FD]" />
            <span>Journal logistique de la commande</span>
          </h2>

          <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {(order.events || []).length === 0 ? (
              <p className="text-xs text-slate-400 pl-8">Aucun événement logistique enregistré.</p>
            ) : (
              (order.events || []).map((ev, idx) => (
                <div key={ev.id || idx} className="relative pl-8 space-y-0.5">
                  <div className="absolute left-1.5 top-1 w-4 h-4 rounded-full bg-[#0B1F3A] border-2 border-white shadow-sm flex items-center justify-center" />
                  <div className="text-xs font-bold text-[#0B1F3A]">
                    {ev.description}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {new Date(ev.created_at).toLocaleString('fr-FR')} &bull; Opérateur : {ev.auteur_role}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Messaging Thread with NOCIBÉ */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0B1F3A] mb-1 flex items-center gap-2">
              <ChatCircleDots size={20} className="text-[#0131FD]" />
              <span>Échanges avec l'équipe NOCIBÉ</span>
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Communiquez directement avec le responsable logistique de votre commande.
            </p>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1 mb-4">
              {(order.messages || []).length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  Aucun message échangé sur cette commande.
                </div>
              ) : (
                (order.messages || []).map(msg => {
                  const isClient = msg.expediteur === 'client';
                  return (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-2xl text-xs max-w-[85%] ${
                        isClient
                          ? 'ml-auto bg-[#0B1F3A] text-white rounded-br-sm'
                          : 'mr-auto bg-slate-100 text-slate-800 rounded-bl-sm border border-slate-200'
                      }`}
                    >
                      <div className="font-bold text-[11px] mb-1 opacity-90 flex items-center gap-1">
                        <User size={12} />
                        <span>{msg.expediteur_nom}</span>
                      </div>
                      <p className="leading-relaxed">{msg.message}</p>
                      <div className="text-[10px] opacity-70 text-right mt-1">
                        {new Date(msg.created_at).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <form onSubmit={handleSendMessage} className="relative pt-2 border-t border-slate-100">
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Écrire un message à l'équipe NOCIBÉ..."
              className="w-full pl-4 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            />
            <button
              type="submit"
              disabled={sendingMsg || !newMessage.trim()}
              className="absolute right-1.5 top-3.5 bg-[#0131FD] text-white p-2 rounded-lg hover:bg-[#0026c7] disabled:opacity-40 transition-colors"
            >
              <PaperPlaneRight size={14} weight="bold" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
