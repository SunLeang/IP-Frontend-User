"use client";

import { HeroSection } from "@/components/hero-section";
import { VolunteerGrid } from "@/components/volunteer/volunteer-grid";
import { VolunteerPagination } from "@/components/volunteer/volunteer-pagination";
import { useVolunteerOpportunities } from "@/hooks/useVolunteerOpportunities";
import { Heart, Users, Star } from "lucide-react";

export default function VolunteerPage() {
  // Use custom hook for data fetching
  const { opportunities, isLoading, error } = useVolunteerOpportunities();

  return (
    <div className="min-h-screen bg-white pb-10">
      <HeroSection />

      {/* header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center mb-4">
            <Heart className="h-8 w-8 text-red-500 mr-3" />
            <Users className="h-8 w-8 text-blue-500 mr-3" />
            <Star className="h-8 w-8 text-yellow-500" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Come Join Us With Many
          </h2>
          <h3 className="text-2xl md:text-3xl font-semibold text-blue-600 mb-6">
            Volunteering Opportunities
          </h3>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Make a difference in your community by volunteering for meaningful
            events. Connect with like-minded people and create lasting impact
            together.
          </p>

          {/* Decorative elements */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            <div className="w-12 h-1 bg-blue-500 rounded-full"></div>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <div className="w-12 h-1 bg-blue-500 rounded-full"></div>
          </div>
        </div>
      </div>

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
