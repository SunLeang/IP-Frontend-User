"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Check, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroSection } from "@/components/home/hero-section"

export default function VolunteerDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const [isApplied, setIsApplied] = useState(false)

  // Sample volunteer opportunity data
  const volunteer = {
    id,
    title: "Sound of eventura event",
    date: {
      day: "Sunday",
      date: "10",
      month: "November",
      year: "2025",
    },
    time: "5:00 PM - 9:30 PM",
    description: "Volunteer for Our Book Fair - Make a Difference & Enjoy Great Perks!",
    details: `We're looking for enthusiastic volunteers to help make our upcoming Book Fair a success! As a volunteer, you'll assist with event setup, book organization, customer support, and various other tasks to create a wonderful experience for book lovers.`,
    benefits: [
      "Free Meals & Refreshments – Stay energized while you work!",
      "Exclusive Event T-Shirt – A special souvenir just for volunteers.",
      "Networking Opportunities – Connect with fellow book enthusiasts, authors, and event organizers.",
      "Certificate of Appreciation – A valuable addition to your resume and future applications.",
      "Fun & Fulfilling Experience – Be part of a community-driven event that promotes reading and learning!",
    ],
    callToAction: "Join us in making this event special while enjoying great perks. Apply today! 🎉💕",
    requirements: {
      title: "Volunteer Requirements:",
      list: [
        "No experience needed – just a passion for books and events!",
        "Willingness to work as part of a team.",
        "A sense of responsibility and commitment to assigned tasks.",
        "Eagerness to learn and grow through hands-on experience.",
        "Must submit a CV for registration.",
      ],
      footer: "If you're excited to be part of this event, apply now!",
    },
    location: {
      name: "Russian Conf Norodom Boulevard, Phnom Penh",
      address: "120404",
      mapImage: "/assets/images/location-map.jpg",
    },
    host: {
      name: "Jeffrey Zin",
      image: "/assets/images/avatar.png",
    },
  }

  const handleApply = () => {
    // Redirect to application form
    router.push(`/volunteer/apply/${id}`)
  }

  return (
    <div className="min-h-screen bg-white pb-10">
      {/* Hero Banner */}
      <HeroSection />

      <div className="container mx-auto px-4 py-6">
        {/* Event Title */}
        <h1 className="text-2xl font-bold mb-6">{volunteer.title}</h1>

        {/* Date and Time */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Date and Time</h2>
          <div className="flex items-start mb-2">
            <Calendar className="h-5 w-5 mr-3 mt-0.5 text-gray-500" />
            <span>
              {volunteer.date.day}, {volunteer.date.date} {volunteer.date.month} {volunteer.date.year}
            </span>
          </div>
          <div className="flex items-start mb-2">
            <Clock className="h-5 w-5 mr-3 mt-0.5 text-gray-500" />
            <span>{volunteer.time}</span>
          </div>
          <button className="text-blue-600 ml-8 hover:underline">+ Add to Calendar</button>
        </div>

        {/* Why Volunteer? */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Why Volunteer?</h2>
          <p className="mb-4">{volunteer.description}</p>
          <p className="mb-4">{volunteer.details}</p>
          <p className="mb-2">Why Volunteer?</p>
          <ul className="mb-4">
            {volunteer.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start mb-2">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
          <p className="mb-6">{volunteer.callToAction}</p>
          <Link href={`/events/${id}`}>
            <Button className="w-full py-6">Check Event</Button>
          </Link>
        </div>

        {/* Requirements */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Requirement:</h2>
          <p className="mb-2">{volunteer.requirements.title}</p>
          <ul className="mb-4">
            {volunteer.requirements.list.map((requirement, index) => (
              <li key={index} className="flex items-start mb-2">
                <span className="text-red-500 mr-2">📌</span>
                <span>{requirement}</span>
              </li>
            ))}
          </ul>
          <p>{volunteer.requirements.footer}</p>
        </div>

        {/* Location */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Location</h2>
          <div className="flex items-start mb-3">
            <MapPin className="h-5 w-5 mr-3 mt-0.5 text-gray-500" />
            <div>
              <p>{volunteer.location.name}</p>
              <p>{volunteer.location.address}</p>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden border border-gray-200 ml-8">
            <Image
              src={volunteer.location.mapImage || "/placeholder.svg"}
              alt="Event location map"
              width={600}
              height={300}
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Hosted by */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Hosted by</h2>
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 mr-3">
                <Image src="/assets/images/logo.png" alt="Eventura" width={40} height={40} className="rounded-sm" />
              </div>
              <div>
                <p className="font-medium">{volunteer.host.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Apply Button - Fixed at bottom on mobile */}
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t md:relative md:border-0 md:p-0 md:mt-8">
          <Button onClick={handleApply} className="w-full py-6 bg-green-500 hover:bg-green-600">
            Apply Now
          </Button>
        </div>

        {/* Spacer for fixed button on mobile */}
        <div className="h-20 md:h-0"></div>
      </div>
    </div>
  )
}
