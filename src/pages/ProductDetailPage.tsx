import React, { useState, useEffect, useRef } from 'react';
import { PRODUCTS, Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { CementBagGraphic } from '../components/ui/CementBagGraphic';
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  DownloadSimple,
  ShieldCheck,
  CheckCircle,
  Check,
  FilePdf,
  ShareNetwork,
  Truck,
  Sparkle,
} from '@phosphor-icons/react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface ProductDetailPageProps {
  slug: string;
  onBackToProducts: () => void;
  onSelectProduct: (slug: string) => void;
  onOpenQuote: (productId: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  slug,
  onBackToProducts,
  onSelectProduct,
  onOpenQuote,
}) => {
  const { addToCart } = useCart();
  const shouldReduceMotion = useReducedMotion();

  const product = PRODUCTS.find((p) => p.slug === slug) || PRODUCTS[1];

  // Active displayed image (can be swapped by clicking thumbnails)
  const [activeImage, setActiveImage] = useState<string>(product.image || '');
  const [quantity, setQuantity] = useState(product.unit === 'sacs' ? 20 : 5);
  const [isAdded, setIsAdded] = useState(false);

  // 3D Tilt state on main image
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, isHovered: false });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveImage(product.image || '');
    setQuantity(product.unit === 'sacs' ? 20 : 5);
  }, [product.slug, product.image, product.unit]);

  const subtotal = product.unitPrice * quantity;
  const associatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 7;
    const rotateX = -((y - centerY) / centerY) * 7;
    setTilt({ rotateX, rotateY, isHovered: true });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, isHovered: false });
  };

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
        image: activeImage || product.image,
      },
      quantity
    );
    setIsAdded(true);
    window.dispatchEvent(new CustomEvent('nocibe:cart-pulse'));
    setTimeout(() => setIsAdded(false), 1600);
  };

  const handleDownloadPdf = () => {
    alert(`Téléchargement officiel de : ${product.pdfFile.name} (${product.pdfFile.size})`);
  };

  // Stagger animation definitions
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  // All available views for the thumbnail gallery
  const allViews = [product.image, ...(product.gallery || [])].filter(
    (img, idx, arr) => img && arr.indexOf(img) === idx
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full py-10 sm:py-16 bg-[#F5F7FA]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Back navigation button */}
        <motion.div variants={itemVariants}>
          <button
            type="button"
            onClick={onBackToProducts}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#0B1F3A] hover:text-[#0131FD] bg-white px-4 py-2.5 rounded-xl border border-slate-200 transition-colors shadow-xs"
          >
            <ArrowLeft size={16} weight="bold" />
            <span>Retour à tous les ciments</span>
          </button>
        </motion.div>

        {/* Product Hero: Gallery (left) + Order & Specs (right) */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10"
        >
          {/* Left Column: Interactive Main Photo + Gallery Thumbnails */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Interactive Visual with 3D Tilt and smooth image swapping */}
            <div
              ref={imageContainerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                perspective: 1000,
              }}
              className="rounded-3xl overflow-hidden bg-slate-50 border border-slate-200 h-80 sm:h-96 lg:h-[420px] flex items-center justify-center p-6 select-none relative cursor-crosshair group shadow-inner"
            >
              <motion.div
                animate={{
                  rotateX: tilt.rotateX,
                  rotateY: tilt.rotateY,
                  scale: tilt.isHovered ? 1.05 : 1,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                }}
                className="w-full h-full flex items-center justify-center"
              >
                <AnimatePresence mode="wait">
                  {activeImage ? (
                    <motion.img
                      key={activeImage}
                      src={activeImage}
                      alt={`Visuel officiel ${product.name}`}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.04 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      loading="eager"
                      width={480}
                      height={480}
                      className="w-full h-full object-contain pointer-events-none select-none max-h-84 drop-shadow-md"
                    />
                  ) : (
                    <CementBagGraphic
                      grade={product.shortGrade}
                      className="w-full h-full max-h-84"
                      accentColor={product.isFeatured ? '#0131FD' : '#0B1F3A'}
                    />
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Gentle zoom indicator on hover */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-xs text-[11px] font-semibold text-slate-600 px-3 py-1 rounded-full border border-slate-200 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                Survol 3D &middot; Vue interactive
              </div>
            </div>

            {/* Gallery Thumbnails: Click to switch main visual */}
            {allViews.length > 1 && (
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Autres vues & conditionnement (cliquez pour afficher) :
                </span>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {allViews.map((img, idx) => {
                    const isSelected = activeImage === img;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImage(img)}
                        className={`h-20 sm:h-22 rounded-2xl border-2 overflow-hidden bg-slate-50 relative transition-all duration-200 focus:outline-none ${
                          isSelected
                            ? 'border-[#0131FD] shadow-md ring-2 ring-[#0131FD]/20 scale-102'
                            : 'border-slate-200 hover:border-slate-400 opacity-75 hover:opacity-100'
                        }`}
                        title={`Afficher la vue ${idx + 1}`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} - Vue ${idx + 1}`}
                          loading="lazy"
                          className="w-full h-full object-cover select-none"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Pricing, Quantity selector & Purchase with Stagger */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <motion.div variants={itemVariants} className="flex items-center gap-2">
                <span className="eyebrow text-[#0131FD]">{product.standard}</span>
                {product.nouveau && (
                  <span className="bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                    Nouveau
                  </span>
                )}
                {/* Rare accent #2: Featured badge */}
                {product.isFeatured && (
                  <span className="bg-[#F26A1B] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-xs">
                    Recommandé
                  </span>
                )}
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold font-playfair text-[#0B1F3A] leading-tight"
              >
                {product.name}
              </motion.h1>

              <motion.div
                variants={itemVariants}
                className="flex items-center gap-3 text-xs text-slate-500 font-semibold"
              >
                <span>Classe : {product.classe}</span>
                <span>&bull;</span>
                <span>
                  Résistance 28j :{' '}
                  <strong className="text-[#16A34A]">{product.resistance28d}</strong>
                </span>
                <span>&bull;</span>
                <span>{product.packaging}</span>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="text-xs sm:text-sm text-slate-600 leading-relaxed"
              >
                {product.description}
              </motion.p>

              {/* Price card */}
              <motion.div
                variants={itemVariants}
                className="p-5 rounded-2xl bg-[#EBF3FF]/60 border border-[#0131FD]/20 flex items-center justify-between"
              >
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Prix indicatif TTC
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-[#0B1F3A]">
                    {product.unitPrice > 0
                      ? `${product.unitPrice.toLocaleString('fr-FR')} FCFA`
                      : 'Sur cotation'}
                  </div>
                  <span className="text-xs text-slate-500">Par {product.unit} (tarif départ usine Massé)</span>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold text-[#16A34A] flex items-center gap-1 justify-end">
                    <CheckCircle size={16} weight="fill" />
                    <span>Disponibilité continue</span>
                  </span>
                  <span className="text-[11px] text-slate-500">Usine de Massé (Plateau)</span>
                </div>
              </motion.div>

              {/* Quantity selector − / + with tactile feedback & animated total */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-xs font-bold text-[#0B1F3A]">
                  Choisir la quantité à commander ({product.unit}) :
                </label>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center border border-slate-300 rounded-xl bg-white p-1 shadow-xs">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-base transition-colors"
                      aria-label="Diminuer la quantité"
                    >
                      <Minus size={16} weight="bold" />
                    </motion.button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 text-center font-bold text-base text-[#0B1F3A] bg-transparent focus:outline-none"
                    />
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-base transition-colors"
                      aria-label="Augmenter la quantité"
                    >
                      <Plus size={16} weight="bold" />
                    </motion.button>
                  </div>

                  {/* Animated Subtotal Counter */}
                  <div className="text-left">
                    <span className="text-xs text-slate-400 block font-semibold">Total estimatif :</span>
                    <motion.span
                      key={subtotal}
                      initial={shouldReduceMotion ? false : { opacity: 0.7, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="text-xl font-black text-[#0131FD] block"
                    >
                      {subtotal > 0 ? `${subtotal.toLocaleString('fr-FR')} FCFA` : 'Sur devis'}
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* CTAs: Add to Cart and PDF Sheet */}
            <motion.div variants={itemVariants} className="space-y-3 pt-4 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAdd}
                  className={`py-3.5 px-6 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl transition-all duration-300 shadow-md ${
                    isAdded
                      ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                      : 'btn-primary'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check size={18} weight="bold" className="animate-bounce" />
                      <span>Ajouté au panier !</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} weight="bold" />
                      <span>Ajouter au panier</span>
                    </>
                  )}
                </motion.button>

                <button
                  type="button"
                  onClick={() => onOpenQuote(product.id)}
                  className="btn-marine py-3.5 px-6 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <span>Demande de devis B2B</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleDownloadPdf}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition"
              >
                <DownloadSimple size={16} weight="bold" />
                <span>Télécharger la fiche technique officielle ({product.pdfFile.name})</span>
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Detailed technical characteristics table */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6"
        >
          <h3 className="text-xl font-bold font-playfair text-[#0B1F3A]">
            Caractéristiques Techniques Complètes (Norme EN 197-1)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Désignation normalisée :</span>
                <span className="font-bold text-[#0B1F3A]">{product.designation}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Résistance mécanique à 2 jours :</span>
                <span className="font-bold text-[#0B1F3A]">{product.resistance2d}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Résistance mécanique à 28 jours :</span>
                <span className="font-bold text-[#16A34A]">{product.resistance28d}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Finesse de mouture (Blaine) :</span>
                <span className="font-bold text-[#0B1F3A]">{product.technicalData.blaineFineness}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Temps de début de prise :</span>
                <span className="font-bold text-[#0B1F3A]">{product.technicalData.initialSet}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Stabilité Le Chatelier :</span>
                <span className="font-bold text-[#0B1F3A]">{product.technicalData.stabilite}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Perte au feu :</span>
                <span className="font-bold text-[#0B1F3A]">{product.technicalData.perteFeu}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Mode de livraison :</span>
                <span className="font-bold text-[#0B1F3A]">{product.packaging}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Associated Products */}
        <motion.div variants={itemVariants} className="space-y-6">
          <h3 className="text-xl sm:text-2xl font-bold font-playfair text-[#0B1F3A]">
            Produits associés de la gamme NOCIBÉ
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {associatedProducts.map((assoc) => (
              <div
                key={assoc.id}
                onClick={() => onSelectProduct(assoc.slug)}
                className="card-nocibe p-5 bg-white border-slate-200 cursor-pointer flex items-center gap-4 group hover:-translate-y-1 hover:shadow-lg transition-all"
              >
                <div className="w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 p-1 overflow-hidden">
                  {assoc.image ? (
                    <img
                      src={assoc.image}
                      alt={assoc.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <CementBagGraphic grade={assoc.shortGrade} className="w-full h-full max-h-14 p-1" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0B1F3A] group-hover:text-[#0131FD] transition-colors">
                    {assoc.name}
                  </h4>
                  <span className="text-[11px] text-[#16A34A] font-semibold block">{assoc.resistance28d}</span>
                  <span className="text-[11px] text-slate-400 block">{assoc.priceDisplay}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductDetailPage;
