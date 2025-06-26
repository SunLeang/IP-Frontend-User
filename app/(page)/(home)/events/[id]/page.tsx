"use client";

import { useState } from "react";
import { use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useInterest } from "@/context/interest-context";
import { EventPageProps } from "@/types/event";
import { useEventDetail } from "@/hooks/useEventDetail";
import {
  transformEventToCardData,
  getValidImageSrc,
} from "@/utils/event-utils";
import { EventHeader } from "@/components/events/event-header";
import { EventInfo } from "@/components/events/event-info";
import { EventActions } from "@/components/events/event-actions";
import { CommentSection } from "@/components/comments/comment-section";
import { CancelConfirmationModal } from "@/components/events/cancel-confirmation-modal";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Event Detail Page Component
 */
export default function EventDetailPage({ params }: EventPageProps) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const { user } = useAuth();
  const { isInterested, addInterest, removeInterest } = useInterest();

  // Use custom hook for event data and actions
  const {
    event,
    isLoading,
    error,
    isJoined,
    eventEnded,
    handleJoinEvent,
    handleLeaveEvent,
    refetch,
  } = useEventDetail(id);

  // Local state for UI interactions
  const [showCancelModal, setShowCancelModal] = useState(false);

  const saved = isInterested(id);

  /**
   * Handles interest toggle (add/remove from favorites)
   */
  const handleInterestToggle = () => {
    if (!event) return;

    if (saved) {
      removeInterest(id);
    } else {
      addInterest(transformEventToCardData(event));
    }
  };

  /**
   * Handles join/cancel button click
   */
  const handleJoinClick = async () => {
    if (!user) {
      window.location.href = `/login?redirect=${encodeURIComponent(
        `/events/${id}`
      )}`;
      return;
    }

    if (isJoined) {
      setShowCancelModal(true);
    } else {
      try {
        await handleJoinEvent();
      } catch (error) {
        console.error("Error joining event:", error);
      }
    }
  };

  /**
   * Handles cancel confirmation
   */
  const handleCancelConfirm = async () => {
    try {
      await handleLeaveEvent();
    } catch (error) {
      console.error("Error leaving event:", error);
    }
    setShowCancelModal(false);
  };

  // Loading state
  if (isLoading) {
    return <EventDetailLoading />;
  }

  // Error state
  if (error || !event) {
    return <EventDetailError error={error} onRetry={refetch} />;
  }

  return (
    <div className="min-h-screen bg-white pb-10">
      {/* ✅ Use EventHeader component instead of inline header */}
      <EventHeader
        event={event}
        isInterested={saved}
        onInterestToggle={handleInterestToggle}
      />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ✅ Use EventInfo component */}
          <EventInfo event={event} />

          {/* ✅ Use EventActions component */}
          <EventActions
            event={event}
            isJoined={isJoined}
            eventEnded={eventEnded}
            onJoinClick={handleJoinClick}
          />
        </div>

        {/* Comments Section */}
        <div className="mt-8">
          <CommentSection eventId={id} />
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

/**
 * Loading component for event detail page
 */
function EventDetailLoading() {
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
          <div className="flex items-center space-x-4">
            <Skeleton className="h-7 w-7" />
            <Skeleton className="h-7 w-7" />
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

/**
 * Error component for event detail page
 */
function EventDetailError({
  error,
  onRetry,
}: {
  error: string | null;
  onRetry: () => void;
}) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-4">
          {error === "Event not found"
            ? "Event not found"
            : "Something went wrong"}
        </h1>
        <p className="mb-6 text-gray-600">
          {error === "Event not found"
            ? "The event you're looking for doesn't exist or has been removed."
            : error || "Failed to load event details. Please try again."}
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={onRetry} className="bg-blue-600 hover:bg-blue-700">
            Try Again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/events">Back to Events</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
