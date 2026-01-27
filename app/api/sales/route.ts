import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { createSaleSchema, listSalesQuerySchema } from "@/lib/validators/sales";
import { Product } from "@/models/Product";
import { Sale } from "@/models/Sale";
import { StockMovement } from "@/models/StockMovement";
import { requireAuth } from "@/lib/requireAuth";

export const runtime = "nodejs";


export async function GET(req: Request) {
  try {
    await connectDB()
    const auth = await requireAuth();
    if (!auth.ok) {
    return NextResponse.json({ status: "error", message: auth.message }, { status: auth.status });
    }

    const url = new URL(req.url)
    const parsed = listSalesQuerySchema.safeParse({
      from: url.searchParams.get("from") ?? undefined,
      to: url.searchParams.get("to") ?? undefined,
      limit: url.searchParams.get("limit") ?? undefined,
    })

    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: "Invalid query", issues: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { from, to, limit } = parsed.data

    const filter: any = {}
    if (from || to) {
      filter.createdAt = {}
      if (from) filter.createdAt.$gte = new Date(from)
      if (to) filter.createdAt.$lte = new Date(to)
    }

    const sales = await Sale.find(filter).sort({ createdAt: -1 }).limit(limit)
    return NextResponse.json({ status: "ok", sales }, { status: 200 })
  } catch (err) {
    return NextResponse.json(
      { status: "error", message: "Failed to fetch sales", error: String(err) },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  let session: mongoose.ClientSession | null = null

  try {
    const body = await req.json()
    const parsed = createSaleSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: "Invalid input", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { productId, quantity, note } = parsed.data

    await connectDB()

    session = await mongoose.startSession();
    session.startTransaction();

    const product = await Product.findById(productId).session(session);
    if (!product) {
      await session.abortTransaction();
      return NextResponse.json({ status: "error", message: "Product not found" }, { status: 404 });
    }

    if (product.currentStock < quantity) {
      await session.abortTransaction();
      return NextResponse.json(
        { status: "error", message: `Not enough stock. Available: ${product.currentStock}` },
        { status: 400 }
      );
    }

    // Uppdatera lager
    const newStock = product.currentStock - quantity
    product.currentStock = newStock;
    await product.save({ session });

    // Skapa Sale (snapshot på pris + namn)
    const total = product.price * quantity

    const sale = await Sale.create(
      [
        {
          productId: product._id,
          productNameSnapshot: product.name,
          unitPriceSnapshot: product.price,
          quantity,
          total,
          note,
        },
      ],
      { session }
    );

    // Logga lager-händelse
    await StockMovement.create(
      [
        {
          productId: product._id,
          type: "OUT",
          quantity: -Math.abs(quantity),
          note: note || "Sale",
          stockAfter: newStock,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return NextResponse.json(
      { status: "ok", message: "Sale recorded", sale: sale[0], product },
      { status: 201 }
    )
  } catch (err) {
    if (session) {
      try {
        await session.abortTransaction()
      } catch {}
    }
    return NextResponse.json(
      { status: "error", message: "Failed to record sale", error: String(err) },
      { status: 500 }
    )
  } finally {
    if (session) session.endSession()
  }
}
