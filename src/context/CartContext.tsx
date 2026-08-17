import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CartMap, Produto } from '../types';

interface CartContextValue {
  cart: CartMap;
  produtos: Produto[];
  setProdutos: (p: Produto[]) => void;
  addToCart: (id: number) => void;
  removeFromCart: (id: number) => void;
  removeItemCompletely: (id: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartMap>({});
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = useCallback(
    (id: number) => {
      setCart((prev) => {
        const produto = produtos.find((p) => p.id === id);
        const noCarrinho = prev[id] || 0;
        if (produto && produto.estoque !== undefined && noCarrinho >= produto.estoque) return prev;
        return { ...prev, [id]: noCarrinho + 1 };
      });
    },
    [produtos]
  );

  const removeFromCart = useCallback((id: number) => {
    setCart((prev) => {
      const next = { ...prev };
      if (next[id] > 1) next[id] -= 1;
      else delete next[id];
      return next;
    });
  }, []);

  const removeItemCompletely = useCallback((id: number) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const clearCart = useCallback(() => setCart({}), []);

  const cartCount = useMemo(() => Object.values(cart).reduce((s, v) => s + v, 0), [cart]);

  const cartTotal = useMemo(() => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const p = produtos.find((x) => x.id === Number(id));
      return sum + (p ? p.preco * qty : 0);
    }, 0);
  }, [cart, produtos]);

  const value: CartContextValue = {
    cart,
    produtos,
    setProdutos,
    addToCart,
    removeFromCart,
    removeItemCompletely,
    clearCart,
    cartCount,
    cartTotal,
    isCartOpen,
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart deve ser usado dentro de CartProvider');
  return ctx;
}
