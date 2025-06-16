"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getCategories } from "@/services/category-service";
import { Category } from "@/types/category";
import { useEvents } from "@/hooks/useEvents";
import { EventsFilter } from "@/components/events/events-filter";
import { EventsGrid } from "@/components/events/events-grid";

/**
 * Events Page Component
 * Displays a filterable list of events with category filters
 *
 * Features:
 * - Category-based filtering
 * - Loading states
 * - Responsive grid layout
 * - URL parameter support
 */
export default function EventsPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categoryId
  );
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Use the custom hook for events data
  const {
    events,
    isLoading: eventsLoading,
    error,
  } = useEvents(
    selectedCategory
      ? { categoryId: selectedCategory, status: "PUBLISHED" }
      : { status: "PUBLISHED" }
  );

  // Fetch categories on component mount
  useEffect(() => {
    async function fetchCategories() {
      setCategoriesLoading(true);
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    }

    fetchCategories();
  }, []);

  /**
   * Handles category filter change
   */
  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="container mx-auto py-8 px-4">
        {/* Page Title */}
        <h1 className="text-3xl font-bold mb-6">Events</h1>

        {/* Category Filters */}
        <EventsFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          isLoading={categoriesLoading}
        />

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md mb-6 shadow-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Events Grid */}
        <EventsGrid events={events} isLoading={eventsLoading} />
      </div>
    </div>
  );
}
