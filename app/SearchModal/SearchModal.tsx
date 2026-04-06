"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

interface Perfume {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
}

function getRecentlyViewed(): Perfume[] {
  try {
    return JSON.parse(localStorage.getItem("recently_viewed") || "[]");
  } catch {
    return [];
  }
}

export default function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Perfume[]>([]);
  const [recent, setRecent] = useState<Perfume[]>([]);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // focus + reset
  useEffect(() => {
    if (open) {
      setRecent(getRecentlyViewed());
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden"; // منع scroll
    } else {
      setQuery("");
      setResults([]);
      document.body.style.overflow = "auto";
    }
  }, [open]);

  // ESC close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // search debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setSearching(true);

      const { data } = await supabase
        .from("perfumes")
        .select("*")
        .ilike("name", `%${query}%`)
        .limit(8);

      if (data) setResults(data);

      setSearching(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const clearRecent = () => {
    localStorage.removeItem("recently_viewed");
    setRecent([]);
  };

  if (typeof window === "undefined") return null;

  return createPortal(
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Modal */}
      <div
        className={`fixed top-0 left-0 w-full bg-white z-[9999] shadow-xl transform transition-all duration-300 ${
          open ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        {/* Search Bar */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <Search size={18} className="text-gray-400" />

          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search perfumes..."
            className="flex-1 text-sm outline-none bg-transparent placeholder-gray-400"
          />

          <button onClick={onClose}>
            <X className="text-gray-400 hover:text-black transition-colors" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {/* Recently Viewed */}
          {!query && recent.length > 0 && (
            <div>
              <div className="flex justify-between mb-4">
                <p className="text-xs uppercase text-gray-500 tracking-widest">
                  Recently viewed
                </p>
                <button
                  onClick={clearRecent}
                  className="text-xs text-gray-400 hover:text-black"
                >
                  Clear
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {recent.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    onClick={onClose}
                    className="group hover:opacity-80 transition"
                  >
                    <div className="relative aspect-square bg-gray-100 rounded-md overflow-hidden mb-2">
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-xs truncate">{product.name}</p>
                    <p className="text-xs text-gray-400">LE {product.price}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {query && (
            <div>
              <p className="text-xs uppercase text-gray-500 tracking-widest mb-4">
                Products
              </p>

              {searching && (
                <div className="flex justify-center py-10">
                  <div className="w-6 h-6 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
                </div>
              )}

              {!searching && results.length === 0 && (
                <p className="text-center text-sm text-gray-400 py-10">
                  No results for "{query}"
                </p>
              )}

              {!searching && results.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      onClick={onClose}
                      className="group hover:opacity-80 transition"
                    >
                      <div className="relative aspect-square bg-gray-100 rounded-md overflow-hidden mb-2">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <p className="text-xs truncate">{product.name}</p>
                      <p className="text-xs text-gray-400">LE {product.price}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}