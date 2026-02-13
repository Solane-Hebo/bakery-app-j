'use client'

import { BestSellers } from "@/components/layout/BestSellers"
import { Hero } from "@/components/layout/Hero"
import { Testimonials } from "@/components/layout/Testimonials"

const HomePage = () => {
  return (
    <>
     <div className="bg-white">
      <Hero/>
      <BestSellers/>
      <Testimonials/>
     </div>
    </>
  )
}

export default HomePage