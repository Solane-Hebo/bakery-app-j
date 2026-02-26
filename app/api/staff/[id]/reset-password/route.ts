import { NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { requireRole } from "@/lib/requireRole";
import { z } from "zod";
import User from "@/models/User";

export const runtime = "nodejs";

const resetSchema = z.object({
  newPassword: z.string().min(8, "Minst 8 tecken").max(100),
});

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(["admin"]);
  if (!auth.ok) {
    return NextResponse.json({ status: "error", message: auth.message }, { status: auth.status });
  }

  const { id } = await ctx.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ status: "error", message: "Invalid id" }, { status: 400 });
  }

  const body = await req.json();
  const parsed = resetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { status: "error", message: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await connectDB();

  const hash = await bcrypt.hash(parsed.data.newPassword, 10);
  const user = await User.findByIdAndUpdate(id, { password: hash }, { new: true });

  if (!user) {
    return NextResponse.json({ status: "error", message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ status: "ok", message: "Password reset" }, { status: 200 });
}
