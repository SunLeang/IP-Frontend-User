import { apiGet } from "./api";

export interface DashboardStats {
  attendeeCount: number;
  taskCount: number;
  volunteerCount: number;
  events: DashboardEvent[];
}

export interface DashboardEvent {
  id: number;
  name: string;
  attendeeCount: number;
  attendeeCapacity: number;
  volunteerCount: string;
  progress: number;
}

export async function getVolunteerDashboardStats(): Promise<DashboardStats> {
  try {
    console.log("Fetching volunteer dashboard stats...");
    const response = await apiGet("/api/volunteer/dashboard/stats");
    console.log("Dashboard stats response:", response);

    // Ensure we have valid data structure
    const stats = {
      attendeeCount: response?.attendeeCount || 0,
      taskCount: response?.taskCount || 0,
      volunteerCount: response?.volunteerCount || 0,
      events: Array.isArray(response?.events) ? response.events : [],
    };

    console.log("Processed dashboard stats:", stats);
    return stats;
  } catch (error) {
    console.error("Failed to fetch volunteer dashboard stats:", error);
    // Return default values in case of error
    return {
      attendeeCount: 0,
      taskCount: 0,
      volunteerCount: 0,
      events: [],
    };
  }
}
