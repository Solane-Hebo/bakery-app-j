"use client";

import { useEffect, useMemo, useState } from "react"

type Range = "day" | "week" | "month"

type Sale = {
  _id: string
  productNameSnapshot: string
  quantity: number
  unitPriceSnapshot: number
  total: number
  createdAt: string
}

type ApiResponse = {
  status: string
  range: Range
  from: string
  to: string
  totals: { totalSalesCount: number; totalRevenue: number }
  sales: Sale[]
}

export function HistoryClient() {
  const [range, setRange] = useState<Range>("day")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [data, setData] = useState<ApiResponse | null>(null)

  async function load(r: Range) {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/history?range=${r}`, { cache: "no-store" })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.message || "Failed to load history")
      setData(json)
    } catch (e: any) {
      setError(e?.message || "Failed to load history")
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(range)
  }, [range])

  const title = useMemo(() => {
    if (range === "day") return "Today"
    if (range === "week") return "This week"
    return "This month"
  }, [range])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0F172A]">History</h1>
          <p className="mt-1 text-sm text-gray-600">
            View sales by day/week/month and export as CSV
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="inline-flex rounded-xl border bg-white p-1">
            <button
              onClick={() => setRange("day")}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                range === "day" ? "bg-[#553030] text-white" : "text-[#553030]"
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setRange("week")}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                range === "week" ? "bg-[#553030] text-white" : "text-[#553030]"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setRange("month")}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                range === "month" ? "bg-[#553030] text-white" : "text-[#553030]"
              }`}
            >
              Month
            </button>
          </div>

          <a
            href={`/api/history/csv?range=${range}`}
            className="inline-flex items-center justify-center rounded-xl border bg-white px-4 py-2 text-sm font-semibold text-[#553030] hover:bg-gray-50"
          >
            ⭳ Export CSV
          </a>
        </div>
      </div>

      {/* Totals cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          title={`Sales (${title})`}
          value={`${data?.totals.totalSalesCount ?? 0} pcs`}
          accent="orange"
          icon="🛒"
        />
        <StatCard
          title={`Revenue (${title})`}
          value={`${(data?.totals.totalRevenue ?? 0).toFixed(2)} kr`}
          accent="green"
          icon="📈"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h2 className="text-lg font-bold text-[#0F172A]">Sales</h2>
          <p className="mt-1 text-sm text-gray-600">
            {data
              ? `${new Date(data.from).toLocaleDateString()} – ${new Date(
                  data.to,
                ).toLocaleDateString()}`
              : ""}
          </p>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-gray-600">Loading...</div>
        ) : error ? (
          <div className="p-6 text-sm text-red-700">{error}</div>
        ) : !data || data.sales.length === 0 ? (
          <div className="p-6 text-sm text-gray-600">
            No sales for the selected period.
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-600">
                <tr>
                  <th className="px-5 py-3 font-semibold">Product</th>
                  <th className="px-5 py-3 font-semibold">Quantity</th>
                  <th className="px-5 py-3 font-semibold">Unit price</th>
                  <th className="px-5 py-3 font-semibold">Total</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {data.sales.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-semibold text-[#0F172A]">
                      {s.productNameSnapshot}
                    </td>
                    <td className="px-5 py-4 text-[#0F172A]">{s.quantity} pcs</td>
                    <td className="px-5 py-4 text-[#0F172A]">
                      {s.unitPriceSnapshot.toFixed(2)} kr
                    </td>
                    <td className="px-5 py-4 text-[#0F172A]">{s.total.toFixed(2)} kr</td>
                    <td className="px-5 py-4 text-gray-700">
                      {new Date(s.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
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
  icon: string;
}) {
  const accentMap: Record<string, string> = {
    orange: "border-l-[#553030]",
    green: "border-l-green-600",
    blue: "border-l-blue-600",
    red: "border-l-red-600",
  };

  return (
    <div
      className={`rounded-2xl bg-white shadow-sm border-l-4 ${accentMap[accent]} p-5`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-gray-600">{title}</div>
          <div className="mt-2 text-xl font-extrabold text-[#0F172A]">
            {value}
          </div>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  )
}
