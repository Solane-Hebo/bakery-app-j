import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";


export async function GET() {
  try {
    await connectDB();

    return NextResponse.json(
      { status: "ok", message: "Database connection is healthy" },
      { status: 200 }
    )
  } catch (err) {
    return NextResponse.json(
      { status: "error", message: "Database connection failed", error: String(err) },
      { status: 500 }
    )
  }
}
