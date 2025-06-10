import { EventCard } from "@/components/home/event-card";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryEvent } from "@/types/category";

/**
 * Props for CategoryEventsGrid component
 */
interface CategoryEventsGridProps {
  events: CategoryEvent[];
  isLoading: boolean;
  categoryName: string;
}

/**
 * Category Events Grid Component
 * Displays a grid of events for a specific category with loading states
 */
export function CategoryEventsGrid({
  events,
  isLoading,
  categoryName,
}: CategoryEventsGridProps) {
  /**
   * Transforms backend event data to format expected by EventCard component
   */
  const transformEventData = (event: CategoryEvent) => {
    const eventDate = new Date(event.dateTime);

    return {
      id: event.id,
      title: event.name,
      image: event.profileImage || event.coverImage || "",
      category: event.category?.name || categoryName,
      date: {
        month: eventDate
          .toLocaleString("en-US", { month: "short" })
          .toUpperCase(),
        day: eventDate.getDate().toString(),
      },
      venue: event.locationDesc,
      time: eventDate.toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      price: 0, // free by default, can be updated later
      interested: event._count?.interestedUsers || 0,
    };
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {categoryName} Events
          </h2>
          <p className="text-gray-600">
            {isLoading
              ? "Loading events..."
              : `${events.length} ${
                  events.length === 1 ? "event" : "events"
                } found`}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <Skeleton className="w-full h-48" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Events State */}
        {!isLoading && events.length === 0 && (
          <div className="text-center py-16">
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
              <p className="text-gray-600 mb-6">
                There are currently no {categoryName.toLowerCase()} events
                available. Check back later for new events!
              </p>
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Browse Other Categories
              </button>
            </div>
          </div>
        )}

        {/* Events Grid */}
        {!isLoading && events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} {...transformEventData(event)} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
