import Image from "next/image";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Event } from "@/types/event";
import { formatEventDate } from "@/utils/event-utils";
import { getValidImageSrc } from "@/lib/image-utils";

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
  const dateInfo = formatEventDate(event.dateTime);

  return (
    <div className="md:col-span-2">
      {/* Date and Time */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-3">Date and Time</h2>
        <div className="flex items-start mb-2">
          <Calendar className="h-5 w-5 mr-3 mt-0.5 text-gray-500" />
          <span>{dateInfo.full}</span>
        </div>
        <div className="flex items-start mb-2">
          <Clock className="h-5 w-5 mr-3 mt-0.5 text-gray-500" />
          <span>{dateInfo.time}</span>
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
            <Image
              src={getValidImageSrc(event.locationImage)}
              alt="Event location map"
              width={600}
              height={300}
              className="w-full h-auto"
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
              <Image
                src="/assets/images/logo.png"
                alt="Eventura"
                width={40}
                height={40}
                className="rounded-sm"
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
