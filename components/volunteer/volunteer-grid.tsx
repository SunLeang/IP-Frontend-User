import { VolunteerCard, VolunteerOpportunity } from "./volunteer-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface VolunteerGridProps {
  opportunities: VolunteerOpportunity[];
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
}

export function VolunteerGrid({
  opportunities,
  isLoading,
  error,
  onRetry,
}: VolunteerGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
          >
            <Skeleton className="w-full h-48" />
            <div className="p-4">
              <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-10" />
                <Skeleton className="h-6 w-40" />
              </div>
              <Skeleton className="h-20 w-full mt-4" />
              <Skeleton className="h-6 w-1/2 mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={onRetry || (() => window.location.reload())}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {opportunities.map((opportunity) => (
        <VolunteerCard key={opportunity.id} opportunity={opportunity} />
      ))}
    </div>
  );
}
