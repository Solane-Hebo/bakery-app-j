import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { Sale } from "@/models/Sale";

export const runtime = "nodejs";

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
function endOfToday() {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
}

export async function GET() {
  try {
    await connectDB();

    const from = startOfToday();
    const to = endOfToday();

    // Sales today
    const todaySales = await Sale.find({ createdAt: { $gte: from, $lte: to } });

    const todaysQuantity = todaySales.reduce((sum, s) => sum + (s.quantity ?? 0), 0);
    const todaysRevenue = todaySales.reduce((sum, s) => sum + (s.total ?? 0), 0);

    // Products stats
    const totalProducts = await Product.countDocuments();
    const lowStockCount = await Product.countDocuments({
      $expr: { $lt: ["$currentStock", "$lowStockThreshold"] },
    });

    // Recent sales
    const recentSales = await Sale.find().sort({ createdAt: -1 }).limit(10);

    return NextResponse.json(
      {
        status: "ok",
        stats: {
          todaysQuantity,
          todaysRevenue,
          totalProducts,
          lowStockCount,
        },
        recentSales,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { status: "error", message: "Failed to load dashboard stats", error: String(err) },
      { status: 500 }
    );
  }
}
