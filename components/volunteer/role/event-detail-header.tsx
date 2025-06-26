import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Star } from "lucide-react";
import { Event } from "@/services/event-service";
import { getValidImageSrc } from "@/utils/event-utils";

interface EventDetailHeaderProps {
  event: Event; // Use Event type from service
  isStarred: boolean;
  onToggleStar: () => void;
}

export function EventDetailHeader({
  event,
  isStarred,
  onToggleStar,
}: EventDetailHeaderProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString("en-US", { weekday: "long" }),
      date: date.getDate().toString(),
      month: date.toLocaleDateString("en-US", { month: "long" }),
      year: date.getFullYear().toString(),
    };
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const startTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    // Assuming 4-hour duration
    const endDate = new Date(date.getTime() + 4 * 60 * 60 * 1000);
    const endTime = endDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${startTime} - ${endTime}`;
  };

  const eventDate = formatDate(event.dateTime);
  const eventImage = getValidImageSrc(event.coverImage || event.profileImage);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    console.log("🖼️ Event detail image failed to load, using fallback");
    const target = e.target as HTMLImageElement;
    if (target.src !== "/assets/constants/billboard.png") {
      target.src = "/assets/constants/billboard.png";
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">{event.name}</h2>
            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              {event.status}
            </span>
          </div>
          <button onClick={onToggleStar}>
            <Star
              className={`h-6 w-6 ${
                isStarred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
              }`}
            />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-gray-500" />
            <div>
              <p className="font-medium">
                {eventDate.day}, {eventDate.date} {eventDate.month}{" "}
                {eventDate.year}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-gray-500" />
            <p>{formatTime(event.dateTime)}</p>
          </div>
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-gray-500" />
            <p className="truncate">{event.locationDesc}</p>
          </div>
        </div>

        {/* Use regular img tag instead of Next.js Image */}
        <div className="relative h-64 rounded-lg overflow-hidden mb-4">
          <img
            src={eventImage}
            alt={event.name}
            className="w-full h-full object-cover"
            onError={handleImageError}
            onLoad={() => {
              console.log(`✅ Event detail image loaded: ${eventImage}`);
            }}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">About this event</h3>
          <p className="text-gray-700">{event.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
