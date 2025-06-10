/**
 * Event-related type definitions
 * Central location for all event interfaces
 */

/**
 * Event status enum
 */
export enum EventStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

/**
 * Main event interface
 */
export interface Event {
  id: string;
  name: string;
  description: string;
  profileImage?: string | null;
  coverImage?: string | null;
  dateTime: string;
  locationDesc: string;
  locationImage?: string | null;
  status: EventStatus;
  acceptingVolunteers: boolean;
  categoryId: string;
  organizerId: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    image?: string;
  };
  organizer?: {
    id: string;
    fullName: string;
  };
  _count?: {
    interestedUsers?: number;
    attendingUsers?: number;
    volunteers?: number;
  };
}

/**
 * Event card props interface
 */
export interface EventCardData {
  id: string;
  title: string;
  image: string;
  category: string;
  date: {
    month: string;
    day: string;
  };
  venue: string;
  time: string;
  price: number;
  interested: number;
}

/**
 * Comment interface for event details
 */
export interface EventComment {
  id: string;
  user: {
    name: string;
    image: string;
    time: string;
  };
  rating: number;
  text: string;
  replies?: EventComment[];
}

/**
 * Page-specific types
 */
export interface EventPageParams {
  id: string;
}

export interface EventPageProps {
  params: Promise<EventPageParams>;
}

/**
 * Events filter parameters
 */
export interface EventsFilterParams {
  categoryId?: string;
  status?: string;
  acceptingVolunteers?: boolean;
}
