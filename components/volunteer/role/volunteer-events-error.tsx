import { Button } from "@/components/ui/button";

interface VolunteerEventsErrorProps {
  error: string;
  onRetry: () => void;
}

export function VolunteerEventsError({
  error,
  onRetry,
}: VolunteerEventsErrorProps) {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Your Volunteer Events</h1>
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={onRetry}>Try Again</Button>
      </div>
    </div>
  );
}
