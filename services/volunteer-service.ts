import { apiGet, apiPost } from "./api";

export interface VolunteerEvent {
  id: string;
  name: string;
  description: string;
  dateTime: string;
  locationDesc: string;
  profileImage?: string;
  coverImage?: string;
  acceptingVolunteers: boolean;
  category?: {
    name: string;
  };
  _count?: {
    volunteers?: number;
  };
}

export interface VolunteerApplicationFormData {
  eventId: string;
  whyVolunteer: string;
  cvPath: string;
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

export async function getUserVolunteerApplications(): Promise<any[]> {
  try {
    return await apiGet("/api/volunteer/my-applications");
  } catch (error) {
    console.error("Failed to fetch user's volunteer applications:", error);
    return [];
  }
}
