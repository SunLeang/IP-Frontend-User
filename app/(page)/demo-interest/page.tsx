"use client"
import Navbar from "@/components/navigation/navbar"
import { Footer } from "@/components/footer/footer"
import { EventCard } from "@/components/home/event-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DemoInterestPage() {
  const sampleEvents = [
    {
      id: "1",
      title: "Coldplay Music Of The Galaxy",
      image: "/assets/images/coldplay.png",
      category: "Entertainment",
      date: { month: "NOV", day: "22" },
      venue: "Venue",
      time: "00:00 AM - 00:00 PM",
      price: 499,
      interested: 10,
    },
    {
      id: "2",
      title: "Elegant Event with Live Music",
      image: "/assets/images/elegant-event.png",
      category: "Entertainment",
      date: { month: "NOV", day: "22" },
      venue: "Venue",
      time: "00:00 AM - 00:00 PM",
      price: 499,
      interested: 10,
    },
    {
      id: "3",
      title: "New Year Celebration",
      image: "/assets/images/new-year.png",
      category: "Entertainment",
      date: { month: "NOV", day: "22" },
      venue: "Venue",
      time: "00:00 AM - 00:00 PM",
      price: 499,
      interested: 10,
    },
    {
      id: "4",
      title: "Book and Explore Upcoming Events",
      image: "/assets/images/event-booking.png",
      category: "Educational & Business",
      date: { month: "NOV", day: "22" },
      venue: "Venue",
      time: "00:00 AM - 00:00 PM",
      price: 499,
      interested: 10,
    },
    {
      id: "5",
      title: "Summer Night Party",
      image: "/assets/images/night-party.png",
      category: "Entertainment",
      date: { month: "NOV", day: "22" },
      venue: "Venue",
      time: "00:00 AM - 00:00 PM",
      price: 499,
      interested: 10,
    },
    {
      id: "6",
      title: "Prom Night School Graduation",
      image: "/assets/images/prom-night.png",
      category: "Entertainment",
      date: { month: "NOV", day: "22" },
      venue: "Venue",
      time: "00:00 AM - 00:00 PM",
      price: 499,
      interested: 10,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={true} />

      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Interest Functionality Demo</h1>

        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">How it works:</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Click the star icon on any event card below to mark it as "interested"</li>
            <li>The star will turn yellow to indicate you're interested in the event</li>
            <li>Click the star again to remove it from your interests</li>
            <li>
              Visit the{" "}
              <Link href="/interest" className="text-blue-600 hover:underline">
                Interest page
              </Link>{" "}
              to see all your interested events
            </li>
          </ol>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {sampleEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>

        <div className="text-center">
          <Button asChild className="px-8">
            <Link href="/interest">View My Interested Events</Link>
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
