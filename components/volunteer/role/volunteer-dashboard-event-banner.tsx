import Image from "next/image";
import { useEffect, useState } from "react";
import { apiGet } from "@/services/api";

interface VolunteerDashboardEventBannerProps {
  eventName?: string;
  eventImage?: string;
}

export function VolunteerDashboardEventBanner({
  eventName,
  eventImage,
}: VolunteerDashboardEventBannerProps) {
  const [currentEvent, setCurrentEvent] = useState<{
    name: string;
    image: string;
  } | null>(null);

  useEffect(() => {
    const fetchCurrentEvent = async () => {
      try {
        // Get the first event from volunteer events
        const response = await apiGet("/api/volunteer/my-applications");
        const approvedApp = response.find(
          (app: any) => app.status === "APPROVED"
        );

        if (approvedApp?.event) {
          setCurrentEvent({
            name: approvedApp.event.name,
            image:
              approvedApp.event.profileImage ||
              approvedApp.event.coverImage ||
              "/icons/user.png",
          });
        }
      } catch (error) {
        console.error("Failed to fetch current event:", error);
      }
    };

    if (!eventName) {
      fetchCurrentEvent();
    }
  }, [eventName]);

  const displayName = eventName || currentEvent?.name || "BookFair Event";
  const displayImage = eventImage || currentEvent?.image || "/icons/user.png";

  return (
    <div className="bg-blue-50 py-6">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">
          You&apos;re volunteering for {displayName}
        </h1>
        <div className="relative w-full h-[200px] md:h-[250px] rounded-lg overflow-hidden">
          <Image
            src={displayImage}
            alt={displayName}
            fill
            className="object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/icons/user.png";
            }}
          />
        </div>
      </div>
    </div>
  );
}
