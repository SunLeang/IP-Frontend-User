import { Badge } from "@/components/ui/badge";
import { VolunteerHistoryEvent } from "@/services/volunteer-history-service";

interface VolunteerEventSidebarProps {
  event: VolunteerHistoryEvent;
}

export function VolunteerEventSidebar({ event }: VolunteerEventSidebarProps) {
  return (
    <div className="md:col-span-1 space-y-8">
      {/* Added more spacing and better separation from image */}
      <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 mt-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Category</h3>
        <Badge
          variant="secondary"
          className="text-sm px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200"
        >
          {event.category?.name || "General"}
        </Badge>
      </div>

      {/* Event Organizer */}
      <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Event Organizer
        </h3>
        <div className="flex items-center">
          <img
            src="/icons/user.png"
            alt="Organizer"
            className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-gray-200"
          />
          <div>
            <p className="font-medium text-gray-800">
              {event.organizer?.fullName || "Event Organizer"}
            </p>
            <p className="text-sm text-gray-600">Event Host</p>
          </div>
        </div>
      </div>

      {/* Event Statistics */}
      <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Event Statistics
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-600 font-medium">Attendees</span>
            <span className="font-semibold text-gray-800 bg-white px-3 py-2 rounded border">
              {event._count?.attendingUsers || 0}
            </span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-600 font-medium">Volunteers</span>
            <span className="font-semibold text-gray-800 bg-white px-3 py-2 rounded border">
              {event._count?.volunteers || 0}
            </span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-600 font-medium">Interested</span>
            <span className="font-semibold text-gray-800 bg-white px-3 py-2 rounded border">
              {event._count?.interestedUsers || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
