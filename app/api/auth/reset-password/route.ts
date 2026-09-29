import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/db";
import { rateLimit } from "@/lib/rateLimit";
import User from "@/models/User";
import { resetPasswordSchema } from "@/lib/validators/password";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // --------------------------------
    // 1. Rate limit by IP
    // --------------------------------

    const forwardedFor = req.headers.get("x-forwarded-for");

    const ip =
      forwardedFor?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const ipLimit = rateLimit(
      `reset-password:${ip}`,
      {
        limit: 10,
        windowMs: 15 * 60 * 1000,
      }
    );

    if (!ipLimit.success) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Too many password reset attempts. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              ipLimit.retryAfter ?? 900
            ),
          },
        }
      );
    }

    // --------------------------------
    // 2. Read + validate request
    // --------------------------------

    const body = await req.json();

    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          status: "error",
          message:
            parsed.error.issues[0]?.message ||
            "Invalid data",
        },
        { status: 400 }
      );
    }

    const { token, password } = parsed.data;

    // --------------------------------
    // 3. Hash token
    // --------------------------------

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    await connectDB();

    // --------------------------------
    // 4. Find valid reset token
    // --------------------------------

    const user = await User.findOne({
      passwordResetToken: hashedToken,

      passwordResetExpires: {
        $gt: new Date(),
      },

      isActive: true,
    });

    if (!user) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "This password reset link is invalid or has expired.",
        },
        { status: 400 }
      );
    }

    // --------------------------------
    // 5. Hash new password
    // --------------------------------

    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    // --------------------------------
    // 6. Save new password
    // --------------------------------

    user.password = hashedPassword;

    // Invalidates JWT tokens issued before
    // the password was changed.
    user.passwordChangedAt = new Date();

    // --------------------------------
    // 7. Delete reset token
    // --------------------------------

    // Token can only be used once.
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    await user.save();

    // --------------------------------
    // 8. Success
    // --------------------------------

    return NextResponse.json(
      {
        status: "success",
        message:
          "Your password has been reset successfully. You can now log in.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);

    return NextResponse.json(
      {
        status: "error",
        message:
          "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}