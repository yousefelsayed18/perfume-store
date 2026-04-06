"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getCart } from "../services/services";

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [Count, setCount] = useState(0);

  const fetchCartCount = async () => {
    const cart = await getCart();

    // 🔥 لو عايز تحسب الكمية مش عدد المنتجات
    const total = cart.reduce(
      (acc: number, item: any) => acc + item.quantity,
      0
    );

    setCount(total);
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ Count, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);