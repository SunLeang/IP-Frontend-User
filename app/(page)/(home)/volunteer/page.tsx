"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/checkbox";
import { HeroSection } from "@/components/hero-section";
import { getVolunteerEvents } from "@/services/volunteer-service";
import { Skeleton } from "@/components/ui/skeleton";

// Helper function to ensure image paths are properly formatted
function getValidImageSrc(src: string | undefined | null): string {
  if (!src) return "/icons/user.png"; // Default image

  if (src.startsWith("http") || src.startsWith("/")) {
    return src;
  }

  return `/assets/images/${src}`;
}

export default function VolunteerPage() {
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch volunteer opportunities (events with acceptingVolunteers = true)
  useEffect(() => {
    const fetchOpportunities = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const events = await getVolunteerEvents();

        if (events && events.length > 0) {
          // Transform events to volunteer opportunities
          const transformedEvents = events.map((event) => ({
            id: event.id,
            title: event.name,
            image: getValidImageSrc(event.profileImage),
            category: event.category?.name || "Uncategorized",
            date: {
              month: new Date(event.dateTime)
                .toLocaleString("en-US", { month: "short" })
                .toUpperCase(),
              day: new Date(event.dateTime).getDate().toString(),
            },
            venue: event.locationDesc,
            time: new Date(event.dateTime).toLocaleString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            }),
            applicants: event._count?.volunteers || 0,
            description: event.description,
          }));

          setOpportunities(transformedEvents);
        } else {
          // If no opportunities found, use a minimum of 3 sample items
          setOpportunities(sampleVolunteerOpportunities.slice(0, 3));
        }
      } catch (err) {
        console.error("Error fetching volunteer opportunities:", err);
        setError("Failed to load volunteer opportunities");
        setOpportunities(sampleVolunteerOpportunities.slice(0, 3)); // Fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  return (
    <div className="min-h-screen bg-white pb-10">
      {/* Hero Banner */}
      <HeroSection />

      {/* Filters Section */}
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-xl font-bold mb-4">Filters</h2>
        <div className="bg-[#001337] text-white rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Filter content */}
            {/* ... */}
          </div>
        </div>
      </div>

      {/* Volunteer Opportunities Grid */}
      <div className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
              >
                <Skeleton className="w-full h-48" />
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-6 w-10" />
                    <Skeleton className="h-6 w-40" />
                  </div>
                  <Skeleton className="h-20 w-full mt-4" />
                  <Skeleton className="h-6 w-1/2 mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {opportunities.map((opportunity) => (
              <VolunteerCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center space-x-2">
          <Button variant="outline" size="sm" className="px-3">
            <span className="sr-only">First</span>
            <span aria-hidden="true">« First</span>
          </Button>
          <Button variant="outline" size="sm" className="px-3">
            <span className="sr-only">Previous</span>
            <span aria-hidden="true">‹ Back</span>
          </Button>
          <Button variant="default" size="sm" className="px-3 bg-[#001337]">
            1
          </Button>
          <Button variant="outline" size="sm" className="px-3">
            2
          </Button>
          <Button variant="outline" size="sm" className="px-3">
            <span className="sr-only">Next</span>
            <span aria-hidden="true">Next ›</span>
          </Button>
          <Button variant="outline" size="sm" className="px-3">
            <span className="sr-only">Last</span>
            <span aria-hidden="true">Last »</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Define a proper interface for the opportunity object
interface VolunteerOpportunity {
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

// Sample data as fallback
const sampleVolunteerOpportunities: VolunteerOpportunity[] = Array.from(
  { length: 9 },
  (_, i) => ({
    id: `volunteer-${i + 1}`,
    title: "Requesting Volunteer on BookFair",
    image: "/icons/user.png",
    category: "Technology & Innovation",
    date: {
      month: "NOV",
      day: "22",
    },
    venue: "Venue",
    time: "00:00 AM - 00:00 PM",
    applicants: 20,
    description:
      "Join us as a volunteer for our book fair! Help with setup, customer assistance, and organizing books. Sign up today!",
  })
);

// Volunteer Card Component
function VolunteerCard({ opportunity }: { opportunity: VolunteerOpportunity }) {
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
