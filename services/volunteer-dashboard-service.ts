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

/**
 * Get volunteer dashboard statistics
 * Matches the backend endpoint: GET /api/volunteer/dashboard/stats
 */
export async function getVolunteerDashboardStats(): Promise<DashboardStats> {
  try {
    console.log("Fetching volunteer dashboard stats...");
    
    // Use the correct endpoint that matches backend controller
    const response = await apiGet("/api/volunteer/dashboard/stats");
    console.log("Dashboard stats response:", response);

    // Ensure we have valid data structure matching backend response
    const stats: DashboardStats = {
      attendeeCount: response?.attendeeCount || 0,
      taskCount: response?.taskCount || 0,
      volunteerCount: response?.volunteerCount || 0,
      events: Array.isArray(response?.events) ? response.events : [],
    };

    console.log("Processed dashboard stats:", stats);
    return stats;
  } catch (error) {
    console.error("Failed to fetch volunteer dashboard stats:", error);
    
    // Return default values that match the expected structure
    return {
      attendeeCount: 0,
      taskCount: 0,
      volunteerCount: 0,
      events: [],
    };
  }
}

/**
 * Get current volunteer's events
 * This could be used for additional event information if needed
 */
export async function getMyVolunteerEventsForDashboard(): Promise<DashboardEvent[]> {
  try {
    console.log("Fetching my volunteer events for dashboard...");
    
    // This would use the existing volunteer events endpoint
    const response = await apiGet("/api/volunteer/my-applications");
    
    // Filter for approved applications and transform to dashboard format
    const approvedApplications = response.filter(
      (app: any) => app.status === "APPROVED"
    );
    
    return approvedApplications.map((app: any, index: number) => ({
      id: index + 1,
      name: app.event?.name || "Unknown Event",
      attendeeCount: 0,
      attendeeCapacity: 100,
      volunteerCount: "1/20",
      progress: 50,
    }));
  } catch (error) {
    console.error("Failed to fetch volunteer events for dashboard:", error);
    return [];
  }
}