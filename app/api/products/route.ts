import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';
import { createProductSchema } from '@/lib/validators/product';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json({ status: 'ok', products }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch products', error: String(err) },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid input', issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    await connectDB();
    const product = await Product.create(parsed.data);

    return NextResponse.json({ status: 'ok', product }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to create product', error: String(err) },
      { status: 500 },
    );
  }
}
