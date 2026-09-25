import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { updateProductSchema } from "@/lib/validators/product";
import { requireRole } from "@/lib/requireRole";
import mongoose from "mongoose";

export const runtime = "nodejs";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  // ONLY ADMIN CAN EDIT
  const auth = await requireRole(["admin"]);

  if (!auth.ok) {
    return NextResponse.json(
      {
        status: "error",
        message: auth.message,
      },
      { status: auth.status }
    );
  }

  try {
    const { id } = await ctx.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          status: "error",
          message: "Invalid id",
        },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsed = updateProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          status: "error",
          message: "Invalid input",
          issues: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    await connectDB();

    const updated = await Product.findByIdAndUpdate(
      id,
      parsed.data,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        {
          status: "error",
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        status: "ok",
        product: updated,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("PATCH product failed:", err);

    return NextResponse.json(
      {
        status: "error",
        message: "Failed to update product",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  // ONLY ADMIN CAN DELETE
  const auth = await requireRole(["admin"]);

  if (!auth.ok) {
    return NextResponse.json(
      {
        status: "error",
        message: auth.message,
      },
      { status: auth.status }
    );
  }

  try {
    const { id } = await ctx.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          status: "error",
          message: "Invalid id",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        {
          status: "error",
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        status: "ok",
        message: "Deleted",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE product failed:", err);

    return NextResponse.json(
      {
        status: "error",
        message: "Failed to delete product",
      },
      { status: 500 }
    );
  }
}