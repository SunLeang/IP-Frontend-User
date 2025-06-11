"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { HeroSection } from "@/components/hero-section";
import { useAuth } from "@/context/auth-context";
import { useVolunteerDetail } from "@/hooks/useVolunteerDetail";
import { VolunteerDetailEventInfo } from "@/components/volunteer/volunteer-detail-event-info";
import { VolunteerDetailBenefits } from "@/components/volunteer/volunteer-detail-benefits";
import { VolunteerDetailRequirements } from "@/components/volunteer/volunteer-detail-requirements";
import { VolunteerDetailStatusBanners } from "@/components/volunteer/volunteer-detail-status-banners";
import { VolunteerDetailApplyButton } from "@/components/volunteer/volunteer-detail-apply-button";
import { VolunteerDetailLoading } from "@/components/volunteer/volunteer-detail-loading";
import { VolunteerDetailError } from "@/components/volunteer/volunteer-detail-error";

export default function VolunteerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = React.use(params as unknown as Promise<{ id: string }>);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  // Use custom hook for data fetching
  const { event, isLoading, error, eventEnded, volunteerStatus } =
    useVolunteerDetail(id, isAuthenticated, user);

  // Handle application logic
  const handleApply = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(`/volunteer/${id}`)}`);
      return;
    }

    // Only allow navigation if user hasn't applied and event hasn't ended
    if (!volunteerStatus.hasApplied && !eventEnded) {
      router.push(`/volunteer/apply/${id}`);
    }
  };

  // Loading state
  if (isLoading) {
    return <VolunteerDetailLoading />;
  }

  // Error state
  if (error || !event) {
    return <VolunteerDetailError error={error || "Event not found"} />;
  }

  return (
    <div className="min-h-screen bg-white pb-10">
      {/* Hero Banner */}
      <HeroSection />

      <div className="container mx-auto px-4 py-6">
        {/* Event Title */}
        <h1 className="text-2xl font-bold mb-6">{event.name}</h1>

        {/* Status Banners */}
        <VolunteerDetailStatusBanners
          eventEnded={eventEnded}
          isAuthenticated={isAuthenticated}
          volunteerStatus={volunteerStatus}
        />

        {/* Event Information */}
        <VolunteerDetailEventInfo event={event} />

        {/* Benefits Section */}
        <VolunteerDetailBenefits
          eventName={event.name}
          eventDescription={event.description}
          eventId={id}
        />

        {/* Requirements Section */}
        <VolunteerDetailRequirements />

        {/* Apply Button */}
        <VolunteerDetailApplyButton
          isAuthenticated={isAuthenticated}
          eventEnded={eventEnded}
          volunteerStatus={volunteerStatus}
          onApply={handleApply}
        />
      </div>
    </div>
  );
}
