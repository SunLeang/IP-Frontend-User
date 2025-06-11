import Image from "next/image";
import { Calendar, Clock, MapPin } from "lucide-react";

interface EventInfo {
  name: string;
  dateTime: string;
  locationDesc: string;
  locationImage?: string | null;
  organizer?: {
    fullName: string;
  };
}

interface VolunteerDetailEventInfoProps {
  event: EventInfo;
}

export function VolunteerDetailEventInfo({
  event,
}: VolunteerDetailEventInfoProps) {
  // Format date from dateTime string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return {
      day: dayNames[date.getDay()],
      date: date.getDate(),
      month: monthNames[date.getMonth()],
      year: date.getFullYear(),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
    };
  };

  // Helper function to ensure image paths are properly formatted
  const getValidImageSrc = (src: string | undefined | null): string => {
    if (!src) return "/assets/images/event-placeholder.png";
    if (src.startsWith("http") || src.startsWith("/")) return src;
    return `/assets/images/${src}`;
  };

  const formattedDate = formatDate(event.dateTime);

  return (
    <>
      {/* Date and Time */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-3">Date and Time</h2>
        <div className="flex items-start mb-2">
          <Calendar className="h-5 w-5 mr-3 mt-0.5 text-gray-500" />
          <span>
            {formattedDate.day}, {formattedDate.date} {formattedDate.month}{" "}
            {formattedDate.year}
          </span>
        </div>
        <div className="flex items-start mb-2">
          <Clock className="h-5 w-5 mr-3 mt-0.5 text-gray-500" />
          <span>{formattedDate.time}</span>
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
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
              <Image
                src="/icons/user.png"
                alt="Host"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-medium">
              {event.organizer?.fullName || "Event Organizer"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
