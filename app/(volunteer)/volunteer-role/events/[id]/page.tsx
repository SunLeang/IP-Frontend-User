"use client"

import { useState } from "react"
import Image from "next/image"
import { Calendar, Clock, Download, MapPin, Search, Share2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function VolunteerEventPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [activeTab, setActiveTab] = useState("details")
  const [isStarred, setIsStarred] = useState(false)

  // Sample event data
  const event = {
    id,
    title: "Sound of eventura event",
    date: {
      day: "Sunday",
      date: "10",
      month: "November",
      year: "2025",
    },
    time: "5:00 PM - 9:30 PM",
    location: {
      name: "Russian Conf Norodom Boulevard, Phnom Penh",
      address: "120404",
      mapImage: "/assets/images/location-map.jpg",
    },
    description: `Get ready to kick off the Christmas season in Mumbai with SOUND OF CHRISTMAS - your favourite LIVE Christmas concert!

City Youth Movement invites you to the 4th edition of our annual Christmas festivities - by the youth and for the youth! Feat. your favourite worship leaders, carols, quizzes and some exciting surprises!

Bring your family and friends and sing along your favourite Christmas carols on the 2nd of December, 6:30 PM onwards at the Balgandharva Rang Mandir, Bandra West. Book your tickets now!

3 Reasons to attend the event:

1. The FIRST Christmas concert of Mumbai!
2. A special Christmas Choir!
3. Special Dance performances and many more surprises!`,
    host: {
      name: "Jeffrey Zin",
      image: "/assets/images/avatar.png",
    },
  }

  // Sample attendees data
  const attendees = [
    { id: "000001", name: "Sun Leang", status: "Attending", gender: "Male", date: "01-01-2024" },
    { id: "000002", name: "Sophia", status: "Attending", gender: "Female", date: "01-01-2024" },
    { id: "000003", name: "Visal Prak", status: "Attending", gender: "Male", date: "01-01-2024" },
    { id: "000004", name: "Jeffrey", status: "Attending", gender: "Male", date: "01-01-2024" },
    { id: "000005", name: "Dara Soun", status: "Attending", gender: "Female", date: "01-01-2024" },
    { id: "000006", name: "Andy", status: "Interested", gender: "Female", date: "01-01-2024" },
    { id: "000007", name: "Sing Neth", status: "Attending", gender: "Female", date: "01-01-2024" },
    { id: "000008", name: "Robert", status: "Interested", gender: "Male", date: "01-01-2024" },
    { id: "000009", name: "Melissa Shrivel", status: "Interested", gender: "Male", date: "01-01-2024" },
    { id: "000010", name: "Cici", status: "Attending", gender: "Female", date: "01-01-2024" },
  ]

  // Sample volunteers data
  const volunteers = [
    { id: "000001", name: "Sun Leang", task: "R/D", gender: "Male", date: "01-01-2024" },
    { id: "000002", name: "Sophia", task: "R/D", gender: "Female", date: "01-01-2024" },
    { id: "000003", name: "Visal Prak", task: "QTG", gender: "Male", date: "01-01-2024" },
    { id: "000004", name: "Jeffrey", task: "R/D", gender: "Male", date: "01-01-2024" },
    { id: "000005", name: "Dara Soun", task: "R/D", gender: "Female", date: "01-01-2024" },
    { id: "000006", name: "Andy", task: "QTG", gender: "Female", date: "01-01-2024" },
    { id: "000007", name: "Sing Neth", task: "R/D", gender: "Female", date: "01-01-2024" },
    { id: "000008", name: "Robert", task: "QTG", gender: "Male", date: "01-01-2024" },
    { id: "000009", name: "Melissa Shrivel", task: "R/D", gender: "Male", date: "01-01-2024" },
    { id: "000010", name: "Cici", task: "R/D", gender: "Female", date: "01-01-2024" },
  ]

  return (
    <div className="min-h-screen bg-white pb-10">
      <div className="container mx-auto px-4 py-6">
        {/* Event Title */}
        <h1 className="text-xl font-bold mb-4">You're volunteering for BookFair Event</h1>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-md border border-gray-200">
            <Button
              variant={activeTab === "details" ? "default" : "ghost"}
              className={`rounded-none ${activeTab === "details" ? "bg-blue-500" : ""}`}
              onClick={() => setActiveTab("details")}
            >
              Details
            </Button>
            <Button
              variant={activeTab === "attendee" ? "default" : "ghost"}
              className={`rounded-none border-l border-r ${activeTab === "attendee" ? "bg-blue-500" : ""}`}
              onClick={() => setActiveTab("attendee")}
            >
              Attendee
            </Button>
            <Button
              variant={activeTab === "volunteer" ? "default" : "ghost"}
              className={`rounded-none ${activeTab === "volunteer" ? "bg-blue-500" : ""}`}
              onClick={() => setActiveTab("volunteer")}
            >
              Volunteer
            </Button>
          </div>
          <Button variant="outline" className="ml-auto" onClick={() => window.print()}>
            <Download size={16} className="mr-2" />
            Download Report
          </Button>
        </div>

        {/* Details Tab Content */}
        {activeTab === "details" && (
          <div>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{event.title}</h2>
              <div className="flex items-center space-x-4">
                <button onClick={() => setIsStarred(!isStarred)} aria-label="Add to favorites">
                  <Star className={`h-6 w-6 ${isStarred ? "fill-blue-900 text-blue-900" : "text-blue-900"}`} />
                </button>
                <button aria-label="Share event">
                  <Share2 className="h-6 w-6 text-blue-900" />
                </button>
              </div>
            </div>

            {/* Date and Time */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3">Date and Time</h3>
              <div className="flex items-start mb-2">
                <Calendar className="h-5 w-5 mr-3 mt-0.5 text-gray-500" />
                <span>
                  {event.date.day}, {event.date.date} {event.date.month} {event.date.year}
                </span>
              </div>
              <div className="flex items-start mb-2">
                <Clock className="h-5 w-5 mr-3 mt-0.5 text-gray-500" />
                <span>{event.time}</span>
              </div>
              <button className="text-blue-600 ml-8 hover:underline">+ Add to Calendar</button>
            </div>

            {/* Location */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3">Location</h3>
              <div className="flex items-start mb-3">
                <MapPin className="h-5 w-5 mr-3 mt-0.5 text-gray-500" />
                <div>
                  <p>{event.location.name}</p>
                  <p>{event.location.address}</p>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden border border-gray-200 ml-8">
                <Image
                  src={event.location.mapImage || "/placeholder.svg"}
                  alt="Event location map"
                  width={600}
                  height={300}
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Hosted by */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3">Hosted by</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 mr-3">
                    <Image src="/assets/images/logo.png" alt="Eventura" width={40} height={40} className="rounded-sm" />
                  </div>
                  <div>
                    <p className="font-medium">{event.host.name}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Description */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3">Event Description</h3>
              <div className="whitespace-pre-line text-gray-700">{event.description}</div>
            </div>

            {/* Ticket Information */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3">Ticket Information</h3>
              <p>This event is free to join.</p>
            </div>
          </div>
        )}

        {/* Attendee Tab Content */}
        {activeTab === "attendee" && (
          <div>
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">Events</span>
                <span className="text-sm text-gray-500 mx-2">›</span>
                <span className="text-sm font-medium">Attendees</span>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Search..." className="pl-10 w-64" />
                </div>
                <Button variant="outline" size="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18M3 12h18M3 18h18" />
                  </svg>
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">No.</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">ID</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Name</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Gender</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Date</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500"></th>
                  </tr>
                </thead>
                <tbody>
                  {attendees.map((attendee, index) => (
                    <tr key={attendee.id} className="border-t">
                      <td className="px-4 py-3 text-sm">{index + 1}</td>
                      <td className="px-4 py-3 text-sm">{attendee.id}</td>
                      <td className="px-4 py-3 text-sm font-medium">{attendee.name}</td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            attendee.status === "Attending"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {attendee.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{attendee.gender}</td>
                      <td className="px-4 py-3 text-sm">{attendee.date}</td>
                      <td className="px-4 py-3">
                        <button>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-500"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="19" cy="12" r="1" />
                            <circle cx="5" cy="12" r="1" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">1-10 of 100</div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" disabled>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </Button>
                <Button variant="outline" size="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Volunteer Tab Content */}
        {activeTab === "volunteer" && (
          <div>
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">Events</span>
                <span className="text-sm text-gray-500 mx-2">›</span>
                <span className="text-sm font-medium">Volunteers</span>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Search..." className="pl-10 w-64" />
                </div>
                <Button variant="outline" size="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18M3 12h18M3 18h18" />
                  </svg>
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">No.</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">ID</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Name</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Tasks</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Gender</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Date</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500"></th>
                  </tr>
                </thead>
                <tbody>
                  {volunteers.map((volunteer, index) => (
                    <tr key={volunteer.id} className="border-t">
                      <td className="px-4 py-3 text-sm">{index + 1}</td>
                      <td className="px-4 py-3 text-sm">{volunteer.id}</td>
                      <td className="px-4 py-3 text-sm font-medium">{volunteer.name}</td>
                      <td className="px-4 py-3 text-sm">
                        {volunteer.task === "ATTENDING" ? (
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            {volunteer.task}
                          </span>
                        ) : (
                          volunteer.task
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">{volunteer.gender}</td>
                      <td className="px-4 py-3 text-sm">{volunteer.date}</td>
                      <td className="px-4 py-3">
                        <button>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-500"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="19" cy="12" r="1" />
                            <circle cx="5" cy="12" r="1" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">1-10 of 100</div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" disabled>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </Button>
                <Button variant="outline" size="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
