import { EventCard } from "@/components/events/event-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Event } from "@/types/event";
import { transformEventToCardData } from "@/utils/event-utils";

/**
 * Props for EventsGrid component
 */
interface EventsGridProps {
  events: Event[];
  isLoading: boolean;
}

/**
 * Events Grid Component
 * Displays a grid of event cards with loading states
 */
export function EventsGrid({ events, isLoading }: EventsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {isLoading ? (
        // Loading skeletons
        Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <Skeleton className="w-full h-48" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))
      ) : events.length === 0 ? (
        // No events state
        <div className="col-span-full text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
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
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No events found
            </h3>
            <p className="text-gray-600">
              There are currently no events available. Check back later for new
              events!
            </p>
          </div>
        </div>
      ) : (
        // Events grid
        events.map((event) => (
          <EventCard key={event.id} {...transformEventToCardData(event)} />
        ))
      )}
    </div>
  );
}
