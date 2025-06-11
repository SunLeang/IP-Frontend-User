"use client";

import { useState, useEffect } from "react";
import { HeroSection } from "@/components/hero-section";
import { VolunteerFilters } from "@/components/volunteer/volunteer-filters";
import { VolunteerGrid } from "@/components/volunteer/volunteer-grid";
import { VolunteerPagination } from "@/components/volunteer/volunteer-pagination";
import { VolunteerOpportunity } from "@/components/volunteer/volunteer-card";
import { getVolunteerEvents } from "@/services/volunteer-service";

// Helper function to ensure image paths are properly formatted
function getValidImageSrc(src: string | undefined | null): string {
  if (!src) return "/icons/user.png";
  if (src.startsWith("http") || src.startsWith("/")) return src;
  return `/assets/images/${src}`;
}

// Sample data as fallback
const sampleVolunteerOpportunities: VolunteerOpportunity[] = Array.from(
  { length: 9 },
  (_, i) => ({
    id: `volunteer-${i + 1}`,
    title: "Requesting Volunteer on BookFair",
    image: "/icons/user.png",
    category: "Technology & Innovation",
    date: { month: "NOV", day: "22" },
    venue: "Venue",
    time: "00:00 AM - 00:00 PM",
    applicants: 20,
    description:
      "Join us as a volunteer for our book fair! Help with setup, customer assistance, and organizing books. Sign up today!",
  })
);

export default function VolunteerPage() {
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch volunteer opportunities logic
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
          setOpportunities(sampleVolunteerOpportunities.slice(0, 3));
        }
      } catch (err) {
        console.error("Error fetching volunteer opportunities:", err);
        setError("Failed to load volunteer opportunities");
        setOpportunities(sampleVolunteerOpportunities.slice(0, 3));
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  return (
    <div className="min-h-screen bg-white pb-10">
      <HeroSection />
      <VolunteerFilters />

      <div className="container mx-auto px-4 py-6">
        <VolunteerGrid
          opportunities={opportunities}
          isLoading={isLoading}
          error={error}
        />
      </div>

      <VolunteerPagination />
    </div>
  );
}
