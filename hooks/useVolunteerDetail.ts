import { useState, useEffect } from "react";
import { Event } from "@/types/event";
import { getEventById } from "@/services/event-service";
import { getUserVolunteerApplications } from "@/services/volunteer-service";

interface VolunteerStatus {
  isVolunteer: boolean;
  applicationStatus: string | null;
  hasApplied: boolean;
}

interface UseVolunteerDetailReturn {
  event: Event | null;
  isLoading: boolean;
  error: string | null;
  eventEnded: boolean;
  volunteerStatus: VolunteerStatus;
  refetch: () => void;
}

/**
 * Custom hook for managing volunteer detail page data
 * Handles event fetching and volunteer status checking
 */
export function useVolunteerDetail(
  eventId: string,
  isAuthenticated: boolean,
  user: any
): UseVolunteerDetailReturn {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventEnded, setEventEnded] = useState(false);
  const [volunteerStatus, setVolunteerStatus] = useState<VolunteerStatus>({
    isVolunteer: false,
    applicationStatus: null,
    hasApplied: false,
  });

  /**
   * Fetches event details
   */
  const fetchEventDetails = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(`Fetching volunteer event detail for: ${eventId}`);

      const data = await getEventById(eventId);
      if (data) {
        setEvent(data);
        // Check if event has ended
        const eventDate = new Date(data.dateTime);
        const now = new Date();
        setEventEnded(eventDate < now);

        console.log(`Successfully loaded event: ${data.name}`);
      } else {
        setError("Event not found");
      }
    } catch (err) {
      console.error("Error fetching event details:", err);
      setError("Failed to load event details");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Checks user's volunteer status for this event
   */
  const checkVolunteerStatus = async () => {
    if (!isAuthenticated || !user) {
      setVolunteerStatus({
        isVolunteer: false,
        applicationStatus: null,
        hasApplied: false,
      });
      return;
    }

    try {
      console.log(`Checking volunteer status for event: ${eventId}`);

      const applications = await getUserVolunteerApplications();
      const eventApplication = applications.find(
        (app: any) => app.eventId === eventId
      );

      if (eventApplication) {
        setVolunteerStatus({
          isVolunteer: eventApplication.status === "APPROVED",
          applicationStatus: eventApplication.status,
          hasApplied: true,
        });

        console.log(`Volunteer status: ${eventApplication.status}`);
      } else {
        setVolunteerStatus({
          isVolunteer: false,
          applicationStatus: null,
          hasApplied: false,
        });

        console.log("No volunteer application found");
      }
    } catch (error) {
      console.error("Error checking volunteer status:", error);
      // Reset to default state on error
      setVolunteerStatus({
        isVolunteer: false,
        applicationStatus: null,
        hasApplied: false,
      });
    }
  };

  /**
   * Refetch function to manually trigger data reload
   */
  const refetch = () => {
    fetchEventDetails();
    checkVolunteerStatus();
  };

  // Fetch event details when eventId changes
  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  // Check volunteer status when authentication or user changes
  useEffect(() => {
    checkVolunteerStatus();
  }, [eventId, isAuthenticated, user]);

  return {
    event,
    isLoading,
    error,
    eventEnded,
    volunteerStatus,
    refetch,
  };
}
