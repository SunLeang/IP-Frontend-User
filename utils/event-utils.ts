import { Event, EventCardData } from "@/types/event";
import { getValidImageSrc } from "@/lib/image-utils";

/**
 * Event utility functions
 * Helper functions for event data transformation and formatting
 */

/**
 * Transforms an Event object to EventCardData format
 * @param event - The event object from API
 * @returns Transformed event card data
 */
export function transformEventToCardData(event: Event): EventCardData {
  const eventDate = new Date(event.dateTime);

  return {
    id: event.id,
    title: event.name,
    image: getValidImageSrc(event.profileImage || event.coverImage),
    category: event.category?.name || "Uncategorized",
    date: {
      month: eventDate
        .toLocaleString("en-US", { month: "short" })
        .toUpperCase(),
      day: eventDate.getDate().toString(),
    },
    venue: event.locationDesc,
    time: eventDate.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }),
    price: 0, // 0 by default
    interested: event._count?.interestedUsers || 0,
  };
}

/**
 * Formats event date for display
 * @param dateTime - Event date time string
 * @returns Formatted date object
 */
export function formatEventDate(dateTime: string) {
  const date = new Date(dateTime);

  return {
    full: date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }),
    month: date.toLocaleString("en-US", { month: "short" }).toUpperCase(),
    day: date.getDate().toString(),
  };
}

/**
 * Checks if an event has ended
 * @param dateTime - Event date time string
 * @returns True if event has ended
 */
export function hasEventEnded(dateTime: string): boolean {
  return new Date(dateTime) < new Date();
}

/**
 * Creates query string from filter parameters
 * @param params - Filter parameters object
 * @returns Query string
 */
export function createEventQueryString(params: Record<string, string>): string {
  return params ? `?${new URLSearchParams(params).toString()}` : "";
}
