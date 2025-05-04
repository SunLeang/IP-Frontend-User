"use client"

import { useState } from "react"
import Navbar from "@/components/navigation/navbar"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer/footer"

export default function DemoPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} />

      <div className="container mx-auto py-20 text-center flex-grow">
        <h1 className="text-3xl font-bold mb-8">Navbar State Demo</h1>
        <Button onClick={() => setIsLoggedIn(!isLoggedIn)} className="bg-blue-600 hover:bg-blue-700">
          {isLoggedIn ? "Switch to Logged Out State" : "Switch to Logged In State"}
        </Button>

        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Current State</h2>
          <p className="text-lg">
            User is currently: <span className="font-bold">{isLoggedIn ? "Logged In" : "Logged Out"}</span>
          </p>
          {isLoggedIn && (
            <p className="mt-4 text-sm text-gray-600">
              Click on the profile picture in the top right corner to open the dropdown menu, then click "Switch Role"
              to see the role selection modal.
            </p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
