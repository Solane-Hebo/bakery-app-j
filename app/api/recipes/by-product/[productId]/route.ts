import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Recipe from "@/models/Recipe";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params
  await connectDB();

  const recipe = await Recipe.findOne({ product: productId });

  if (!recipe) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(recipe);
}
