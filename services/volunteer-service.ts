import { apiGet, apiPost } from "./api";
import type { Event } from "@/types/event";

/**
 * Volunteer-specific interfaces
 */
export interface VolunteerEvent extends Event {
  // Extend base Event type for volunteer-specific needs
}

export interface VolunteerApplicationFormData {
  eventId: string;
  whyVolunteer: string;
  cvPath: string;
}

// Add interface for volunteer application
export interface VolunteerApplication {
  id: string;
  eventId: string;
  userId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  whyVolunteer: string;
  cvPath: string;
  createdAt: string;
  updatedAt: string;
  event?: {
    id: string;
    name: string;
    dateTime: string;
  };
}

export async function getVolunteerEvents(): Promise<VolunteerEvent[]> {
  try {
    const response = await apiGet(
      "/api/events?acceptingVolunteers=true&status=PUBLISHED"
    );
    return response.data || response;
  } catch (error) {
    console.error("Failed to fetch volunteer events:", error);
    return [];
  }
}

export async function applyForVolunteer(
  data: VolunteerApplicationFormData
): Promise<any> {
  try {
    return await apiPost("/api/volunteer/applications", data);
  } catch (error) {
    console.error("Failed to submit volunteer application:", error);
    throw error;
  }
}

// Update the getUserVolunteerApplications function
export async function getUserVolunteerApplications(): Promise<
  VolunteerApplication[]
> {
  try {
    const response = await apiGet("/api/volunteer/my-applications");
    return Array.isArray(response) ? response : response.data || [];
  } catch (error) {
    console.error("Failed to fetch user's volunteer applications:", error);
    return [];
  }
}

// Add function to check application status for specific event
export async function getVolunteerApplicationStatus(
  eventId: string
): Promise<VolunteerApplication | null> {
  try {
    const applications = await getUserVolunteerApplications();
    return applications.find((app) => app.eventId === eventId) || null;
  } catch (error) {
    console.error("Failed to check volunteer application status:", error);
    return null;
  }
}

// Add this new function to get events where user is volunteering
export async function getMyVolunteerEvents(): Promise<VolunteerEvent[]> {
  try {
    console.log("Fetching my volunteer events...");

    // First get the user's applications to find which events they're volunteering for
    const applications = await getUserVolunteerApplications();
    const approvedApplications = applications.filter(
      (app) => app.status === "APPROVED"
    );

    if (approvedApplications.length === 0) {
      return [];
    }

    // Get event details for approved applications
    const eventPromises = approvedApplications.map(async (app) => {
      try {
        const event = await apiGet(`/api/events/${app.eventId}`);
        return event;
      } catch (error) {
        console.error(`Failed to fetch event ${app.eventId}:`, error);
        return null;
      }
    });

    const events = await Promise.all(eventPromises);
    return events.filter((event) => event !== null);
  } catch (error) {
    console.error("Failed to fetch my volunteer events:", error);
    return [];
  }
}

// Alternative approach using backend endpoint if available
export async function getVolunteerEventsDirect(): Promise<VolunteerEvent[]> {
  try {
    // This would require a new backend endpoint
    const response = await apiGet("/api/volunteer/my-events");
    return response.data || response;
  } catch (error) {
    console.error("Failed to fetch volunteer events directly:", error);
    return [];
  }
}
