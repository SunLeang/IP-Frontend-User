import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import { VolunteerEvent } from "@/services/volunteer-service";
import { getValidImageSrc } from "@/utils/event-utils";

interface VolunteerEventCardProps {
  event: VolunteerEvent;
}

export function VolunteerEventCard({ event }: VolunteerEventCardProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const startTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    // Assuming 4-hour duration, you might want to get this from backend
    const endDate = new Date(date.getTime() + 4 * 60 * 60 * 1000);
    const endTime = endDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${startTime} - ${endTime}`;
  };

  const handleCardClick = () => {
    router.push(`/volunteer-role/events/${event.id}`);
  };

  const eventImage = getValidImageSrc(event.profileImage || event.coverImage);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    if (target.src !== "/assets/constants/billboard.png") {
      target.src = "/assets/constants/billboard.png";
    }
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleCardClick}
    >
      {/* Use regular img tag instead of Next.js Image */}
      <div className="relative h-48">
        <img
          src={eventImage}
          alt={event.name}
          className="w-full h-full object-cover"
          onError={handleImageError}
          onLoad={() => {
            console.log(`✅ Volunteer event card image loaded: ${event.name}`);
          }}
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2">{event.name}</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              {formatDate(event.dateTime)} • {formatTime(event.dateTime)}
            </span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="truncate">{event.locationDesc}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span>{event._count?.attendingUsers || 0} attendees</span>
            </div>
            <span className="text-blue-600">
              {event._count?.volunteers || 0} volunteers
            </span>
          </div>
          {event.category && (
            <div className="text-xs text-gray-500">
              Category: {event.category.name}
            </div>
          )}
        </div>
        <Button className="w-full mt-4 bg-blue-500 hover:bg-blue-600">
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
