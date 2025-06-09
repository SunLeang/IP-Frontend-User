"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

// Helper function to ensure image paths are properly formatted
function getValidImageSrc(src: string | undefined | null): string {
  if (!src) return "/assets/images/event-placeholder.png";

  // If it's already an absolute URL or starts with a slash, return as is
  if (src.startsWith("http") || src.startsWith("/")) {
    return src;
  }

  // Otherwise, prepend the assets path
  return `/assets/images/${src}`;
}

interface InterestEventCardProps {
  id: string;
  title: string;
  image: string;
  category: string;
  date: {
    month: string;
    day: string;
  };
  venue: string;
  time: string;
  price: number;
  interested: number;
  onRemoveInterest: (id: string) => void;
}

export function InterestEventCard({
  id,
  title,
  image,
  category,
  date,
  venue,
  time,
  price,
  interested,
  onRemoveInterest,
}: InterestEventCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="relative">
        <Image
          src={getValidImageSrc(image)}
          alt={title}
          width={400}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div
          className={`absolute top-4 left-4 px-3 py-1 rounded-md text-xs font-medium text-white ${
            category === "Educational & Business"
              ? "bg-blue-500"
              : "bg-orange-500"
          }`}
        >
          {category}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white rounded-full w-8 h-8 p-1 hover:bg-gray-100"
          onClick={() => onRemoveInterest(id)}
        >
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        </Button>
      </div>

      <div className="p-4">
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-xs font-semibold text-gray-500">
              {date.month}
            </div>
            <div className="text-2xl font-bold">{date.day}</div>
          </div>

          <div className="flex-1">
            <Link href={`/events/${id}`}>
              <h3 className="font-medium text-lg hover:text-blue-600 transition-colors line-clamp-2">
                {title}
              </h3>
            </Link>
            <p className="text-sm text-gray-500 mt-1">{venue}</p>
            <p className="text-xs text-gray-400 mt-0.5">{time}</p>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center text-xs text-gray-500">
                <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                <span>{interested} interested</span>
              </div>
              {price > 0 && (
                <div className="text-sm font-medium">INR {price}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
