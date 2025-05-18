"use client";

import React, { useState, useEffect, use } from "react";
import { ArrowLeft, Calendar, Clock, MapPin, Share2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInterest } from "@/context/interest-context";
import Link from "next/link";
import Image from "next/image";
import { CancelConfirmationModal } from "@/components/events/cancel-confirmation-modal";
import { EventRating } from "@/components/events/event-rating";
import { CommentSection } from "@/components/events/comment-section";
import { getEventById, joinEvent, leaveEvent } from "@/services/event-service";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth-context";

// Helper function to ensure image paths are properly formatted
function getImagePath(src: string | undefined | null): string {
  if (!src) return "/assets/images/event-placeholder.png";

  // If it's already an absolute URL or starts with a slash, return as is
  if (src.startsWith("http") || src.startsWith("/")) {
    return src;
  }

  return `/assets/images/${src}`;
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function EventDetailPage({ params }: PageProps) {
  const resolvedParams = use(params as any) as { id: string };
  const { id } = resolvedParams;

  const { isInterested, addInterest, removeInterest } = useInterest();
  const { user } = useAuth();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [eventEnded, setEventEnded] = useState(false);
  const [comments, setComments] = useState([]);
  const saved = isInterested(id);

  useEffect(() => {
    async function fetchEvent() {
      setIsLoading(true);
      try {
        const eventData = await getEventById(id);
        if (eventData) {
          setEvent(eventData);

          // Check if event has ended
          const eventDate = new Date(eventData.dateTime);
          setEventEnded(eventDate < new Date());
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvent();
  }, [id]);

  const handleInterestToggle = () => {
    if (!event) return;

    if (saved) {
      removeInterest(id);
    } else {
      addInterest({
        id,
        title: event.name,
        image: getImagePath(event.profileImage),
        category: event.category?.name || "Uncategorized",
        date: {
          month: new Date(event.dateTime)
            .toLocaleString("en-US", { month: "short" })
            .substring(0, 3)
            .toUpperCase(),
          day: new Date(event.dateTime).getDate().toString(),
        },
        venue: event.locationDesc,
        time: new Date(event.dateTime).toLocaleString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
        price: 0,
        interested: event._count?.interestedUsers || 0,
      });
    }
  };

  const handleJoinClick = async () => {
    if (!user) {
      // Redirect to login
      window.location.href =
        "/login?redirect=" + encodeURIComponent(`/events/${id}`);
      return;
    }

    if (isJoined) {
      setShowCancelModal(true);
    } else {
      try {
        const result = await joinEvent(id);
        if (result.success) {
          setIsJoined(true);
        }
      } catch (error) {
        console.error("Error joining event:", error);
      }
    }
  };

  const handleCancelConfirm = async () => {
    try {
      const result = await leaveEvent(id);
      if (result.success) {
        setIsJoined(false);
      }
    } catch (error) {
      console.error("Error leaving event:", error);
    }
    setShowCancelModal(false);
  };

  const handleRatingSubmit = (rating: number, feedback: string) => {
    console.log("Rating submitted:", rating, feedback);
    setShowRating(false);
    // Here you would normally submit the rating to your backend
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pb-10">
        <div className="w-full h-[200px] md:h-[300px] relative">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Skeleton className="h-6 w-6 mr-3" />
              <Skeleton className="h-8 w-64" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Skeleton className="h-6 w-48 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-6" />

              <Skeleton className="h-6 w-48 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-6" />

              <Skeleton className="h-6 w-48 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-6" />
            </div>
            <div className="md:col-span-1">
              <Skeleton className="h-12 w-full mb-6" />
              <Skeleton className="h-6 w-48 mb-3" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event not found</h1>
          <p className="mb-6">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/events">
            <Button>Back to Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-10">
      {/* Banner Image */}
      <div className="w-full h-[200px] md:h-[300px] relative">
        <Image
          src={getImagePath(event.coverImage || event.profileImage)}
          alt={event.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Back Button and Title */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/events" className="mr-3">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold">{event.name}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleInterestToggle}
              aria-label="Add to favorites"
            >
              <Star
                className={`h-7 w-7 ${
                  saved ? "fill-blue-900 text-blue-900" : "text-blue-900"
                }`}
              />
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
                  {new Date(event.dateTime).toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-start mb-2">
                <Clock className="h-5 w-5 mr-3 mt-0.5 text-gray-500" />
                <span>
                  {new Date(event.dateTime).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </span>
              </div>
            </div>

            {/* Location */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">Location</h2>
              <div className="flex items-start mb-3">
                <MapPin className="h-5 w-5 mr-3 mt-0.5 text-gray-500" />
                <div>
                  <p>{event.locationDesc}</p>
                </div>
              </div>
              {event.locationImage && (
                <div className="rounded-lg overflow-hidden border border-gray-200 ml-8">
                  <Image
                    src={getImagePath(event.locationImage)}
                    alt="Event location map"
                    width={600}
                    height={300}
                    className="w-full h-auto"
                  />
                </div>
              )}
            </div>

            {/* Hosted by */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">Hosted by</h2>
              <div className="flex items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 mr-3">
                    <Image
                      src="/assets/images/logo.png"
                      alt="Eventura"
                      width={40}
                      height={40}
                      className="rounded-sm"
                    />
                  </div>
                  <div>
                    <p className="font-medium">
                      {event.organizer?.fullName || "Event Organizer"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Description */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">Event Description</h2>
              <div className="whitespace-pre-line text-gray-700">
                {event.description}
              </div>
            </div>

            {/* Rating Section - Only show if event has ended */}
            {eventEnded && !showRating && (
              <Button
                onClick={() => setShowRating(true)}
                className="mb-6 bg-orange-500 hover:bg-orange-600"
              >
                Rate this event
              </Button>
            )}

            {eventEnded && showRating && (
              <EventRating
                onClose={() => setShowRating(false)}
                onSubmit={handleRatingSubmit}
              />
            )}

            {/* Comments Section - Only show if event has ended */}
            {eventEnded && (
              <CommentSection
                comments={comments}
                totalComments={comments.length}
              />
            )}
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

            {/* Category Information */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">Category</h2>
              <p>{event.category?.name || "Uncategorized"}</p>
            </div>

            {/* Volunteer Information - if accepting volunteers */}
            {event.acceptingVolunteers && (
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3">
                  Volunteer Opportunities
                </h2>
                <p className="mb-3">This event is looking for volunteers!</p>
                <Link href={`/volunteer/${event.id}`}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Apply as Volunteer
                  </Button>
                </Link>
              </div>
            )}
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
  );
}
