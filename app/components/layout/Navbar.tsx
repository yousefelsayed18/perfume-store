"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SearchIcon, ShareIcon, UserIcon, Menu, X } from "lucide-react";
import { useCart } from "@/app/Context/CartContext";
import SearchModal from "@/app/SearchModal/SearchModal";
import { supabase } from "@/app/lib/supabase";
import AuthModal from "@/app/AuthModal/AuthModal";
export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const { Count } = useCart();
  const router = useRouter();

  const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Contact Us", href: "/contact" },
  ];

  useEffect(() => {
    // جيب الـ user الحالي
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    // استمع للتغييرات
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleUserClick = () => {
    if (user) {
      supabase.auth.signOut();
    } else {
      setAuthOpen(true);
    }
  };

  return (
    <>
      <nav className="eldora-navbar flex items-center justify-between px-4 py-3 relative z-50">

        {/* Mobile Menu Button */}
        <button className="md:hidden cursor-pointer" onClick={() => setMenuOpen(true)}>
          <Menu />
        </button>

        {/* Left Links (Desktop only) */}
        <div className="hidden md:flex gap-6">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Logo */}
        <Link href="/" className="text-center">
          <h1 className="font-bold tracking-widest">ELDORA</h1>
          <p className="text-xs text-gray-400">Fine Jewellery · Treasured Gifts</p>
        </Link>

        {/* Right Icons */}
        <div className="flex items-center gap-4 ">
          <button className="cursor-pointer" onClick={() => setSearchOpen(true)}>
            <SearchIcon />
          </button>

          {/* User Icon */}
          <button
            onClick={handleUserClick}
            className="relative cursor-pointer"
            title={user ? `Signed in as ${user.email} — click to sign out` : "Sign in"}
          >
            <UserIcon className="cursor-pointer" />
            {user && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
            )}
          </button>

          <ShareIcon className="cursor-pointer" />

          <button onClick={() => router.push("/cart")} className="relative cursor-pointer">
            🛒
            {Count > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-black text-white rounded-full px-1">
                {Count}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[9999] transition ${menuOpen ? "visible opacity-100" : "invisible opacity-0"}`}>
        <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
        <div className={`absolute top-0 left-0 w-[75%] h-full bg-white p-6 transform transition duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <button className="mb-6" onClick={() => setMenuOpen(false)}>
            <X />
          </button>
          <div className="flex flex-col gap-6 text-lg">
            {NAV_LINKS.map((link) => (
              <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Auth Modal */}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}