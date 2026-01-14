"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        Sign me up to receive emails on new product arrivals and special offers.
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-2"
      >
        {/* Input + Button wrapper */}
        <div className="w-full sm:w-72 relative">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-[#F9F9F9] border text-gray-600"
          />

          <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#553030] text-white px-4 py-1.5 rounded-md text-sm"
          >
            Subscribe
          </button>
        </div>

        {/* Messages (same width as input) */}
        {status === "success" && (
          <p className="w-full sm:w-72 mt-2 text-sm text-white bg-green-600 border border-white rounded-md py-1">
            {message}
          </p>
        )}

        {status === "error" && (
          <p className="w-full sm:w-72 mt-2 text-sm text-white bg-red-600 border border-white rounded-md py-1">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
