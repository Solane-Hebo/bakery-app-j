"use client"

import Link from "next/link"
import { X } from "lucide-react"
import Image from "next/image"
import { Dispatch, SetStateAction } from "react"

type Product = {
  _id: string
  name: string
  description?: string
  price: number
  unit?: string
  imageUrl?: string
  category?: "bread" | "cakes" | "drinks" | "other"
  currentStock?: number
}

type PickupOption = {
  label: string
  value: string
}

type OrderModalProps = {
  product: Product
  qty: number
  setQty: Dispatch<SetStateAction<number>>
  pickup: string
  setPickup: Dispatch<SetStateAction<string>>
  pickupOptions: PickupOption[]
  whatsappHref: string
  telegramHref: string
  onClose: () => void
}

export default function OrderModal({
    product,
    qty,
    setQty,
    pickup,
    setPickup,
    pickupOptions,
    whatsappHref,
    telegramHref,
    onClose,
  }: {
    product: Product
    qty: number
    setQty: (n: number) => void
    pickup: string
    setPickup: (v: string) => void
    pickupOptions: PickupOption[]
    whatsappHref: string
    telegramHref: string
    onClose: () => void
  }) {
    const unit = product.unit || "kr"
    const total = product.price * qty
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <div className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-black/5">
          <div className="flex items-start justify-between gap-3 border-b px-6 py-5">
            <div>
              <h3 className="text-xl font-extrabold text-[#0F172A]">Order</h3>
              <p className="mt-1 text-sm text-gray-600">Choose pickup time and continue.</p>
            </div>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm font-semibold text-[#553030] hover:bg-gray-50"
            >
              <X className="h-4 w-4" />
              Close
            </button>
          </div>
  
          <div className="grid gap-6 px-6 py-6 sm:grid-cols-[140px_1fr]">
            <div className="relative h-32 w-full overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-black/5 sm:h-36">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="h-full w-full object-cover"
                  sizes="140px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-gray-500">
                  No image
                </div>
              )}
            </div>
  
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-lg font-extrabold text-[#0F172A]">{product.name}</div>
                  <div className="mt-1 line-clamp-2 text-sm text-gray-600">
                    {product.description || "Freshly baked with our unique ingredients."}
                  </div>
                </div>
  
                <div className="shrink-0 text-right">
                  <div className="text-xs text-gray-500">Price</div>
                  <div className="text-base font-extrabold text-[#553030]">
                    {product.price.toFixed(2)} {unit}
                  </div>
                </div>
              </div>
  
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-[#553030]">Quantity</label>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="h-10 w-10 rounded-xl border bg-white text-sm font-extrabold text-[#553030] hover:bg-gray-50"
                      aria-label="Decrease"
                    >
                      −
                    </button>
  
                    <input
                      value={qty}
                      onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
                      type="number"
                      min={1}
                      className="h-10 w-full rounded-xl border px-3 text-sm font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#553030]/20"
                    />
  
                    <button
                      type="button"
                      onClick={() => setQty(qty + 1)}
                      className="h-10 w-10 rounded-xl border bg-white text-sm font-extrabold text-[#553030] hover:bg-gray-50"
                      aria-label="Increase"
                    >
                      +
                    </button>
                  </div>
                </div>
  
                <div>
                  <label className="text-sm font-semibold text-[#553030]">Pickup time</label>
                  <select
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="mt-2 h-10 w-full rounded-xl border bg-white px-3 text-sm font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#553030]/20"
                  >
                    {pickupOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">Options update automatically based on current time.</p>
                </div>
              </div>
  
              <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#553030]/5 px-4 py-3 ring-1 ring-[#553030]/10">
                <div>
                  <div className="text-xs text-gray-600">Total</div>
                  <div className="text-lg font-extrabold text-[#0F172A]">
                    {total.toFixed(2)} {unit}
                  </div>
                </div>
                <div className="text-right text-xs text-gray-600">Pickup time included in message</div>
              </div>
            </div>
          </div>
  
          <div className="border-t px-6 py-5">
            <div className="text-sm font-semibold text-[#0F172A]">Continue with</div>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Link
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-[#553030] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#553030]/25"
              >
                WhatsApp
              </Link>
  
              <Link
                href={telegramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border bg-white px-4 py-2.5 text-sm font-semibold text-[#553030] shadow-sm ring-1 ring-[#553030]/15 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#553030]/25"
              >
                Telegram
              </Link>
            </div>
          </div>
        </div>
    </div>
  )
}
