import { VolunteerEvent } from "@/services/volunteer-service";
import { VolunteerEventCard } from "./volunteer-event-card";

interface VolunteerEventsGridProps {
  events: VolunteerEvent[];
}

export function VolunteerEventsGrid({ events }: VolunteerEventsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <VolunteerEventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
