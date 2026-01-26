"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type Product = {
  _id: string
  name: string
  price: number
  currentStock: number
  lowStockThreshold: number
}

type RecentSale = {
  id: string
  productName: string
  quantity: number
  total: number
  date: string
  note?: string
}

const saleSchema = z.object({
  productId: z.string().min(1, "Select a product"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  note: z.string().max(200).optional(),
})

type SaleFormValues = z.infer<typeof saleSchema>

export function SalesClient() {
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [serverError, setServerError] = useState<string>("")
  const [serverSuccess, setServerSuccess] = useState<string>("")

  const [recent, setRecent] = useState<RecentSale[]>([])

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: { productId: "", quantity: 1, note: "" },
  })

  const selectedProductId = watch("productId")
  const selectedProduct = useMemo(
    () => products.find((p) => p._id === selectedProductId),
    [products, selectedProductId],
  )

  const total = useMemo(() => {
    if (!selectedProduct) return 0
    const qty = Number(watch("quantity") || 0)
    return selectedProduct.price * qty
  }, [selectedProduct, watch])

  async function fetchProducts() {
    setLoadingProducts(true)
    setServerError("")
    try {
      const res = await fetch("/api/products", { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || "Failed to fetch products")
      setProducts(data.products ?? [])
    } catch (e: any) {
      setServerError(e?.message || "Failed to fetch products")
    } finally {
      setLoadingProducts(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const onSubmit = async (values: SaleFormValues) => {
    setServerError("")
    setServerSuccess("")

    const product = products.find((p) => p._id === values.productId)
    if (!product) {
      setServerError("Product not found.")
      return
    }

    // Client-side stock check
    if (values.quantity > product.currentStock) {
      setServerError(`Not enough stock. Remaining: ${product.currentStock} pcs`);
      return;
    }

    try {
      const res = await fetch(`/api/sales`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
     body: JSON.stringify({
     productId: values.productId,
     quantity: values.quantity,
     note: values.note,
  }),
})

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.message || "Failed to register sale")
      }

      // Update product stock locally
      const updatedProduct = data.product as Product;
      setProducts((prev) =>
        prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)),
      )

      // Add to recent sales (UI only)
      const sale: RecentSale = {
        id: crypto.randomUUID(),
        productName: product.name,
        quantity: values.quantity,
        total: product.price * values.quantity,
        date: new Date().toLocaleString(),
        note: values.note,
      }

      setRecent((prev) => [sale, ...prev].slice(0, 8));

      setServerSuccess("Sale registered successfully ✅")
      reset({ productId: "", quantity: 1, note: "" })
    } catch (e: any) {
      setServerError(e?.message || "Failed to register sale")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#0F172A]">Sales</h1>
        <p className="mt-1 text-sm text-gray-600">
          Register sold products and update inventory
        </p>
      </div>

      {/* Top grid */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Form card */}
        <div className="rounded-2xl bg-white shadow-sm">
          <div className="border-b px-5 py-4">
            <h2 className="text-lg font-bold text-[#0F172A]">New sale</h2>
            <p className="mt-1 text-sm text-gray-600">
              Select product and quantity sold
            </p>
          </div>

          <div className="p-5">
            {serverSuccess && (
              <p className="mb-4 rounded-md bg-green-100 px-3 py-2 text-sm text-green-700">
                {serverSuccess}
              </p>
            )}
            {serverError && (
              <p className="mb-4 rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">
                {serverError}
              </p>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Product select */}
              <div>
                <label className="text-sm font-semibold text-[#553030]">
                  Product
                </label>
                <select
                  className="mt-1 w-full rounded-xl border  text-[#866161] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#553030]/30"
                  {...register("productId")}
                  disabled={loadingProducts}
                >
                  <option value="">
                    {loadingProducts ? "Loading..." : "Select product"}
                  </option>
                  {products.map((p) => (
                    <option  key={p._id} value={p._id}>
                      {p.name} (remaining: {p.currentStock} pcs)
                    </option>
                  ))}
                </select>
                {errors.productId && (
                  <p className="mt-1 text-xs text-red-700">
                    {errors.productId.message}
                  </p>
                )}
              </div>

              {/* Quantity & total */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-[#553030]">
                    Quantity
                  </label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-xl border px-3 py-2 text-[#866161] text-sm focus:outline-none focus:ring-2 focus:ring-[#553030]/30"
                    {...register("quantity", { valueAsNumber: true })}
                    min={1}
                  />
                  {errors.quantity && (
                    <p className="mt-1 text-xs text-red-700">
                      {errors.quantity.message}
                    </p>
                  )}
                </div>

                <div className="rounded-xl border bg-gray-50 p-3">
                  <div className="text-xs text-gray-600">Total</div>
                  <div className="mt-1 text-lg font-extrabold text-[#0F172A]">
                    {total.toFixed(2)} kr
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {selectedProduct
                      ? `${selectedProduct.price.toFixed(2)} kr / pcs`
                      : "Select product"}
                  </div>
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="text-sm font-semibold text-[#553030]">
                  Note (optional)
                </label>
                <input
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-[#0F172A] text-sm focus:outline-none focus:ring-2 focus:ring-[#553030]/30"
                  placeholder="e.g. sold over counter"
                  {...register("note")}
                />
                {errors.note && (
                  <p className="mt-1 text-xs text-red-700">
                    {errors.note.message}
                  </p>
                )}
              </div>

              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full rounded-xl bg-[#553030] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
              >
                {isSubmitting ? "Registering..." : "Register sale"}
              </button>
            </form>
          </div>
        </div>

        {/* Stock overview */}
        <div className="rounded-2xl bg-white shadow-sm">
          <div className="border-b px-5 py-4">
            <h2 className="text-lg font-bold text-[#0F172A]">
              Inventory overview
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Quick overview of products running low
            </p>
          </div>

          <div className="p-5">
            {loadingProducts ? (
              <p className="text-sm text-gray-600">Loading...</p>
            ) : products.length === 0 ? (
              <p className="text-sm text-gray-600">No products.</p>
            ) : (
              <div className="space-y-3">
                {products
                  .slice()
                  .sort(
                    (a, b) =>
                      a.currentStock - a.lowStockThreshold -
                      (b.currentStock - b.lowStockThreshold),
                  )
                  .slice(0, 6)
                  .map((p) => {
                    const low = p.currentStock < p.lowStockThreshold;
                    return (
                      <div
                        key={p._id}
                        className="flex items-center justify-between rounded-xl border px-4 py-3"
                      >
                        <div className="min-w-0">
                          <div className="truncate font-semibold text-[#0F172A]">
                            {p.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            Remaining:{" "}
                            <span className="font-semibold">
                              {p.currentStock} pcs
                            </span>{" "}
                            • Min:{" "}
                            <span className="font-semibold">
                              {p.lowStockThreshold} pcs
                            </span>
                          </div>
                        </div>

                        <span
                          className={[
                            "ml-3 inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-semibold",
                            low
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700",
                          ].join(" ")}
                        >
                          {low ? "Low" : "OK"}
                        </span>
                      </div>
                    );
                  })}
              </div>
            )}

            <button
              onClick={fetchProducts}
              className="mt-4 w-full rounded-xl border px-4 py-2 text-sm font-semibold text-[#553030] hover:bg-gray-50"
            >
              Refresh products
            </button>
          </div>
        </div>
      </div>

      {/* Recent sales */}
      <div className="rounded-2xl bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h2 className="text-lg font-bold text-[#0F172A]">Recent sales</h2>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-5 py-3 font-semibold">Product</th>
                <th className="px-5 py-3 font-semibold">Quantity</th>
                <th className="px-5 py-3 font-semibold">Total</th>
                <th className="px-5 py-3 font-semibold">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {recent.length === 0 ? (
                <tr>
                  <td className="px-5 py-6 text-gray-600" colSpan={4}>
                    No sales registered yet.
                  </td>
                </tr>
              ) : (
                recent.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-[#0F172A]">
                        {r.productName}
                      </div>
                      {r.note && (
                        <div className="text-xs text-gray-500">{r.note}</div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-[#0F172A]">{r.quantity} pcs</td>
                    <td className="px-5 py-4 text-[#0F172A]">
                      {r.total.toFixed(2)} kr
                    </td>
                    <td className="px-5 py-4 text-gray-700">{r.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
