import { apiGet } from "./api";
import {
  Category,
  CategoryEvent,
  CategoryWithEventsResponse,
} from "@/types/category";

/**
 * Category Service
 * Handles all category-related API operations
 */

/**
 * Fetches all categories for general use (filtering, navigation, etc.)
 * @returns Promise resolving to array of categories
 */
export async function getCategories(): Promise<Category[]> {
  try {
    console.log("Fetching all categories...");
    const response = await apiGet("/api/event-categories");
    return Array.isArray(response) ? response : response?.data || [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

/**
 * Fetches a single category by ID
 * @param id - Category ID to fetch
 * @returns Promise resolving to category data or null if not found
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    console.log(`Fetching category with ID: ${id}`);
    const response = await apiGet(`/api/event-categories/${id}`);
    return response;
  } catch (error) {
    console.error(`Failed to fetch category with id ${id}:`, error);
    return null;
  }
}

/**
 * Fetches all events belonging to a specific category
 * @param categoryId - The ID of the category
 * @returns Promise resolving to array of events
 */
export async function getEventsByCategory(
  categoryId: string
): Promise<CategoryEvent[]> {
  try {
    console.log(`Fetching events for category: ${categoryId}`);
    const response = await apiGet(
      `/api/events?categoryId=${categoryId}&status=PUBLISHED`
    );

    // Handle different response structures
    if (Array.isArray(response)) {
      return response;
    } else if (response?.data && Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  } catch (error) {
    console.error(`Failed to fetch events for category ${categoryId}:`, error);
    return [];
  }
}

/**
 * Fetches category and its events in parallel for better performance
 * Used primarily by category detail pages
 * @param categoryId - The ID of the category
 * @returns Promise resolving to object containing category and events
 */
export async function getCategoryWithEvents(
  categoryId: string
): Promise<CategoryWithEventsResponse> {
  try {
    console.log(`Fetching category ${categoryId} with events...`);

    // Fetch category and events in parallel for better performance
    const [category, events] = await Promise.all([
      getCategoryById(categoryId),
      getEventsByCategory(categoryId),
    ]);

    return { category, events };
  } catch (error) {
    console.error(
      `Failed to fetch category and events for ${categoryId}:`,
      error
    );
    return { category: null, events: [] };
  }
}
