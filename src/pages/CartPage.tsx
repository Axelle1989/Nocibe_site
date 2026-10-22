import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { SectionHeader } from '../components/ui/SectionHeader';
import { ShoppingCart, Plus, Minus, Trash, ArrowRight, ShieldCheck, ArrowLeft, X, LockKey } from '@phosphor-icons/react';
import { IconCementBag } from '../components/icons/IndustryIcons';

interface CartPageProps {
  onBackToProducts: () => void;
  onProceedToCheckout: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onBackToProducts, onProceedToCheckout }) => {
  const { items, updateQuantity, removeFromCart, clearCart, totalEstimatedFcfa, totalBags, totalTons } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleValidationClick = () => {
    if (!user) {
      setAuthModalOpen(true);
    } else {
      onProceedToCheckout();
    }
  };

  return (
    <div className="w-full py-12 sm:py-16 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          eyebrow="Récapitulatif de Commande"
          titleBeforeItalic="Votre"
          italicWord="panier"
          titleAfterItalic="de ciment"
          subtitle="Ajustez vos volumes de ciment en sacs ou en vrac. Le panier est conservé sur votre appareil sans nécessiter de compte."
        />

        {items.length === 0 ? (
          <div className="card-nocibe p-12 bg-white border-slate-200 text-center max-w-xl mx-auto space-y-4">
            <div className="w-20 h-20 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <ShoppingCart size={40} weight="duotone" />
            </div>
            <h3 className="text-xl font-bold font-playfair text-[#0B1F3A]">
              Votre panier est actuellement vide
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Explorez notre gamme de ciments certifiés EN 197-1 et ajoutez les quantités requises pour votre chantier.
            </p>
            <button
              type="button"
              onClick={onBackToProducts}
              className="btn-primary px-6 py-3 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2"
            >
              <span>Découvrir la gamme</span>
              <ArrowRight size={14} weight="bold" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Items list (8 cols) */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Articles sélectionnés ({items.length})
                </span>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-red-500 hover:text-red-700 font-semibold"
                >
                  Vider le panier
                </button>
              </div>

              <div className="divide-y divide-slate-100 space-y-4">
                {items.map((item) => (
                  <div key={item.productId} className="pt-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0131FD] flex items-center justify-center shrink-0">
                        <IconCementBag size={26} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#0B1F3A]">{item.name}</h4>
                        <span className="text-xs text-slate-500 block">
                          {item.shortGrade} &bull; {item.packaging}
                        </span>
                        <span className="text-xs font-bold text-[#0131FD]">
                          {item.unitPrice.toLocaleString()} FCFA / {item.unit}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      {/* Quantity selector */}
                      <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 p-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm shadow-xs transition"
                        >
                          <Minus size={12} weight="bold" />
                        </button>
                        <span className="w-14 text-center font-bold text-sm text-[#0B1F3A]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm shadow-xs transition"
                        >
                          <Plus size={12} weight="bold" />
                        </button>
                      </div>

                      {/* Line total */}
                      <div className="text-right min-w-[100px]">
                        <span className="text-sm font-extrabold text-[#0B1F3A] block">
                          {(item.unitPrice * item.quantity).toLocaleString()} FCFA
                        </span>
                      </div>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId)}
                        className="text-slate-400 hover:text-red-500 p-2"
                        title="Supprimer la ligne"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={onBackToProducts}
                  className="text-xs font-semibold text-slate-600 hover:text-[#0B1F3A] flex items-center gap-1.5"
                >
                  <ArrowLeft size={14} weight="bold" />
                  <span>Continuer mes achats</span>
                </button>
              </div>
            </div>

            {/* Order Summary & Validation (4 cols) */}
            <div className="lg:col-span-4 bg-[#0B1F3A] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <h3 className="font-playfair font-bold text-xl text-white">
                Synthèse de la Commande
              </h3>

              <div className="space-y-3 text-xs text-slate-300 border-b border-white/10 pb-5">
                <div className="flex justify-between">
                  <span>Poids total estimé :</span>
                  <span className="font-semibold text-white">
                    {totalBags > 0 ? `${totalBags} sacs (~ ${(totalBags * 0.05).toFixed(1)} T)` : ''}
                    {totalTons > 0 && totalBags === 0 ? `${totalTons.toFixed(1)} tonnes` : ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Lieu d'enlèvement :</span>
                  <span className="font-semibold text-white">Usine Massé ou Livraison</span>
                </div>
                <div className="flex justify-between">
                  <span>Délai moyen constaté :</span>
                  <span className="font-semibold text-[#16A34A]">24 à 48 heures</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">
                  Montant estimé des fournitures
                </span>
                <div className="text-3xl font-extrabold text-[#00CCFF]">
                  {totalEstimatedFcfa.toLocaleString()} FCFA
                </div>
                <p className="text-[11px] text-slate-400 leading-tight pt-1">
                  * Hors frais de déchargement et transport camion selon la commune.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleValidationClick}
                  className="w-full btn-primary py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>Passer la commande</span>
                  <ArrowRight size={16} weight="bold" />
                </button>

                <div className="text-center text-[11px] text-slate-400 bg-white/5 p-3 rounded-xl border border-white/10">
                  <ShieldCheck size={16} weight="bold" className="text-[#16A34A] inline mr-1" />
                  <span>Validation requérant un compte client vérifié par email.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auth required modal before checkout */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0B1F3A]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-center relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl"
            >
              <X size={20} weight="bold" />
            </button>

            <div className="w-14 h-14 bg-[#0B1F3A]/10 text-[#0B1F3A] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#0B1F3A]/15">
              <LockKey size={30} weight="duotone" />
            </div>

            <h3 className="text-xl font-bold font-playfair text-[#0B1F3A] mb-2">
              Identification requise
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Connectez-vous ou créez un compte pour passer commande. <br />
              <strong className="text-[#0B1F3A]">Votre panier est conservé.</strong>
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => navigate('/connexion', { state: { from: { pathname: '/commande' } } })}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-[#0B1F3A] hover:bg-[#132A4C] text-white shadow transition"
              >
                Se connecter
              </button>

              <button
                type="button"
                onClick={() => navigate('/inscription', { state: { from: { pathname: '/commande' } } })}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold border border-[#0B1F3A] text-[#0B1F3A] hover:bg-slate-50 transition"
              >
                Créer un compte client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
