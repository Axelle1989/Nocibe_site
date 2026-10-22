import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useClientPortal } from '../hooks/useClientPortal';
import { SITE_CONFIG } from '../config/site';
import {
  CheckCircle,
  Truck,
  Building,
  CreditCard,
  MapPin,
  CalendarBlank,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  WarningCircle,
  SpinnerGap,
  DownloadSimple,
} from '@phosphor-icons/react';

export const CheckoutPage: React.FC = () => {
  const { items, totalEstimatedFcfa, totalBags, clearCart } = useCart();
  const { user, profile, isEmailVerified } = useAuth();
  const { placeOrder } = useClientPortal();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [modeLivraison, setModeLivraison] = useState<'livraison' | 'retrait_usine'>('livraison');
  const [ville, setVille] = useState('Cotonou');
  const [quartier, setQuartier] = useState(profile?.adresses_livraison?.[0]?.quartier || '');
  const [precision, setPrecision] = useState(profile?.adresses_livraison?.[0]?.precision || '');
  const [dateSouhaitee, setDateSouhaitee] = useState('');
  const [phoneReception, setPhoneReception] = useState(profile?.telephone || '+229 ');
  const [notes, setNotes] = useState('');
  const [modePaiement, setModePaiement] = useState('Virement bancaire');
  const [submitting, setSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<{ id: string; numero: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 bg-[#0B1F3A]/10 text-[#0B1F3A] rounded-2xl flex items-center justify-center mb-4">
          <ShieldCheck size={36} weight="duotone" />
        </div>
        <h1 className="text-2xl font-serif font-black text-[#0B1F3A] mb-2">
          Identification requise
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
          Connectez-vous ou créez un compte pour passer commande. <br />
          <strong>Votre panier ({items.length} article{items.length > 1 ? 's' : ''}) est conservé.</strong>
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/connexion"
            state={{ from: { pathname: '/commande' } }}
            className="bg-[#0B1F3A] text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-[#132A4C] shadow transition"
          >
            Se connecter
          </Link>
          <Link
            to="/inscription"
            state={{ from: { pathname: '/commande' } }}
            className="border border-[#0B1F3A] text-[#0B1F3A] text-xs font-bold px-6 py-3 rounded-xl hover:bg-slate-50 transition"
          >
            Créer un compte client
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !createdOrder) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
          <Truck size={32} />
        </div>
        <h1 className="text-xl font-bold text-[#0B1F3A] mb-2">Votre panier de ciment est vide</h1>
        <p className="text-xs text-slate-500 mb-6">Ajoutez des sacs de ciment NOCIBÉ pour démarrer votre commande usine.</p>
        <Link
          to="/produits"
          className="bg-[#0B1F3A] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#132A4C]"
        >
          Découvrir les ciments certifiés
        </Link>
      </div>
    );
  }

  const handleFinalSubmit = async () => {
    if (!user) {
      navigate('/espace-client/connexion', { state: { from: { pathname: '/commande' } } });
      return;
    }
    if (!isEmailVerified) {
      navigate('/espace-client/verifier-email');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    const orderPayload = {
      items: items.map(it => ({
        product_id: it.productId,
        nom_produit: `${it.name} (${it.shortGrade})`,
        quantite: it.quantity,
        prix_unitaire: it.unitPrice,
        prix_total: it.unitPrice * it.quantity,
      })),
      montant_total: totalEstimatedFcfa,
      mode_paiement: modePaiement,
      mode_livraison: modeLivraison,
      adresse_livraison:
        modeLivraison === 'livraison'
          ? {
              ville,
              quartier,
              precision,
            }
          : undefined,
      date_livraison_souhaitee: dateSouhaitee || undefined,
      telephone_reception: phoneReception,
      notes: notes || undefined,
    };

    const res = await placeOrder(orderPayload);
    setSubmitting(false);

    if (res.success && res.numero_commande && res.orderId) {
      setCreatedOrder({ id: res.orderId, numero: res.numero_commande });
      clearCart();
      setStep(4);
    } else {
      setErrorMessage(res.error || "Une erreur est survenue lors de l'enregistrement de la commande.");
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Top return link */}
        {step < 4 && (
          <div className="mb-6">
            <Link
              to="/panier"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#0B1F3A]"
            >
              <ArrowLeft size={14} />
              <span>Retour au panier</span>
            </Link>
          </div>
        )}

        {/* Checkout Steps Indicator */}
        {step < 4 && (
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-md mx-auto text-xs font-bold text-slate-400">
              <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-[#0B1F3A]' : ''}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-[#0B1F3A] text-white' : 'bg-slate-200'}`}>1</span>
                <span>Récapitulatif</span>
              </div>
              <div className="w-10 h-0.5 bg-slate-200" />
              <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-[#0B1F3A]' : ''}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-[#0B1F3A] text-white' : 'bg-slate-200'}`}>2</span>
                <span>Livraison</span>
              </div>
              <div className="w-10 h-0.5 bg-slate-200" />
              <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-[#0B1F3A]' : ''}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-[#0B1F3A] text-white' : 'bg-slate-200'}`}>3</span>
                <span>Validation</span>
              </div>
            </div>
          </div>
        )}

        {/* Notice if user not logged in or email not verified */}
        {(!user || !isEmailVerified) && step < 4 && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2.5">
              <WarningCircle size={22} weight="fill" className="text-amber-600 shrink-0" />
              <div>
                <strong>Compte client requis pour valider :</strong> Vous devez vous connecter avec une adresse email vérifiée pour valider la commande directe usine.
              </div>
            </div>
            <Link
              to="/espace-client/connexion"
              state={{ from: { pathname: '/commande' } }}
              className="bg-[#0B1F3A] text-white font-bold px-3 py-1.5 rounded-lg text-center hover:bg-[#132A4C] shrink-0"
            >
              Se connecter / S'inscrire
            </Link>
          </div>
        )}

        {/* STEP 1: SUMMARY */}
        {step === 1 && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h1 className="text-xl font-serif font-black text-[#0B1F3A]">
                Étape 1 : Récapitulatif <span className="italic text-[#0131FD]">du tonnage</span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">Vérifiez les classes de ciment et les volumes demandés.</p>
            </div>

            <div className="divide-y divide-slate-100">
              {items.map(it => (
                <div key={it.productId} className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-sm text-[#0B1F3A]">{it.name}</h3>
                    <div className="text-xs text-slate-500">
                      {it.shortGrade} &bull; {it.packaging} &bull; {it.quantity} sacs
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm text-[#0B1F3A]">
                      {(it.unitPrice * it.quantity).toLocaleString('fr-FR')} FCFA
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {((it.quantity * 50) / 1000).toFixed(1)} tonnes
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Poids total estimé :</span>
              <span className="text-[#0B1F3A] font-black text-sm">{((totalBags * 50) / 1000).toFixed(1)} Tonnes</span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase">Total estimatif :</div>
                <div className="text-xl font-black text-[#0B1F3A]">{totalEstimatedFcfa.toLocaleString('fr-FR')} FCFA</div>
              </div>
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 bg-[#0131FD] hover:bg-[#0026c7] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md transition-all"
              >
                <span>Continuer vers la livraison</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: DELIVERY INFO */}
        {step === 2 && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h1 className="text-xl font-serif font-black text-[#0B1F3A]">
                Étape 2 : Mode de livraison <span className="italic text-[#0131FD]">& Chantier</span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">Choisissez entre la livraison directe sur site ou l'enlèvement à l'usine de Massé.</p>
            </div>

            {/* Mode Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setModeLivraison('livraison')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  modeLivraison === 'livraison'
                    ? 'border-[#0B1F3A] bg-blue-50/40 ring-2 ring-[#0B1F3A]'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm text-[#0B1F3A] mb-1">
                  <Truck size={18} className="text-[#0131FD]" />
                  <span>Livraison sur mon chantier</span>
                </div>
                <p className="text-xs text-slate-500">
                  Acheminement sécurisé par camion plateau ou semi-remorque NOCIBÉ dans tout le Bénin.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setModeLivraison('retrait_usine')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  modeLivraison === 'retrait_usine'
                    ? 'border-[#0B1F3A] bg-blue-50/40 ring-2 ring-[#0B1F3A]'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm text-[#0B1F3A] mb-1">
                  <Building size={18} className="text-[#0B1F3A]" />
                  <span>Retrait direct à l'usine</span>
                </div>
                <p className="text-xs text-slate-500">
                  Enlèvement par vos propres transporteurs au centre d'ensachage de Massé (Plateau).
                </p>
              </button>
            </div>

            {modeLivraison === 'livraison' ? (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Ville de livraison *</label>
                    <select
                      value={ville}
                      onChange={e => setVille(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#0B1F3A]"
                    >
                      <option value="Cotonou">Cotonou</option>
                      <option value="Abomey-Calavi">Abomey-Calavi</option>
                      <option value="Porto-Novo">Porto-Novo</option>
                      <option value="Ouidah">Ouidah</option>
                      <option value="Allada">Allada</option>
                      <option value="Bohicon">Bohicon</option>
                      <option value="Parakou">Parakou</option>
                      <option value="Pobè / Massé">Pobè / Massé</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Quartier & Chantier *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Akpakpa PK3, Résidence Lagune"
                      value={quartier}
                      onChange={e => setQuartier(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0B1F3A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Repère d'accès pour les camions</label>
                  <input
                    type="text"
                    placeholder="Ex: Face station Bénin Pétro, rue pavée accessible aux 30 tonnes"
                    value={precision}
                    onChange={e => setPrecision(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0B1F3A]"
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-2xl text-xs text-slate-600 space-y-1">
                <p className="font-bold text-[#0B1F3A]">Adresse du centre de retrait :</p>
                <p>Usine de Massé, Commune d’Adja-Ouèrè, Département du Plateau, République du Bénin.</p>
                <p className="text-[11px] text-slate-400">Ouvert du lundi au samedi de 06h00 à 20h00 pour les chargements.</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Téléphone du réceptionnaire chantier *</label>
                <input
                  type="tel"
                  required
                  placeholder="+229 97 00 11 22"
                  value={phoneReception}
                  onChange={e => setPhoneReception(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#0B1F3A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Date souhaitée de livraison</label>
                <input
                  type="date"
                  value={dateSouhaitee}
                  onChange={e => setDateSouhaitee(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0B1F3A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Remarques ou contraintes logistiques</label>
              <textarea
                rows={2}
                placeholder="Ex: Déchargement manuel à prévoir, accès restreint avant 8h..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0B1F3A]"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Retour
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 bg-[#0131FD] hover:bg-[#0026c7] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md transition-all"
              >
                <span>Continuer vers le paiement</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PAYMENT & CONFIRMATION */}
        {step === 3 && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h1 className="text-xl font-serif font-black text-[#0B1F3A]">
                Étape 3 : Modalité de règlement & <span className="italic text-[#0131FD]">Validation</span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">Choisissez le mode de paiement convenu avec NOCIBÉ S.A.</p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-semibold">
                {errorMessage}
              </div>
            )}

            <div className="space-y-3">
              {[
                {
                  id: 'Virement bancaire',
                  title: 'Virement bancaire certifié (RIB NOCIBÉ S.A.)',
                  desc: 'Validation après réception de l’avis d’opéré de la banque (Ecobank, BOA, Société Générale Bénin).',
                },
                {
                  id: 'Chèque certifié',
                  title: 'Chèque certifié à la livraison / enlèvement',
                  desc: 'Paiement à la remise du bon de livraison par le chauffeur ou au guichet usine.',
                },
                {
                  id: 'Mobile Money',
                  title: 'Mobile Money Pro (Moov Money / MTN MoMo)',
                  desc: 'Paiement sécurisé instantané avec référence de transaction.',
                },
              ].map(opt => (
                <label
                  key={opt.id}
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    modePaiement === opt.id
                      ? 'border-[#0B1F3A] bg-blue-50/40 ring-2 ring-[#0B1F3A]'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="modePaiement"
                    value={opt.id}
                    checked={modePaiement === opt.id}
                    onChange={e => setModePaiement(e.target.value)}
                    className="mt-1 text-[#0B1F3A]"
                  />
                  <div>
                    <div className="font-bold text-xs text-[#0B1F3A]">{opt.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Volume commandé :</span>
                <span className="font-bold text-slate-800">{totalBags} sacs ({((totalBags * 50) / 1000).toFixed(1)} T)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Mode logistique :</span>
                <span className="font-bold text-slate-800">{modeLivraison === 'livraison' ? `Livraison à ${ville}` : 'Retrait Massé'}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Contact chantier :</span>
                <span className="font-bold text-slate-800">{phoneReception}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black text-[#0B1F3A]">
                <span>Montant total :</span>
                <span>{totalEstimatedFcfa.toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Retour
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={handleFinalSubmit}
                className="inline-flex items-center gap-2 bg-[#0B1F3A] hover:bg-[#132A4C] text-white text-xs font-bold px-6 py-3 rounded-xl shadow-lg shadow-[#0B1F3A]/20 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <SpinnerGap size={16} className="animate-spin" />
                    <span>Transmission usine...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} className="text-white" />
                    <span>Confirmer et transmettre la commande</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS CONFIRMATION */}
        {step === 4 && createdOrder && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-xl text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle size={48} weight="fill" />
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#16A34A] mb-1">
                Commande Enregistrée avec Succès
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#0B1F3A]">
                N° {createdOrder.numero}
              </h1>
              <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
                Votre commande a été transmise au centre logistique de la cimenterie de Massé. Vous recevrez des alertes à chaque étape de préparation.
              </p>
            </div>

            {/* Direct Factory Dispatch Info */}
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl max-w-md mx-auto text-left">
              <div className="font-bold text-xs text-[#0131FD] mb-1">
                Coordination expédition usine :
              </div>
              <p className="text-[12px] text-slate-700">
                Nos équipes coordonnent la mise à quai et le pesage du ciment à l'usine de Massé. Vous pouvez contacter la logistique au <strong className="font-semibold text-slate-900">{SITE_CONFIG.phoneMain}</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-100">
              <Link
                to={`/espace-client/commandes/${createdOrder.id}`}
                className="inline-flex items-center gap-2 bg-[#0B1F3A] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#132A4C] shadow-sm"
              >
                <Truck size={16} />
                <span>Suivre ma commande dans l'espace client</span>
              </Link>
              <Link
                to="/produits"
                className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-slate-50 shadow-sm"
              >
                <span>Retour au catalogue</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
