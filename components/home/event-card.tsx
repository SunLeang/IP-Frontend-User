"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useInterest } from "@/context/interest-context";
import { useState } from "react";

interface EventCardProps {
  id: string;
  title: string;
  image: string; // This should already be processed by transformEventToCardData
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
  const saved = isInterested(id);

  // Use the image as-is since it's already been processed
  const [imgSrc, setImgSrc] = useState(image);
  const [hasError, setHasError] = useState(false);

  console.log(`EventCard for "${title}" using image:`, imgSrc);

  const handleInterestToggle = () => {
    if (saved) {
      removeInterest(id);
    } else {
      addInterest({
        id,
        title,
        image: imgSrc,
        category,
        date,
        venue,
        time,
        price,
        interested,
      });
    }
  };

  const handleImageError = () => {
    if (!hasError) {
      console.warn(`Image failed to load for event "${title}": ${imgSrc}`);
      setImgSrc("/assets/constants/billboard.png");
      setHasError(true);
    }
  };

  return (
    <Card className="overflow-hidden h-full">
      <div className="relative">
        <Image
          src={imgSrc}
          alt={title}
          width={400}
          height={200}
          className="w-full h-40 object-cover"
          onError={handleImageError}
        />
        <Badge
          className={`absolute bottom-2 left-2 ${
            category.includes("Educational") ? "bg-blue-500" : "bg-orange-500"
          }`}
        >
          {category}
        </Badge>
        <button
          className="absolute top-2 right-2 bg-white p-1 rounded-full hover:bg-gray-100"
          onClick={handleInterestToggle}
        >
          <Star
            className={`h-5 w-5 ${
              saved ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
            }`}
          />
        </button>
      </div>

      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className="text-center">
            <div className="text-xs font-semibold text-gray-500">
              {date.month}
            </div>
            <div className="text-lg font-bold">{date.day}</div>
          </div>

          <div className="flex-1">
            <Link href={`/events/${id}`}>
              <h3 className="font-medium line-clamp-2 hover:text-blue-600 transition-colors">
                {title}
              </h3>
            </Link>
            <p className="text-sm text-gray-500 mt-1">{venue}</p>
            <p className="text-xs text-gray-400 mt-0.5">{time}</p>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center text-xs text-gray-500">
                <Users size={14} className="mr-1" />
                <span>{interested} interested</span>
              </div>
              {price > 0 && (
                <div className="text-sm font-medium">INR {price}</div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}