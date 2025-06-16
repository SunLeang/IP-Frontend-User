import { useState, useEffect } from "react";
import { getVolunteerEvents } from "@/services/volunteer-service";
import { VolunteerOpportunity } from "@/components/volunteer/volunteer-card";

interface UseVolunteerOpportunitiesReturn {
  opportunities: VolunteerOpportunity[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Helper function to ensure image paths are properly formatted
 */
function getValidImageSrc(src: string | undefined | null): string {
  if (!src) return "/icons/user.png";
  if (src.startsWith("http") || src.startsWith("/")) return src;
  return `/assets/images/${src}`;
}

/**
 * Sample data as fallback
 */
const sampleVolunteerOpportunities: VolunteerOpportunity[] = Array.from(
  { length: 9 },
  (_, i) => ({
    id: `volunteer-${i + 1}`,
    title: `Requesting Volunteer for Event ${i + 1}`,
    image: "/icons/user.png",
    category: "Technology & Innovation",
    date: { month: "NOV", day: "22" },
    venue: "Venue",
    time: "00:00 AM - 00:00 PM",
    applicants: 20,
    description:
      "Join us as a volunteer for this event! Help with setup, customer assistance, and organizing activities. Sign up today!",
  })
);

/**
 * Custom hook for managing volunteer opportunities
 * Handles fetching and transforming volunteer events data
 */
export function useVolunteerOpportunities(): UseVolunteerOpportunitiesReturn {
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches and transforms volunteer opportunities
   */
  const fetchOpportunities = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Fetching volunteer opportunities...");

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
        console.log(
          `Successfully loaded ${transformedEvents.length} volunteer opportunities`
        );
      } else {
        console.log("No events from API, using fallback data");
        setOpportunities(sampleVolunteerOpportunities.slice(0, 3));
      }
    } catch (err) {
      console.error("Error fetching volunteer opportunities:", err);
      setError("Failed to load volunteer opportunities");
      // Use fallback data on error
      setOpportunities(sampleVolunteerOpportunities.slice(0, 3));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refetch function to manually trigger data reload
   */
  const refetch = () => {
    fetchOpportunities();
  };

  // Fetch opportunities on component mount
  useEffect(() => {
    fetchOpportunities();
  }, []);

  return {
    opportunities,
    isLoading,
    error,
    refetch,
  };
}
