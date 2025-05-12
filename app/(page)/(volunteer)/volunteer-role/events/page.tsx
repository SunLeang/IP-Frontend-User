"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Calendar, MapPin, Users } from "lucide-react"

export default function VolunteerEventsPage() {
  const router = useRouter()

  // Sample events data
  const events = [
    {
      id: "bookfair-1",
      title: "BookFair Event",
      date: "10 November 2025",
      time: "5:00 PM - 9:30 PM",
      location: "Russian Conf Norodom Boulevard, Phnom Penh",
      attendees: 121,
      volunteers: 10,
      image: "/assets/images/event-banner.jpg",
    },
    {
      id: "sound-of-eventura",
      title: "Sound of eventura event",
      date: "15 December 2025",
      time: "6:30 PM - 10:00 PM",
      location: "Balgandharva Rang Mandir, Bandra West, Mumbai",
      attendees: 220,
      volunteers: 20,
      image: "/assets/images/event-melody.jpg",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Your Volunteer Events</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card
            key={event.id}
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push(`/volunteer-role/events/${event.id}`)}
          >
            <div className="relative h-48">
              <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2">{event.title}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {event.date} • {event.time}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{event.attendees} attendees</span>
                  </div>
                  <span className="text-blue-600">{event.volunteers} volunteers</span>
                </div>
              </div>
              <Button className="w-full mt-4 bg-blue-500 hover:bg-blue-600">View Details</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
