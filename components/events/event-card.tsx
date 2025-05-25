"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { useInterest } from "@/context/interest-context";

// Helper function for image paths
function getValidImagePath(src: string | undefined | null): string {
  if (!src) return "/assets/images/event-placeholder.png";
  if (src.startsWith("http") || src.startsWith("/")) return src;
  return `/assets/images/${src}`;
}

interface EventCardProps {
  id: string;
  title: string;
  image: string | undefined | null;
  category: string;
  date: {
    month: string;
    day: string;
  };
  venue: string;
  time: string;
  price: number;
  interested: number;
}

export function EventCard({
  id,
  title,
  image,
  category,
  date,
  venue,
  time,
  price,
  interested,
}: EventCardProps) {
  const { addInterest, removeInterest, isInterested } = useInterest();
  const [isToggling, setIsToggling] = useState(false);

  // Memoize the interest status check
  const saved = React.useMemo(() => isInterested(id), [isInterested, id]);

  const handleInterestToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isToggling) return;

    setIsToggling(true);
    try {
      if (saved) {
        await removeInterest(id);
      } else {
        await addInterest({
          id,
          title,
          image: image || "",
          category,
          date,
          venue,
          time,
          price,
          interested,
        });
      }
    } catch (error) {
      console.error("Failed to toggle interest:", error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Link href={`/events/${id}`} className="block">
        <div className="relative">
          <Image
            src={getValidImagePath(image)}
            alt={title}
            width={400}
            height={200}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-4 left-4 px-3 py-1 rounded-md text-xs font-medium text-white bg-orange-500">
            {category}
          </div>
          <button
            className="absolute top-2 right-2 bg-white p-1 rounded-full hover:bg-gray-100 transition-colors"
            onClick={handleInterestToggle}
            disabled={isToggling}
          >
            <Star
              className={`h-5 w-5 transition-colors ${
                saved ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
              }`}
            />
          </button>
        </div>

        <div className="p-4">
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-xs font-semibold text-blue-600">
                {date.month}
              </div>
              <div className="text-2xl font-bold text-blue-600">{date.day}</div>
            </div>

            <div className="flex-1">
              <h3 className="font-medium text-lg hover:text-blue-600 transition-colors line-clamp-2">
                {title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{venue}</p>
              <p className="text-xs text-gray-400 mt-0.5">{time}</p>

              <div className="flex items-center justify-between mt-2">
                <div className="text-sm font-medium">
                  {price > 0 ? `USD ${price.toFixed(2)}` : "Free"}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Star
                    className={`h-4 w-4 mr-1 ${
                      saved
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-400"
                    }`}
                  />
                  <span>{interested} interested</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
