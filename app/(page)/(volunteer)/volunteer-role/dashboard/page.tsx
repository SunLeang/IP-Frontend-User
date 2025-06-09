"use client";

import { useAuth } from "@/context/auth-context";
import { Users, ClipboardList, UserCheck } from "lucide-react";
import { StatCard } from "@/components/volunteer/stat-card";
import { EventTable } from "@/components/volunteer/event-table";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  getVolunteerDashboardStats,
  DashboardStats,
} from "@/services/volunteer-dashboard-service";
import { getMyVolunteerEvents } from "@/services/volunteer-service";

export default function VolunteerRoleDashboardPage() {
  // Emergency redirect check
  useEffect(() => {
    try {
      const userJson = localStorage.getItem("user");
      if (!userJson) return;

      const user = JSON.parse(userJson);
      if (user.currentRole !== "VOLUNTEER") {
        window.location.href = "/unauthorized";
      }
    } catch (error) {
      console.error("Auth check error:", error);
    }
  }, []);

  const { isLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(
    null
  );
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardStats, volunteerEvents] = await Promise.all([
          getVolunteerDashboardStats(),
          getMyVolunteerEvents(),
        ]);

        setDashboardData(dashboardStats);

        // You can also update any event banner or recent events display
        console.log("Volunteer events:", volunteerEvents);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (!isLoading) {
      fetchDashboardData();
    }
  }, [isLoading]);

  // Show loading state
  if (isLoading || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Create stats array from dashboard data
  const stats = [
    {
      title: "Total Attendee",
      value: dashboardData?.attendeeCount || 0,
      change: {
        value: 8.5,
        isIncrease: true,
        period: "yesterday",
      },
      icon: <Users size={24} className="text-blue-500" />,
    },
    {
      title: "Total Tasks",
      value: dashboardData?.taskCount || 0,
      change: {
        value: 4.3,
        isIncrease: false,
        period: "yesterday",
      },
      icon: <ClipboardList size={24} className="text-green-500" />,
    },
    {
      title: "Total Volunteer",
      value: dashboardData?.volunteerCount || 0,
      change: {
        value: 3.3,
        isIncrease: true,
        period: "past week",
      },
      icon: <UserCheck size={24} className="text-yellow-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Event Banner */}
      <div className="bg-blue-50 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4">
            You&apos;re volunteering for BookFair Event
          </h1>
          <div className="relative w-full h-[200px] md:h-[250px] rounded-lg overflow-hidden">
            <Image
              src="/icons/user.png"
              alt="BookFair Event"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
            />
          ))}
        </div>

        {/* Download Report Button */}
        <div className="flex justify-end mb-6">
          <Button variant="outline" className="text-blue-500 border-blue-500">
            Download Report
          </Button>
        </div>

        {/* Events Table */}
        <EventTable events={dashboardData?.events || []} />
      </div>
    </div>
  );
}
