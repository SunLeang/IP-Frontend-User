"use client";

import { useState } from "react";
import { EventCard } from "@/components/events/event-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useInterest } from "@/context/interest-context";
import { getValidImageSrc } from "@/utils/event-utils";

export default function InterestPage() {
  const { interestedEvents, removeInterest, isLoading, error } = useInterest();
  const [visibleEvents, setVisibleEvents] = useState(8);

  const handleSeeMore = () => {
    setVisibleEvents((prev) => prev + 8);
  };

  const handleRemoveInterest = async (eventId: string) => {
    try {
      await removeInterest(eventId);
    } catch (err) {
      console.error("Error removing interest:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Your Interested Events</h1>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-sm"
              >
                <Skeleton className="w-full h-48" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">{error}</div>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && interestedEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No interested events yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start exploring events and add them to your interests!
              </p>
              <Button onClick={() => (window.location.href = "/events")}>
                Browse Events
              </Button>
            </div>
          </div>
        )}

        {/* Events Grid */}
        {!isLoading && !error && interestedEvents.length > 0 && (
          <>
            <p className="text-gray-600 mb-6">
              You have {interestedEvents.length} event
              {interestedEvents.length !== 1 ? "s" : ""} in your interests
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {interestedEvents.slice(0, visibleEvents).map((event) => {
                // Process the image URL for each interested event
                const processedImage = getValidImageSrc(event.image);

                console.log(
                  `❤️ INTERESTED EVENT: "${event.title}" - Original: ${event.image} -> Processed: ${processedImage}`
                );

                return (
                  <div key={event.id} className="relative">
                    <EventCard {...event} image={processedImage} />
                    <button
                      onClick={() => handleRemoveInterest(event.id)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
                      title="Remove from interests"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* See More Button */}
            {visibleEvents < interestedEvents.length && (
              <div className="text-center">
                <Button onClick={handleSeeMore} variant="outline">
                  See More ({interestedEvents.length - visibleEvents} remaining)
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
