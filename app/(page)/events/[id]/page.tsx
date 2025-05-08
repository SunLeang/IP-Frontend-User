"use client"
import { useState, useEffect } from "react"
import { ArrowLeft, Calendar, Clock, MapPin, Share2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useInterest } from "@/context/interest-context"
import Link from "next/link"
import Image from "next/image"
import { CancelConfirmationModal } from "@/components/events/cancel-confirmation-modal"
import { EventRating } from "@/components/events/event-rating"
import { CommentSection } from "@/components/events/comment-section"

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const { isInterested, addInterest, removeInterest } = useInterest()
  const [isJoined, setIsJoined] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showRating, setShowRating] = useState(false)
  const [eventEnded, setEventEnded] = useState(false)
  const saved = isInterested(id)

  // For demo purposes, toggle event ended state
  useEffect(() => {
    // Check if URL has ?ended=true
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get("ended") === "true") {
      setEventEnded(true)
    }
  }, [])

  // Sample event data
  const event = {
    id,
    title: "Sound of eventura event",
    bannerImage: "/assets/images/event-banner.jpg",
    category: "Technology & Innovation",
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
    price: "Free",
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

  // Sample comments data
  const comments = [
    {
      id: "1",
      user: {
        name: "Mark",
        image: "/assets/images/avatar.png",
        time: "2d ago",
      },
      rating: 5,
      text: "It was an amazing night out guys! 🎉 This was our first time using your selling service, so we were nervous (first timers). We had a friend in the city and completely trusted your service. We found a nice 4 day for free deal, we spent a considerable amount of money on food and drinks and hanging out with our kids. We also met our friends and shared stories.",
      replies: [
        {
          id: "1-1",
          user: {
            name: "Jack",
            image: "/assets/images/avatar.png",
            time: "1d ago",
          },
          rating: 0,
          text: "Thank you for your feedback! We're glad you enjoyed the event.",
        },
      ],
    },
    {
      id: "2",
      user: {
        name: "Sarah",
        image: "/assets/images/avatar.png",
        time: "3d ago",
      },
      rating: 5,
      text: "It was an amazing night out guys! 🎉 This was our first time using your selling service, so we were nervous (first timers). We had a friend in the city and completely trusted your service.",
    },
    {
      id: "3",
      user: {
        name: "Alex",
        image: "/assets/images/avatar.png",
        time: "4d ago",
      },
      rating: 4,
      text: "It was an professional visit on dog show. We were first time users of your selling service, so we were nervous (first timers). We had a friend in the city and completely trusted your service. She made sure it was for a week and provided us with detailed pictures. We were happy having a wonderful time.",
    },
  ]

  const handleInterestToggle = () => {
    if (saved) {
      removeInterest(id)
    } else {
      addInterest({
        id,
        title: event.title,
        image: event.bannerImage,
        category: event.category,
        date: {
          month: event.date.month.substring(0, 3).toUpperCase(),
          day: event.date.date,
        },
        venue: event.location.name,
        time: event.time,
        price: 0,
        interested: 10,
      })
    }
  }

  const handleJoinClick = () => {
    if (isJoined) {
      setShowCancelModal(true)
    } else {
      setIsJoined(true)
    }
  }

  const handleCancelConfirm = () => {
    setIsJoined(false)
    setShowCancelModal(false)
  }

  const handleRatingSubmit = (rating: number, feedback: string) => {
    console.log("Rating submitted:", rating, feedback)
    setShowRating(false)
    // Here you would normally submit the rating to your backend
  }

  return (
    <div className="min-h-screen bg-white pb-10">
      {/* Banner Image */}
      <div className="w-full h-[200px] md:h-[300px] relative">
        <Image src={event.bannerImage || "/placeholder.svg"} alt={event.title} fill className="object-cover" priority />
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Back Button and Title */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/events" className="mr-3">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold">{event.title}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={handleInterestToggle} aria-label="Add to favorites">
              <Star className={`h-7 w-7 ${saved ? "fill-blue-900 text-blue-900" : "text-blue-900"}`} />
            </button>
            <button aria-label="Share event">
              <Share2 className="h-7 w-7 text-blue-900" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {/* Date and Time */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">Date and Time</h2>
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
              <h2 className="text-xl font-bold mb-3">Location</h2>
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
              <h2 className="text-xl font-bold mb-3">Hosted by</h2>
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
              <h2 className="text-xl font-bold mb-3">Event Description</h2>
              <div className="whitespace-pre-line text-gray-700">{event.description}</div>
            </div>

            {/* Rating Section - Only show if event has ended */}
            {eventEnded && !showRating && (
              <Button onClick={() => setShowRating(true)} className="mb-6 bg-orange-500 hover:bg-orange-600">
                Rate this event
              </Button>
            )}

            {eventEnded && showRating && (
              <EventRating onClose={() => setShowRating(false)} onSubmit={handleRatingSubmit} />
            )}

            {/* Comments Section - Only show if event has ended */}
            {eventEnded && <CommentSection comments={comments} totalComments={126} />}
          </div>

          <div className="md:col-span-1">
            {/* Join/Cancel Button or Event Ended */}
            <div className="mb-6">
              {eventEnded ? (
                <Button
                  disabled
                  className="w-full py-6 bg-orange-500 hover:bg-orange-600 flex items-center justify-center gap-2"
                >
                  Event ended
                </Button>
              ) : isJoined ? (
                <Button
                  onClick={handleJoinClick}
                  className="w-full py-6 bg-white text-black border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </Button>
              ) : (
                <Button
                  onClick={handleJoinClick}
                  className="w-full py-6 bg-green-500 hover:bg-green-600 flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <line x1="19" x2="19" y1="8" y2="14"></line>
                    <line x1="22" x2="16" y1="11" y2="11"></line>
                  </svg>
                  Join event
                </Button>
              )}
            </div>

            {/* Ticket Information */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">Ticket Information</h2>
              <p>This event is free to join.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <CancelConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelConfirm}
      />
    </div>
  )
}
