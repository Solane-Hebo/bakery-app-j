"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Material {
  _id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  minLevel: number;
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      const res = await fetch("/api/materials", {
        cache: "no-store",
      });
      const data = await res.json();
      console.log("MATERIALS FROM API:", data);
      setMaterials(data);
      setLoading(false);
    };
  
    fetchMaterials();
  }, []);
  

  if (loading) return <p>Loading...</p>;

  function getStatus(stock: number, minLevel: number) {
    if (stock <= 0) return "out";
    if (stock <= minLevel) return "low";
    return "ok";
  }
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this material?")) return;
  
    const res = await fetch(`/api/materials/${id}`, {
      method: "DELETE",
    });
  
    if (!res.ok) {
      alert("Failed to delete");
      return;
    }
  
    setMaterials((prev) => prev.filter((m) => m._id !== id));
  };
  

  return (
    <div className="p-6 text-[#553030]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Raw Materials</h2>
        <Link
          href="/admin/materials/new"
          className="bg-[#553030] text-white px-4 py-2 rounded-md"
        >
          + Add Material
        </Link>
      </div>

      <table className="w-full border rounded-md overflow-hidden">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Category</th>
            <th className="p-3">Stock</th>
            <th className="p-3">Min level</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {materials.map((m) => (
            <tr key={m._id} className="border-t">
              <td className="p-3">{m.name}</td>
              <td className="p-3">{m.category}</td>
              <td className="p-3">
                {m.stock} {m.unit}
              </td>
              <td className="p-3">{m.minLevel}{m.unit}</td>
              <td className="p-3">

                <StatusBadge status={getStatus(m.stock, m.minLevel)} />
              </td>
              <td className="p-3">
              <Link
                href={`/admin/materials/${m._id}`}
                className="text-[#553030] bg-white px-3 py-1 border border-[#553030] mr-2  rounded-md"
               >
                         Edit
                </Link>
                <button
                  onClick={() => handleDelete(m._id)}
                  className="bg-[#553030] text-white px-3 py-1 rounded-md"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    ok: "bg-green-100 text-green-700",
    low: "bg-yellow-100 text-yellow-700",
    out: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status]}`}
    >
      {status}
    </span>
  );
}
