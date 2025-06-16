"use client";

import { useVolunteerEvents } from "@/hooks/useVolunteerEvents";
import { VolunteerEventsGrid } from "@/components/volunteer/role/volunteer-events-grid";
import { VolunteerEventsLoading } from "@/components/volunteer/role/volunteer-events-loading";
import { VolunteerEventsEmpty } from "@/components/volunteer/role/volunteer-events-empty";
import { VolunteerEventsError } from "@/components/volunteer/role/volunteer-events-error";

export default function VolunteerEventsPage() {
  const { events, isLoading, error, refetch } = useVolunteerEvents();

  // Show loading state
  if (isLoading) {
    return <VolunteerEventsLoading />;
  }

  // Show error state
  if (error) {
    return <VolunteerEventsError error={error} onRetry={refetch} />;
  }

  // Show empty state
  if (events.length === 0) {
    return <VolunteerEventsEmpty />;
  }

  // Show events grid
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Your Volunteer Events</h1>
      <p className="text-gray-600 mb-6">
        You are volunteering for {events.length} event
        {events.length !== 1 ? "s" : ""}
      </p>
      <VolunteerEventsGrid events={events} />
    </div>
  );
}