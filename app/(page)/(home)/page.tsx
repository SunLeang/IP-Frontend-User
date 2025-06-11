"use client";

import { HeroSection } from "@/components/hero-section";
import { CategorySection } from "@/components/home/category-section";
import { EventsSection } from "@/components/home/events-section";
import { useHome } from "@/hooks/useHome";

/**
 * Home Page Component
 * Displays the main landing page with hero section, categories, and events
 */
export default function Home() {
  const { 
    categories, 
    popularEvents, 
    upcomingEvents, 
    isLoading, 
    error 
  } = useHome();

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-gray-900">
      <HeroSection />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-auto my-4 max-w-4xl">
          <p>{error}</p>
        </div>
      )}

      <CategorySection
        categories={categories}
        isLoading={isLoading}
      />

      <EventsSection
        title="Popular Events"
        events={popularEvents}
        isLoading={isLoading}
      />

      <EventsSection
        title="Upcoming Events"
        events={upcomingEvents}
        isLoading={isLoading}
      />
    </main>
  );
}