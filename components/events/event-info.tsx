import { Calendar, Clock, MapPin } from "lucide-react";
import { Event } from "@/types/event";
import {
  formatEventDate,
  formatEventTime,
  getValidImageSrc,
} from "@/utils/event-utils";

/**
 * Props for EventInfo component
 */
interface EventInfoProps {
  event: Event;
}

/**
 * Event Info Component
 * Displays event date, time, location, organizer, and description
 */
export function EventInfo({ event }: EventInfoProps) {
  const fullDate = formatEventDate(event.dateTime);
  const time = formatEventTime(event.dateTime);

  // Process location image properly
  const locationImageSrc = getValidImageSrc(event.locationImage);

  console.log(`🖼️ EVENT INFO LOCATION IMAGE for "${event.name}":`, {
    original: event.locationImage,
    processed: locationImageSrc,
    isMinIO: locationImageSrc.includes("localhost:9000"),
  });

  return (
    <div className="md:col-span-2">
      {/* Date and Time */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-3">Date and Time</h2>
        <div className="flex items-start mb-2">
          <Calendar className="h-5 w-5 mr-3 mt-0.5 text-gray-500" />
          <span>{fullDate}</span>
        </div>
        <div className="flex items-start mb-2">
          <Clock className="h-5 w-5 mr-3 mt-0.5 text-gray-500" />
          <span>{time}</span>
        </div>
      </div>

      {/* Location */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-3">Location</h2>
        <div className="flex items-start mb-3">
          <MapPin className="h-5 w-5 mr-3 mt-0.5 text-gray-500" />
          <div>
            <p>{event.locationDesc}</p>
          </div>
        </div>
        {event.locationImage && (
          <div className="rounded-lg overflow-hidden border border-gray-200 ml-8">
            {/* Use regular img tag instead of Next.js Image */}
            <img
              src={locationImageSrc}
              alt="Event location map"
              className="w-full max-h-72 object-contain"
              onError={(e) => {
                console.error(
                  `❌ Location image load failed for event: ${event.name}`
                );
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
              onLoad={() => {
                console.log(
                  `✅ Location image loaded successfully for event: ${event.name}`
                );
              }}
            />
          </div>
        )}
      </div>

      {/* Hosted by */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-3">Hosted by</h2>
        <div className="flex items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 mr-3">
              <img
                src="/assets/images/logo.png"
                alt="Eventura"
                className="w-10 h-10 rounded-sm"
              />
            </div>
            <div>
              <p className="font-medium">
                {event.organizer?.fullName || "Event Organizer"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Event Description */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-3">Event Description</h2>
        <div className="whitespace-pre-line text-gray-700">
          {event.description}
        </div>
      </div>
    </div>
  );
}
