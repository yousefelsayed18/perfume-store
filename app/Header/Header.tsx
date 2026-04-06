import React from "react";

export default function Header() {
  return (
    <>
      <header className=" header ">
        <div className="relative z-10 flex flex-col justify-end h-full pb-32 px-16">
          <h1 className="text-white text-5xl font-bold">Timeless Elegance</h1>
          <p className="text-white text-lg mt-2">
            Discover the art of refined luxury
          </p>
          <button className="mt-6 border border-white text-white px-6 py-3 w-fit">
            SHOP ALL
          </button>
        </div>
      </header>
    </>
  );
}
