import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  shortGrade: string;
  packaging: string;
  unitPrice: number; // in FCFA, 0 if quote only
  priceDisplay: string;
  quantity: number;
  unit: 'sacs' | 'tonnes';
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalEstimatedFcfa: number;
  totalBags: number;
  totalTons: number;
  itemCount: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  toastMessage: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'nocibe_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.warn('Could not save cart to localStorage', err);
    }
  }, [items]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const addToCart = (product: Omit<CartItem, 'quantity'>, quantity: number) => {
    if (quantity <= 0) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.productId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { ...product, quantity }];
    });
    showToast(`✓ Ajouté au panier : ${quantity} ${product.unit} de ${product.name}`);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalEstimatedFcfa = items.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0
  );

  const totalBags = items
    .filter((i) => i.unit === 'sacs')
    .reduce((acc, item) => acc + item.quantity, 0);

  const totalTons = items.reduce((acc, item) => {
    if (item.unit === 'tonnes') return acc + item.quantity;
    if (item.unit === 'sacs') return acc + (item.quantity * 50) / 1000;
    return acc;
  }, 0);

  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalEstimatedFcfa,
        totalBags,
        totalTons,
        itemCount,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        toastMessage,
      }}
    >
      {children}
      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-6 md:bottom-6 z-50 bg-[#0B1F3A] text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/20 text-xs sm:text-sm font-semibold flex items-center gap-3 animate-bounce-subtle">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
