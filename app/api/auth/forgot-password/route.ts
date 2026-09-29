import { NextResponse } from "next/server";
import crypto from "crypto";

import { sendPasswordResetEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rateLimit";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { forgotPasswordSchema } from "@/lib/validators/password";

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
      `forgot-password:${ip}`,
      {
        limit: 5,
        windowMs: 15 * 60 * 1000,
      }
    );

    if (!ipLimit.success) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Too many password reset requests. Please try again later.",
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
    // 2. Validate body
    // --------------------------------

    const body = await req.json();

    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          status: "error",
          message: "Please enter a valid email address",
        },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();

    // Same response whether account exists or not.
    const genericResponse = {
      status: "ok",
      message:
        "If an account exists with this email, a password reset link has been sent.",
    };

    // --------------------------------
    // 3. Rate limit by email
    // --------------------------------

    const emailLimit = rateLimit(
      `forgot-password-email:${email}`,
      {
        limit: 3,
        windowMs: 15 * 60 * 1000,
      }
    );

    if (!emailLimit.success) {
      // Do not reveal whether the email exists.
      return NextResponse.json(genericResponse, {
        status: 200,
      });
    }

    // --------------------------------
    // 4. Find user
    // --------------------------------

    await connectDB();

    const user = await User.findOne({ email });

    if (!user || !user.isActive) {
      return NextResponse.json(genericResponse, {
        status: 200,
      });
    }

    // --------------------------------
    // 5. Create reset token
    // --------------------------------

    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");

    // Store only a hash of the token.
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetToken = hashedToken;

    user.passwordResetExpires = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await user.save();

    // --------------------------------
    // 6. Create reset URL
    // --------------------------------

    const baseUrl =
      process.env.APP_URL || "http://localhost:3000";

    const resetUrl =
      `${baseUrl}/reset-password?token=${resetToken}`;

    // --------------------------------
    // 7. Send email
    // --------------------------------

    await sendPasswordResetEmail({
      email: user.email,
      resetUrl,
    });

    // --------------------------------
    // 8. Generic response
    // --------------------------------

    return NextResponse.json(genericResponse, {
      status: 200,
    });
  } catch (error) {
    console.error("Forgot password error:", error);

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