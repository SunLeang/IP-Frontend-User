import { StatCard } from "@/components/volunteer/stat-card";
import { Users, ClipboardList, UserCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { apiGet } from "@/services/api";

interface DashboardStats {
  attendeeCount: number;
  taskCount: number;
  volunteerCount: number;
}

interface VolunteerDashboardStatsGridProps {
  fallbackStats?: DashboardStats | null;
}

export function VolunteerDashboardStatsGrid({
  fallbackStats,
}: VolunteerDashboardStatsGridProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        console.log(
          "Fetching dashboard stats from /api/volunteer/dashboard/stats"
        );

        const dashboardStats = await apiGet("/api/volunteer/dashboard/stats");

        if (dashboardStats) {
          setStats(dashboardStats);
          console.log("Successfully loaded dashboard stats:", dashboardStats);
        } else if (fallbackStats) {
          setStats(fallbackStats);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        if (fallbackStats) {
          setStats(fallbackStats);
        } else {
          setStats({
            attendeeCount: 0,
            taskCount: 0,
            volunteerCount: 0,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, [fallbackStats]);

  // Use fetched stats or fallback (handles both null and undefined)
  const displayStats = stats ||
    fallbackStats || {
      attendeeCount: 0,
      taskCount: 0,
      volunteerCount: 0,
    };

  // Transform stats into the format expected by StatCard
  const statCards = [
    {
      title: "Total Attendee",
      value: displayStats.attendeeCount,
      change: {
        value: 8.5,
        isIncrease: true,
        period: "yesterday",
      },
      icon: <Users size={24} className="text-blue-500" />,
    },
    {
      title: "Total Tasks",
      value: displayStats.taskCount,
      change: {
        value: 4.3,
        isIncrease: false,
        period: "yesterday",
      },
      icon: <ClipboardList size={24} className="text-green-500" />,
    },
    {
      title: "Total Volunteer",
      value: displayStats.volunteerCount,
      change: {
        value: 3.3,
        isIncrease: true,
        period: "past week",
      },
      icon: <UserCheck size={24} className="text-yellow-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={isLoading ? "..." : stat.value}
          change={stat.change}
          icon={stat.icon}
        />
      ))}
    </div>
  );
}
