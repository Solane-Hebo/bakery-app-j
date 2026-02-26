"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import SmartImage from "@/components/ui/SmartImage"
import { X } from "lucide-react"

type Product = {
  _id: string
  name: string
  description?: string
  price: number
  unit?: string
  imageUrl?: string
  category?: "bread" | "cakes" | "drinks" | "other"
}

type PickupOption = { label: string; value: string }

// ---------------- Time helpers ----------------
function pad2(n: number) {
  return n.toString().padStart(2, "0")
}
function formatTime(d: Date) {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`
}
function startOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function buildPickupOptions(now: Date): PickupOption[] {
  const opts: PickupOption[] = [{ label: "ASAP (as soon as possible)", value: "ASAP" }]

  const roundTo = 15 // minutes
  const next = new Date(now)
  next.setSeconds(0, 0)

  const m = next.getMinutes()
  const delta = (roundTo - (m % roundTo)) % roundTo
  next.setMinutes(m + (delta === 0 ? roundTo : delta)) // always next slot

  // Relative quick picks
  const in30 = new Date(now)
  in30.setMinutes(in30.getMinutes() + 30)
  const in60 = new Date(now)
  in60.setMinutes(in60.getMinutes() + 60)

  opts.push({ label: `In 30 minutes (${formatTime(in30)})`, value: `In 30 minutes (${formatTime(in30)})` })
  opts.push({ label: `In 1 hour (${formatTime(in60)})`, value: `In 1 hour (${formatTime(in60)})` })

  // Today until closing
  const closingHour = 18
  const endToday = new Date(now)
  endToday.setHours(closingHour, 0, 0, 0)

  for (let t = new Date(next); t <= endToday; t.setMinutes(t.getMinutes() + 15)) {
    opts.push({ label: `Today ${formatTime(t)}`, value: `Today ${formatTime(t)}` })
  }

  // Tomorrow morning
  const tomorrow = new Date(startOfDay(now))
  tomorrow.setDate(tomorrow.getDate() + 1)

  const startTomorrow = new Date(tomorrow)
  startTomorrow.setHours(8, 0, 0, 0)

  const endTomorrow = new Date(tomorrow)
  endTomorrow.setHours(12, 0, 0, 0)

  for (let t = new Date(startTomorrow); t <= endTomorrow; t.setMinutes(t.getMinutes() + 30)) {
    opts.push({ label: `Tomorrow ${formatTime(t)}`, value: `Tomorrow ${formatTime(t)}` })
  }

  return opts
}

// ---------------- Message + deep links ----------------
function buildMessage(p: Product, qty: number, pickup: string) {
  const unit = p.unit || "kr"
  return `Hi! I'd like to order:\n- ${p.name}\n- Quantity: ${qty}\n- Price: ${p.price.toFixed(
    2,
  )} ${unit}\n- Pickup: ${pickup}\n\nThanks!`
}

function whatsappLink(phoneNoPlus: string, message: string) {
  return `https://wa.me/${phoneNoPlus}?text=${encodeURIComponent(message)}`
}

function telegramLink(usernameNoAt: string, message: string) {
  return `https://t.me/${usernameNoAt}?text=${encodeURIComponent(message)}`
}

// ---------------- UI ----------------
export default function MenuClient({ products }: { products: Product[] }) {
  const [q, setQ] = React.useState("")
  const [cat, setCat] = React.useState<"all" | "bread" | "cakes" | "drinks">("all")

  // TODO: set these
  const WHATSAPP_PHONE = "46701234567" // no +
  const TELEGRAM_USERNAME = "yourbakery" // no @

  // Modal state
  const [orderOpen, setOrderOpen] = React.useState(false)
  const [orderProduct, setOrderProduct] = React.useState<Product | null>(null)
  const [qty, setQty] = React.useState(1)
  const [pickup, setPickup] = React.useState("ASAP")

  // Dynamic pickup options (updates every minute)
  const [pickupOptions, setPickupOptions] = React.useState<PickupOption[]>(() =>
    buildPickupOptions(new Date()),
  )

  React.useEffect(() => {
    const t = setInterval(() => {
      setPickupOptions(buildPickupOptions(new Date()))
    }, 60_000) // refresh every minute
    return () => clearInterval(t)
  }, [])

  React.useEffect(() => {
    // keep selected pickup valid
    if (!pickupOptions.some((o) => o.value === pickup)) setPickup("ASAP")
  }, [pickupOptions, pickup])

  const filtered = React.useMemo(() => {
    const query = q.trim().toLowerCase()
    return products.filter((p) => {
      const matchesQuery =
        !query || `${p.name} ${p.description ?? ""}`.toLowerCase().includes(query)
      const matchesCat = cat === "all" ? true : (p.category ?? "").toLowerCase() === cat
      return matchesQuery && matchesCat
    })
  }, [products, q, cat])

  function openOrder(p: Product) {
    setOrderProduct(p)
    setQty(1)
    setPickup("ASAP")
    setOrderOpen(true)
  }

  const orderMessage = React.useMemo(() => {
    if (!orderProduct) return ""
    return buildMessage(orderProduct, qty, pickup)
  }, [orderProduct, qty, pickup])

  const whatsappHref = orderProduct ? whatsappLink(WHATSAPP_PHONE, orderMessage) : "#"
  const telegramHref = orderProduct ? telegramLink(TELEGRAM_USERNAME, orderMessage) : "#"

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFF7F5] via-[#FAFAFA] to-[#F5F5F5]">
      <header className="mx-auto max-w-6xl px-6 pt-10">
        <div className="rounded-3xl bg-white/70 p-8 shadow-sm ring-1 ring-black/5 backdrop-blur">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#553030]/10 ring-1 ring-[#553030]/15">
              <Image
                src="/cupcake-logo.png"
                alt="Bakery logo"
                width={46}
                height={46}
                className="h-10 w-10 object-contain"
                priority
              />
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#553030] md:text-4xl">
              Our Menu
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[#553030]/70 md:text-base">
              Explore our selection of freshly baked goods, made daily with the finest ingredients.
            </p>

            {/* Search + filters */}
            <div className="mt-6 w-full max-w-3xl">
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <div className="rounded-2xl bg-white p-2 shadow-sm ring-1 ring-black/5">
                  <div className="flex items-center gap-2">
                    <input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="Search products…"
                      className="w-full rounded-xl border-0 bg-transparent px-3 py-2 text-sm text-[#0F172A] outline-none placeholder:text-gray-400"
                    />
                    {q ? (
                      <button
                        type="button"
                        onClick={() => setQ("")}
                        className="rounded-xl px-3 py-2 text-xs font-semibold text-[#553030] hover:bg-gray-50"
                      >
                        Clear
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
                  <FilterPill active={cat === "all"} onClick={() => setCat("all")} label="All" />
                  <FilterPill active={cat === "bread"} onClick={() => setCat("bread")} label="Bread" />
                  <FilterPill active={cat === "cakes"} onClick={() => setCat("cakes")} label="Cakes" />
                  <FilterPill active={cat === "drinks"} onClick={() => setCat("drinks")} label="Drinks" />
                </div>
              </div>

              <div className="mt-2 text-xs text-gray-600">
                Showing <span className="font-semibold text-[#553030]">{filtered.length}</span>{" "}
                item{filtered.length === 1 ? "" : "s"}
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-14 pt-10">
        {products.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-black/5">
            <h2 className="text-lg font-extrabold text-[#0F172A]">No products yet</h2>
            <p className="mt-2 text-sm text-gray-600">
              Add products in your admin area, then refresh this page.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-black/5">
            <h2 className="text-lg font-extrabold text-[#0F172A]">No matches</h2>
            <p className="mt-2 text-sm text-gray-600">Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <MenuCard key={p._id} product={p} onOrder={() => openOrder(p)} />
            ))}
          </div>
        )}
      </section>

     {orderOpen && orderProduct ? (
        <OrderModal
          product={orderProduct}
          qty={qty}
          setQty={setQty}
          pickup={pickup}
          setPickup={setPickup}
          pickupOptions={pickupOptions}
          whatsappHref={whatsappHref}
          telegramHref={telegramHref}
          onClose={() => setOrderOpen(false)}
        />
      ) : null}
    </main>
  )
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full px-3 py-1 text-xs font-semibold ring-1 transition",
        active
          ? "bg-[#553030] text-white ring-[#553030]/20"
          : "bg-[#553030]/10 text-[#553030] ring-[#553030]/15 hover:bg-[#553030]/15",
      ].join(" ")}
    >
      {label}
    </button>
  )
}

function MenuCard({ product, onOrder }: { product: Product; onOrder: () => void }) {
  const { name, description, price, unit, imageUrl, category } = product

  return (
    <article className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative">
        <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-[#553030]/10 to-[#D9B8B8]/30">
          {imageUrl ? (
            <SmartImage
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#553030]/60">
              <div className="rounded-2xl bg-white/60 px-4 py-2 text-xs font-semibold ring-1 ring-[#553030]/15">
                No image
              </div>
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
        </div>

        <div className="absolute right-4 top-4 flex gap-2">
          {category ? (
            <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[11px] font-extrabold text-[#553030] shadow-sm ring-1 ring-black/5">
              {category}
            </span>
          ) : null}
          <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold text-[#553030] shadow-sm ring-1 ring-black/5">
            {price.toFixed(2)} {unit || "kr"}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h2 className="min-w-0 truncate text-base font-extrabold text-[#0F172A] md:text-lg">
          {name}
        </h2>

        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
          {description || "Freshly baked with our unique ingredients."}
        </p>

        <div className="mt-5 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-[#553030]/70">Available today</span>

          <button
            type="button"
            onClick={onOrder}
            className="inline-flex items-center justify-center rounded-xl bg-[#553030] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#553030]/25"
          >
            Order
          </button>
        </div>
      </div>
    </article>
  )
}

function OrderModal({
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
              <SmartImage
                src={product.imageUrl}
                alt={product.name}
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
