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
 * Check if an event has ended based on its date and time
 */
export function hasEventEnded(eventDateTime: string): boolean {
  const now = new Date();
  const eventDate = new Date(eventDateTime);

  // Add some debugging
  console.log("🕐 Event date check:", {
    eventDateTime,
    eventDate: eventDate.toISOString(),
    now: now.toISOString(),
    hasEnded: eventDate < now,
    timeDifference: now.getTime() - eventDate.getTime(),
    hoursDifference: (now.getTime() - eventDate.getTime()) / (1000 * 60 * 60),
  });

  return eventDate < now;
}

/**
 * Format event date for display
 */
export function formatEventDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Get time until event starts/ends
 */
export function getTimeUntilEvent(eventDateTime: string): {
  hasEnded: boolean;
  timeString: string;
  isToday: boolean;
  isTomorrow: boolean;
} {
  const now = new Date();
  const eventDate = new Date(eventDateTime);
  const diffMs = eventDate.getTime() - now.getTime();
  const hasEnded = diffMs < 0;

  const absDiffMs = Math.abs(diffMs);
  const days = Math.floor(absDiffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (absDiffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((absDiffMs % (1000 * 60 * 60)) / (1000 * 60));

  let timeString = "";
  if (days > 0) {
    timeString = `${days} day${days > 1 ? "s" : ""}`;
  } else if (hours > 0) {
    timeString = `${hours} hour${hours > 1 ? "s" : ""}`;
  } else {
    timeString = `${minutes} minute${minutes > 1 ? "s" : ""}`;
  }

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
  const eventDateStart = new Date(
    eventDate.getFullYear(),
    eventDate.getMonth(),
    eventDate.getDate()
  );

  return {
    hasEnded,
    timeString: hasEnded ? `${timeString} ago` : `in ${timeString}`,
    isToday: eventDateStart.getTime() === todayStart.getTime(),
    isTomorrow: eventDateStart.getTime() === tomorrowStart.getTime(),
  };
}

/**
 * Creates query string from filter parameters
 * @param params - Filter parameters object
 * @returns Query string
 */
export function createEventQueryString(params: Record<string, string>): string {
  return params ? `?${new URLSearchParams(params).toString()}` : "";
}
