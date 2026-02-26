import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { requireRole } from "@/lib/requireRole";
import { createStaffSchema } from "@/lib/validators/staff";
import User from "@/models/User";

export const runtime = "nodejs"

export async function GET() {
  const auth = await requireRole(["admin"])
  if (!auth.ok) {
    return NextResponse.json({ status: "error", message: auth.message }, { status: auth.status })
  }

  await connectDB()

  const staff = await User.find({}, { password: 0 }).sort({ createdAt: -1 })
  return NextResponse.json({ status: "ok", staff }, { status: 200 })
}

export async function POST(req: Request) {
  const auth = await requireRole(["admin"])
  if (!auth.ok) {
    return NextResponse.json({ status: "error", message: auth.message }, { status: auth.status })
  }

  try {
    const body = await req.json()
    const parsed = createStaffSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: "Invalid input", issues: parsed.error.flatten() },
        { status: 400 }
      )
    }

    await connectDB()

    const email = parsed.data.email.toLowerCase().trim()
    const exists = await User.findOne({ email })
    if (exists) {
      return NextResponse.json({ status: "error", message: "Email already exists" }, { status: 409 })
    }

    const hash = await bcrypt.hash(parsed.data.password, 10)

    const user = await User.create({
      name: parsed.data.name,
      email,
      password: hash,
      role: parsed.data.role,
      isActive: true,
    })

    return NextResponse.json(
      { status: "ok", user: { _id: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive } },
      { status: 201 }
    )
  } catch (err: any) {
    console.error("POST /api/staff failed:", err);
    return NextResponse.json({ status: "error", message: "Server error" }, { status: 500 });
  }
}
