"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductSchema, updateProductSchema } from "@/lib/validators/product";
import {
  AlertTriangle,
  Box,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

type Product = {
  _id: string
  name: string
  description?: string
  price: number
  unit?: string
  currentStock: number
  lowStockThreshold: number
  imageUrl?: string
  isActive?: boolean
}

export function ProductsClient() {
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<Product | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  async function fetchProducts() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/products", { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || "Failed to load products")
      setItems(data.products ?? [])
    } catch (e: any) {
      setError(e?.message || "Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const stats = useMemo(() => {
    const total = items.length
    const low = items.filter((p) => p.currentStock < p.lowStockThreshold).length
    return { total, low }
  }, [items])

  function openCreate() {
    setEditItem(null)
    setModalOpen(true)
  }

  function openEdit(p: Product) {
    setEditItem(p)
    setModalOpen(true)
  }

  async function onDelete(id: string) {
    const ok = confirm("Are you sure you want to delete this product?")
    if (!ok) return

    setBusyId(id)
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || "Delete failed")
      await fetchProducts()
    } catch (e: any) {
      alert(e?.message || "Delete failed")
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0F172A]">Product Management</h1>
          <p className="mt-1 text-sm text-gray-600">Manage your products and inventory levels</p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#553030] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New product
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard title="Total products" value={`${stats.total}`} accent="blue" icon={<Box className="h-5 w-5" />} />
        <StatCard title="Low stock" value={`${stats.low}`} accent="red" icon={<AlertTriangle className="h-5 w-5" />} />
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white shadow-sm">
        <div className="px-5 py-4 border-b">
          <h2 className="text-lg font-bold text-[#0F172A]">Products</h2>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-gray-600">Loading…</div>
        ) : error ? (
          <div className="p-6 text-sm text-red-700">{error}</div>
        ) : items.length === 0 ? (
          <div className="p-6 text-sm text-gray-600">No products yet.</div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-600">
                <tr>
                  <th className="px-5 py-3 font-semibold">Product</th>
                  <th className="px-5 py-3 font-semibold">Price</th>
                  <th className="px-5 py-3 font-semibold">Stock</th>
                  <th className="px-5 py-3 font-semibold">Min stock</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {items.map((p) => {
                  const low = p.currentStock < p.lowStockThreshold

                  return (
                    <tr key={p._id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-[#0F172A]">{p.name}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">{p.description || "—"}</div>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap text-[#0F172A]">
                        {p.price.toFixed(2)} kr
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap text-[#23262c]">
                        {p.currentStock} pcs
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap text-[#0F172A]">
                        {p.lowStockThreshold} pcs
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={[
                            "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                            low ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700",
                          ].join(" ")}
                        >
                          {low ? "Low stock" : "In stock"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => openEdit(p)}
                            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </button>

                          <button
                            onClick={() => onDelete(p._id)}
                            disabled={busyId === p._id}
                            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <ProductModal
          editItem={editItem}
          onClose={() => setModalOpen(false)}
          onSaved={async () => {
            setModalOpen(false)
            await fetchProducts()
          }}
        />
      )}
    </div>
  )
}

function StatCard({
  title,
  value,
  accent,
  icon,
}: {
  title: string;
  value: string;
  accent: "orange" | "green" | "blue" | "red";
  icon: React.ReactNode
}) {
  const accentMap: Record<string, string> = {
    orange: "border-l-[#553030]",
    green: "border-l-green-600",
    blue: "border-l-blue-600",
    red: "border-l-red-600",
  };

  return (
    <div className={`rounded-2xl bg-white shadow-sm border-l-4 ${accentMap[accent]} p-5`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-gray-600">{title}</div>
          <div className="mt-2 text-xl font-extrabold text-[#0F172A]">{value}</div>
        </div>
        <div className="text-[#0F172A]">{icon}</div>
      </div>
    </div>
  );
}

function ProductModal({
  editItem,
  onClose,
  onSaved,
}: {
  editItem: Product | null
  onClose: () => void
  onSaved: () => void
}) {
  const isEdit = Boolean(editItem)
  const schema = isEdit ? updateProductSchema : createProductSchema

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<any>({
    resolver: zodResolver(schema as any),
    defaultValues: isEdit
      ? {
          name: editItem?.name ?? "",
          description: editItem?.description ?? "",
          price: editItem?.price ?? 0,
          unit: editItem?.unit ?? "pcs",
          currentStock: editItem?.currentStock ?? 0,
          lowStockThreshold: editItem?.lowStockThreshold ?? 5,
          imageUrl: editItem?.imageUrl ?? "",
          isActive: editItem?.isActive ?? true,
        }
      : {
          name: "",
          description: "",
          price: 0,
          unit: "pcs",
          currentStock: 0,
          lowStockThreshold: 5,
          imageUrl: "",
          isActive: true,
        },
  })

  async function onSubmit(values: any) {
    const payload = {
      ...values,
      price: Number(values.price),
      currentStock: Number(values.currentStock),
      lowStockThreshold: Number(values.lowStockThreshold),
    };

    const url = isEdit ? `/api/products/${editItem!._id}` : "/api/products"
    const method = isEdit ? "PATCH" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json()
    if (!res.ok) {
      alert(data?.message || "Save failed")
      return
    }

    reset()
    onSaved()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-[#0F172A]">
              {isEdit ? "Edit product" : "New product"}
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {isEdit ? "Update product information." : "Add a new product to the list."}
            </p>
          </div>

          <button onClick={onClose} className="text-[#553030] hover:bg-[#a49595] inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
            <X className="h-4 w-4" />
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 grid gap-4">
          <div>
            <label className="text-sm font-semibold text-[#553030]">Product name</label>
            <input
              className="mt-1 w-full rounded-xl border text-[#553030] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#553030]/30"
              {...register("name")}
              placeholder="Sourdough bread"
            />
            {errors.name && <p className="mt-1 text-xs text-red-700">{String(errors.name.message)}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-[#553030]">Description</label>
            <textarea
              className="mt-1 w-full rounded-xl text-[#553030] border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#553030]/30"
              {...register("description")}
              placeholder="Short description..."
              rows={3}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-700">{String(errors.description.message)}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-[#553030]">Price (kr)</label>
              <input
                type="number"
                step="0.01"
                className="mt-1 w-full rounded-xl border text-[#553030] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#553030]/30"
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && <p className="mt-1 text-xs text-red-700">{String(errors.price.message)}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-[#553030]">Unit</label>
              <input
                className="mt-1 w-full rounded-xl border text-[#553030] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#553030]/30"
                {...register("unit")}
                placeholder="pcs / kg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-[#553030]">Stock</label>
              <input
                type="number"
                className="mt-1 w-full text-[#553030] rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#553030]/30"
                {...register("currentStock", { valueAsNumber: true })}
              />
              {errors.currentStock && (
                <p className="mt-1 text-xs text-red-700">{String(errors.currentStock.message)}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-[#553030]">Minimum stock</label>
              <input
                type="number"
                className="mt-1 w-full text-[#553030] rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#553030]/30"
                {...register("lowStockThreshold", { valueAsNumber: true })}
              />
              {errors.lowStockThreshold && (
                <p className="mt-1 text-xs text-red-700">{String(errors.lowStockThreshold.message)}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-[#553030]">Image URL (optional)</label>
            <input
              className="mt-1 w-full rounded-xl text-[#553030] border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#553030]/30"
              {...register("imageUrl")}
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="h-4 w-4" {...register("isActive")} />
              Active product
            </label>

            <button
              disabled={isSubmitting}
              type="submit"
              className="rounded-xl bg-[#553030] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : isEdit ? "Save changes" : "Create product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
