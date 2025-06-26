import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getValidImageSrc } from "@/utils/event-utils";

interface VolunteerDetailHeaderProps {
  eventName?: string;
  eventImage?: string;
  onBack?: () => void;
}

export function VolunteerDetailHeader({
  eventName,
  eventImage,
  onBack,
}: VolunteerDetailHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  // Process the event image with proper MinIO URL handling
  const processedEventImage = getValidImageSrc(eventImage);

  console.log(`🎯 VOLUNTEER HEADER: "${eventName}"`, {
    originalImage: eventImage,
    processedImage: processedEventImage,
  });

  return (
    <>
      {/* Back button and title */}
      <div className="flex items-center mb-8">
        <button onClick={handleBack} className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-3xl font-bold">Volunteer Details</h1>
      </div>

      {/* Event title and image */}
      {eventName && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{eventName}</h2>
          {eventImage && (
            <div className="rounded-lg overflow-hidden mb-6">
              {/* Use regular img tag instead of Next.js Image */}
              <img
                src={processedEventImage}
                alt={eventName}
                className="w-full max-w-md h-auto object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== "/assets/constants/billboard.png") {
                    target.src = "/assets/constants/billboard.png";
                  }
                }}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}
