// components/Footer.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer style={{ backgroundColor: "#1e2d3d" }} className="text-white">
      <div className="w-[90%] mx-auto py-12">

        {/* Newsletter */}
        <div className="mb-12">
          <p className="italic text-sm mb-6">Lets stay in touch</p>
          <div className="flex items-end gap-4 border-b border-gray-500 pb-3">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-gray-400 text-sm outline-none"
            />
            <button className="bg-white text-black text-sm px-6 py-2 hover:bg-gray-100 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>

        {/* Links */}
        <div className="flex gap-24 mb-16">
          {/* Column 1 */}
          <div>
            <p className="text-[11px] tracking-widest text-gray-400 uppercase mb-4">
              Links & Support
            </p>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm hover:text-gray-300 transition-colors">Home</Link></li>
              <li><Link href="/categories" className="text-sm hover:text-gray-300 transition-colors">Categories</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-gray-300 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="mt-8">
            <ul className="space-y-3">
              <li><Link href="/search" className="text-sm hover:text-gray-300 transition-colors">Search</Link></li>
              <li><Link href="/shipping-policy" className="text-sm hover:text-gray-300 transition-colors">Shipping policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-600 pt-6 flex items-center justify-between">
          <p className="text-xs text-gray-400">© 2026 Eldora</p>
          <Link href="/terms" className="text-xs text-gray-400 hover:text-white transition-colors">
            Terms and Policies
          </Link>
        </div>

      </div>
    </footer>
  );
}