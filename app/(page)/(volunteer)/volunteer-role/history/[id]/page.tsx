"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, MapPin, Share2, Download, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function HistoryEventDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [showCertificateModal, setShowCertificateModal] = useState(false)
  const [showReviewSuccess, setShowReviewSuccess] = useState(false)

  // Sample event data
  const event = {
    id,
    title: "Book Fair Event",
    bannerImage: "/assets/images/event-banner.jpg",
    category: "Educational & Business",
    date: {
      day: "Sunday",
      date: "10",
      month: "November",
      year: "2025",
    },
    time: "09:00 AM - 05:00 PM",
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
      image: "/assets/icons/user.png",
    },
    volunteerRole: "Guest Assistance",
    volunteerTasks: [
      "Guided visitors and answered questions about book locations and event schedule",
      "Assisted with author meet-and-greet sessions",
      "Helped elderly and disabled visitors navigate the venue",
      "Distributed event brochures and collected feedback forms",
    ],
    volunteerHours: 8,
    certificateAvailable: true,
  }

  // Sample comments data
  const comments = [
    {
      id: "1",
      user: {
        name: "Mark",
        image: "/assets/icons/user.png",
        time: "2d ago",
      },
      rating: 5,
      text: "It was an amazing night out guys! 🎉 This was our first time using your selling service, so we were nervous (first timers). We had a friend in the city and completely trusted your service. We found a nice 4 day for free deal, we spent a considerable amount of money on food and drinks and hanging out with our kids. We also met our friends and shared stories.",
    },
    {
      id: "2",
      user: {
        name: "Sarah",
        image: "/assets/icons/user.png",
        time: "3d ago",
      },
      rating: 5,
      text: "It was an amazing night out guys! 🎉 This was our first time using your selling service, so we were nervous (first timers). We had a friend in the city and completely trusted your service.",
    },
    {
      id: "3",
      user: {
        name: "Alex",
        image: "/assets/icons/user.png",
        time: "4d ago",
      },
      rating: 4,
      text: "It was an professional visit on dog show. We were first time users of your selling service, so we were nervous (first timers). We had a friend in the city and completely trusted your service. She made sure it was for a week and provided us with detailed pictures. We were happy having a wonderful time.",
    },
  ]

  const handleSubmitReview = () => {
    console.log("Submitting review:", { rating, comment })
    setShowReviewSuccess(true)
    // Reset form
    setRating(0)
    setComment("")

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowReviewSuccess(false)
    }, 3000)
  }

  const handleDownloadCertificate = () => {
    setShowCertificateModal(true)
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
            <Link href="/volunteer-role/history" className="mr-3">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold">{event.title}</h1>
          </div>
          <div className="flex items-center space-x-4">
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

            {/* Volunteer Role */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">Your Volunteer Role</h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">{event.volunteerRole}</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {event.volunteerTasks.map((task, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      {task}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-gray-600">
                  Total volunteer hours: <span className="font-medium">{event.volunteerHours} hours</span>
                </p>
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

            {/* Rating Section */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">Rate Your Experience</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setRating(star)} className="text-3xl px-2 focus:outline-none">
                      <span className={star <= rating ? "text-yellow-400" : "text-gray-300"}>★</span>
                    </button>
                  ))}
                </div>
                <Textarea
                  placeholder="Share your experience as a volunteer..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mb-3 min-h-[100px]"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmitReview}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={rating === 0}
                  >
                    Submit Review
                  </Button>
                </div>
                {showReviewSuccess && (
                  <div className="mt-3 p-2 bg-green-100 text-green-800 rounded-md flex items-center">
                    <Check size={16} className="mr-2" />
                    Thank you for your review!
                  </div>
                )}
              </div>
            </div>

            {/* Comments Section */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">Comments and Reviews ({comments.length})</h2>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Image
                        src={comment.user.image || "/placeholder.svg"}
                        alt={comment.user.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{comment.user.name}</span>
                          <span className="text-xs text-gray-500">{comment.user.time}</span>
                        </div>

                        <div className="flex text-yellow-400 my-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={i < comment.rating ? "text-yellow-400" : "text-gray-300"}>
                              ★
                            </span>
                          ))}
                        </div>

                        <p className="text-gray-700 mt-1">{comment.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            {/* Certificate Section */}
            <div className="bg-white rounded-lg border p-4 sticky top-20">
              <h2 className="text-xl font-bold mb-4">Volunteer Certificate</h2>
              {event.certificateAvailable ? (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    Thank you for volunteering! Your certificate of participation is now available.
                  </p>
                  <Button
                    onClick={handleDownloadCertificate}
                    className="w-full bg-green-500 hover:bg-green-600 flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    Download Certificate
                  </Button>
                </>
              ) : (
                <p className="text-sm text-gray-600">
                  Certificate will be available after the event organizer verifies your participation.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 animate-in fade-in zoom-in duration-300">
            <h2 className="text-xl font-bold text-center mb-4">Certificate Downloaded</h2>
            <p className="text-center mb-6">
              Your volunteer certificate has been downloaded. Thank you for your contribution!
            </p>
            <Button onClick={() => setShowCertificateModal(false)} className="w-full bg-blue-600 hover:bg-blue-700">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
