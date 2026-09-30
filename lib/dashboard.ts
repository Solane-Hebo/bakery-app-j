import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { Sale } from "@/models/Sale";

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

export async function getDashboardStats() {
  await connectDB();

  const from = startOfToday();
  const to = endOfToday();

  const todaySales = await Sale.find({
    createdAt: { $gte: from, $lte: to },
  }).lean();

  const todaysQuantity = todaySales.reduce(
    (sum, sale) => sum + (sale.quantity ?? 0),
    0
  );

  const todaysRevenue = todaySales.reduce(
    (sum, sale) => sum + (sale.total ?? 0),
    0
  );

  const totalProducts = await Product.countDocuments();

  const lowStockCount = await Product.countDocuments({
    $expr: {
      $lt: ["$currentStock", "$lowStockThreshold"],
    },
  });

  const recentSales = await Sale.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  return {
    stats: {
      todaysQuantity,
      todaysRevenue,
      totalProducts,
      lowStockCount,
    },

    recentSales: recentSales.map((sale) => ({
      _id: sale._id.toString(),
      productNameSnapshot: sale.productNameSnapshot,
      quantity: sale.quantity,
      total: sale.total,
      createdAt: sale.createdAt.toISOString(),
    })),
  };
}