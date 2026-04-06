import { Perfume } from "@/app/types";
import { supabase } from "../lib/supabase";

// ✅ getCartId - بيستخدم user id لو logged in، وإلا guest_id
async function getCartId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) return user.id;

  if (typeof window === "undefined") return "";

  let guestId = localStorage.getItem("guest_id");
  if (!guestId) {
    guestId = crypto.randomUUID();
    localStorage.setItem("guest_id", guestId);
  }
  return guestId;
}

// get perfumes by category
export async function getPerfumesByCategory(category: string): Promise<Perfume[]> {
  const { data, error } = await supabase
    .from("perfumes")
    .select("*")
    .eq("category", category);

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

// 🛒 add to cart
export async function addToCart(product_id: string | number) {
  const guest_id = await getCartId(); // ✅

  const { data: existing } = await supabase
    .from("Cart")
    .select("*")
    .eq("guest_id", guest_id)
    .eq("product_id", product_id)
    .maybeSingle();

  if (existing) {
    return await supabase
      .from("Cart")
      .update({ quantity: existing.quantity + 1 })
      .eq("id", existing.id);
  } else {
    return await supabase.from("Cart").insert({
      guest_id,
      product_id,
      quantity: 1,
    });
  }
}

// 📦 get cart
export async function getCart() {
  const guest_id = await getCartId(); // ✅

  const { data, error } = await supabase
    .from("Cart")
    .select("*, perfumes(*)")
    .eq("guest_id", guest_id);

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

// ❌ remove item
export async function removeFromCart(id: number) {
  return await supabase.from("Cart").delete().eq("id", id);
}

// 🔄 update quantity
export async function updateQuantity(id: number, quantity: number) {
  return await supabase
    .from("Cart")
    .update({ quantity })
    .eq("id", id);
}