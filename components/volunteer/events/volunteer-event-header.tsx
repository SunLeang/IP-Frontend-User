import { ArrowLeft, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { VolunteerHistoryEvent } from "@/services/volunteer-history-service";
import { getValidImageSrc } from "@/utils/event-utils";

interface VolunteerEventHeaderProps {
  event: VolunteerHistoryEvent;
}

export function VolunteerEventHeader({ event }: VolunteerEventHeaderProps) {
  const router = useRouter();

  const eventImage = getValidImageSrc(event.coverImage || event.profileImage);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    console.log(
      `🖼️ Volunteer event header image failed to load: ${event.name}`
    );
    const target = e.target as HTMLImageElement;
    if (target.src !== "/assets/constants/billboard.png") {
      target.src = "/assets/constants/billboard.png";
    }
  };

  return (
    <div className="w-full h-[200px] md:h-[300px] relative">
      {/* ✅ Event Image */}
      <img
        src={eventImage}
        alt={event.name}
        className="w-full h-full object-cover"
        onError={handleImageError}
        onLoad={() => {
          console.log(`✅ Volunteer event header image loaded: ${event.name}`);
        }}
      />

      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black bg-opacity-30" />

      {/* ✅ UPDATED: Only navigation buttons, no title */}
      <div className="absolute inset-0 flex flex-col">
        {/* Top Navigation */}
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
