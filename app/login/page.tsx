"use client"
import { loginSchema } from "@/lib/validators/login";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
   const router = useRouter();
   const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
   const [serverMessage, setServerMessage] = useState("")

    const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    setStatus("idle")
    setServerMessage("")

     try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

    const result = await res.json()

     if (!res.ok) {
        setStatus("error")
        setServerMessage(result.message || "Login failed. Try again.")
        return
      }

      setStatus("success")
      setServerMessage(result.message || "Logged in successfully!")
      reset()
      // setTimeout(() => router.push("/dashboard"), 800)

      setTimeout(() => router.push("/dashboard"), 800);
    } catch (error: any) {
      setStatus("error")
      setServerMessage(error?.message || "Network error. Try again.")
    }
  }

  return (
    <main className="min-h-screen bg-[#F9F9F9] flex flex-col items-center px-6 py-12">
      <div className="flex items-center mx-auto flex-col gap-2 mb-10">
        <img
          src="/cupcake-logo.png"
          alt="Bakery logo"
          className="h-10 w-16 object-contain"
        />
        <h1 className="text-4xl font-extrabold text-[#553030] text-center">
          Login
        </h1>
      </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl bg-[#978282] shadow-sm min-h-90 min-w-90 flex items-center justify-center">
          <div className="absolute inset-0 bg-[url('/cake-login.jpg')] bg-cover bg-center opacity-70 object-cover"
               aria-hidden
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 p-6 md:p-8 text-center text-white flex flex-col items-center justify-center">
            <img
              src="/cupcake-logo.png"
              alt="Bakery logo"
              className="h-12 w-auto filter brightness-0 invert mb-6"
            />
            <h2 className="text-3xl font-bold">Welcome Back</h2>
            <p className="mt-2 text-sm text-white/80">
              Log in to manage stock and sales.
            </p>
          </div>
        </div>

        <div className="rounded-2xl  bg-[#CFC5C5] p-6 shadow-sm md:p-8 md:rounded-r-2xl md:rounded-bl-none">
          <h3 className="text-xl font-bold text-[#553030] text-center md:text-left">Welcome Back!</h3>
          <p className="mt-1 text-sm text-gray-600 text-center md:text-left">Enter your details below.</p>
           {status === "success" && (
            <p className="mt-4 rounded-md bg-green-100 text-green-700 px-3 py-2 text-sm text-center">
              {serverMessage} Redirecting...
            </p>
          )}
          {status === "error" && (
            <p className="mt-4 rounded-md bg-red-100 text-red-700 px-3 py-2 text-sm text-center">
              {serverMessage}
            </p>
          )}

          <form  onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#553030]">
                Email
              </label>
              <input
              id="email"
              type="email"
              {...register("email")}
              placeholder="Your email"
              className="w-full rounded-md bg-[#FFFFFF] px-3 py-2 text-sm focus:outline-none focuse:ring-2 text-[#715454] focus:ring-[#c5a2a2]"
              />
                {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#553030]">
                Password
              </label>
              <input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Your password"
              className="w-full rounded-md text-[#553030] bg-[#FFFFFF] px-3 py-2 text-sm focus:outline-none focuse:ring-2 focus:ring-[#c5a2a2]"
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}   
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-[#553030] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#3b1f1f]/30"
            >
              {isSubmitting ? "Logging in..." : "Login"}
        
            </button>

            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-semibold text-[#553030] hover:underline">
                  Register
               </Link>

            </p>
          </form>
        </div>
        </div>

    </main>

  )
}
