import { useState, useEffect } from "react";
import { Event } from "@/types/event";
import { getEventById, joinEvent, leaveEvent } from "@/services/event-service";
import { hasEventEnded } from "@/utils/event-utils";

/**
 * Return type for useEventDetail hook
 */
interface UseEventDetailReturn {
  event: Event | null;
  isLoading: boolean;
  error: string | null;
  isJoined: boolean;
  eventEnded: boolean;
  handleJoinEvent: () => Promise<void>;
  handleLeaveEvent: () => Promise<void>;
  refetch: () => void;
}

/**
 * Custom hook for managing event detail data and actions
 * Handles loading states, error handling, and event actions
 *
 * @param eventId - The ID of the event to fetch
 * @returns Object containing event data, states, and action handlers
 */
export function useEventDetail(eventId: string): UseEventDetailReturn {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [eventEnded, setEventEnded] = useState(false);

  /**
   * Fetches event data
   */
  const fetchEvent = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log(`Fetching event detail for: ${eventId}`);

      const eventData = await getEventById(eventId);

      if (!eventData) {
        throw new Error("Event not found");
      }

      setEvent(eventData);
      setEventEnded(hasEventEnded(eventData.dateTime));

      console.log(`Successfully loaded event: ${eventData.name}`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load event";
      console.error("Error in useEventDetail:", err);
      setError(errorMessage);
      setEvent(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles joining an event
   */
  const handleJoinEvent = async () => {
    if (!event) return;

    try {
      const result = await joinEvent(event.id);
      if (result.success) {
        setIsJoined(true);
      }
    } catch (error) {
      console.error("Error joining event:", error);
      throw error;
    }
  };

  /**
   * Handles leaving an event
   */
  const handleLeaveEvent = async () => {
    if (!event) return;

    try {
      const result = await leaveEvent(event.id);
      if (result.success) {
        setIsJoined(false);
      }
    } catch (error) {
      console.error("Error leaving event:", error);
      throw error;
    }
  };

  /**
   * Refetch function to manually trigger data reload
   */
  const refetch = () => {
    fetchEvent();
  };

  // Fetch data when component mounts or eventId changes
  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  return {
    event,
    isLoading,
    error,
    isJoined,
    eventEnded,
    handleJoinEvent,
    handleLeaveEvent,
    refetch,
  };
}
