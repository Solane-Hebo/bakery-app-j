'use client'

import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative flex h-[40vh] items-center justify-center md:h-[60vh]">
    
      <Image
        src="/hero-bakery 2.png"
        alt="Bakery hero"
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative mb-10 z-10 text-center text-white px-4 md:mb-20">
        <h1 className="mb-4 text-3xl font-bold md:text-5xl">
          Baked With Care, Served With Love
        </h1>
        <p className="mb-8 text-lg md:text-xl">
          Serious About Baking. Soft About Everything Else.
        </p>

        <Link
          href="/menu"
          className="rounded-md bg-white px-4 py-2 font-semibold text-black hover:bg-[#553030] hover:text-white transition"
        >
          See Menu
        </Link>
      </div>
    </section>
  );
}
