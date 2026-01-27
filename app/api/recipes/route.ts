import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Recipe from "@/models/Recipe";
import "@/models/RawMaterial"; 
import "@/models/Product"; 

 

export const runtime = "nodejs";

// GET all recipes
export async function GET() {
  try {
    await connectDB();

    const recipes = await Recipe.find()
      .populate("product")
      .populate("ingredients.material")
      .sort({ createdAt: -1 });

    return NextResponse.json(Array.isArray(recipes) ? recipes : [], { status: 200 });
  } catch (error) {
    console.error("GET RECIPES ERROR:", error);
    return NextResponse.json({ message: "Failed to fetch recipes" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

  
    const exists = await Recipe.findOne({ product: body.product });
    if (exists) {
      return NextResponse.json(
        { message: "Recipe already exists for this product" },
        { status: 400 }
      );
    }

    const recipe = await Recipe.create(body);

    const populated = await Recipe.findById(recipe._id)
      .populate("product")
      .populate("ingredients.material");

    return NextResponse.json(populated, { status: 201 });
  } catch (error: any) {
    
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "This product already has a recipe." },
        { status: 400 }
      );
    }

    console.error("CREATE RECIPE ERROR:", error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

