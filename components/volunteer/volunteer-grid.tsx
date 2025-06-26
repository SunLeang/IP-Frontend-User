"use client";

import { VolunteerCard } from "./volunteer-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getValidImageSrc } from "@/utils/event-utils";

interface VolunteerOpportunity {
  id: string;
  title: string;
  image: string;
  category: string;
  date: { month: string; day: string };
  venue: string;
  time: string;
  applicants: number;
  description: string;
}

interface VolunteerGridProps {
  opportunities: VolunteerOpportunity[];
  isLoading: boolean;
  error?: string | null;
}

export function VolunteerGrid({
  opportunities,
  isLoading,
  error,
}: VolunteerGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg overflow-hidden shadow-sm"
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
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No volunteer opportunities found
          </h3>
          <p className="text-gray-600">
            Check back later for new volunteer opportunities!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {opportunities.map((opportunity) => {
        // Process the image URL one more time to ensure it's correct
        const finalImage = getValidImageSrc(opportunity.image);

        console.log(`🎯 VOLUNTEER GRID FINAL: "${opportunity.title}"`, {
          originalFromHook: opportunity.image,
          finalProcessed: finalImage,
          shouldBeMinIO: finalImage.includes("localhost:9000"),
        });

        return (
          <VolunteerCard
            key={opportunity.id}
            id={opportunity.id}
            title={opportunity.title}
            image={finalImage}
            category={opportunity.category}
            date={opportunity.date}
            venue={opportunity.venue}
            time={opportunity.time}
            applicants={opportunity.applicants}
            description={opportunity.description}
          />
        );
      })}
    </div>
  );
}
