import { apiGet, apiPost, apiDelete } from "./api";
import type { Event, EventsFilterParams } from "@/types/event";

/**
 * Event Service
 * Handles all event-related API operations
 */

/**
 * Fetches events with optional filtering
 * @param params - Optional filter parameters
 * @returns Promise resolving to array of events
 */
export async function getEvents(params?: EventsFilterParams): Promise<Event[]> {
  try {
    const queryString = params
      ? `?${new URLSearchParams(
          Object.entries(params).reduce((acc, [key, value]) => {
            if (value !== undefined) {
              acc[key] = String(value);
            }
            return acc;
          }, {} as Record<string, string>)
        ).toString()}`
      : "";

    console.log(`📡 Fetching events from: /api/events${queryString}`);

    const response = await apiGet(`/api/events${queryString}`);

    // Enhanced response handling
    let events: Event[] = [];

    if (Array.isArray(response)) {
      events = response;
    } else if (response?.data && Array.isArray(response.data)) {
      events = response.data;
    } else if (response && typeof response === "object") {
      // Handle case where response might be a single event object
      events = [response];
    } else {
      console.warn("⚠️ Unexpected response format:", response);
      events = [];
    }

    // Enhanced logging for MinIO images
    console.log("📊 EVENTS API RESPONSE:", {
      totalEvents: events.length,
      hasData: !!response?.data,
      isArray: Array.isArray(events),
      originalResponse: response,
    });

    // Log each event's image data specifically
    events.forEach((event: Event, index: number) => {
      console.log(`📅 EVENT ${index + 1}: "${event.name}"`, {
        id: event.id,
        profileImage: event.profileImage,
        coverImage: event.coverImage,
        locationImage: event.locationImage,
        category: event.category?.name,
        categoryImage: event.category?.image,
        isMinIOProfile: event.profileImage?.includes("localhost:9000"),
        isMinIOCover: event.coverImage?.includes("localhost:9000"),
      });
    });

    return events;
  } catch (error) {
    console.error("❌ Failed to fetch events:", error);
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
    console.log(`📡 Fetching event by ID: ${id}`);
    const event = await apiGet(`/api/events/${id}`);

    if (event) {
      console.log(`📅 SINGLE EVENT RESPONSE: "${event.name}"`, {
        id: event.id,
        profileImage: event.profileImage,
        coverImage: event.coverImage,
        locationImage: event.locationImage,
        isMinIOProfile: event.profileImage?.includes("localhost:9000"),
        isMinIOCover: event.coverImage?.includes("localhost:9000"),
      });
    }

    return event;
  } catch (error) {
    console.error(`❌ Failed to fetch event with id ${id}:`, error);
    return null;
  }
}

/**
 * Toggles user interest in an event
 */
export async function toggleEventInterest(
  eventId: string
): Promise<{ success: boolean; isInterested: boolean }> {
  try {
    console.log("Toggling interest for event:", eventId);
    const checkResponse = await apiGet(`/api/interests/check/${eventId}`);
    console.log("Current interest status:", checkResponse);

    let result;
    if (checkResponse && checkResponse.interested) {
      console.log("Removing interest...");
      await apiDelete(`/api/interests/event/${eventId}`);
      result = { success: true, isInterested: false };
    } else {
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
