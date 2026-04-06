// app/categories/men/page.tsx
import Image from "next/image";
import { ShoppingCart, Clock } from "lucide-react";
import { getPerfumesByCategory } from "@/app/services/services";

export default async function Unisix() {
  const perfumes = await getPerfumesByCategory("unisex");

  return (
    <main className="w-[90%] mx-auto py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-widest">Unisix</h1>
        <p className="text-sm text-gray-500">{perfumes.length} products</p>
      </div>

      {/* Grid */}
      {perfumes.length === 0 ? (
        <p className="text-gray-400 text-sm">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {perfumes.map((perfume) => (
            <div key={perfume.id} className="group">
              {/* Image */}
              <div className="relative w-full aspect-square rounded-sm overflow-hidden bg-gray-100 group/card">
                <Image
                  src={perfume.image_url}
                  alt={perfume.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                />
                <button className="absolute bottom-3 right-3 bg-white rounded-full p-2 opacity-0 group-hover/card:opacity-100 transition-opacity shadow">
                  <ShoppingCart size={16} />
                </button>
              </div>

              {/* Info */}
              <div className="mt-3 space-y-1">
                <div className="flex items-center gap-1 text-gray-400 text-xs">
                  <Clock size={12} />
                  <span>Longevity 8+ hours</span>
                </div>
                <p className="text-base font-semibold">{perfume.name}</p>
                <p className="text-sm text-gray-600">
                  LE {perfume.price}.00 EGP
                </p>
              </div>

              {/* Button */}
              <button className="mt-3 w-full flex items-center justify-center gap-2 bg-[#1a1a1a] text-white text-sm py-3 hover:bg-black transition-colors">
                <ShoppingCart size={16} />
                FAST CHECKOUT
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
