// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validators/user";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";
import User from "@/app/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const data = registerSchema.parse(body);

    const exists = await User.findOne({ email: data.email });
    if (exists) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: "user",
    });

    return NextResponse.json(
      { message: "Registration successful" },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
