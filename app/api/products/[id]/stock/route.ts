import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';
import { StockMovement } from '@/models/StockMovement';
import mongoose from 'mongoose';
import { stockAdjustSchema } from '@/lib/validators/product';

export const runtime = 'nodejs';

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ status: 'error', message: 'Invalid id' }, { status: 400 });
    }

    const body = await req.json();
    const parsed = stockAdjustSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid input', issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { type, quantity, note } = parsed.data;

    await connectDB();
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ status: 'error', message: 'Product not found' }, { status: 404 });
    }

    // Quantity rules:
    // IN: add quantity
    // OUT: subtract quantity
    // ADJUST: set stock = stock + quantity (can be +/-)
    let newStock = product.currentStock;

    if (type === 'IN') {
      newStock = product.currentStock + Math.abs(quantity);
    } else if (type === 'OUT') {
      newStock = product.currentStock - Math.abs(quantity);
    } else {
      // ADJUST
      newStock = product.currentStock + quantity; // quantity can be negative or positive
    }

    if (newStock < 0) {
      return NextResponse.json(
        { status: 'error', message: 'Stock cannot go below 0' },
        { status: 400 },
      )
    }

    product.currentStock = newStock;
    await product.save()

    const movement = await StockMovement.create({
      productId: product._id,
      type,
      quantity: type === 'OUT' ? -Math.abs(quantity) : type === 'IN' ? Math.abs(quantity) : quantity,
      note,
      stockAfter: newStock,
    })

    return NextResponse.json(
      { status: 'ok', product, movement },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to adjust stock', error: String(err) },
      { status: 500 },
    )
  }
}
