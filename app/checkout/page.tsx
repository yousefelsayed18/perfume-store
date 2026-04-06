"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/app/lib/supabase";

async function getCartId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) return user.id;

  let guestId = localStorage.getItem("guest_id");
  if (!guestId) {
    guestId = crypto.randomUUID();
    localStorage.setItem("guest_id", guestId);
  }
  return guestId;
}

const GOVERNORATES = [
  "Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Beheira",
  "Fayoum", "Gharbia", "Ismailia", "Menofia", "Minya", "Qaliubiya",
  "New Valley", "North Sinai", "Port Said", "Qalyubia", "Qena",
  "Sharqia", "South Sinai", "Suez", "Luxor", "Matruh", "Aswan",
  "Asyut", "Beni Suef", "Damietta", "Kafr El Sheikh", "Sohag",
];

const PAYMENT_METHODS = [
  { id: "cod", label: "Cash on Delivery (COD)" },
  { id: "instapay", label: "Instapay" },
  { id: "vcash", label: "V-Cash" },
  { id: "telda", label: "Telda" },
];

const PAYMENT_INFO: Record<string, { number: string; whatsapp: string }> = {
  instapay: { number: "01068511331", whatsapp: "01011756110" },
  vcash: { number: "01011756110", whatsapp: "01011756110" },
};

interface CartItem {
  id: string;
  quantity: number;
  perfumes: {
    id: string;
    name: string;
    price: number;
    image_url: string;
  };
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    governorate: "Gharbia",
    phone: "",
  });

  useEffect(() => {
    const fetchCart = async () => {
      const guest_id = await getCartId();
      const { data } = await supabase
        .from("Cart")
        .select("*, perfumes(*)")
        .eq("guest_id", guest_id);

      if (data) {
        setCart(
          data.map((item) => ({
            ...item,
            perfumes: {
              ...item.perfumes,
              image_url: item.perfumes.image_url.trim(),
            },
          }))
        );
      }
      setLoading(false);
    };

    fetchCart();
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.perfumes.price * item.quantity, 0);
  const shipping = subtotal >= 1500 ? 0 : 60;
  const total = subtotal + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;
    await supabase.from("Cart").update({ quantity }).eq("id", id);
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const removeItem = async (id: string) => {
    await supabase.from("Cart").delete().eq("id", id);
    setCart((prev) => prev.filter((item) => item.id !== id));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const handleSubmit = async () => {
    if (!form.email || !form.lastName || !form.address || !form.city || !form.phone) {
      alert("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    const guest_id = await getCartId();

    const { error } = await supabase.from("Cart").delete().eq("guest_id", guest_id);

    if (!error) {
      window.dispatchEvent(new Event("cart-updated"));
      router.push("/order-success");
    } else {
      alert("❌ Something went wrong. Please try again.");
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left - Form */}
      <div className="bg-[#1e2d3d] text-white p-10 lg:p-16 space-y-8">
        <h1 className="text-2xl font-bold tracking-widest text-center">ELDORA</h1>

        {/* Contact */}
        <div>
          <h2 className="font-semibold tracking-wide mb-3">Contact</h2>
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email or mobile phone number" className="w-full bg-[#2a3a4d] border border-[#3a4a5d] rounded-md px-4 py-3 text-sm placeholder-gray-400 outline-none focus:border-gray-400 transition-colors" />
        </div>

        {/* Delivery */}
        <div className="space-y-3">
          <h2 className="font-semibold tracking-wide">Delivery</h2>
          <div className="w-full bg-[#2a3a4d] border border-[#3a4a5d] rounded-md px-4 py-3 text-sm text-gray-300">Egypt</div>
          <div className="grid grid-cols-2 gap-3">
            <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name (optional)" className="bg-[#2a3a4d] border border-[#3a4a5d] rounded-md px-4 py-3 text-sm placeholder-gray-400 outline-none focus:border-gray-400 transition-colors" />
            <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" className="bg-[#2a3a4d] border border-[#3a4a5d] rounded-md px-4 py-3 text-sm placeholder-gray-400 outline-none focus:border-gray-400 transition-colors" />
          </div>
          <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="w-full bg-[#2a3a4d] border border-[#3a4a5d] rounded-md px-4 py-3 text-sm placeholder-gray-400 outline-none focus:border-gray-400 transition-colors" />
          <input name="apartment" value={form.apartment} onChange={handleChange} placeholder="Apartment, suite, etc. (optional)" className="w-full bg-[#2a3a4d] border border-[#3a4a5d] rounded-md px-4 py-3 text-sm placeholder-gray-400 outline-none focus:border-gray-400 transition-colors" />
          <div className="grid grid-cols-2 gap-3">
            <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="bg-[#2a3a4d] border border-[#3a4a5d] rounded-md px-4 py-3 text-sm placeholder-gray-400 outline-none focus:border-gray-400 transition-colors" />
            <select name="governorate" value={form.governorate} onChange={handleChange} className="bg-[#2a3a4d] border border-[#3a4a5d] rounded-md px-4 py-3 text-sm text-white outline-none focus:border-gray-400 transition-colors">
              {GOVERNORATES.map((gov) => <option key={gov} value={gov}>{gov}</option>)}
            </select>
          </div>
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="w-full bg-[#2a3a4d] border border-[#3a4a5d] rounded-md px-4 py-3 text-sm placeholder-gray-400 outline-none focus:border-gray-400 transition-colors" />
        </div>

        {/* Shipping */}
        <div>
          <h2 className="font-semibold tracking-wide mb-3">Shipping method</h2>
          <div className="flex items-center justify-between bg-[#2a3a4d] border border-[#3a4a5d] rounded-md px-4 py-3 text-sm">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : `EGP ${shipping}.00`}</span>
          </div>
        </div>

        {/* ✅ Payment */}
        <div>
          <h2 className="font-semibold tracking-wide mb-1">Payment</h2>
          <p className="text-xs text-gray-400 mb-3">All transactions are secure and encrypted.</p>

          <div className="border border-[#3a4a5d] rounded-md overflow-hidden divide-y divide-[#3a4a5d]">
            {PAYMENT_METHODS.map((method) => (
              <div key={method.id}>
                <label className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${paymentMethod === method.id ? "bg-[#3a4a5d]" : "hover:bg-[#2a3a4d]"}`}>
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={() => setPaymentMethod(method.id)}
                    className="accent-white"
                  />
                  <span className="text-sm">{method.label}</span>
                </label>

                {/* ✅ Instapay Info */}
                {paymentMethod === "instapay" && method.id === "instapay" && (
                  <div className="px-4 py-4 bg-[#243345] text-sm space-y-2 text-gray-200">
                    <p>Please make your payment to the following number : 📲 <span className="font-semibold text-white">01068511331</span></p>
                    <p>After completing the payment, kindly send a photo of the payment receipt by sending a whatsapp to 📩 <span className="font-semibold text-white">01011756110</span></p>
                    <p className="mt-2 text-yellow-300">Important Notice ⚠️</p>
                    <p className="text-gray-300">Your order will not be confirmed or shipped until we receive a valid payment receipt at the number above.</p>
                  </div>
                )}

                {/* ✅ V-Cash Info */}
                {paymentMethod === "vcash" && method.id === "vcash" && (
                  <div className="px-4 py-4 bg-[#243345] text-sm space-y-2 text-gray-200">
                    <p>Please make your payment to the following number : 📲 <span className="font-semibold text-white">01011756110</span></p>
                    <p>After completing the payment, kindly send a photo of the payment receipt by sending a whatsapp to 📩 <span className="font-semibold text-white">01011756110</span></p>
                    <p className="mt-2 text-yellow-300">Important Notice ⚠️</p>
                    <p className="text-gray-300">Your order will not be confirmed or shipped until we receive a valid payment receipt at the number above.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-[#4a7c6f] hover:bg-[#3a6c5f] text-white py-4 rounded-md text-sm tracking-widest uppercase transition-colors disabled:opacity-50"
        >
          {submitting ? "Processing..." : "Complete Order"}
        </button>
      </div>

      {/* Right - Order Summary */}
      <div className="bg-[#f5f0e8] p-10 lg:p-16 space-y-6">
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
                <Image src={item.perfumes.image_url} alt={item.perfumes.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.perfumes.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-200 transition-colors">−</button>
                  <span className="text-sm w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-200 transition-colors">+</button>
                  <button onClick={() => removeItem(item.id)} className="text-xs text-red-400 hover:text-red-600 ml-2 transition-colors">Remove</button>
                </div>
              </div>
              <p className="text-sm font-medium">EGP {(item.perfumes.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <hr className="border-gray-300" />

        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>EGP {subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{shipping === 0 ? "Free" : `EGP ${shipping}.00`}</span></div>
        </div>

        <hr className="border-gray-300" />

        <div className="flex justify-between items-center">
          <span className="text-base font-semibold">Total</span>
          <div className="text-right">
            <span className="text-xs text-gray-400 mr-1">EGP</span>
            <span className="text-2xl font-bold">{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}