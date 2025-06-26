import { ArrowLeft, Share2, Star } from "lucide-react";
import Link from "next/link";
import { Event } from "@/types/event";
import { getValidImageSrc } from "@/utils/event-utils";

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
  // Process banner image properly
  const bannerImage = getValidImageSrc(event.coverImage || event.profileImage);

  console.log(`🖼️ EVENT HEADER IMAGE for "${event.name}":`, {
    coverImage: event.coverImage,
    profileImage: event.profileImage,
    finalBannerImage: bannerImage,
    isMinIO: bannerImage.includes("localhost:9000"),
  });

  return (
    <>
      {/* Banner Image - Use regular img tag instead of Next.js Image */}
      <div className="w-full h-[200px] md:h-[300px] relative">
        <img
          src={bannerImage}
          alt={event.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error(
              `❌ Banner image load failed for event: ${event.name}`
            );
            const target = e.target as HTMLImageElement;
            target.src = "/assets/constants/billboard.png";
          }}
          onLoad={() => {
            console.log(
              `✅ Banner image loaded successfully for event: ${event.name}`
            );
          }}
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
