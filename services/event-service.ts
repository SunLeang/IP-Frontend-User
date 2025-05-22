import { apiGet, apiPost, apiDelete } from "./api";

export enum EventStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export interface Event {
  id: string;
  name: string;
  description: string;
  profileImage?: string;
  coverImage?: string;
  dateTime: string;
  locationDesc: string;
  locationImage?: string;
  status: EventStatus;
  acceptingVolunteers: boolean;
  categoryId: string;
  organizerId: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    image?: string;
  };
  organizer?: {
    id: string;
    fullName: string;
  };
  _count?: {
    interestedUsers?: number;
    attendingUsers?: number;
    volunteers?: number;
  };
}

export async function getEvents(
  params?: Record<string, string>
): Promise<Event[]> {
  try {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    const response = await apiGet(`/api/events${queryString}`);
    // Check if the response has a data property (pagination structure)
    return response.data || response;
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return [];
  }
}

export async function getEventById(id: string): Promise<Event | null> {
  try {
    return await apiGet(`/api/events/${id}`);
  } catch (error) {
    console.error(`Failed to fetch event with id ${id}:`, error);
    return null;
  }
}

// Interest-related functions based on the provided backend code
export async function toggleEventInterest(
  eventId: string
): Promise<{ success: boolean }> {
  try {
    // Check if already interested
    const checkResult = await apiGet(`/api/interests/check/${eventId}`);

    if (checkResult.interested) {
      // If already interested, remove interest
      await apiDelete(`/api/interests/event/${eventId}`);
    } else {
      // If not interested, add interest
      await apiPost("/api/interests", { eventId });
    }

    return { success: true };
  } catch (error) {
    console.error(`Failed to toggle interest for event ${eventId}:`, error);
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      throw new Error("Please log in to add this event to your interests");
    }
    throw error;
  }
}

export async function getInterestedEvents(): Promise<Event[]> {
  try {
    const response = await apiGet("/api/interests/my-interests");

    if (response && response.data) {
      return response.data.map((item: any) => item.event);
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch interested events:", error);
    // If unauthorized, just return empty array instead of throwing
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return [];
    }
    throw error;
  }
}

// Attendance-related functions
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
