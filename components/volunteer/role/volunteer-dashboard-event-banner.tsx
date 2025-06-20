import Image from "next/image";
import { useEffect, useState } from "react";
import { apiGet } from "@/services/api";
import { getValidImageSrc } from "@/utils/event-utils";

interface EventBannerData {
  id: string;
  name: string;
  profileImage?: string | null;
  coverImage?: string | null;
  locationImage?: string | null;
  dateTime: string;
  locationDesc: string;
  status: string;
}

interface VolunteerDashboardEventBannerProps {
  eventName?: string;
  eventImage?: string;
}

export function VolunteerDashboardEventBanner({
  eventName,
  eventImage,
}: VolunteerDashboardEventBannerProps) {
  const [currentEvent, setCurrentEvent] = useState<EventBannerData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentEvent = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("🎯 Fetching current volunteer event for banner...");

        // Get user's approved volunteer applications
        const applicationsResponse = await apiGet(
          "/api/volunteer/my-applications"
        );
        console.log(
          "📋 Volunteer applications response:",
          applicationsResponse
        );

        const applications = Array.isArray(applicationsResponse)
          ? applicationsResponse
          : applicationsResponse?.data || [];

        const approvedApp = applications.find(
          (app: any) => app.status === "APPROVED"
        );

        if (approvedApp?.eventId) {
          console.log(
            `📅 Found approved application for event: ${approvedApp.eventId}`
          );

          // Fetch detailed event information
          const eventDetails = await apiGet(
            `/api/events/${approvedApp.eventId}`
          );
          console.log("🖼️ Event details for banner:", eventDetails);

          if (eventDetails) {
            setCurrentEvent({
              id: eventDetails.id,
              name: eventDetails.name,
              profileImage: eventDetails.profileImage,
              coverImage: eventDetails.coverImage,
              locationImage: eventDetails.locationImage,
              dateTime: eventDetails.dateTime,
              locationDesc: eventDetails.locationDesc,
              status: eventDetails.status,
            });

            console.log("✅ Event banner data set:", {
              name: eventDetails.name,
              profileImage: eventDetails.profileImage,
              coverImage: eventDetails.coverImage,
              processedCoverImage: getValidImageSrc(eventDetails.coverImage),
              processedProfileImage: getValidImageSrc(
                eventDetails.profileImage
              ),
            });
          } else {
            console.warn("⚠️ No event details found");
            setError("Event details not found");
          }
        } else {
          console.log("📝 No approved volunteer applications found");
          // Don't set error - user might not be volunteering yet
        }
      } catch (err) {
        console.error("❌ Failed to fetch current volunteer event:", err);
        setError("Failed to load event information");
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if no props provided
    if (!eventName && !eventImage) {
      fetchCurrentEvent();
    } else {
      setIsLoading(false);
    }
  }, [eventName, eventImage]);

  // Determine display values
  const displayName = eventName || currentEvent?.name || "Volunteer Dashboard";

  // Prioritize cover image, then profile image, then fallback
  const getEventImage = (): string => {
    if (eventImage) return eventImage;

    if (currentEvent) {
      // Try cover image first (better for banners)
      if (currentEvent.coverImage) {
        return getValidImageSrc(currentEvent.coverImage);
      }
      // Fall back to profile image
      if (currentEvent.profileImage) {
        return getValidImageSrc(currentEvent.profileImage);
      }
      // Last resort: location image
      if (currentEvent.locationImage) {
        return getValidImageSrc(currentEvent.locationImage);
      }
    }

    return "/assets/constants/billboard.png";
  };

  const displayImage = getEventImage();

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    console.log("🖼️ Image failed to load, using fallback");
    const target = e.target as HTMLImageElement;
    if (target.src !== "/assets/constants/billboard.png") {
      target.src = "/assets/constants/billboard.png";
    }
  };

  // Format event date if available
  const formatEventDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "";
    }
  };

  return (
    <div className="bg-blue-50 py-6">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-2">
          {currentEvent
            ? `You're volunteering for ${displayName}`
            : displayName}
        </h1>
            
        {/* Loading state */}
        {isLoading && (
          <div className="relative w-full h-[200px] md:h-[250px] rounded-lg overflow-hidden bg-gray-200 animate-pulse flex items-center justify-center">
            <span className="text-gray-500">Loading event image...</span>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="relative w-full h-[200px] md:h-[250px] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            <span className="text-gray-500">{error}</span>
          </div>
        )}

        {/* Image */}
        {!isLoading && !error && (
          <div className="relative w-full h-[200px] md:h-[250px] rounded-lg overflow-hidden">
            <Image
              src={displayImage}
              alt={displayName}
              fill
              className="object-cover"
              onError={handleImageError}
              priority
            />
            {/* Overlay for better text contrast if needed */}
            <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg"></div>
          </div>
        )}
      </div>
    </div>
  );
}
