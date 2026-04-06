"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Pencil, Trash2, Plus, X, Check, LogOut } from "lucide-react";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

interface Perfume {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  description: string;
}

const EMPTY_FORM = {
  name: "",
  price: "",
  image_url: "",
  category: "men",
  description: "",
};

const CATEGORIES = ["men", "women", "unisex", "niche"];

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // ✅ Auth check
  useEffect(() => {
    if (localStorage.getItem("admin_auth") !== "true") {
      router.push("/admin");
    }
  }, []);

  // ✅ Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabaseAdmin
      .from("perfumes")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProducts(data.map((p) => ({ ...p, image_url: p.image_url.trim() })));
    }
    setLoading(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.image_url) {
      alert("Please fill name, price and image URL");
      return;
    }

    setSubmitting(true);

    const payload = {
      name: form.name,
      price: Number(form.price),
      image_url: form.image_url.trim(),
      category: form.category,
      description: form.description,
    };

    if (editingId) {
      // ✅ Update
      const { error } = await supabaseAdmin
        .from("perfumes")
        .update(payload)
        .eq("id", editingId);

      if (!error) {
        setProducts((prev) =>
          prev.map((p) => (p.id === editingId ? { ...p, ...payload } : p))
        );
        resetForm();
      }
    } else {
      // ✅ Insert
      const { data, error } = await supabaseAdmin
        .from("perfumes")
        .insert(payload)
        .select()
        .single();

      if (!error && data) {
        setProducts((prev) => [data, ...prev]);
        resetForm();
      }
    }

    setSubmitting(false);
  };

  const handleEdit = (product: Perfume) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: String(product.price),
      image_url: product.image_url,
      category: product.category,
      description: product.description || "",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabaseAdmin.from("perfumes").delete().eq("id", id);
    if (!error) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setDeleteConfirmId(null);
    }
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    router.push("/admin");
  };

  // ✅ Filter
  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "all" || p.category === filterCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-[#f8f6f2]">
      {/* Header */}
      <div className="bg-[#1e2d3d] text-white px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-widest">ELDORA</h1>
          <p className="text-xs text-gray-400 tracking-widest">Admin Dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{products.length} products</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8 space-y-8">
        {/* Add / Edit Form */}
        {showForm && (
          <div className="bg-white p-6 space-y-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="font-bold tracking-widest uppercase text-sm">
                {editingId ? "Edit Product" : "Add New Product"}
              </h2>
              <button onClick={resetForm}>
                <X size={18} className="text-gray-400 hover:text-black" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product name *"
                className="border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors"
              />
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Price (EGP) *"
                type="number"
                className="border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors"
              />
              <input
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                placeholder="Image URL *"
                className="border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors"
              />
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description (optional)"
              rows={3}
              className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors resize-none"
            />

            {/* Image Preview */}
            {form.image_url && (
              <div className="relative w-24 h-24 border border-gray-200 overflow-hidden">
                <Image
                  src={form.image_url.trim()}
                  alt="preview"
                  fill
                  className="object-cover"
                  onError={() => {}}
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 bg-[#1e2d3d] text-white px-6 py-3 text-sm tracking-widest uppercase hover:bg-black transition-colors disabled:opacity-50"
              >
                <Check size={16} />
                {submitting ? "Saving..." : editingId ? "Update" : "Add Product"}
              </button>
              <button
                onClick={resetForm}
                className="flex items-center gap-2 border border-gray-200 px-6 py-3 text-sm hover:bg-gray-50 transition-colors"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-3 flex-1">
            <input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-200 px-4 py-2 text-sm outline-none focus:border-black transition-colors flex-1 max-w-xs"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-200 px-4 py-2 text-sm outline-none focus:border-black transition-colors"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-[#1e2d3d] text-white px-5 py-2 text-sm tracking-widest uppercase hover:bg-black transition-colors"
            >
              <Plus size={16} />
              Add Product
            </button>
          )}
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white h-16 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold tracking-wider uppercase text-xs text-gray-500">Product</th>
                  <th className="text-left px-6 py-4 font-semibold tracking-wider uppercase text-xs text-gray-500">Category</th>
                  <th className="text-left px-6 py-4 font-semibold tracking-wider uppercase text-xs text-gray-500">Price</th>
                  <th className="text-right px-6 py-4 font-semibold tracking-wider uppercase text-xs text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 flex-shrink-0 bg-gray-100 overflow-hidden">
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          {product.description && (
                            <p className="text-xs text-gray-400 truncate max-w-xs">
                              {product.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      LE {product.price}.00
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded transition-colors"
                        >
                          <Pencil size={15} />
                        </button>

                        {deleteConfirmId === product.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-xs bg-red-500 text-white px-3 py-1 hover:bg-red-600 transition-colors"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="text-xs border border-gray-200 px-3 py-1 hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(product.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400 text-sm">
                No products found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}