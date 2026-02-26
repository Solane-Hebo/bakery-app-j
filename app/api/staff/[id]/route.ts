import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { requireRole } from "@/lib/requireRole";
import { updateStaffSchema } from "@/lib/validators/staff";
import User from "@/models/User";

export const runtime = "nodejs"

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireRole(["admin"])
  if (!auth.ok) {
    return NextResponse.json({ status: "error", message: auth.message }, { status: auth.status })
  }

  const { id } = await ctx.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ status: "error", message: "Invalid id" }, { status: 400 })
  }

  const body = await req.json()
  const parsed = updateStaffSchema.safeParse(body)
  if (!parsed.success) {
     return NextResponse.json(
      { status: "error", message: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 }
    )
  }

  await connectDB()

  const user = await User.findByIdAndUpdate(id, parsed.data, {
    new: true,
    projection: { password: 0 },
  })

  if (!user) {
    return NextResponse.json({ status: "error", message: "User not found" }, { status: 404 })
  }

  return NextResponse.json({ status: "ok", user }, { status: 200 })
}
