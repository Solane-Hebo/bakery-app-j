"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { registerSchema } from "@/lib/validators/user"; // your Zod schema

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });
  

  const onSubmit = async (data: RegisterFormValues) => {
    setStatus("idle");
    setServerMessage("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setStatus("error");
        setServerMessage(result.message);
        return;
      }

      setStatus("success");
      setServerMessage(result.message);
      reset(); // clears the form

      // Redirect to login after 2 seconds
      setTimeout(() => router.push("/login"), 2000);
    } catch (error: any) {
      setStatus("error");
      setServerMessage(error?.message || "Network error. Try again.");
    }
  };

  return (
    <main className="min-h-screen bg-[#F9F9F9] flex flex-col items-center px-6 py-12">
      {/* Header */}
      <div className="flex items-center gap-2 mb-10">
        <img
          src="/cupcake-logo.png"
          alt="Bakery logo"
          className="h-10 w-16 object-contain"
        />
        <h1 className="text-4xl font-extrabold text-[#553030] text-center">
          Register
        </h1>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 max-w-6xl w-full gap-0">
        {/* Left Section */}
        <div className="relative overflow-hidden rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none bg-[#978282] shadow-sm min-h-[320px] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-[url('/cake-login.jpg')] bg-cover bg-center opacity-70"
            aria-hidden
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 p-6 md:p-8 text-center text-white flex flex-col items-center justify-center">
            <img
              src="/cupcake-logo.png"
              alt="Bakery logo"
              className="h-12 w-auto filter brightness-0 invert mb-6"
            />
            <h2 className="text-3xl font-bold">Register</h2>
          </div>
        </div>

        {/* Right Section */}
        <div className="bg-[#978282] rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none p-6 shadow-sm md:p-8">
          <h3 className="text-2xl font-bold text-[#553030] text-center md:text-left">
            Create an account
          </h3>
          <p className="mt-1 text-sm text-gray-600 text-center md:text-left">
            Fill in your details below.
          </p>

          {/* Success/Error messages */}
          {status === "success" && (
            <p className="mb-4 rounded-md bg-green-100 text-green-700 px-3 py-2 text-sm text-center">
              {serverMessage} Redirecting to login...
            </p>
          )}
          {status === "error" && (
            <p className="mb-4 rounded-md bg-red-100 text-red-700 px-3 py-2 text-sm text-center">
              {serverMessage}
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            {/* Full Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-[#553030]">
                Full Name
              </label>
              <input
                {...register("name")}
                placeholder="Your full name"
                className="w-full rounded-md bg-white text-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a2a2]"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="mb-1 block text-sm font-medium text-[#553030]">
                Email
              </label>
              <input
                {...register("email")}
                placeholder="Your email"
                className="w-full rounded-md bg-white text-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a2a2]"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-1 block text-sm font-medium text-[#553030]">
                Password
              </label>
              <input
                type="password"
                {...register("password")}
                placeholder="Your password"
                className="w-full rounded-md bg-white text-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a2a2]"
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-1 block text-sm font-medium text-[#553030]">
                Confirm Password
              </label>
              <input
                type="password"
                {...register("confirmPassword")}
                placeholder="Confirm your password"
                className="w-full rounded-md bg-white text-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a2a2]"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-[#553030] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#3b1f1f]/30"
            >
              Register
            </button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#553030] hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
