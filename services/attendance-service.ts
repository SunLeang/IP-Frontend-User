import { apiGet, apiPost, apiDelete } from "./api";

export interface AttendanceStatus {
  hasAttended: boolean;
  attendanceStatus?: string;
  checkedInAt?: Date;
  eventStatus: string;
}

export interface JoinEventRequest {
  eventId: string;
  userId: string;
  status?: "JOINED";
}

/**
 * Check user's attendance status for an event
 * ENHANCED: Handle all permission errors gracefully
 */
export async function checkAttendanceStatus(
  eventId: string
): Promise<AttendanceStatus> {
  try {
    console.log(`📡 Checking attendance status for event: ${eventId}`);

    // SIMPLIFIED: Use the simple 'check' route
    const response = await apiGet(`/api/attendance/check/${eventId}`);

    console.log("📊 Attendance status response:", response);

    return {
      hasAttended: response.hasAttended || false,
      attendanceStatus: response.attendanceStatus || "NOT_REGISTERED",
      checkedInAt: response.checkedInAt
        ? new Date(response.checkedInAt)
        : undefined,
      eventStatus: response.eventStatus || "UNKNOWN",
    };
  } catch (error: any) {
    console.error("❌ Error checking attendance status:", error);

    // ENHANCED: Handle all types of errors with specific responses

    // Permission-related errors (most common for attendees)
    if (
      error.status === 403 ||
      error.response?.status === 403 ||
      error.message?.includes("permission") ||
      error.message?.includes("Forbidden") ||
      error.message?.includes("You do not have permission")
    ) {
      console.log(
        "⚠️ User lacks attendance permissions - returning safe defaults"
      );
      return {
        hasAttended: false,
        attendanceStatus: "NO_PERMISSION",
        eventStatus: "UNKNOWN",
      };
    }

    // Not found errors (event or attendance record)
    if (
      error.status === 404 ||
      error.response?.status === 404 ||
      error.message?.includes("not found")
    ) {
      console.log("⚠️ Event or attendance record not found");
      return {
        hasAttended: false,
        attendanceStatus: "NOT_FOUND",
        eventStatus: "NOT_FOUND",
      };
    }

    // Authentication errors
    if (
      error.status === 401 ||
      error.response?.status === 401 ||
      error.message?.includes("Unauthorized")
    ) {
      console.log("⚠️ User not authenticated");
      return {
        hasAttended: false,
        attendanceStatus: "NOT_AUTHENTICATED",
        eventStatus: "UNKNOWN",
      };
    }

    // Network or server errors
    if (
      error.status >= 500 ||
      error.response?.status >= 500 ||
      error.message?.includes("Network Error") ||
      error.message?.includes("fetch")
    ) {
      console.log("⚠️ Server or network error");
      return {
        hasAttended: false,
        attendanceStatus: "SERVER_ERROR",
        eventStatus: "UNKNOWN",
      };
    }

    // For any other errors, return safe defaults
    console.log("⚠️ Unknown error type - returning safe defaults");
    return {
      hasAttended: false,
      attendanceStatus: "ERROR",
      eventStatus: "UNKNOWN",
    };
  }
}

/**
 * Join an event (register attendance)
 */
export async function joinEvent(eventId: string): Promise<void> {
  try {
    console.log(`📝 Joining event: ${eventId}`);

    // Get current user from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
      throw new Error("User not found in localStorage");
    }

    const joinData: JoinEventRequest = {
      eventId,
      userId: user.id,
      status: "JOINED",
    };

    await apiPost("/api/attendance", joinData);

    console.log("✅ Successfully joined event");
  } catch (error: any) {
    console.error("❌ Error joining event:", error);
    throw new Error(error.message || "Failed to join event");
  }
}

/**
 * Leave an event (remove attendance)
 */
export async function leaveEvent(eventId: string): Promise<void> {
  try {
    console.log(`🚪 Leaving event: ${eventId}`);

    // Get current user from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
      throw new Error("User not found in localStorage");
    }

    // Use the user ID and event ID to form the composite key
    await apiDelete(`/api/attendance/${user.id}/${eventId}`);

    console.log("✅ Successfully left event");
  } catch (error: any) {
    console.error("❌ Error leaving event:", error);
    throw new Error(error.message || "Failed to leave event");
  }
}

/**
 * Get all attendees for an event (admin/organizer only)
 */
export async function getEventAttendees(eventId: string) {
  try {
    const response = await apiGet(`/api/attendance/event/${eventId}`);
    return response;
  } catch (error: any) {
    console.error("❌ Error fetching event attendees:", error);
    throw error;
  }
}

/**
 * Get attendance statistics for an event (admin/organizer only)
 */
export async function getEventAttendanceStats(eventId: string) {
  try {
    const response = await apiGet(`/api/attendance/event/${eventId}/stats`);
    return response;
  } catch (error: any) {
    console.error("❌ Error fetching attendance stats:", error);
    throw error;
  }
}
