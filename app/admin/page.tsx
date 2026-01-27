type StatsResponse = {
  status: string;
  stats: {
    todaysQuantity: number
    todaysRevenue: number
    totalProducts: number
    lowStockCount: number
  };
  recentSales: Array<{
    _id: string
    productNameSnapshot: string
    quantity: number
    total: number
    createdAt: string
  }>
}

async function getStats(): Promise<StatsResponse | null> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")

  const res = await fetch(`${baseUrl}/api/dashboard/stats`, { cache: "no-store" })
  if (!res.ok) return null
  return res.json()
}

export default async function AdminDashboard() {
  const data = await getStats()

  const stats = data?.stats ?? {
    todaysQuantity: 0,
    todaysRevenue: 0,
    totalProducts: 0,
    lowStockCount: 0,
  }

  const recent = data?.recentSales ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-[#0F172A]">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Overview of today’s sales and inventory status
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Today's sales" value={`${stats.todaysQuantity} pcs`} accent="orange" icon="🛒" />
        <StatCard title="Today's revenue" value={`${stats.todaysRevenue.toFixed(2)} kr`} accent="green" icon="📈" />
        <StatCard title="Total products" value={`${stats.totalProducts} pcs`} accent="blue" icon="⬚" />
        <StatCard title="Low stock" value={`${stats.lowStockCount} pcs`} accent="red" icon="⚠" />
      </div>

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
                    No sales yet.
                  </td>
                </tr>
              ) : (
                recent.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-semibold text-[#0F172A]">
                      {s.productNameSnapshot}
                    </td>
                    <td className="px-5 py-4 text-[#0F172A]">{s.quantity} pcs</td>
                    <td className="px-5 py-4 text-[#0F172A]">{s.total.toFixed(2)} kr</td>
                    <td className="px-5 py-4 text-gray-700">
                      {new Date(s.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
    orange: "border-l-[#F59E0B]",
    green: "border-l-green-600",
    blue: "border-l-blue-600",
    red: "border-l-red-600",
  }

  return (
    <div className={`rounded-2xl bg-white shadow-sm border-l-4 ${accentMap[accent]} p-5`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-gray-600">{title}</div>
          <div className="mt-2 text-xl font-extrabold text-[#0F172A]">{value}</div>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  )
}

  