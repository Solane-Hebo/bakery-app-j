import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Recipe from "@/models/Recipe";
import "@/models/Product";
import "@/models/RawMaterial";

export const runtime = "nodejs";

/* ===================== GET ONE RECIPE ===================== */
export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params; // ✅ AWAIT params

    const recipe = await Recipe.findById(id)
      .populate("product")
      .populate("ingredients.material");

    if (!recipe) {
      return NextResponse.json(
        { message: "Recipe not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(recipe, { status: 200 });
  } catch (error) {
    console.error("GET RECIPE ERROR:", error);
    return NextResponse.json(
      { message: "Failed to load recipe" },
      { status: 500 }
    );
  }
}

/* ===================== UPDATE RECIPE ===================== */
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params; // ✅ AWAIT params
    const body = await req.json();

    const updated = await Recipe.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    )
      .populate("product")
      .populate("ingredients.material");

    if (!updated) {
      return NextResponse.json(
        { message: "Recipe not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("UPDATE RECIPE ERROR:", error);
    return NextResponse.json(
      { message: "Failed to update recipe" },
      { status: 400 }
    );
  }
}

/* ===================== DELETE RECIPE ===================== */
export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params; // ✅ AWAIT params

    const deleted = await Recipe.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { message: "Recipe not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE RECIPE ERROR:", error);
    return NextResponse.json(
      { message: "Failed to delete recipe" },
      { status: 500 }
    );
  }
}
