import { supabase } from "@/app/lib/supabase";
import { Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import AddToCartButton from "@/app/AddToCartButton";
import ImageSlider from "@/app/ImageSlider/ImageSlider";

async function getProduct(id: string) {
  console.log("Fetching product with id:", id);

  const { data, error } = await supabase
    .from("perfumes")
    .select("*")
    .eq("id", id)
    .single();

  console.log("data:", data, "error:", error);

  if (error) return null;
  return data;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Product not found.</p>
      </div>
    );
  }

  // ✅ parse الـ images
  const rawImages = product.images;
  const images: string[] = Array.isArray(rawImages)
    ? rawImages.map((img: string) => img.trim())
    : typeof rawImages === "string"
    ? JSON.parse(rawImages).map((img: string) => img.trim())
    : [product.image_url.trim()];

  return (
    <main className="min-h-screen bg-[#f8f6f2]">
      {/* Back */}
      <div className="w-[90%] mx-auto pt-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors w-fit"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
      </div>

      {/* Content */}
      <div className="w-[90%] mx-auto py-10 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images Slider */}
        <ImageSlider images={images} />

        {/* Info */}
        <div className="flex flex-col justify-center gap-6">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">
              {product.category}
            </p>
            <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
              <Clock size={14} />
              <span>Longevity 8+ hours</span>
            </div>
            <p className="text-2xl font-semibold">LE {product.price}.00 EGP</p>
          </div>

          {product.description && (
            <p className="text-gray-500 text-sm leading-relaxed">
              {product.description}
            </p>
          )}

          <AddToCartButton product={product} />
        </div>
      </div>
    </main>
  );
}