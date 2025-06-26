import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import { Event } from "@/types/event";

/**
 * Props for EventActions component
 */
interface EventActionsProps {
  event: Event;
  isJoined: boolean;
  eventEnded: boolean;
  onJoinClick: () => void;
}

/**
 * Event Actions Component
 * Displays event sidebar with join/volunteer buttons and event stats
 */
export function EventActions({
  event,
  isJoined,
  eventEnded,
  onJoinClick,
}: EventActionsProps) {
  // Add null checks to prevent undefined errors
  if (!event) {
    return (
      <div className="md:col-span-1">
        <div className="bg-gray-100 p-4 rounded-lg">
          <p>Loading event actions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="md:col-span-1">
      {/* Join/Cancel Button */}
      {!eventEnded && (
        <Button
          onClick={onJoinClick}
          className={`w-full mb-6 ${
            isJoined
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isJoined ? "Cancel Registration" : "Join Event"}
        </Button>
      )}

      {/* Volunteer Application Button */}
      {event.acceptingVolunteers && !eventEnded && (
        <Button variant="outline" className="w-full mb-6" asChild>
          <Link href={`/volunteer/${event.id}`}>Apply as Volunteer</Link>
        </Button>
      )}

      {/* Event Stats */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Event Details</h3>

        <div className="flex items-center text-gray-600">
          <Users className="h-5 w-5 mr-3" />
          <div>
            <p className="font-medium">
              {event._count?.attendingUsers || 0} attending
            </p>
            <p className="text-sm">
              {event._count?.interestedUsers || 0} interested
            </p>
          </div>
        </div>

        {event.acceptingVolunteers && (
          <div className="flex items-center text-gray-600">
            <Calendar className="h-5 w-5 mr-3" />
            <div>
              <p className="font-medium">Volunteers needed</p>
              <p className="text-sm">
                {event._count?.volunteers || 0} volunteers signed up
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center text-gray-600">
          <MapPin className="h-5 w-5 mr-3" />
          <div>
            <p className="font-medium">Category</p>
            <p className="text-sm">{event.category?.name || "General"}</p>
          </div>
        </div>
      </div>

      {eventEnded && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <p className="text-gray-600 text-center">This event has ended</p>
        </div>
      )}
    </div>
  );
}
