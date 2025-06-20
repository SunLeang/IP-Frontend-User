import { apiGet } from "./api";

export interface Category {
  id: string;
  name: string;
  image?: string;
}

export interface CategoryEvent {
  id: string;
  name: string;
  description: string;
  profileImage?: string;
  dateTime: string;
  locationDesc: string;
  status: string;
  _count?: {
    interestedUsers?: number;
    attendingUsers?: number;
  };
}

/**
 * Fetches all categories for general use (filtering, navigation, etc.)
 * @returns Promise resolving to array of categories
 */
export async function getCategories(): Promise<Category[]> {
  try {
    console.log("📡 Fetching all categories...");
    const response = await apiGet("/api/event-categories");
    const categories = Array.isArray(response)
      ? response
      : response?.data || [];

    // Enhanced logging for MinIO category images
    console.log("📊 CATEGORIES API RESPONSE:", {
      totalCategories: categories.length,
      hasData: !!response.data,
      isArray: Array.isArray(categories),
    });

    categories.forEach((category: Category, index: number) => {
      console.log(`🏷️ CATEGORY ${index + 1}: "${category.name}"`, {
        id: category.id,
        image: category.image,
        isMinIOImage: category.image?.includes("localhost:9000"),
      });
    });

    return categories;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

/**
 * Fetches a specific category with its events
 * @param categoryId - The ID of the category to fetch
 * @returns Promise resolving to category with events
 */
export async function getCategoryWithEvents(categoryId: string): Promise<{
  category: Category | null;
  events: CategoryEvent[];
}> {
  try {
    console.log(`📡 Fetching category with events: ${categoryId}`);

    const response = await apiGet(`/api/event-categories/${categoryId}/events`);

    const category = response.category || null;
    const events = response.events || [];

    if (category) {
      console.log(`🏷️ CATEGORY WITH EVENTS: "${category.name}"`, {
        id: category.id,
        image: category.image,
        eventsCount: events.length,
        isMinIOImage: category.image?.includes("localhost:9000"),
      });

      events.forEach((event: CategoryEvent, index: number) => {
        console.log(`📅 CATEGORY EVENT ${index + 1}: "${event.name}"`, {
          id: event.id,
          profileImage: event.profileImage,
          isMinIOProfile: event.profileImage?.includes("localhost:9000"),
        });
      });
    }

    return { category, events };
  } catch (error) {
    console.error(`Failed to fetch category ${categoryId} with events:`, error);
    return { category: null, events: [] };
  }
}
