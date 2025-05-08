"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function VolunteerDemoPage() {
  return (
    <div className="container mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Volunteer Pages Demo</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Volunteer Listings</h2>
          <p className="mb-6">
            View all volunteer opportunities available. Browse through different events that need volunteers.
          </p>
          <Button asChild>
            <Link href="/volunteer">View Volunteer Listings</Link>
          </Button>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Volunteer Details</h2>
          <p className="mb-6">
            View details about a specific volunteer opportunity, including requirements and benefits.
          </p>
          <Button asChild>
            <Link href="/volunteer/volunteer-1">View Volunteer Details</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
