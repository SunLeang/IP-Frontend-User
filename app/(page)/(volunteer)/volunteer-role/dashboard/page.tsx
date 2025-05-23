"use client";

import { useAuth } from "@/context/auth-context";
import { Users, ClipboardList, UserCheck } from "lucide-react";
import { StatCard } from "@/components/volunteer/stat-card";
import { EventTable } from "@/components/volunteer/event-table";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect } from "react";

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

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Sample data for the dashboard
  const stats = [
    {
      title: "Total Attendee",
      value: 400,
      change: {
        value: 8.5,
        isIncrease: true,
        period: "yesterday",
      },
      icon: <Users size={24} className="text-blue-500" />,
    },
    {
      title: "Total Tasks",
      value: 21,
      change: {
        value: 4.3,
        isIncrease: false,
        period: "yesterday",
      },
      icon: <ClipboardList size={24} className="text-green-500" />,
    },
    {
      title: "Total Volunteer",
      value: 100,
      change: {
        value: 3.3,
        isIncrease: true,
        period: "past week",
      },
      icon: <UserCheck size={24} className="text-yellow-500" />,
    },
  ];

  const events = [
    {
      id: 1,
      name: "BookFair",
      attendeeCount: 121,
      attendeeCapacity: 121,
      volunteerCount: "10/10",
      progress: 100,
    },
    {
      id: 2,
      name: "BookFair",
      attendeeCount: 113,
      attendeeCapacity: 220,
      volunteerCount: "16/20",
      progress: 51,
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
              src="/assets/images/prom-night.png"
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
        <EventTable events={events} />
      </div>
    </div>
  );
}
