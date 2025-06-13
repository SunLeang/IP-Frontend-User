"use client";

import { useAuth } from "@/context/auth-context";
import { VolunteerDashboardLoading } from "@/components/volunteer/role/volunteer-dashboard-loading";
import { VolunteerDashboardError } from "@/components/volunteer/role/volunteer-dashboard-error";
import { VolunteerDashboardEventBanner } from "@/components/volunteer/role/volunteer-dashboard-event-banner";
import { VolunteerDashboardStatsGrid } from "@/components/volunteer/role/volunteer-dashboard-stats-grid";
import { VolunteerDashboardActions } from "@/components/volunteer/role/volunteer-dashboard-actions";
import { EventTable } from "@/components/volunteer/event-table";
import { useVolunteerDashboard } from "@/hooks/useVolunteerDashboard";
import { useEffect } from "react";

export default function VolunteerRoleDashboardPage() {
  const { isLoading: authLoading } = useAuth();
  const {
    stats,
    events,
    isLoading: dashboardLoading,
    error,
    refetch,
  } = useVolunteerDashboard();

  // Emergency redirect check for unauthorized access
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

  // Handle download report action
  const handleDownloadReport = () => {
    console.log("Downloading volunteer dashboard report...");
    // TODO: Implement actual report generation
  };

  // Show loading state
  if (authLoading || dashboardLoading) {
    return <VolunteerDashboardLoading />;
  }

  // Show error state
  if (error) {
    return <VolunteerDashboardError error={error} onRetry={refetch} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Event Banner */}
      <VolunteerDashboardEventBanner />

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>

        {/* Stats Cards - Now fetches from API directly */}
        <VolunteerDashboardStatsGrid fallbackStats={stats} />

        {/* Download Report Button */}
        <VolunteerDashboardActions onDownloadReport={handleDownloadReport} />

        {/* Events Table */}
        <EventTable events={events} />
      </div>
    </div>
  );
}
