import { Badge } from "@/components/ui/badge";
import { VolunteerHistoryEvent } from "@/services/volunteer-history-service";

interface VolunteerEventSidebarProps {
  event: VolunteerHistoryEvent;
}

export function VolunteerEventSidebar({ event }: VolunteerEventSidebarProps) {
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return {
          className: "bg-green-100 text-green-800",
          label: "Event Completed",
        };
      case "published":
        return {
          className: "bg-blue-100 text-blue-800",
          label: "Event Active",
        };
      case "cancelled":
        return {
          className: "bg-red-100 text-red-800",
          label: "Event Cancelled",
        };
      default:
        return { className: "bg-gray-100 text-gray-800", label: status };
    }
  };

  const getVolunteerStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return {
          className: "bg-green-100 text-green-800",
          label: "Volunteer Approved",
        };
      case "pending":
        return {
          className: "bg-yellow-100 text-yellow-800",
          label: "Application Pending",
        };
      case "rejected":
        return {
          className: "bg-red-100 text-red-800",
          label: "Application Rejected",
        };
      default:
        return { className: "bg-gray-100 text-gray-800", label: status };
    }
  };

  const eventStatus = getStatusBadge(event.status);
  const volunteerStatus = getVolunteerStatusBadge(event.volunteerStatus);

  return (
    <div className="md:col-span-1">
      {/* Event Status */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-3">Event Status</h2>
        <Badge className={eventStatus.className}>{eventStatus.label}</Badge>
      </div>

      {/* Volunteer Status */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-3">Your Status</h2>
        <Badge className={volunteerStatus.className}>
          {volunteerStatus.label}
        </Badge>
        {event.approvedAt && (
          <p className="text-sm text-gray-500 mt-2">
            Approved on: {new Date(event.approvedAt).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Category Information */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-3">Category</h2>
        <p>{event.category?.name || "Uncategorized"}</p>
      </div>

      {/* Event Statistics */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-3">Statistics</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Attendees:</span>
            <span className="text-sm font-medium">
              {event._count?.attendingUsers || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Volunteers:</span>
            <span className="text-sm font-medium">
              {event._count?.volunteers || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Tasks:</span>
            <span className="text-sm font-medium">
              {event._count?.tasks || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
