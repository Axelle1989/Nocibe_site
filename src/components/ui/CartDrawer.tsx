import React from 'react';
import { useCart } from '../../context/CartContext';
import { X, Trash, ArrowRight, ShoppingCart, Plus, Minus } from '@phosphor-icons/react';
import { IconCementBag } from '../icons/IndustryIcons';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToCart: () => void;
  onGoToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onGoToCart,
  onGoToCheckout,
}) => {
  const { items, updateQuantity, removeFromCart, totalEstimatedFcfa, totalTons, totalBags } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1F3A]/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingCart size={22} weight="bold" className="text-[#0B1F3A]" />
            <h3 className="font-playfair font-bold text-lg text-[#0B1F3A]">
              Votre Panier de Commande
            </h3>
            <span className="text-xs bg-[#0B1F3A] text-white px-2 py-0.5 rounded-full font-bold">
              {items.length}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <ShoppingCart size={32} weight="duotone" />
              </div>
              <p className="text-sm font-semibold text-[#0B1F3A]">Votre panier est vide</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Sélectionnez un ciment dans notre gamme pour configurer vos quantités et estimer votre commande.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.productId}
                className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0131FD] flex items-center justify-center shrink-0">
                      <IconCementBag size={22} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0B1F3A]">{item.name}</h4>
                      <span className="text-[11px] font-semibold text-slate-500">{item.shortGrade} &bull; {item.packaging}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId)}
                    className="text-slate-400 hover:text-red-500 p-1"
                    title="Supprimer"
                  >
                    <Trash size={16} />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  {/* Quantity selector */}
                  <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1 bg-slate-50">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-1 hover:bg-white rounded transition text-slate-600"
                    >
                      <Minus size={12} weight="bold" />
                    </button>
                    <span className="font-bold text-[#0B1F3A] min-w-[28px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="p-1 hover:bg-white rounded transition text-slate-600"
                    >
                      <Plus size={12} weight="bold" />
                    </button>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold pr-1">
                      {item.unit}
                    </span>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <span className="font-bold text-[#0B1F3A] block">
                      {(item.unitPrice * item.quantity).toLocaleString()} FCFA
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {item.unitPrice.toLocaleString()} FCFA / {item.unit}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Volume estimé :</span>
                <span className="font-semibold text-slate-800">
                  {totalBags > 0 ? `${totalBags} sacs (environ ${(totalBags * 0.05).toFixed(1)} T)` : ''}
                  {totalTons > 0 && totalBags === 0 ? `${totalTons.toFixed(1)} tonnes` : ''}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#0B1F3A] pt-1 border-t border-slate-200">
                <span>Total estimatif :</span>
                <span className="text-base text-[#0131FD]">
                  {totalEstimatedFcfa.toLocaleString()} FCFA
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block italic">
                * Tarification indicative hors frais de transport vers votre commune.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onGoToCart();
                }}
                className="py-3 px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-xs font-bold text-[#0B1F3A] transition"
              >
                Voir le panier
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onGoToCheckout();
                }}
                className="btn-primary py-3 px-3 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <span>Commander</span>
                <ArrowRight size={14} weight="bold" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
