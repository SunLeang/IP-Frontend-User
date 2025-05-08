"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function EventDemoPage() {
  return (
    <div className="container mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Event Detail Demo</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Active Event</h2>
          <p className="mb-6">View an event that is still active, where users can join or cancel their attendance.</p>
          <Button asChild>
            <Link href="/events/event-1">View Active Event</Link>
          </Button>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Ended Event</h2>
          <p className="mb-6">View an event that has ended, showing the rating and comment sections.</p>
          <Button asChild>
            <Link href="/events/event-1?ended=true">View Ended Event</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
