"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Users, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function VolunteerHistoryPage() {
  const [currentPage, setCurrentPage] = useState(2)

  // Sample past events data
  const pastEvents = [
    {
      id: "new-year-1",
      title: "Event title that can go up to two lines",
      image: "/assets/images/new-year.png",
      category: "Technology & Innovation",
      date: { month: "NOV", day: "22" },
      venue: "Venue",
      time: "00:00 AM - 00:00 PM",
      attendees: 133,
      interested: 10,
      status: "Ended",
    },
    {
      id: "new-year-2",
      title: "Event title that can go up to two lines",
      image: "/assets/images/new-year.png",
      category: "Technology & Innovation",
      date: { month: "NOV", day: "22" },
      venue: "Venue",
      time: "00:00 AM - 00:00 PM",
      attendees: 133,
      interested: 10,
      status: "Ended",
    },
    {
      id: "new-year-3",
      title: "Event title that can go up to two lines",
      image: "/assets/images/new-year.png",
      category: "Technology & Innovation",
      date: { month: "NOV", day: "22" },
      venue: "Venue",
      time: "00:00 AM - 00:00 PM",
      attendees: 133,
      interested: 10,
      status: "Ended",
    },
    {
      id: "bookfair-1",
      title: "BookFair Event",
      image: "/assets/images/event-banner.jpg",
      category: "Educational & Business",
      date: { month: "OCT", day: "15" },
      venue: "Russian Conf Norodom Boulevard",
      time: "09:00 AM - 05:00 PM",
      attendees: 245,
      interested: 32,
      status: "Ended",
    },
    {
      id: "music-festival",
      title: "Sound of Eventura Music Festival",
      image: "/assets/images/event-melody.jpg",
      category: "Entertainment",
      date: { month: "SEP", day: "10" },
      venue: "Balgandharva Rang Mandir",
      time: "06:30 PM - 10:00 PM",
      attendees: 520,
      interested: 78,
      status: "Ended",
    },
    {
      id: "tech-conference",
      title: "Annual Technology Conference 2024",
      image: "/assets/images/event-banner.jpg",
      category: "Technology & Innovation",
      date: { month: "AUG", day: "05" },
      venue: "Convention Center",
      time: "09:00 AM - 06:00 PM",
      attendees: 310,
      interested: 45,
      status: "Ended",
    },
  ]

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-8">Your Volunteer Journey</h1>

        {/* Event Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {pastEvents.map((event) => (
            <Link href={`/volunteer-role/history/${event.id}`} key={event.id}>
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="relative">
                  <Image
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-red-500 text-white">{event.status}</Badge>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <Badge className="bg-yellow-400 text-black font-medium">{event.category}</Badge>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex gap-3">
                    <div className="text-center">
                      <div className="text-sm font-semibold text-blue-600">{event.date.month}</div>
                      <div className="text-2xl font-bold text-blue-600">{event.date.day}</div>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium line-clamp-2">{event.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{event.venue}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{event.time}</p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center text-xs text-gray-500">
                          <Users size={14} className="mr-1" />
                          <span>{event.attendees} People</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Star size={14} className="mr-1" />
                          <span>{event.interested} interested</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-2">
          <Button variant="outline" size="sm" className="px-3">
            <ChevronLeft size={16} className="mr-1" />
            <span className="sr-only">First</span>
            <span aria-hidden="true">First</span>
          </Button>
          <Button variant="outline" size="sm" className="px-3">
            <span className="sr-only">Back</span>
            <span aria-hidden="true">Back</span>
          </Button>
          <Button variant="outline" size="sm" className="px-3">
            1
          </Button>
          <Button variant="default" size="sm" className="px-3 bg-[#001337]">
            2
          </Button>
          <Button variant="outline" size="sm" className="px-3">
            3
          </Button>
          <Button variant="outline" size="sm" className="px-3">
            4
          </Button>
          <span className="px-2">...</span>
          <Button variant="outline" size="sm" className="px-3">
            25
          </Button>
          <Button variant="outline" size="sm" className="px-3">
            <span className="sr-only">Next</span>
            <span aria-hidden="true">Next</span>
            <ChevronRight size={16} className="ml-1" />
          </Button>
          <Button variant="outline" size="sm" className="px-3">
            <span className="sr-only">Last</span>
            <span aria-hidden="true">Last</span>
            <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
