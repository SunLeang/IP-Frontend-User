"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InterestEventCard } from "@/components/interest/interest-event-card";
import { useInterest } from "@/context/interest-context";
import { Skeleton } from "@/components/ui/skeleton";

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
      console.error("Failed to remove interest:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Link href="/" className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold">Interested Events</h1>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
              >
                <Skeleton className="w-full h-48" />
                <div className="p-4">
                  <div className="flex gap-4">
                    <Skeleton className="w-12 h-16 flex-shrink-0" />
                    <div className="flex-1">
                      <Skeleton className="h-6 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-1" />
                      <Skeleton className="h-3 w-1/2 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-sm max-w-md mx-auto">
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : interestedEvents.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
              <h2 className="text-xl font-medium text-gray-600 mb-4">
                You haven&apos;t marked any events as interested yet
              </h2>
              <p className="text-gray-500 mb-6">
                Browse events and click the star icon to add them to your
                interests
              </p>
              <Button
                asChild
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                <Link href="/events">Browse Events</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {interestedEvents.slice(0, visibleEvents).map((event) => (
                <InterestEventCard
                  key={event.id}
                  {...event}
                  onRemoveInterest={handleRemoveInterest}
                />
              ))}
            </div>

            {visibleEvents < interestedEvents.length && (
              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  onClick={handleSeeMore}
                  className="px-8 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  See more
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
