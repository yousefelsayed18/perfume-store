"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/app/lib/supabase";
import { useCart } from "../Context/CartContext";
import Link from "next/link";

async function getCartId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) return user.id;

  let guestId = localStorage.getItem("guest_id");
  if (!guestId) {
    guestId = crypto.randomUUID();
    localStorage.setItem("guest_id", guestId);
  }
  return guestId;
}

export default function CartPage() {
  const { fetchCartCount } = useCart();
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    const guest_id = await getCartId(); // ✅

    const { data } = await supabase
      .from("Cart")
      .select("*, perfumes(*)")
      .eq("guest_id", guest_id);

    if (data) setCart(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
    fetchCartCount();
  }, []);

  const removeItem = async (id: number) => {
    await supabase.from("Cart").delete().eq("id", id);
    fetchCart();
    fetchCartCount();
    window.dispatchEvent(new Event("cart-updated"));
  };

  const updateQty = async (id: number, qty: number) => {
    if (qty < 1) return;
    await supabase.from("Cart").update({ quantity: qty }).eq("id", id);
    fetchCart();
    fetchCartCount();
  };

  const total = cart.reduce(
    (acc, item) => acc + item.perfumes.price * item.quantity, 0
  );

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <div className="w-[90%] mx-auto py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-2xl font-bold">Your Cart 🛒</h1>

        {cart.length === 0 && <p>Your cart is empty</p>}

        {cart.map((item) => (
          <div key={item.id} className="flex gap-4 border rounded-lg p-4 shadow-sm">
            <Image
              src={item.perfumes.image_url}
              alt={item.perfumes.name}
              width={100}
              height={100}
              className="rounded-md object-cover"
            />
            <div className="flex-1">
              <p className="font-semibold text-lg">{item.perfumes.name}</p>
              <p className="text-gray-500 text-sm">LE {item.perfumes.price}</p>
              <div className="flex items-center gap-3 mt-3">
                <button onClick={() => updateQty(item.id, item.quantity - 1)} className="px-3 py-1 border rounded">-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQty(item.id, item.quantity + 1)} className="px-3 py-1 border rounded">+</button>
              </div>
            </div>
            <div className="flex flex-col justify-between items-end">
              <p className="font-semibold">LE {item.perfumes.price * item.quantity}</p>
              <button onClick={() => removeItem(item.id)} className="text-red-500 text-sm">Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="border rounded-lg p-6 shadow-sm h-fit">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>LE {total}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between font-bold text-lg mb-6">
          <span>Total</span>
          <span>LE {total}</span>
        </div>
        <Link href="/checkout">
          <button className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition">
            Checkout
          </button>
        </Link>
      </div>
    </div>
  );
}