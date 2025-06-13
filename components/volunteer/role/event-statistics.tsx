import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, ClipboardList } from "lucide-react";
import { useState, useEffect } from "react";
import { apiGet } from "@/services/api";

interface DashboardStats {
  attendeeCount: number;
  taskCount: number;
  volunteerCount: number;
}

interface EventStatisticsProps {
  eventId?: string;
  fallbackAttendingUsers?: number;
  fallbackVolunteers?: number;
  fallbackTasks?: number;
}

export function EventStatistics({
  eventId,
  fallbackAttendingUsers = 0,
  fallbackVolunteers = 0,
  fallbackTasks = 0,
}: EventStatisticsProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        console.log(
          "Fetching dashboard stats from /api/volunteer/dashboard/stats"
        );

        const dashboardStats = await apiGet("/api/volunteer/dashboard/stats");

        if (dashboardStats) {
          setStats(dashboardStats);
          console.log("Successfully loaded dashboard stats:", dashboardStats);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        // Use fallback values if API fails
        setStats({
          attendeeCount: fallbackAttendingUsers,
          taskCount: fallbackTasks,
          volunteerCount: fallbackVolunteers,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [eventId, fallbackAttendingUsers, fallbackVolunteers, fallbackTasks]);

  // Use dashboard stats if available, otherwise use fallback values
  const displayStats = stats || {
    attendeeCount: fallbackAttendingUsers,
    taskCount: fallbackTasks,
    volunteerCount: fallbackVolunteers,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6 text-center">
          <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
          <p className="text-2xl font-bold">
            {isLoading ? "..." : displayStats.attendeeCount}
          </p>
          <p className="text-sm text-gray-600">Total Attendees</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 text-center">
          <UserCheck className="h-8 w-8 mx-auto mb-2 text-green-500" />
          <p className="text-2xl font-bold">
            {isLoading ? "..." : displayStats.volunteerCount}
          </p>
          <p className="text-sm text-gray-600">Volunteers</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 text-center">
          <ClipboardList className="h-8 w-8 mx-auto mb-2 text-purple-500" />
          <p className="text-2xl font-bold">
            {isLoading ? "..." : displayStats.taskCount}
          </p>
          <p className="text-sm text-gray-600">Tasks</p>
        </CardContent>
      </Card>
    </div>
  );
}
