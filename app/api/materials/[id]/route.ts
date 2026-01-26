import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";
import RawMaterial from "@/models/RawMaterial";

export const runtime = "nodejs";

// Helper to get the ID from the request URL
function getIdFromRequest(req: Request) {
  const url = new URL(req.url);
  const segments = url.pathname.split("/"); // e.g. ['', 'api', 'materials', '696f28128ebc649067db66be']
  return segments[segments.length - 1]; // last segment = id
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const id = getIdFromRequest(req);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const material = await RawMaterial.findById(id).lean();

    if (!material) {
      return NextResponse.json({ message: "Material not found" }, { status: 404 });
    }

    return NextResponse.json(material);
  } catch (error) {
    console.error("GET SINGLE ERROR:", error);
    return NextResponse.json({ message: "Failed to load material" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();

    const id = getIdFromRequest(req);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();

    const updated = await RawMaterial.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return NextResponse.json({ message: "Material not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    return NextResponse.json({ message: "Failed to update material" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();

    const id = getIdFromRequest(req);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const deleted = await RawMaterial.findByIdAndDelete(id).lean();

    if (!deleted) {
      return NextResponse.json({ message: "Material not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json({ message: "Failed to delete material" }, { status: 500 });
  }
}
