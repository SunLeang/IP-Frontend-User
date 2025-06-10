/**
 * Category-related type definitions
 * Central location for all category and event interfaces
 */

/**
 * Basic category information
 */
export interface Category {
  id: string;
  name: string;
  image?: string | null;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Event interface for category-related operations
 * Extended with category-specific fields and counts
 */
export interface CategoryEvent {
  id: string;
  name: string;
  description: string;
  profileImage?: string | null;
  coverImage?: string | null;
  dateTime: string;
  locationDesc: string;
  status: string;
  acceptingVolunteers: boolean;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  _count?: {
    interestedUsers?: number;
    attendingUsers?: number;
    volunteers?: number;
  };
}

/**
 * Page-specific types for category detail page
 */
export interface CategoryPageParams {
  id: string;
}

export interface CategoryPageProps {
  params: Promise<CategoryPageParams>;
}

/**
 * Response type for category with events API call
 */
export interface CategoryWithEventsResponse {
  category: Category | null;
  events: CategoryEvent[];
}
