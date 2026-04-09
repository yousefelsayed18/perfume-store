// components/ProductsSlider.tsx
"use client";

import Image from "next/image";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, Clock, ShoppingCart } from "lucide-react";

interface Product {
  id: number;
  brand: string;
  name: string;
  price: number;
  longevity: string;
  image: string;
}

const products: Product[] = [
  {
    id: 1,
    brand: "STRONGER WITH YOU INTENSELY",
    name: "Toffee Crush",
    price: 480,
    longevity: "💕تحفة جدا بجد",
    image: "/images/1.jpg", // ✅
  },
  {
    id: 2,
    brand: "ALTHAÏR (PARFUMS DE MARLY)",
    name: "Althaïr Royal Essence",
    price: 750,
    longevity: "دا احلى برفان جربته في حياتي وااو بجد❤️",
    image: "/images/zara.jpg", // ✅
  },
  {
    id: 3,
    brand: "LE MALE LE PARFUM",
    name: "Le Noir Éclat",
    price: 450,
    longevity: "مشاء الله جودة ممتازه وتعامل احلا واحلا💕",
    image: "/images/3.jpg", // ✅
  },
  {
    id: 4,
    brand: "LE MALE ELIXIR",
    name: "Golden Velvet",
    price: 480,
    longevity: "كواليتي متميز جدا مشاءالله😍",
    image: "/images/4.jpg", // ✅
  },
  {
    id: 5,
    brand: "INITIO SIDE EFI",
    name: "Toxic Desire",
    price: 650,
    longevity: "واو بجد منتج قمة في الجمال",
    image: "/images/5.jpg", // ✅
  },
  {
    id: 6,
    brand: "CREED",
    name: "Imperial Leather",
    price: 550,
    longevity: "مشاء الله عليكم باكديج وجودة المنتج تحفة",
    image: "/images/6.jpg", // ✅
  },
  {
    id: 7,
    brand: "LOUIS VUITTON",
    name: "Black Amber Voyage",
    price: 850,
    longevity: "معامله ممتازه وقمة في الاحترام وبرفان تحفة💕",
    image: "/images/7.jpg", // ✅
  },
];

export default function Customers() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const scroll = (dir: "left" | "right") => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({
      left: dir === "right" ? 340 : -340,
      behavior: "smooth",
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
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

  return (
    <section className="w-[90%] mx-auto py-10">
      {/* Header */}
      <div className=" mb-6 text-center">
        <h1 className="text-4xl font-bold tracking-widest">
          What Our Customers Say
        </h1>
      </div>

      {/* Slider wrapper */}
      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-[45%] -translate-y-1/2 -translate-x-5 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Cards */}
        <div
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="flex gap-4 overflow-x-auto pb-2 cursor-grab select-none "
          style={{ scrollbarWidth: "none" }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-[400px] flex-shrink-0 shadow-xl p-5"
            >
              {/* Image */}
              <div className="relative w-full aspect-square rounded-sm overflow-hidden bg-gray-100 group/card">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                  draggable={false}
                />
                {/* <button className="absolute bottom-3 right-3 bg-white rounded-full p-2 opacity-0 group-hover/card:opacity-100 transition-opacity shadow">
                  <ShoppingCart size={16} />
                </button> */}
              </div>

              {/* Info */}
              <div className="mt-3 space-y-1">
                <div className="flex items-center gap-1 text-xs">
                  <h1 className="text-2xl"> {product.longevity}</h1>
                </div>
                <p className="text-[11px] text-gray-400 uppercase tracking-wider">
                  {product.brand}
                </p>
                <p className="text-base font-semibold">{product.name}</p>
                <p className="text-sm text-gray-600">
                  LE {product.price}.00 EGP
                </p>
              </div>

              {/* Button */}
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-[45%] -translate-y-1/2 translate-x-5 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}
