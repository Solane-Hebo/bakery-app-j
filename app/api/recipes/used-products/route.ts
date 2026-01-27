import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Recipe from "@/models/Recipe";

export async function GET() {
  try {
    await connectDB();

    const recipes = await Recipe.find().select("product");
    const usedProductIds = recipes.map(r => r.product.toString());

    return NextResponse.json(usedProductIds);
  } catch (error) {
    console.error("USED PRODUCTS ERROR:", error);
    return NextResponse.json([], { status: 500 });
  }
}
