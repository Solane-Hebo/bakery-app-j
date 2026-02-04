import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getAuthUser, AUTH_COOKIE_NAME } from "@/lib/auth";

export const runtime = "nodejs";

export async function PUT(req: Request) {
  try {
    await connectDB();
    const authUser = await getAuthUser();
    if (!authUser) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { currentPassword, newPassword } = await req.json();

    if (newPassword.length < 6) {
      return NextResponse.json({ message: "Password too short" }, { status: 400 });
    }

    const user = await User.findById(authUser.sub);
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) {
      return NextResponse.json({ message: "Current password incorrect" }, { status: 400 });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordChangedAt = new Date();
    await user.save();

    const res = NextResponse.json(
        { message: "Password updated. Please log in again." }, 
        {status: 200 }
    );
    res.cookies.set(AUTH_COOKIE_NAME, "", {
        path: "/",
        maxAge: 0,
      });
  
      return res;
  } catch(error) {
    return NextResponse.json({ message: "Failed to update password" }, { status: 500 });
  }
}
