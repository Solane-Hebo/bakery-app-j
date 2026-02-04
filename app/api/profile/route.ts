import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getAuthUser } from "@/lib/auth";

export const runtime = "nodejs";


export async function GET() {
  try {
    await connectDB();

    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(authUser.sub).select("name email avatar");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to load profile" },
      { status: 500 }
    );
  }
}

// UPDATE profile
export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, email } = body;

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { message: "Name is too short" },
        { status: 400 }
      );
    }
    if (!email || email.trim().length < 5) {
      return NextResponse.json(
        { message: "Inavalid email" },
        { status: 400 }
      );
    }

    const updated = await User.findByIdAndUpdate(
      authUser.sub,
      {
        name: name.trim(),
        email: email.trim(),
      },
      { new: true }
    ).select("name email avatar");

    return NextResponse.json(updated);
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error)
    return NextResponse.json(
      { message: "Failed to update profile" },
      { status: 400 }
    );
  }
}
