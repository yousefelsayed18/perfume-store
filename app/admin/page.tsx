"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ADMIN_PASSWORD = "eldora2026"; // ✅ غير الباسورد

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("admin_auth", "true");
      router.push("/admin/dashboard");
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e2d3d] flex items-center justify-center">
      <div className="bg-white p-10 w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-widest">ELDORA</h1>
          <p className="text-xs text-gray-400 mt-1 tracking-widest uppercase">Admin Panel</p>
        </div>

        <div className="space-y-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className={`w-full border px-4 py-3 text-sm outline-none transition-colors ${
              error ? "border-red-400" : "border-gray-200 focus:border-black"
            }`}
          />
          {error && <p className="text-red-400 text-xs">Incorrect password</p>}

          <button
            onClick={handleLogin}
            className="w-full bg-[#1e2d3d] text-white py-3 text-sm tracking-widest uppercase hover:bg-black transition-colors"
          >
            Enter
          </button>
        </div>
      </div>
    </div>
  );
}