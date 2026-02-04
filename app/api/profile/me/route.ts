import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  await connectDB();

  const authUser = await getAuthUser();
  if (!authUser) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(authUser.sub).select(
    "name email avatar"
  );

  return NextResponse.json(user);
}
