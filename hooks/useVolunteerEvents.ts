import { useState, useEffect } from "react";
import {
  getMyVolunteerEvents,
  VolunteerEvent,
} from "@/services/volunteer-service";

interface UseVolunteerEventsReturn {
  events: VolunteerEvent[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook for managing volunteer events data
 * Fetches events where the user is volunteering
 */
export function useVolunteerEvents(): UseVolunteerEventsReturn {
  const [events, setEvents] = useState<VolunteerEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches volunteer events
   */
  const fetchVolunteerEvents = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Fetching volunteer events...");

      const volunteerEvents = await getMyVolunteerEvents();
      setEvents(volunteerEvents);

      console.log(
        `Successfully loaded ${volunteerEvents.length} volunteer events`
      );
    } catch (err) {
      console.error("Error fetching volunteer events:", err);
      setError("Failed to load volunteer events");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refetch function to manually trigger data reload
   */
  const refetch = () => {
    fetchVolunteerEvents();
  };

  // Fetch events when component mounts
  useEffect(() => {
    fetchVolunteerEvents();
  }, []);

  return {
    events,
    isLoading,
    error,
    refetch,
  };
}
