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
    currentEvent,
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
      {/* Event Banner - Enhanced with proper event data */}
      <VolunteerDashboardEventBanner
        eventName={currentEvent?.event?.name}
        eventImage={
          currentEvent?.event?.coverImage || currentEvent?.event?.profileImage
        }
      />

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>

        {/* Stats Cards - Now fetches from API directly */}
        <VolunteerDashboardStatsGrid fallbackStats={stats} />

        {/* Download Actions */}
        <VolunteerDashboardActions onDownloadReport={handleDownloadReport} />

        {/* Events Table - Fixed props */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">My Volunteer Events</h3>
          {events && events.length > 0 ? (
            <EventTable events={events} />
          ) : (
            <div className="bg-white rounded-lg border p-8 text-center">
              <div className="text-gray-500">
                <svg
                  className="h-12 w-12 mx-auto mb-4 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-lg font-medium mb-2">
                  No volunteer events found
                </p>
                <p className="text-sm">
                  Your volunteer events will appear here once you're approved.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
