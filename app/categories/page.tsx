"use client";

import Image from "next/image";
import { useState } from "react";

export default function Categories({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);

  const validImages = Array.isArray(images) && images.length > 0;

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-100 rounded-md overflow-hidden">
        <Image
          src={validImages ? images[current].trim() : "/images/placeholder.png"}
          alt="product"
          fill
          className="object-cover transition-opacity duration-300"
        />
      </div>

      {/* Thumbnails */}
      {validImages && (
        <div className="flex gap-2 flex-wrap">
          {images.map((img, index) => (
            <div
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-16 h-16 relative cursor-pointer border-2 rounded-sm overflow-hidden transition-all ${
                current === index
                  ? "border-black"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <Image
                src={img.trim()}
                alt={`thumb-${index}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}