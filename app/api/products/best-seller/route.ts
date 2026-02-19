import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Product } from "@/models/Product"

export async function GET() {
  try {
    await connectDB()

    const products = await Product.find({
      isBestSeller: true,
      isActive: true,
      currentStock: { $gt: 0 },
    })
      .sort({ createdAt: -1 })
      .limit(4)
      .lean()

    return NextResponse.json({ status: "ok", products })
  } catch (err) {
    return NextResponse.json(
      { status: "error", message: "Failed to fetch best sellers" },
      { status: 500 }
    )
  }
}
