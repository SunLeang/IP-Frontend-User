import { useState, useEffect } from "react";
import { getVolunteerEvents } from "@/services/volunteer-service";
import {
  getValidImageSrc,
  formatEventDateForCard,
  formatEventTime,
} from "@/utils/event-utils";
import type { Event } from "@/types/event";

export interface VolunteerOpportunity {
  id: string;
  title: string;
  image: string;
  category: string;
  date: { month: string; day: string };
  venue: string;
  time: string;
  applicants: number;
  description: string;
}

interface UseVolunteerOpportunitiesReturn {
  opportunities: VolunteerOpportunity[];
  isLoading: boolean;
  error: string | null;
  refetchOpportunities: () => void;
}

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
      console.log("🤝 Fetching volunteer opportunities...");

      const events = await getVolunteerEvents();

      console.log(`📊 Raw volunteer events from API:`, {
        count: events.length,
        events: events.map((e) => ({
          id: e.id,
          name: e.name,
          profileImage: e.profileImage,
          coverImage: e.coverImage,
        })),
      });

      // Transform events to volunteer opportunities with proper MinIO URL handling
      const transformedOpportunities: VolunteerOpportunity[] = events.map(
        (event: Event) => {
          // Use the proper image processing utility
          let processedImage = getValidImageSrc(event.profileImage);

          // If profile image is not available, try cover image
          if (!event.profileImage && event.coverImage) {
            processedImage = getValidImageSrc(event.coverImage);
          }

          console.log(`🎯 PROCESSING VOLUNTEER EVENT: "${event.name}"`, {
            id: event.id,
            originalProfileImage: event.profileImage,
            originalCoverImage: event.coverImage,
            processedImage,
            shouldBeMinIO: processedImage.includes("localhost:9000"),
          });

          return {
            id: event.id,
            title: event.name,
            image: processedImage,
            category: event.category?.name || "General",
            date: formatEventDateForCard(event.dateTime),
            venue: event.locationDesc,
            time: formatEventTime(event.dateTime),
            applicants: event._count?.volunteers || 0,
            description: event.description,
          };
        }
      );

      console.log(
        `✅ Transformed ${transformedOpportunities.length} volunteer opportunities`
      );

      // Log final processed images
      transformedOpportunities.forEach((opp, index) => {
        console.log(`🖼️ FINAL VOLUNTEER IMAGE ${index + 1}: "${opp.title}"`, {
          image: opp.image,
          isMinIO: opp.image.includes("localhost:9000"),
          isLocal: opp.image.startsWith("/"),
        });
      });

      setOpportunities(transformedOpportunities);
    } catch (err) {
      console.error("❌ Error fetching volunteer opportunities:", err);
      setError("Failed to load volunteer opportunities");
      setOpportunities([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refetch function to manually trigger data reload
   */
  const refetchOpportunities = () => {
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
    refetchOpportunities,
  };
}
