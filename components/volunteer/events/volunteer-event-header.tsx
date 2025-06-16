import Image from "next/image";
import { ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";
import { VolunteerHistoryEvent } from "@/services/volunteer-history-service";
import { getValidImageSrc } from "@/lib/image-utils";

interface VolunteerEventHeaderProps {
  event: VolunteerHistoryEvent;
  backUrl?: string;
}

export function VolunteerEventHeader({
  event,
  backUrl = "/volunteer-role/history",
}: VolunteerEventHeaderProps) {
  return (
    <>
      {/* Banner Image */}
      <div className="w-full h-[200px] md:h-[300px] relative">
        <Image
          src={getValidImageSrc(event.coverImage || event.profileImage)}
          alt={event.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Header with title and actions */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href={backUrl} className="mr-3">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold">{event.name}</h1>
          </div>

          <div className="flex items-center space-x-4">
            <button aria-label="Share event">
              <Share2 className="h-7 w-7 text-blue-900" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
