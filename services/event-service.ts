import { apiGet, apiPost, apiDelete } from "./api";
import { Event, EventsFilterParams } from "@/types/event";

/**
 * Event Service
 * Handles all event-related API operations
 */

// Re-export types for convenience
export type { Event, EventsFilterParams } from "@/types/event";

/**
 * Fetches events with optional filtering
 * @param params - Optional filter parameters
 * @returns Promise resolving to array of events
 */
export async function getEvents(params?: EventsFilterParams): Promise<Event[]> {
  try {
    console.log("Fetching events with params:", params);

    let queryString = "";
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.categoryId)
        searchParams.append("categoryId", params.categoryId);
      if (params.status) searchParams.append("status", params.status);
      if (params.acceptingVolunteers !== undefined) {
        searchParams.append(
          "acceptingVolunteers",
          params.acceptingVolunteers.toString()
        );
      }
      queryString = `?${searchParams.toString()}`;
    }

    const response = await apiGet(`/api/events${queryString}`);
    console.log("RAW API RESPONSE FOR EVENTS:", response);

    // Handle different response structures
    const events = response.data || response || [];

    // Log each event's image data specifically
    console.log(
      "EVENTS IMAGE DATA:",
      events.map((e: any, index: number) => ({
        index,
        id: e.id,
        name: e.name,
        profileImage: e.profileImage,
        coverImage: e.coverImage,
        category: e.category?.name,
        categoryImage: e.category?.image,
      }))
    );

    return events;
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return [];
  }
}

/**
 * Fetches a single event by ID
 * @param id - Event ID
 * @returns Promise resolving to event data or null
 */
export async function getEventById(id: string): Promise<Event | null> {
  try {
    console.log(`Fetching event with ID: ${id}`);
    return await apiGet(`/api/events/${id}`);
  } catch (error) {
    console.error(`Failed to fetch event with id ${id}:`, error);
    return null;
  }
}

/**
 * Toggles user interest in an event
 * @param eventId - Event ID
 * @returns Promise with success status and interest state
 */
export async function toggleEventInterest(
  eventId: string
): Promise<{ success: boolean; isInterested: boolean }> {
  try {
    console.log("Toggling interest for event:", eventId);

    // Check current interest status
    const checkResponse = await apiGet(`/api/interests/check/${eventId}`);
    console.log("Current interest status:", checkResponse);

    let result;
    if (checkResponse && checkResponse.interested) {
      // Remove interest
      console.log("Removing interest...");
      await apiDelete(`/api/interests/event/${eventId}`);
      result = { success: true, isInterested: false };
    } else {
      // Add interest
      console.log("Adding interest...");
      await apiPost("/api/interests", { eventId });
      result = { success: true, isInterested: true };
    }

    console.log("Toggle result:", result);
    return result;
  } catch (error) {
    console.error(`Failed to toggle interest for event ${eventId}:`, error);
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      throw new Error("Please log in to manage your interests");
    }
    throw error;
  }
}

/**
 * Fetches user's interested events
 * @returns Promise resolving to array of events
 */
export async function getInterestedEvents(): Promise<Event[]> {
  try {
    console.log("Fetching interested events from API...");
    const response = await apiGet("/api/interests/my-interests");
    console.log("API response:", response);

    if (response && response.data && Array.isArray(response.data)) {
      return response.data.map((item: any) => item.event);
    } else if (response && Array.isArray(response)) {
      return response;
    }

    return [];
  } catch (error) {
    console.error("Failed to fetch interested events:", error);
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return [];
    }
    throw error;
  }
}

/**
 * Joins user to an event
 * @param eventId - Event ID
 * @returns Promise with success status
 */
export async function joinEvent(
  eventId: string
): Promise<{ success: boolean }> {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user?.id) throw new Error("User not logged in");

    await apiPost(`/api/attendance`, {
      userId: user.id,
      eventId,
    });
    return { success: true };
  } catch (error) {
    console.error(`Failed to join event ${eventId}:`, error);
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      throw new Error("Please log in to join this event");
    }
    throw error;
  }
}

/**
 * Removes user from an event
 * @param eventId - Event ID
 * @returns Promise with success status
 */
export async function leaveEvent(
  eventId: string
): Promise<{ success: boolean }> {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user?.id) throw new Error("User not logged in");

    await apiDelete(`/api/attendance/${user.id}/${eventId}`);
    return { success: true };
  } catch (error) {
    console.error(`Failed to leave event ${eventId}:`, error);
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      throw new Error("Please log in to leave this event");
    }
    throw error;
  }
}
