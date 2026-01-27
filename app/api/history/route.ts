import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Sale } from "@/models/Sale";
import { requireAuth } from "@/lib/requireAuth";
import { historyQuerySchema } from "@/lib/validators/history";
import { getRange } from "@/lib/dateRanges";

export const runtime = "nodejs"

export async function GET(req: Request) {
  const auth = await requireAuth()
  if (!auth.ok) {
    return NextResponse.json({ status: "error", message: auth.message }, { status: auth.status });
  }

  try {
    await connectDB()

    const url = new URL(req.url)
    const parsed = historyQuerySchema.safeParse({
      range: url.searchParams.get("range") ?? "day",
    })

    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: "Invalid query", issues: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { range } = parsed.data
    const { from, to } = getRange(range)

    const sales = await Sale.find({ createdAt: { $gte: from, $lte: to } }).sort({ createdAt: -1 })

    const totalSalesCount = sales.reduce((sum, s) => sum + s.quantity, 0)
    const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0)

    return NextResponse.json(
      {
        status: "ok",
        range,
        from,
        to,
        totals: { totalSalesCount, totalRevenue },
        sales,
      },
      { status: 200 }
    )
  } catch (err) {
    return NextResponse.json(
      { status: "error", message: "Failed to load history", error: String(err) },
      { status: 500 }
    )
  }
}
