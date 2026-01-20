"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewMaterialPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "",
    stock: 0,
    unit: "kg",
    minLevel: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/admin/materials");
      router.refresh(); 
    }
  };

  return (
    <div className="min-h-[50] flex items-center justify-center px-4">

      <form onSubmit={handleSubmit} className="p-6 max-w-xl rounded-xl text-[#553030] space-y-4  border border-transparent shadow-2xl items-center center">
        <div className="flex justify-center items-center gap-1 mb-10">
            <img
            src="/cupcake-logo.png"
            alt="Bakery logo"
            className="h-7 w-16 object-contain"
            />
            <h1 className="text-2xl font-extrabold text-[#553030] text-center">
             Add Raw Material
            </h1>
        </div>
        <input
            placeholder="Name"
            className="w-full border p-2 text-[#553030] rounded-md"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
            placeholder="Category"
            className="w-full border p-2 rounded-md"
            onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <input
            type="number"
            placeholder="Stock"
            className="w-full border p-2 rounded-md"
            onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
        />

        <input
            type="number"
            placeholder="Minimum level"
            className="w-full border p-2 rounded-md"
            onChange={(e) => setForm({ ...form, minLevel: Number(e.target.value) })}
        />

        <select
            className="w-full border p-2 rounded-md"
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
        >
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="l">l</option>
            <option value="pcs">pcs</option>
        </select>
        <div className="flex justify-center gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#553030] text-white px-6 py-2 rounded-md disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>

            <button
               type="button"
               onClick={() => router.push("/admin/materials")}
               className="text-[#553030] bg-white px-5 py-2 rounded-md border border-[#553030]"
            >
              Cancel
            </button>

        </div>
    </form>
  </div>
 );
 }
