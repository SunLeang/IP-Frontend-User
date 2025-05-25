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
