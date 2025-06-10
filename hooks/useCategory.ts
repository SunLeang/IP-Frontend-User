import { useState, useEffect } from "react";
import { Category, CategoryEvent } from "@/types/category";
import { getCategoryWithEvents } from "@/services/category-service";

/**
 * Return type for useCategory hook
 */
interface UseCategoryReturn {
  category: Category | null;
  events: CategoryEvent[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook for managing category data and events
 * Handles loading states, error handling, and data fetching
 *
 * @param categoryId - The ID of the category to fetch
 * @returns Object containing category data, events, loading state, and error state
 */
export function useCategory(categoryId: string): UseCategoryReturn {
  const [category, setCategory] = useState<Category | null>(null);
  const [events, setEvents] = useState<CategoryEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches category and events data
   */
  const fetchCategoryData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log(`Fetching data for category: ${categoryId}`);

      const { category: categoryData, events: eventsData } =
        await getCategoryWithEvents(categoryId);

      if (!categoryData) {
        throw new Error("Category not found");
      }

      setCategory(categoryData);
      setEvents(eventsData);

      console.log(
        `Successfully loaded category: ${categoryData.name} with ${eventsData.length} events`
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load category data";
      console.error("Error in useCategory:", err);
      setError(errorMessage);
      setCategory(null);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refetch function to manually trigger data reload
   */
  const refetch = () => {
    fetchCategoryData();
  };

  // Fetch data when component mounts or categoryId changes
  useEffect(() => {
    if (categoryId) {
      fetchCategoryData();
    }
  }, [categoryId]);

  return {
    category,
    events,
    isLoading,
    error,
    refetch,
  };
}
