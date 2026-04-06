import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Shopping() {
  const categories = [
    
    { name: "MEN", image: "/images/men.png", href: "/categories/men" },
    {
      name: "WOMEN",
      image: "/images/category_women.png",
      href: "/categories/women",
    },
    {
      name: "UNISEX",
      image: "/images/category_unisex.png",
      href: "/categories/unisex",
    },
  ];

  return (
    <>
      <section className="w-[95%] mx-auto py-10">
        <div className=" py-4">
          <p className=" font-bold">SHOP BY</p>
          <h1 className=" text-4xl font-bold">Collection</h1>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {categories.map((cat) => (
            <Link key={cat.name} href={cat.href}>
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
