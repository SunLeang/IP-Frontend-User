"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function HeroSection() {
  return (
    <section
      className="relative bg-cover bg-center h-[400px]"
      style={{ backgroundImage: "url('/assets/images/banner.png')" }}
    >
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold text-white">Don't miss out!</h1>
        <h2 className="text-2xl text-white mt-2">
          Explore the <span className="text-yellow-400">vibrant events</span> happening right now.
        </h2>
        <div className="mt-6 w-full max-w-xl relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search Events, Categories, Location..."
            className="w-full pl-10 py-6 rounded-md focus:outline-none bg-white border-none"
          />
        </div>
      </div>
    </section>
  )
}
