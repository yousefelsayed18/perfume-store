"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, ShoppingCart } from "lucide-react";
import { supabase } from "@/app/lib/supabase";
import { Perfume } from "@/app/types";
import { addToCart } from "../services/services";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../Context/CartContext";

export default function ProductsSlider() {
   const { fetchCartCount } = useCart();
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const router = useRouter();

  const [products, setProducts] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState<string | number | null>(null);
  const [loadingId, setLoadingId] = useState<string | number | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("perfumes")
        .select("*")
        .eq("category", "men");

      if (error) console.error(error);

      if (data) {
        const cleanData = data.map((item) => ({
          ...item,
          image_url: item.image_url.trim(),
        }));
        setProducts(cleanData);
      }

      setLoading(false);
    };

    fetchProducts();
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (!sliderRef.current) return;
    const el = sliderRef.current;
    el.scrollBy({
      left: dir === "right" ? el.clientWidth * 0.8 : -el.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a, button")) return;
    const el = sliderRef.current!;
    isDragging.current = true;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeft.current = el.scrollLeft;
    el.style.cursor = "grabbing";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !sliderRef.current) return;
    const el = sliderRef.current;
    const x = e.pageX - el.offsetLeft;
    el.scrollLeft = scrollLeft.current - (x - startX.current);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (sliderRef.current) sliderRef.current.style.cursor = "grab";
  };

  const handleAddToCart = async (product: Perfume) => {
    if (loadingId === product.id) return;
    setLoadingId(product.id);
    const { error } = await addToCart(product.id);
    if (!error) {
      setAddedId(product.id);
       await fetchCartCount();
      setTimeout(() => setAddedId(null), 2000);
    } else {
      alert("❌ Something went wrong");
    }
    setLoadingId(null);
  };

  // ✅ Fast Checkout
  const handleFastCheckout = async (e: React.MouseEvent, product: Perfume) => {
    e.preventDefault();
    e.stopPropagation();
    if (loadingId === product.id) return;
    setLoadingId(product.id);
    const { error } = await addToCart(product.id);
    if (!error) {
      window.dispatchEvent(new Event("cart-updated"));
      router.push("/checkout");
    } else {
      alert("❌ Something went wrong");
    }
    setLoadingId(null);
  };

  return (
    <section className="w-[90%] mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-widest">Men</h2>

        <a
          href="/categories/men"
          className="text-sm text-gray-500 hover:text-black transition-colors"
        >
          View all
        </a>
      </div>

      {loading && (
        <div className="flex gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="min-w-[280px] animate-pulse">
              <div className="w-full aspect-square bg-gray-200 rounded-sm" />
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <div className="relative group">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-[45%] -translate-y-1/2 -translate-x-5 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={20} />
          </button>

          <div
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="flex gap-4 overflow-x-auto pb-2 cursor-grab select-none"
            style={{ scrollbarWidth: "none" }}
          >
            {products.map((product) => (
              <div key={product.id} className="min-w-[280px] flex-shrink-0">
                {/* Image - بتودي لصفحة المنتج */}
                <Link href={`/products/${product.id}`}>
                  <div className="relative w-full aspect-square rounded-sm overflow-hidden bg-gray-100 group/card">
                    <Image
                      src={encodeURI(product.image_url.trim())}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                      draggable={false}
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      disabled={loadingId === product.id}
                      className="absolute bottom-3 right-3 bg-white rounded-full p-2 opacity-0 group-hover/card:opacity-100 transition-opacity shadow"
                    >
                      <ShoppingCart
                        size={16}
                        className={
                          addedId === product.id
                            ? "text-green-500"
                            : "text-black"
                        }
                      />
                    </button>
                    {addedId === product.id && (
                      <div className="absolute bottom-3 left-3 bg-black text-white text-xs px-3 py-1 rounded-full">
                        ✅ Added to cart!
                      </div>
                    )}
                  </div>

                  <div className="mt-3 space-y-1">
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <Clock size={12} />
                      <span>Longevity 8+ hours</span>
                    </div>
                    <p className="text-base font-semibold">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      LE {product.price} EGP
                    </p>
                  </div>
                </Link>

                {/* ✅ Fast Checkout Button */}
                <button
                  onClick={(e) => handleFastCheckout(e, product)}
                  disabled={loadingId === product.id}
                  className="mt-3 w-full flex items-center justify-center gap-2 bg-[#1a1a1a] text-white text-sm py-3 hover:bg-black transition-colors disabled:opacity-50"
                >
                  <ShoppingCart size={16} />
                  {loadingId === product.id ? "Loading..." : "FAST CHECKOUT"}
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-[45%] -translate-y-1/2 translate-x-5 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </section>
  );
}
