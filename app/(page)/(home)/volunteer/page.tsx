"use client";

import { HeroSection } from "@/components/hero-section";
import { VolunteerFilters } from "@/components/volunteer/volunteer-filters";
import { VolunteerGrid } from "@/components/volunteer/volunteer-grid";
import { VolunteerPagination } from "@/components/volunteer/volunteer-pagination";
import { useVolunteerOpportunities } from "@/hooks/useVolunteerOpportunities";

export default function VolunteerPage() {
  // Use custom hook for data fetching
  const { opportunities, isLoading, error } = useVolunteerOpportunities();

  return (
    <div className="min-h-screen bg-white pb-10">
      <HeroSection />
      <VolunteerFilters />

      <div className="container mx-auto px-4 py-6">
        <VolunteerGrid
          opportunities={opportunities}
          isLoading={isLoading}
          error={error}
        />
      </div>

      <VolunteerPagination />
    </div>
  );
}
