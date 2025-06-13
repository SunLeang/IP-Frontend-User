"use client";

import { useState, use } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useVolunteerEventDetail } from "@/hooks/useVolunteerEventDetail";
import { EventDetailTabs } from "@/components/volunteer/role/event-detail-tabs";
import { EventDetailHeader } from "@/components/volunteer/role/event-detail-header";
import { EventOrganizer } from "@/components/volunteer/role/event-organizer";
import { EventStatistics } from "@/components/volunteer/role/event-statistics";
import { AttendeeTable } from "@/components/volunteer/role/attendee-table";
import { VolunteerTable } from "@/components/volunteer/role/volunteer-table";
import { TaskTable } from "@/components/volunteer/role/task-table";

export default function VolunteerEventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState("details");
  const [isStarred, setIsStarred] = useState(false);

  const {
    event,
    attendees,
    volunteers,
    tasks,
    taskCount,
    taskMeta,
    isLoading,
    error,
    fetchAttendees,
    fetchVolunteers,
    fetchTasks,
  } = useVolunteerEventDetail(id);

  // Event handlers
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    // Fetch data only when tab is switched to avoid infinite loops
    if (tab === "attendee" && event) {
      fetchAttendees();
    } else if (tab === "volunteer" && event) {
      fetchVolunteers();
      fetchTasks(1); // Always start from page 1 when switching to volunteer tab
    }
  };

  const handleTaskPageChange = (page: number) => {
    console.log(`Changing to task page: ${page}`);
    fetchTasks(page);
  };

  const handleToggleStar = () => {
    setIsStarred(!isStarred);
  };

  const handleDownloadReport = () => {
    window.print();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pb-10">
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <div className="flex justify-center mb-6">
            <Skeleton className="h-10 w-80" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !event) {
    return (
      <div className="min-h-screen bg-white pb-10">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error || "Event not found"}</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-10">
      <div className="container mx-auto px-4 py-6">
        {/* Event Title */}
        <h1 className="text-xl font-bold mb-4">
          You&apos;re volunteering for {event.name}
        </h1>

        {/* Tabs */}
        <EventDetailTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          attendeeCount={event._count?.attendingUsers || 0}
          volunteerCount={event._count?.volunteers || 0}
          onDownloadReport={handleDownloadReport}
        />

        {/* Details Tab Content */}
        {activeTab === "details" && (
          <div>
            <EventDetailHeader
              event={event}
              isStarred={isStarred}
              onToggleStar={handleToggleStar}
            />
            <EventOrganizer organizer={event.organizer} />
            <EventStatistics
              eventId={id}
              fallbackAttendingUsers={event._count?.attendingUsers || 0}
              fallbackVolunteers={event._count?.volunteers || 0}
              fallbackTasks={taskCount}
            />
          </div>
        )}

        {/* Attendee Tab Content */}
        {activeTab === "attendee" && <AttendeeTable attendees={attendees} />}

        {/* Volunteer Tab Content */}
        {activeTab === "volunteer" && (
          <div className="space-y-6">
            <VolunteerTable volunteers={volunteers} />
            <TaskTable
              tasks={tasks}
              taskMeta={taskMeta}
              onPageChange={handleTaskPageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
