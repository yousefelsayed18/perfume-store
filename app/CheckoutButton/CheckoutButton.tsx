// app/components/CheckoutButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { addToCart } from "@/app/services/services";

export default function CheckoutButton({ perfumeId }: { perfumeId: string }) {
  const router = useRouter();

  const handleCheckout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await addToCart(perfumeId);
    window.dispatchEvent(new Event("cart-updated"));
    router.push("/checkout");
  };

  return (
    <button
      onClick={handleCheckout}
      className="mt-3 w-full flex items-center justify-center gap-2 bg-[#1a1a1a] text-white text-sm py-3 hover:bg-black transition-colors"
    >
      <ShoppingCart size={16} />
      FAST CHECKOUT
    </button>
  );
}