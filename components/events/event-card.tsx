"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Calendar, MapPin, Users, Heart } from "lucide-react";
import { useInterest } from "@/context/interest-context";
import { getValidImageSrc } from "@/lib/image-utils"; // Import utility

// Helper function for image paths
function getValidImagePath(src: string | undefined | null): string {
  if (!src) return "/assets/images/event-placeholder.png";
  if (src.startsWith("http") || src.startsWith("/")) return src;
  return `/assets/images/${src}`;
}

// Define the interface properly
export interface EventCardProps {
  id: string;
  title: string;
  image: string;
  category: string;
  date: { month: string; day: string };
  venue: string;
  time: string;
  interested: number;
  attending?: number;
  price?: number;
  onClick?: () => void;
}

export function EventCard({
  id,
  title,
  image,
  category,
  date,
  venue,
  time,
  interested,
  attending = 0,
  price = 0,
  onClick,
}: EventCardProps) {
  const { addInterest, removeInterest, isInterested } = useInterest();
  const [isToggling, setIsToggling] = useState(false);
  const [imageSrc, setImageSrc] = useState(getValidImageSrc(image));

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

  const processedImage = getValidImageSrc(image);

  console.log(`🎯 EVENT CARD: "${title}"`, {
    originalImage: image,
    processedImage: processedImage,
    category: category,
    isMinIO: processedImage.includes("localhost:9000"),
  });

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default navigation
      window.location.href = `/events/${id}`;
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
      onClick={handleClick}
    >
      {/* Image - Use regular img tag */}
      <div className="h-48 bg-gray-200 relative overflow-hidden">
        <img
          src={processedImage}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error(`❌ Image load failed for event card: ${title}`, {
              originalSrc: image,
              processedSrc: processedImage,
            });
            const target = e.target as HTMLImageElement;
            target.src = "/assets/constants/billboard.png";
          }}
          onLoad={() => {
            console.log(
              `✅ Image loaded successfully for event card: ${title}`
            );
          }}
        />

        {category && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
            {category}
          </div>
        )}

        {price && price > 0 && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
            ${price}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>

        <div className="space-y-2 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>
              {date.month} {date.day}
            </span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="line-clamp-1">{venue}</span>
          </div>
          <div className="flex items-center">
            <span className="text-xs">{time}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-500">
            <Heart className="w-4 h-4 mr-1" />
            <span>{interested}</span>
          </div>
          {attending > 0 && (
            <div className="flex items-center text-gray-500">
              <Users className="w-4 h-4 mr-1" />
              <span>{attending}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
