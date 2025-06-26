import Link from "next/link";
import { Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { VolunteerHistoryEvent } from "@/services/volunteer-history-service";
import { getValidImageSrc } from "@/utils/event-utils";

interface VolunteerEventCardProps {
  event: VolunteerHistoryEvent;
}

export function VolunteerEventCard({ event }: VolunteerEventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
      day: date.getDate().toString().padStart(2, "0"),
    };
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-red-500 text-white";
      case "published":
        return "bg-green-500 text-white";
      case "cancelled":
        return "bg-gray-500 text-white";
      default:
        return "bg-blue-500 text-white";
    }
  };

  const dateInfo = formatDate(event.dateTime);
  const timeInfo = formatTime(event.dateTime);

  // Process image URL correctly
  const eventImage = getValidImageSrc(event.profileImage || event.coverImage);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    console.log(`🖼️ History event image failed to load: ${event.name}`);
    const target = e.target as HTMLImageElement;
    if (target.src !== "/assets/constants/billboard.png") {
      target.src = "/assets/constants/billboard.png";
    }
  };

  console.log(`🎯 HISTORY EVENT CARD: "${event.name}"`, {
    originalProfileImage: event.profileImage,
    originalCoverImage: event.coverImage,
    processedImage: eventImage,
    isMinIO: eventImage.includes("localhost:9000"),
  });

  return (
    <Link href={`/volunteer-role/history/${event.id}`}>
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <div className="relative">
          {/* Use regular img tag instead of Next.js Image */}
          <img
            src={eventImage}
            alt={event.name}
            className="w-full h-48 object-cover"
            onError={handleImageError}
            onLoad={() => {
              console.log(
                `✅ History event image loaded: ${event.name} - ${eventImage}`
              );
            }}
          />
          <Badge
            className={`absolute top-2 right-2 ${getStatusBadge(event.status)}`}
          >
            {event.status === "COMPLETED" ? "Ended" : event.status}
          </Badge>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <Badge className="bg-yellow-400 text-black font-medium">
              {event.category?.name || "General"}
            </Badge>
          </div>
        </div>

        <div className="p-4">
          <div className="flex gap-3">
            <div className="text-center">
              <div className="text-sm font-semibold text-blue-600">
                {dateInfo.month}
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {dateInfo.day}
              </div>
            </div>

            <div className="flex-1">
              <h3 className="font-medium line-clamp-2">{event.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{event.locationDesc}</p>
              <p className="text-xs text-gray-400 mt-0.5">{timeInfo}</p>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center text-xs text-gray-500">
                  <Users size={14} className="mr-1" />
                  <span>{event._count?.attendingUsers || 0} People</span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Star size={14} className="mr-1" />
                  <span>{event._count?.volunteers || 0} volunteers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
