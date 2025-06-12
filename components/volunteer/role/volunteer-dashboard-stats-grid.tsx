import { StatCard } from "@/components/volunteer/stat-card";
import { Users, ClipboardList, UserCheck } from "lucide-react";

interface DashboardStats {
  attendeeCount: number;
  taskCount: number;
  volunteerCount: number;
}

interface VolunteerDashboardStatsGridProps {
  stats: DashboardStats;
}

export function VolunteerDashboardStatsGrid({
  stats,
}: VolunteerDashboardStatsGridProps) {
  // Transform stats into the format expected by StatCard
  const statCards = [
    {
      title: "Total Attendee",
      value: stats.attendeeCount,
      change: {
        value: 8.5,
        isIncrease: true,
        period: "yesterday",
      },
      icon: <Users size={24} className="text-blue-500" />,
    },
    {
      title: "Total Tasks",
      value: stats.taskCount,
      change: {
        value: 4.3,
        isIncrease: false,
        period: "yesterday",
      },
      icon: <ClipboardList size={24} className="text-green-500" />,
    },
    {
      title: "Total Volunteer",
      value: stats.volunteerCount,
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
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
        />
      ))}
    </div>
  );
}
