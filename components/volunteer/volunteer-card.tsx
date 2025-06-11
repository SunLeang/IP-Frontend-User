import Link from "next/link";
import Image from "next/image";
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

interface VolunteerCardProps {
  opportunity: VolunteerOpportunity;
}

export function VolunteerCard({ opportunity }: VolunteerCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
      <div className="relative">
        <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-center py-1 text-xs">
          ✨ YOU ARE INVITED ✨
        </div>
        <Image
          src={opportunity.image || "/icons/user.png"}
          alt={opportunity.title}
          width={400}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full bg-pink-500 text-white text-center py-1 text-xs">
          {opportunity.category.toUpperCase()}
        </div>
        <div className="absolute top-12 left-4 bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-sm">
          {opportunity.date.month} {opportunity.date.day}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="text-center">{/* Date display */}</div>

          <div className="flex-1 ml-4">
            <h3 className="font-medium text-lg">{opportunity.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{opportunity.venue}</p>
            <p className="text-xs text-gray-400 mt-0.5">{opportunity.time}</p>
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
              <span>{opportunity.applicants} Have applied</span>
            </div>
          </div>
        </div>

        <div className="mt-4 border-t pt-4">
          <p className="text-sm mb-2">
            {opportunity.description.substring(0, 150)}...
          </p>
          <p className="text-sm mb-3">
            Location:{" "}
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(
                opportunity.venue
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View on map
            </a>
          </p>
          <div className="text-right">
            <Link href={`/volunteer/${opportunity.id}`}>
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
