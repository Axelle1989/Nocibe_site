import React, { useState } from 'react';
import { Product } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { CementBagGraphic } from './CementBagGraphic';
import { ShoppingCart, Plus, Minus, ArrowRight, CheckCircle, Check } from '@phosphor-icons/react';

interface ProductCardProps {
  product: Product;
  onViewDetail: (slug: string) => void;
  onOpenQuote: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetail,
  onOpenQuote,
}) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(product.unit === 'sacs' ? 10 : 5);
  const [isAdded, setIsAdded] = useState(false);

  const subtotal = product.unitPrice * quantity;

  const handleAdd = () => {
    addToCart(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        shortGrade: product.shortGrade,
        packaging: product.packaging,
        unitPrice: product.unitPrice,
        priceDisplay: product.priceDisplay,
        unit: product.unit,
        image: product.image,
      },
      quantity
    );
    setIsAdded(true);
    // Pulse event for header cart badge
    window.dispatchEvent(new CustomEvent('nocibe:cart-pulse'));
    setTimeout(() => setIsAdded(false), 1600);
  };

  return (
    <div
      className={`card-nocibe bg-white p-6 sm:p-7 flex flex-col justify-between relative transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-slate-300 ${
        product.isFeatured ? 'border-2 border-[#0131FD] shadow-lg ring-4 ring-[#0131FD]/10' : ''
      }`}
    >
      {/* Top badges */}
      <div className="flex items-center justify-between mb-3">
        {product.nouveau && (
          <span className="bg-emerald-600 text-white text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-xs">
            Nouveau
          </span>
        )}
        {/* Rare accent #1: Featured recommendation badge */}
        {product.isFeatured && !product.nouveau && (
          <span className="bg-[#F26A1B] text-white text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-xs">
            Recommandé
          </span>
        )}
        {!product.nouveau && !product.isFeatured && (
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Norme EN 197-1
          </span>
        )}

        <span className="text-xs font-bold bg-[#DCFCE7] text-[#16A34A] px-2.5 py-0.5 rounded-full">
          {product.resistance28d}
        </span>
      </div>

      <div>
        {/* Visual representation: Genuine product photograph with smooth zoom on hover */}
        <div
          onClick={() => onViewDetail(product.slug)}
          className="cursor-pointer mb-4 group h-44 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-center p-3 overflow-hidden relative"
          title={`Voir la fiche détaillée de ${product.name}`}
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              width={320}
              height={320}
              className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-110 select-none"
              onError={(e) => {
                // Fallback to graphic if image fails
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <CementBagGraphic
              grade={product.shortGrade}
              className="w-full h-44 transition-transform duration-500 ease-out group-hover:scale-105"
              accentColor={product.isFeatured ? '#0131FD' : '#0B1F3A'}
            />
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-1 mb-3">
          <div className="text-[11px] font-mono font-semibold text-slate-500">
            {product.designation}
          </div>
          <h3
            onClick={() => onViewDetail(product.slug)}
            className="text-lg font-bold font-playfair text-[#0B1F3A] hover:text-[#0131FD] cursor-pointer transition leading-snug"
          >
            {product.name}
          </h3>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {product.targetUse}
          </p>
        </div>

        {/* Price Display */}
        <div className="py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-100 flex items-baseline justify-between mb-4">
          <span className="text-xs text-slate-500 font-medium">Prix indicatif :</span>
          <div className="text-right">
            <span className="text-base font-extrabold text-[#0B1F3A]">
              {product.unitPrice > 0 ? `${product.unitPrice.toLocaleString('fr-FR')} FCFA` : 'Sur devis'}
            </span>
            <span className="text-[11px] text-slate-400 block">/ {product.unit}</span>
          </div>
        </div>

        {/* Quantity selector − / + with tactile scale feedback */}
        <div className="space-y-1.5 mb-4">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Quantité ({product.unit}) :
          </label>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 active:scale-90 text-slate-700 flex items-center justify-center font-bold text-sm shadow-xs transition-transform"
                aria-label="Diminuer la quantité"
              >
                <Minus size={14} weight="bold" />
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center font-bold text-sm text-[#0B1F3A] bg-transparent focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 active:scale-90 text-slate-700 flex items-center justify-center font-bold text-sm shadow-xs transition-transform"
                aria-label="Augmenter la quantité"
              >
                <Plus size={14} weight="bold" />
              </button>
            </div>

            {/* Instant Subtotal with brand blue */}
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total estimé</span>
              <span className="text-sm font-bold text-[#0131FD] transition-all">
                {subtotal > 0 ? `${subtotal.toLocaleString('fr-FR')} FCFA` : 'Sur cotation'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons with brand blue & micro-animation */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={handleAdd}
          className={`w-full py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl transition-all duration-300 shadow-sm ${
            isAdded
              ? 'bg-emerald-600 text-white scale-[1.02] shadow-emerald-500/25 shadow-lg'
              : 'btn-primary active:scale-[0.98]'
          }`}
        >
          {isAdded ? (
            <>
              <Check size={16} weight="bold" className="animate-bounce" />
              <span>Ajouté au panier !</span>
            </>
          ) : (
            <>
              <ShoppingCart size={16} weight="bold" />
              <span>Ajouter au panier</span>
            </>
          )}
        </button>

        <div className="flex items-center justify-between text-xs pt-1">
          <button
            type="button"
            onClick={() => onViewDetail(product.slug)}
            className="text-slate-500 hover:text-[#0131FD] font-semibold flex items-center gap-1 transition"
          >
            <span>Fiche technique</span>
            <ArrowRight size={12} weight="bold" />
          </button>

          <button
            type="button"
            onClick={() => onOpenQuote(product.id)}
            className="text-[#0131FD] hover:text-[#0026C7] font-bold transition-colors"
          >
            Devis B2B &gt;30T
          </button>
        </div>
      </div>
    </div>
  );
};
