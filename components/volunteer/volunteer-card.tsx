import Link from "next/link";
import { Button } from "@/components/ui/button";

export interface VolunteerOpportunity {
  id: string;
  title: string;
  image?: string;
  category: string;
  date: {
    month: string;
    day: string;
  };
  venue: string;
  time: string;
  applicants: number;
  description: string;
}

interface VolunteerCardProps extends VolunteerOpportunity {
  // Props are spread directly, not nested in opportunity object
}

export function VolunteerCard({
  id,
  title,
  image,
  category,
  date,
  venue,
  time,
  applicants,
  description,
}: VolunteerCardProps) {
  // Log the image being used
  console.log(`🎯 VOLUNTEER CARD: "${title}"`, {
    originalImage: image,
    isMinIO: image?.includes("localhost:9000"),
  });

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
      <div className="relative">
        <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-center py-1 text-xs">
          ✨ YOU ARE INVITED ✨
        </div>
        {/* Use regular img tag for MinIO images */}
        <img
          src={image || "/icons/user.png"}
          alt={title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            console.error(`❌ Image load failed for volunteer card: ${title}`, {
              originalSrc: image,
            });
            const target = e.target as HTMLImageElement;
            target.src = "/icons/user.png";
          }}
          onLoad={() => {
            console.log(
              `✅ Image loaded successfully for volunteer card: ${title}`
            );
          }}
        />
        <div className="absolute bottom-0 left-0 w-full bg-pink-500 text-white text-center py-1 text-xs">
          {category.toUpperCase()}
        </div>
        <div className="absolute top-12 left-4 bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-sm">
          {date.month} {date.day}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="text-center">{/* Date display */}</div>

          <div className="flex-1 ml-4">
            <h3 className="font-medium text-lg">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{venue}</p>
            <p className="text-xs text-gray-400 mt-0.5">{time}</p>
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span>{applicants} Have applied</span>
            </div>
          </div>
        </div>

        <div className="mt-4 border-t pt-4">
          <p className="text-sm mb-2">{description.substring(0, 150)}...</p>
          <p className="text-sm mb-3">
            Location:{" "}
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(venue)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View on map
            </a>
          </p>
          <div className="text-right">
            <Link href={`/volunteer/${id}`}>
              <Button className="bg-green-500 hover:bg-green-600">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
