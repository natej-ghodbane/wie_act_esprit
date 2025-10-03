"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CartLineItem, getCart, saveCart, clearCart as clearCartUtil } from '@/utils/cart';

interface CartContextValue {
  items: CartLineItem[];
  total: number;
  count: number;
  setItems: (items: CartLineItem[]) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>([]);

  useEffect(() => {
    setItems(getCart());
    const onUpdate = () => setItems(getCart());
    window.addEventListener('cart:updated', onUpdate as EventListener);
    return () => window.removeEventListener('cart:updated', onUpdate as EventListener);
  }, []);

  const value = useMemo<CartContextValue>(() => ({
    items,
    total: items.reduce((s, i) => s + i.price * i.quantity, 0),
    count: items.reduce((s, i) => s + i.quantity, 0),
    setItems: (next) => {
      setItems(next);
      saveCart(next);
    },
    clearCart: () => {
      clearCartUtil();
      setItems([]);
    },
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}



