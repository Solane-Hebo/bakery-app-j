"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";

type RegisterFormData = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch("password");

  const onSubmit = (data: RegisterFormData) => {
    console.log("Register data:", data);
    // Add your API call here
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
        <h1 className="text-4xl font-extrabold text-[#553030] text-center">Register</h1>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 max-w-6xl w-full">
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
            <img className="h-25" src="/bakery logo.png" alt="bakerylogo" />
          </div>
        </div>

        {/* Right Section */}
        <div className="bg-[#978282] rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none p-6 shadow-sm md:p-8">
          <h3 className="text-2xl font-bold text-[#553030] text-center md:text-left">Create an account</h3>
          <p className="mt-1 text-sm text-gray-600 text-center md:text-left ">Fill in your details below.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            {/* Full Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-[#553030]">Full Name</label>
              <input
                {...register("fullName", { required: "Full Name is required" })}
                placeholder="Your full name"
                className="w-full rounded-md bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a2a2]"
              />
              {errors.fullName && (
                <p className="text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="mb-1 block text-sm font-medium text-[#553030]">Email</label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                placeholder="Your email"
                className="w-full rounded-md bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a2a2]"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-1 block text-sm font-medium text-[#553030]">Password</label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
                placeholder="Your password"
                className="w-full rounded-md bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a2a2]"
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-1 block text-sm font-medium text-[#553030]">Confirm Password</label>
              <input
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === password || "Passwords do not match",
                })}
                placeholder="Confirm your password"
                className="w-full rounded-md bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a2a2]"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full rounded-md bg-[#553030] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#3b1f1f]/30"
            >
              Register
            </button>

            {/* Login link */}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/pages/loginPage" className="font-semibold text-[#553030] hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
