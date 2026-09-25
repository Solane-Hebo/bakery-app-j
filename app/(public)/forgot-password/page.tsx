"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { forgotPasswordSchema } from "@/lib/validators/password";

type ForgotPasswordValues =
  z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordValues) {
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.message ||
            "Something went wrong."
        );

        return;
      }

      setMessage(result.message);
    } catch {
      setError(
        "Could not connect to the server."
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#F9F9F9] flex items-center justify-center px-6 py-12">

      <div className="w-full max-w-md rounded-2xl bg-[#978282] p-8 shadow-lg">

        <div className="text-center">
          <img
            src="/cupcake-logo.png"
            alt="Bakery logo"
            className="mx-auto h-14 w-auto"
          />

          <h1 className="mt-4 text-3xl font-bold text-[#553030]">
            Forgot password?
          </h1>

          <p className="mt-2 text-sm text-gray-700">
            Enter your email and we&apos;ll send you
            instructions to reset your password.
          </p>
        </div>

        {message && (
          <div className="mt-6 rounded-lg bg-green-100 px-4 py-3 text-sm text-green-800">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 space-y-5"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-[#553030]"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email")}
              placeholder="Your email"
              className="w-full rounded-md bg-white px-3 py-2.5 text-sm text-black outline-none focus:ring-2 focus:ring-[#553030]"
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-700">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-[#553030] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Sending..."
              : "Send reset link"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm font-semibold text-[#553030] hover:underline"
          >
            ← Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}