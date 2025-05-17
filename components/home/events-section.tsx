import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/home/event-card";
import { Skeleton } from "@/components/ui/skeleton";

interface Event {
  id: string;
  title: string;
  img: string;
  category: string;
  date: {
    month: string;
    day: string;
  };
  venue: string;
  time: string;
  price: number;
  interested: number;
}

interface EventsSectionProps {
  title: string;
  events: Event[];
  isLoading?: boolean;
}

export function EventsSection({
  title,
  events,
  isLoading = false,
}: EventsSectionProps) {
  return (
    <section className="py-12 px-6 bg-white">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">{title}</h2>
          <Link href="/events">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        {isLoading ? (
          // Loading skeletons
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
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
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No events found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                image={
                  event.img.startsWith("http")
                    ? event.img
                    : event.img.startsWith("/")
                    ? event.img
                    : `/assets/images/${event.img}`
                }
                category={event.category}
                date={event.date}
                venue={event.venue}
                time={event.time}
                price={event.price}
                interested={event.interested}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
