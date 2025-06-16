import { useState, useEffect } from "react";
import {
  getVolunteerEventDetail,
  VolunteerHistoryEvent,
} from "@/services/volunteer-history-service";

interface UseVolunteerHistoryDetailReturn {
  event: VolunteerHistoryEvent | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook for managing volunteer history detail data
 */
export function useVolunteerHistoryDetail(
  eventId: string
): UseVolunteerHistoryDetailReturn {
  const [event, setEvent] = useState<VolunteerHistoryEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches volunteer event detail
   */
  const fetchEventDetail = async () => {
    if (!eventId) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log(`Fetching volunteer event detail for: ${eventId}`);
      const eventData = await getVolunteerEventDetail(eventId);

      if (eventData) {
        setEvent(eventData);
        console.log(`Successfully loaded volunteer event: ${eventData.name}`);
      } else {
        setError("Event not found");
      }
    } catch (err) {
      console.error("Error fetching volunteer event detail:", err);
      setError("Failed to load event details");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refetch function to manually trigger data reload
   */
  const refetch = () => {
    fetchEventDetail();
  };

  // Fetch data when eventId changes
  useEffect(() => {
    fetchEventDetail();
  }, [eventId]);

  return {
    event,
    isLoading,
    error,
    refetch,
  };
}
