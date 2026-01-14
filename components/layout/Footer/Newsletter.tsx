"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset status
    setStatus("idle");
    setMessage("");

    if (!email) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setStatus("success");
      setMessage("Thank you for subscribing");
      setEmail("");
    } catch (error: any) {
      setStatus("error");
      setMessage(error.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 text-center">
      <p className="text-sm text-white mb-6">
       Sign me up to receive emails on new product arrivals special offers.
       
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 justify-center  text-gray-600 "
      >
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 rounded-lg bg-[#F9F9F9] border w-full sm:w-72 text-gray-600 relative"
        />

        <button
          type="submit"
          className="bg-[#553030] text-white px-4 py-2 rounded-md absolute right-7 md:right-40"
        >
          Subscribe
        </button>
      </form>

      {/* Messages */}
      {status === "success" && (
        <p className="mt-4 text-green-600 text-sm">{message}</p>
      )}

      {status === "error" && (
        <p className="mt-4 text-red-600 text-sm">{message}</p>
      )}
    </div>
  );
}
