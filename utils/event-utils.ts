import { Event, EventCardData, EventStatus } from "@/types/event";

/**
 * Event utility functions
 * Helper functions for event data transformation and formatting
 */

/**
 * Gets a valid image source from MinIO or fallback
 * @param src - Image source URL from API (should be MinIO URL)
 * @returns Valid image URL or fallback
 */
export function getValidImageSrc(src: string | null | undefined): string {
  // Check if we have a valid MinIO URL
  if (
    src &&
    (src.startsWith("http://localhost:9000/") || src.startsWith("https://"))
  ) {
    console.log("Using MinIO image source:", src);
    return src;
  }

  // Check if it's a relative MinIO path that needs base URL
  if (src && (src.startsWith("images/") || src.startsWith("thumbnails/"))) {
    const minioBaseUrl =
      process.env.NEXT_PUBLIC_MINIO_URL || "http://localhost:9000";
    const fullUrl = `${minioBaseUrl}/${src}`;
    console.log("Converting relative MinIO path:", src, "->", fullUrl);
    return fullUrl;
  }

  // For any other valid-looking paths
  if (src && src.trim() !== "" && src !== "null" && src !== "undefined") {
    // Handle other absolute paths
    if (src.startsWith("/") || src.startsWith("http")) {
      console.log("Using provided image source:", src);
      return src;
    }

    // Handle relative paths
    console.log(`Converting relative path: ${src} -> /${src}`);
    return `/${src}`;
  }

  // Only use fallback when absolutely necessary
  console.log("No valid image source, using fallback for:", src);
  return "/assets/constants/billboard.png";
}

/**
 * ✅ FIXED: Format event date to match EventCardData type
 */
export function formatEventDateForCard(dateString: string): {
  month: string;
  day: string;
} {
  try {
    const date = new Date(dateString);
    return {
      month: date.toLocaleDateString("en-US", { month: "short" }),
      day: date.toLocaleDateString("en-US", { day: "2-digit" }),
    };
  } catch {
    return { month: "TBD", day: "00" };
  }
}

/**
 * Transforms an Event object to EventCardData format
 * @param event - The event object from API
 * @returns Transformed event card data
 */
export function transformEventToCardData(event: Event): EventCardData {
  return {
    id: event.id,
    title: event.name,
    image: getValidImageSrc(event.profileImage), // Use MinIO profile image
    category: event.category?.name || "General",
    date: formatEventDateForCard(event.dateTime), // ✅ FIXED: Use proper date format
    venue: event.locationDesc,
    time: formatEventTime(event.dateTime),
    interested: event._count?.interestedUsers || 0,
    attending: event._count?.attendingUsers || 0,
  };
}

/**
 * Check if an event has ended based on its date and time
 */
export function hasEventEnded(eventDateTime: string): boolean {
  return new Date(eventDateTime) < new Date();
}

/**
 * ✅ RENAMED: Format event date for display (string format)
 */
export function formatEventDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    });
  } catch {
    return "TBD";
  }
}

/**
 * Format event time for display
 */
export function formatEventTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "TBD";
  }
}

/**
 * Get event cover image (for detail pages)
 */
export function getEventCoverImage(event: Event): string {
  return getValidImageSrc(event.coverImage);
}

/**
 * Get event location image
 */
export function getEventLocationImage(event: Event): string {
  return getValidImageSrc(event.locationImage);
}

/**
 * Get category image
 */
export function getCategoryImage(category: { image?: string }): string {
  return getValidImageSrc(category.image);
}

/**
 * Creates query string from filter parameters
 * @param params - Filter parameters object
 * @returns Query string
 */
export function createEventQueryString(params: Record<string, string>): string {
  return params ? `?${new URLSearchParams(params).toString()}` : "";
}
