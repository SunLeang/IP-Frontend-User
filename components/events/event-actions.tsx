import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { Event } from "@/types/event";

/**
 * Props for EventActions component
 */
interface EventActionsProps {
  event: Event;
  eventEnded: boolean;
  isJoined: boolean;
  onJoinClick: () => void;
}

/**
 * Event Actions Component
 * Displays join/cancel buttons and event information sidebar
 */
export function EventActions({
  event,
  eventEnded,
  isJoined,
  onJoinClick,
}: EventActionsProps) {
  return (
    <div className="md:col-span-1">
      {/* Join/Cancel Button or Event Ended */}
      <div className="mb-6">
        {eventEnded ? (
          <Button
            disabled
            className="w-full py-6 bg-orange-500 hover:bg-orange-600 flex items-center justify-center gap-2"
          >
            Event ended
          </Button>
        ) : isJoined ? (
          <Button
            onClick={onJoinClick}
            className="w-full py-6 bg-white text-black border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </Button>
        ) : (
          <Button
            onClick={onJoinClick}
            className="w-full py-6 bg-green-500 hover:bg-green-600 flex items-center justify-center gap-2"
          >
            <UserPlus className="h-6 w-6" />
            Join event
          </Button>
        )}
      </div>

      {/* Ticket Information */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-3">Ticket Information</h2>
        <p>This event is free to join.</p>
      </div>

      {/* Category Information */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-3">Category</h2>
        <p>{event.category?.name || "Uncategorized"}</p>
      </div>

      {/* Volunteer Information - if accepting volunteers */}
      {event.acceptingVolunteers && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Volunteer Opportunities</h2>
          <p className="mb-3">This event is looking for volunteers!</p>
          <Link href={`/volunteer/${event.id}`}>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Apply as Volunteer
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
