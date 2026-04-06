"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "../lib/supabase";
import { Perfume } from "../types";
import { ShoppingCart } from "lucide-react";
import { addToCart } from "../services/services";
import { useCart } from "../Context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Products() {
  const [products, setProducts] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState<string | number | null>(null);
  const [cartLoadingId, setCartLoadingId] = useState<string | number | null>(
    null,
  );
  const [checkoutLoadingId, setCheckoutLoadingId] = useState<
    string | number | null
  >(null);
  const { fetchCartCount } = useCart();
  const router = useRouter();

  useEffect(() => {
    async function getAllData() {
      const { data, error } = await supabase.from("perfumes").select("*");
      if (!error && data) {
        setProducts(
          data.map((item) => ({ ...item, image_url: item.image_url.trim() })),
        );
      }
      setLoading(false);
    }
    getAllData();
  }, []);

  const handleAddToCart = async (e: React.MouseEvent, product: Perfume) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartLoadingId === product.id) return;
    setCartLoadingId(product.id);
    const { error } = await addToCart(product.id);
    if (!error) {
      setAddedId(product.id);
      window.dispatchEvent(new Event("cart-updated"));
      fetchCartCount();
      setTimeout(() => setAddedId(null), 1500);
    }
    setCartLoadingId(null);
  };

  const handleFastCheckout = async (e: React.MouseEvent, product: Perfume) => {
    e.preventDefault();
    e.stopPropagation();
    if (checkoutLoadingId === product.id) return;
    setCheckoutLoadingId(product.id);
    const { error } = await addToCart(product.id);
    if (!error) {
      window.dispatchEvent(new Event("cart-updated"));
      router.push("/checkout");
    } else {
      alert("❌ Something went wrong");
    }
    setCheckoutLoadingId(null);
  };

  return (
    <div className="w-[90%] mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>

      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-md" />
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group">
              <Link href={`/products/${product.id}`}>
                <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-md">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={cartLoadingId === product.id}
                    className="absolute bottom-3 right-3 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition shadow"
                  >
                    <ShoppingCart
                      size={16}
                      className={
                        addedId === product.id ? "text-green-500" : "text-black"
                      }
                    />
                  </button>
                  {addedId === product.id && (
                    <div className="absolute bottom-3 left-3 bg-black text-white text-xs px-3 py-1 rounded-full">
                      Added!
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <p className="text-sm text-gray-400 uppercase">Perfume</p>
                  <h2 className="text-base font-semibold">{product.name}</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    LE {product.price} EGP
                  </p>
                </div>
              </Link>

              {/* ✅ Add to Cart */}
              <button
                onClick={(e) => handleAddToCart(e, product)}
                disabled={cartLoadingId === product.id}
                className="mt-3 w-full flex items-center justify-center gap-2 border border-[#1a1a1a] text-[#1a1a1a] py-2 text-sm hover:bg-gray-100 transition disabled:opacity-50"
              >
                <ShoppingCart size={14} />
                {cartLoadingId === product.id ? "Adding..." : "Add to Cart"}
              </button>

              {/* ✅ Fast Checkout */}
              <button
                onClick={(e) => handleFastCheckout(e, product)}
                disabled={checkoutLoadingId === product.id}
                className="mt-2 w-full flex items-center justify-center gap-2 bg-[#1a1a1a] text-white py-2 text-sm hover:bg-black transition disabled:opacity-50"
              >
                <ShoppingCart size={14} />
                {checkoutLoadingId === product.id
                  ? "Loading..."
                  : "Fast Checkout"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
