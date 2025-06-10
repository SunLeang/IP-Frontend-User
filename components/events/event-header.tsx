import Image from "next/image";
import { ArrowLeft, Share2, Star } from "lucide-react";
import Link from "next/link";
import { Event } from "@/types/event";
import { getValidImageSrc } from "@/lib/image-utils";

/**
 * Props for EventHeader component
 */
interface EventHeaderProps {
  event: Event;
  isInterested: boolean;
  onInterestToggle: () => void;
}

/**
 * Event Header Component
 * Displays event banner image, title, and action buttons
 */
export function EventHeader({
  event,
  isInterested,
  onInterestToggle,
}: EventHeaderProps) {
  return (
    <>
      {/* Banner Image */}
      <div className="w-full h-[200px] md:h-[300px] relative">
        <Image
          src={getValidImageSrc(event.coverImage || event.profileImage)}
          alt={event.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Header with title and actions */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/events" className="mr-3">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold">{event.name}</h1>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={onInterestToggle} aria-label="Add to favorites">
              <Star
                className={`h-7 w-7 ${
                  isInterested ? "fill-blue-900 text-blue-900" : "text-blue-900"
                }`}
              />
            </button>
            <button aria-label="Share event">
              <Share2 className="h-7 w-7 text-blue-900" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
