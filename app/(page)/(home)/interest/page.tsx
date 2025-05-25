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
  const [visibleEvents, setVisibleEvents] = useState(6);

  const handleSeeMore = () => {
    setVisibleEvents((prev) => prev + 6);
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm overflow-hidden mb-6"
              >
                <Skeleton className="w-full h-48" />
                <div className="p-4">
                  <div className="flex gap-4">
                    <Skeleton className="w-12 h-14" />
                    <div className="flex-1">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-1" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : interestedEvents.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-xl font-medium text-gray-600 mb-4">
              You haven&apos;t marked any events as interested yet
            </h2>
            <p className="text-gray-500 mb-6">
              Browse events and click the star icon to add them to your
              interests
            </p>
            <Button asChild>
              <Link href="/events">Browse Events</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  className="px-8 py-2 rounded-full"
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
