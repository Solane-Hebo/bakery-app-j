"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { resetPasswordSchema } from "@/lib/validators/password";

type ResetPasswordValues =
  z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";

  const [message, setMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),

    defaultValues: {
      token,
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: ResetPasswordValues) {
    setMessage("");
    setServerError("");

    try {
      const response = await fetch(
        "/api/auth/reset-password",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            token,
            password: data.password,
            confirmPassword: data.confirmPassword,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setServerError(
          result.message ||
            "Could not reset password."
        );

        return;
      }

      setSuccess(true);
      setMessage(result.message);
    } catch {
      setServerError(
        "Could not connect to the server."
      );
    }
  }

  if (!token) {
    return (
      <main className="min-h-screen bg-[#F9F9F9] flex items-center justify-center px-6">

        <div className="w-full max-w-md rounded-2xl bg-[#CFC5C5] p-8 text-center shadow-lg">

          <h1 className="text-2xl font-bold text-[#553030]">
            Invalid reset link
          </h1>

          <p className="mt-3 text-sm text-gray-700">
            This password reset link is missing a token.
          </p>

          <Link
            href="/forgot-password"
            className="mt-6 inline-block font-semibold text-[#553030] hover:underline"
          >
            Request a new link
          </Link>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F9F9F9] flex items-center justify-center px-6 py-12">

      <div className="w-full max-w-md rounded-2xl bg-[#CFC5C5] p-8 shadow-lg">

        <div className="text-center">

          <img
            src="/cupcake-logo.png"
            alt="Bakery logo"
            className="mx-auto h-14 w-auto"
          />

          <h1 className="mt-4 text-3xl font-bold text-[#553030]">
            Reset password
          </h1>

          <p className="mt-2 text-sm text-gray-700">
            Choose a new password for your account.
          </p>

        </div>

        {message && (
          <div className="mt-6 rounded-md bg-green-100 px-4 py-3 text-sm text-green-800">
            {message}
          </div>
        )}

        {serverError && (
          <div className="mt-6 rounded-md bg-red-100 px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        {!success && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 space-y-5"
          >

            {/* Hidden token */}
            <input
              type="hidden"
              {...register("token")}
              value={token}
            />

            {/* New password */}

            <div>

              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-[#553030]"
              >
                New password
              </label>

              <input
                id="password"
                type="password"
                autoComplete="new-password"
                {...register("password")}
                placeholder="New password"
                className="w-full rounded-md bg-white px-3 py-2.5 text-sm text-[#553030] outline-none focus:ring-2 focus:ring-[#553030]"
              />

              {errors.password && (
                <p className="mt-1 text-sm text-red-700">
                  {errors.password.message}
                </p>
              )}

            </div>

            {/* Confirm password */}

            <div>

              <label
                htmlFor="confirmPassword"
                className="mb-1 block text-sm font-medium text-[#553030]"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...register("confirmPassword")}
                placeholder="Confirm new password"
                className="w-full rounded-md bg-white px-3 py-2.5 text-sm text-[#553030] outline-none focus:ring-2 focus:ring-[#553030]"
              />

              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-700">
                  {errors.confirmPassword.message}
                </p>
              )}

            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-[#553030] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Resetting..."
                : "Reset password"}
            </button>

          </form>
        )}

        {success && (
          <Link
            href="/login"
            className="mt-6 block w-full rounded-md bg-[#553030] px-4 py-2.5 text-center text-sm font-semibold text-white hover:opacity-90"
          >
            Go to login
          </Link>
        )}

      </div>

    </main>
  );
}