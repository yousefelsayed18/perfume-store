import Image from "next/image";
import { ShoppingCart, Clock } from "lucide-react";
import { getPerfumesByCategory } from "@/app/services/services";
import Link from "next/link";
import CheckoutButton from "@/app/CheckoutButton/CheckoutButton";

export default async function Women() {
  const perfumes = await getPerfumesByCategory("women");

  return (
    <main className="w-[90%] mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-widest">Women</h1>
        <p className="text-sm text-gray-500">{perfumes.length} products</p>
      </div>

      {perfumes.length === 0 ? (
        <p className="text-gray-400 text-sm">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {perfumes.map((perfume) => (
            <div key={perfume.id} className="group">
              {/* Image + Info - بتودي لصفحة المنتج */}
              <Link href={`/products/${perfume.id}`}>
                <div className="relative w-full aspect-square rounded-sm overflow-hidden bg-gray-100 group/card">
                  <Image
                    src={perfume.image_url.trim()}
                    alt={perfume.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                  />
                  <div className="absolute bottom-3 right-3 bg-white rounded-full p-2 opacity-0 group-hover/card:opacity-100 transition-opacity shadow">
                    <ShoppingCart size={16} />
                  </div>
                </div>

                <div className="mt-3 space-y-1">
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <Clock size={12} />
                    <span>Longevity 8+ hours</span>
                  </div>
                  <p className="text-base font-semibold">{perfume.name}</p>
                  <p className="text-sm text-gray-600">LE {perfume.price} EGP</p>
                </div>
              </Link>

              {/* ✅ Checkout Button */}
              <CheckoutButton perfumeId={String(perfume.id)} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}