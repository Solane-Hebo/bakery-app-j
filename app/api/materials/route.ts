import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import RawMaterial from "@/models/RawMaterial";

export async function GET() {
  try {
    await connectDB();
    const materials = await RawMaterial.find().sort({ createdAt: -1 });
    return NextResponse.json(materials);
  } catch {
    return NextResponse.json({ message: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const material = await RawMaterial.create(body);
    return NextResponse.json(material, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed to create" }, { status: 400 });
  }
}
