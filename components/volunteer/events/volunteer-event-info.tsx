import { Calendar, Clock, MapPin, Users, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { VolunteerHistoryEvent } from "@/services/volunteer-history-service";
import { getValidImageSrc } from "@/utils/event-utils";

interface VolunteerEventInfoProps {
  event: VolunteerHistoryEvent;
}

export function VolunteerEventInfo({ event }: VolunteerEventInfoProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-red-100 text-red-800 border-red-200";
      case "published":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "Event Ended";
      case "published":
        return "Published";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const eventImage = getValidImageSrc(event.profileImage);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    if (target.src !== "/assets/constants/billboard.png") {
      target.src = "/assets/constants/billboard.png";
    }
  };

  return (
    <div className="md:col-span-2 space-y-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mt-8">
        {/* Event Title Section */}
        <div className="px-8 py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            {event.name}
          </h1>

          {/* Status and Volunteer Count Row */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <Badge
              className={`${getStatusColor(
                event.status
              )} px-4 py-2 text-sm font-medium border`}
            >
              {getStatusLabel(event.status)}
            </Badge>

            <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
              <Star className="h-4 w-4 mr-2 text-yellow-500" />
              <span className="font-medium">
                {event._count?.volunteers || 0}
              </span>
              <span className="ml-1">
                volunteer{(event._count?.volunteers || 0) !== 1 ? "s" : ""}{" "}
                joined
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm">{event.locationDesc}</span>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          Event Details
        </h2>

        <div className="space-y-4">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <Calendar className="h-5 w-5 mr-4 text-gray-500 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500 mb-1">Date</p>
              <p className="text-gray-800 font-medium">
                {formatDate(event.dateTime)}
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <Clock className="h-5 w-5 mr-4 text-gray-500 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500 mb-1">Time</p>
              <p className="text-gray-800 font-medium">
                {formatTime(event.dateTime)}
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <Users className="h-5 w-5 mr-4 text-gray-500 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500 mb-1">Attendance</p>
              <p className="text-gray-800 font-medium">
                {event._count?.attendingUsers || 0} people attended
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Event Description */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          About This Event
        </h2>
        <p className="text-gray-700 leading-relaxed text-base">
          {event.description || "No description available for this event."}
        </p>
      </div>

      {/* Event Images */}
      {event.profileImage && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Event Photos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <img
              src={eventImage}
              alt={`${event.name} photo`}
              className="w-full h-48 object-cover rounded-lg border border-gray-200"
              onError={handleImageError}
            />
          </div>
        </div>
      )}
    </div>
  );
}
