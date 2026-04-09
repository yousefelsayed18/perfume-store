// app/products/[id]/AddToCartButton.tsx
"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { addToCart } from "@/app/services/services";
import { useCart } from "./Context/CartContext";

export default function AddToCartButton({ product }: { product: any }) {
   const { fetchCartCount } = useCart();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    const { error } = await addToCart(product.id);
    if (!error) {
      setAdded(true);
       await fetchCartCount();
      setTimeout(() => setAdded(false), 2000);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] text-white py-4 text-sm tracking-widest uppercase hover:bg-black transition-colors disabled:opacity-50"
    >
      <ShoppingCart size={16} />
      {loading ? "Adding..." : added ? "✅ Added to Cart!" : "Add to Cart"}
    </button>
  );
}