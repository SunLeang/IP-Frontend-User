"use client";

import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { getValidImageSrc } from "@/utils/event-utils";
import type { Event } from "@/types/event";

interface VolunteerDetailEventInfoProps {
  event: Event;
}

export function VolunteerDetailEventInfo({
  event,
}: VolunteerDetailEventInfoProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Process event images with proper MinIO URL handling
  const processedProfileImage = getValidImageSrc(event.profileImage);
  const processedCoverImage = getValidImageSrc(event.coverImage);
  const processedLocationImage = getValidImageSrc(event.locationImage);

  console.log(`🤝 VOLUNTEER EVENT INFO: "${event.name}"`, {
    profileImage: event.profileImage,
    processedProfileImage,
    coverImage: event.coverImage,
    processedCoverImage,
    locationImage: event.locationImage,
    processedLocationImage,
  });

  return (
    <div className="mb-8">
      {/* Event Image - Use regular img tag */}
      <div className="rounded-lg overflow-hidden mb-6">
        <img
          src={processedCoverImage || processedProfileImage}
          alt={event.name}
          className="w-full h-64 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== "/assets/constants/billboard.png") {
              target.src = "/assets/constants/billboard.png";
            }
          }}
        />
      </div>

      {/* Event Details */}
      <div className="space-y-4">
        <div className="flex items-center text-gray-600">
          <Calendar className="h-5 w-5 mr-3" />
          <span>{formatDate(event.dateTime)}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <Clock className="h-5 w-5 mr-3" />
          <span>{formatTime(event.dateTime)}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <MapPin className="h-5 w-5 mr-3" />
          <span>{event.locationDesc}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <Users className="h-5 w-5 mr-3" />
          <span>
            {event._count?.attendingUsers || 0} attendees •{" "}
            {event._count?.volunteers || 0} volunteers
          </span>
        </div>
      </div>

      {/* Event Description */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">About This Event</h3>
        <p className="text-gray-700 leading-relaxed">{event.description}</p>
      </div>

      {/* Location Image - Use regular img tag */}
      {event.locationImage && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Location</h3>
          <div className="rounded-lg overflow-hidden">
            <img
              src={processedLocationImage}
              alt="Event location"
              className="w-full h-48 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
