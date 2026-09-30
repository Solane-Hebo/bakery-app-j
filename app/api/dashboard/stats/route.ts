import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/dashboard";

export const runtime = "nodejs";

export async function GET() {
  try {
    const data = await getDashboardStats();

    return NextResponse.json(
      {
        status: "ok",
        ...data,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Dashboard stats error:", err);

    return NextResponse.json(
      {
        status: "error",
        message: "Failed to load dashboard stats",
      },
      { status: 500 }
    );
  }
}