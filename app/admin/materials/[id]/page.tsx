"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface MaterialForm {
  name: string;
  category: string;
  stock: number;
  unit: string;
  minLevel: number;
}

export default function EditMaterialPage() {
  const { id } = useParams(); // Dynamic route ID
  const router = useRouter();

  const [form, setForm] = useState<MaterialForm>({
    name: "",
    category: "",
    stock: 0,
    unit: "kg",
    minLevel: 0,
  });

  const [loading, setLoading] = useState(true);

  // Fetch single material
  useEffect(() => {
    if (!id) return;

    const fetchMaterial = async () => {
      try {
        const res = await fetch(`/api/materials/${id}`);
        if (!res.ok) {
          alert("Failed to load material");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setForm(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Error fetching material");
        setLoading(false);
      }
    };

    fetchMaterial();
  }, [id]);

  // Submit edits
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/materials/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/admin/materials");
      router.refresh();
    } else {
      const err = await res.json();
      alert("Failed to update material: " + err.message);
    }
  };

  // Delete material
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this material?")) return;

    const res = await fetch(`/api/materials/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push("/admin/materials");
      router.refresh();
    } else {
      const err = await res.json();
      alert("Failed to delete material: " + err.message);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="p-6 max-w-xl w-full rounded-xl shadow-xl space-y-4 text-[#553030]"
      >
         <div className="flex justify-center items-center gap-1 mb-10">
            <img
              src="/cupcake-logo.png"
              alt="Bakery logo"
              className="h-7 w-16 object-contain"
            />
            <h1 className="text-2xl font-extrabold text-[#553030] text-center">
               Edit Raw Material
            </h1>
        </div>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border p-2 rounded-md"
          placeholder="Name"
        />

        <input
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full border p-2 rounded-md"
          placeholder="Category"
        />

        <input
          type="number"
          value={form.stock}
          onChange={(e) =>
            setForm({ ...form, stock: Number(e.target.value) })
          }
          className="w-full border p-2 rounded-md"
        />

        <input
          type="number"
          value={form.minLevel}
          onChange={(e) =>
            setForm({ ...form, minLevel: Number(e.target.value) })
          }
          className="w-full border p-2 rounded-md"
        />

        <select
          value={form.unit}
          onChange={(e) => setForm({ ...form, unit: e.target.value })}
          className="w-full border p-2 rounded-md"
        >
          <option value="kg">kg</option>
          <option value="g">g</option>
          <option value="l">l</option>
          <option value="pcs">pcs</option>
        </select>

        <div className="flex justify-center gap-4">
          <button className="bg-[#553030] text-white px-5 py-2 rounded-md">
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/materials")}
            className="border border-[#553030] px-5 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
