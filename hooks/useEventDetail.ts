import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/auth-context";
import { Event, getEventById } from "@/services/event-service";
import {
  checkAttendanceStatus,
  joinEvent,
  leaveEvent,
} from "@/services/attendance-service";

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
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isJoined, setIsJoined] = useState(false);

  const fetchEventData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("🔍 Fetching event data for ID:", eventId);

      // Fetch event details (this should always work for public events)
      const eventData = await getEventById(eventId);

      if (!eventData) {
        setError("Event not found");
        return;
      }

      setEvent(eventData);
      console.log("✅ Event data loaded:", eventData.name);

      // ✅ FIXED: Only check attendance if user is authenticated AND handle all errors gracefully
      if (isAuthenticated && user) {
        try {
          console.log("👤 Checking attendance status for authenticated user");
          const attendanceStatus = await checkAttendanceStatus(eventId);
          setIsJoined(attendanceStatus.hasAttended || false);
          console.log("📊 Attendance status:", attendanceStatus);
        } catch (attendanceError: any) {
          console.warn(
            "⚠️ Could not fetch attendance status:",
            attendanceError.message
          );

          // ✅ ENHANCED: Handle all types of permission and attendance errors gracefully
          if (
            attendanceError.message?.includes("permission") ||
            attendanceError.message?.includes("Forbidden") ||
            attendanceError.message?.includes("You do not have permission") ||
            attendanceError.status === 403 ||
            attendanceError.response?.status === 403
          ) {
            console.log(
              "📝 User has no attendance permissions - setting joined status to false"
            );
            setIsJoined(false);
          } else if (
            attendanceError.status === 404 ||
            attendanceError.response?.status === 404 ||
            attendanceError.message?.includes("not found")
          ) {
            console.log("📝 No attendance record found - user not joined");
            setIsJoined(false);
          } else {
            // ✅ For any other error, just set safe defaults and continue
            console.log("📝 Unknown attendance error - setting safe defaults");
            setIsJoined(false);
          }

          // ✅ IMPORTANT: Don't set the main error state for attendance issues
          // The event details should still be viewable even if attendance check fails
        }
      } else {
        console.log("👤 User not authenticated - skipping attendance check");
        setIsJoined(false);
      }
    } catch (err: any) {
      console.error("❌ Error fetching event data:", err);
      // ✅ Only set error for actual event loading failures
      setError(err.message || "Failed to load event details");
    } finally {
      setIsLoading(false);
    }
  }, [eventId, isAuthenticated, user]);

  useEffect(() => {
    if (eventId) {
      fetchEventData();
    }
  }, [fetchEventData, eventId]);

  const handleJoinEvent = useCallback(async () => {
    if (!user || !event) {
      throw new Error("User must be logged in to join events");
    }

    try {
      console.log("📝 Joining event:", event.name);
      await joinEvent(eventId);
      setIsJoined(true);
      console.log("✅ Successfully joined event");
    } catch (error: any) {
      console.error("❌ Error joining event:", error);
      throw error;
    }
  }, [eventId, user, event]);

  const handleLeaveEvent = useCallback(async () => {
    if (!user || !event) {
      throw new Error("User must be logged in to leave events");
    }

    try {
      console.log("🚪 Leaving event:", event.name);
      await leaveEvent(eventId);
      setIsJoined(false);
      console.log("✅ Successfully left event");
    } catch (error: any) {
      console.error("❌ Error leaving event:", error);
      throw error;
    }
  }, [eventId, user, event]);

  const eventEnded = event ? new Date(event.dateTime) < new Date() : false;

  const refetch = useCallback(() => {
    fetchEventData();
  }, [fetchEventData]);

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
