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

interface UseVolunteerDashboardReturn {
  stats: DashboardStats | null;
  events: DashboardEvent[];
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

      // Fetch dashboard stats using the correct endpoint from backend
      const dashboardStats = await apiGet("/api/volunteer/dashboard/stats");

      if (dashboardStats) {
        setStats(dashboardStats);
        console.log("Successfully loaded dashboard stats:", dashboardStats);
      } else {
        // Fallback data if no stats returned
        setStats({
          attendeeCount: 0,
          taskCount: 0,
          volunteerCount: 0,
          events: [],
        });
      }
    } catch (err) {
      console.error("Error fetching volunteer dashboard data:", err);
      setError("Failed to load dashboard data");

      // Fallback data on error
      setStats({
        attendeeCount: 0,
        taskCount: 0,
        volunteerCount: 0,
        events: [],
      });
    } finally {
      setIsLoading(false);
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
    isLoading,
    error,
    refetch,
  };
}
