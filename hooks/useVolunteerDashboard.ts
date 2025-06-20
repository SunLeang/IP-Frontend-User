import { useState, useEffect } from "react";
import { apiGet } from "@/services/api";

interface DashboardStats {
  attendeeCount: number;
  taskCount: number;
  volunteerCount: number;
  events: DashboardEvent[];
}

interface DashboardEvent {
  id: number;
  name: string;
  attendeeCount: number;
  attendeeCapacity: number;
  volunteerCount: string;
  progress: number;
}

interface CurrentEventData {
  event: {
    id: string;
    name: string;
    coverImage?: string;
    profileImage?: string;
  };
}

interface UseVolunteerDashboardReturn {
  stats: DashboardStats | null;
  events: DashboardEvent[];
  currentEvent: CurrentEventData | null; // Add this property
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook for managing volunteer dashboard data
 * Fetches dashboard statistics and events from the backend
 */
export function useVolunteerDashboard(): UseVolunteerDashboardReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [currentEvent, setCurrentEvent] = useState<CurrentEventData | null>(
    null
  ); // Add this state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches dashboard data from the backend
   */
  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Fetching volunteer dashboard data...");

      // Fetch dashboard stats and current event in parallel
      const [dashboardStats, currentEventData] = await Promise.all([
        apiGet("/api/volunteer/dashboard/stats"),
        fetchCurrentEvent(),
      ]);

      if (dashboardStats) {
        setStats(dashboardStats);
        console.log("Successfully loaded dashboard stats:", dashboardStats);
      } else {
        setStats({
          attendeeCount: 0,
          taskCount: 0,
          volunteerCount: 0,
          events: [],
        });
      }

      setCurrentEvent(currentEventData);
    } catch (err) {
      console.error("Error fetching volunteer dashboard data:", err);
      setError("Failed to load dashboard data");
      setStats({
        attendeeCount: 0,
        taskCount: 0,
        volunteerCount: 0,
        events: [],
      });
      setCurrentEvent(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to fetch current event
  const fetchCurrentEvent = async (): Promise<CurrentEventData | null> => {
    try {
      const applicationsResponse = await apiGet(
        "/api/volunteer/my-applications"
      );
      const applications = Array.isArray(applicationsResponse)
        ? applicationsResponse
        : applicationsResponse?.data || [];

      const approvedApp = applications.find(
        (app: any) => app.status === "APPROVED"
      );

      if (approvedApp?.eventId) {
        const eventDetails = await apiGet(`/api/events/${approvedApp.eventId}`);
        if (eventDetails) {
          return {
            event: {
              id: eventDetails.id,
              name: eventDetails.name,
              coverImage: eventDetails.coverImage,
              profileImage: eventDetails.profileImage,
            },
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error fetching current event:", error);
      return null;
    }
  };

  /**
   * Refetch function to manually trigger data reload
   */
  const refetch = () => {
    fetchDashboardData();
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    stats,
    events: stats?.events || [],
    currentEvent, // Include currentEvent in return
    isLoading,
    error,
    refetch,
  };
}
