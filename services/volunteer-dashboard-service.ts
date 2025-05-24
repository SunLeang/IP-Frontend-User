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
    const response = await apiGet("/api/volunteer/dashboard/stats");
    return response;
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
