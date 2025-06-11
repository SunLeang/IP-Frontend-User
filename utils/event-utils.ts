import { Event, EventCardData, EventStatus } from "@/types/event";

/**
 * Event utility functions
 * Helper functions for event data transformation and formatting
 */

/**
 * Gets a valid image source, with fallback only when truly needed
 * @param src - Image source URL from API
 * @returns Valid image URL or fallback only if src is null/undefined/empty
 */
export function getValidImageSrc(src: string | null | undefined): string {
  // Be very specific about what constitutes an invalid image
  if (
    src === null ||
    src === undefined ||
    src === "" ||
    src === "null" ||
    src === "undefined"
  ) {
    console.log("No valid image source, using fallback for:", src);
    return "/assets/constants/billboard.png";
  }

  // Handle relative paths without leading slash
  if (src && !src.startsWith("/") && !src.startsWith("http")) {
    console.log(`Fixing relative path: ${src} -> /${src}`);
    return `/${src}`;
  }

  // If we have any other value, use it (let the browser handle invalid URLs)
  console.log("Using API image source:", src);
  return src;
}

/**
 * Transforms an Event object to EventCardData format
 * @param event - The event object from API
 * @returns Transformed event card data
 */
export function transformEventToCardData(event: Event): EventCardData {
  const eventDate = new Date(event.dateTime);

  const imageSource = event.profileImage || event.coverImage;
  console.log(`Transforming event "${event.name}":`, {
    profileImage: event.profileImage,
    coverImage: event.coverImage,
    selectedSource: imageSource,
    finalImage: getValidImageSrc(imageSource),
  });

  return {
    id: event.id,
    title: event.name,
    image: getValidImageSrc(imageSource),
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
    price: 0,
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
