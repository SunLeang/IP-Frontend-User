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
  // Return fallback for null/undefined/empty values
  if (!src || src.trim() === "" || src === "null" || src === "undefined") {
    return "/assets/constants/billboard.png";
  }

  console.log(`🔍 Processing image source: "${src}"`);

  // Handle direct MinIO URLs (full URLs)
  if (src.startsWith("http://localhost:9000/") || src.startsWith("https://")) {
    console.log(`✅ Using direct URL: ${src}`);
    return src;
  }

  // Handle MinIO bucket paths - convert to full MinIO URL
  if (src.includes("/")) {
    // Handle paths like: images/events/profiles/filename.jpg, images/general/filename.jpg
    if (src.startsWith("images/") || src.startsWith("assets/images/")) {
      const cleanPath = src.startsWith("assets/")
        ? src.replace("assets/", "")
        : src;
      const minioUrl = `http://localhost:9000/${cleanPath}`;
      console.log(`✅ Converting bucket path: ${src} -> ${minioUrl}`);
      return minioUrl;
    }

    // Handle paths like: events/profiles/filename.jpg, general/filename.jpg
    const minioUrl = `http://localhost:9000/images/${src}`;
    console.log(`✅ Converting relative path: ${src} -> ${minioUrl}`);
    return minioUrl;
  }

  // Handle just filename - assume it's in images bucket
  if (!src.includes("/") && !src.startsWith("/")) {
    const minioUrl = `http://localhost:9000/images/${src}`;
    console.log(`✅ Converting filename: ${src} -> ${minioUrl}`);
    return minioUrl;
  }

  // Handle local asset paths (keep as-is)
  if (src.startsWith("/assets/") || src.startsWith("/icons/")) {
    console.log(`✅ Using local asset: ${src}`);
    return src;
  }

  // Handle other local paths
  if (src.startsWith("/")) {
    console.log(`✅ Using local path: ${src}`);
    return src;
  }

  // Last resort - try to construct MinIO URL
  const fallbackMinioUrl = `http://localhost:9000/images/${src}`;
  console.log(`⚠️ Last resort conversion: ${src} -> ${fallbackMinioUrl}`);
  return fallbackMinioUrl;
}

/**
 *  Format event date to match EventCardData type requirements
 */
export function formatEventDateForCard(dateString: string): {
  month: string;
  day: string;
} {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return { month: "TBD", day: "00" };
    }

    return {
      month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
      day: date.toLocaleDateString("en-US", { day: "2-digit" }),
    };
  } catch (error) {
    console.error("Error formatting date for card:", error);
    return { month: "TBD", day: "00" };
  }
}

/**
 * Specific function for event profile images - Always returns absolute URLs
 */
export function getEventProfileImageSrc(
  src: string | null | undefined
): string {
  if (!src || src.trim() === "" || src === "null" || src === "undefined") {
    return "/assets/images/event-placeholder.png";
  }

  // Already absolute MinIO URL - return as is
  if (src.startsWith("http://localhost:9000/") || src.startsWith("https://")) {
    console.log("✅ Using absolute MinIO URL:", src);
    return src;
  }

  // Handle organized paths - convert to absolute URL
  if (
    src.startsWith("events/") ||
    src.startsWith("images/events/") ||
    src.startsWith("assets/images/")
  ) {
    const minioBaseUrl =
      process.env.NEXT_PUBLIC_MINIO_URL || "http://localhost:9000";
    let cleanPath = src;

    // Remove 'assets/' prefix if present
    if (cleanPath.startsWith("assets/")) {
      cleanPath = cleanPath.replace("assets/", "");
    }

    // Ensure 'images/' prefix
    if (!cleanPath.startsWith("images/")) {
      cleanPath = `images/${cleanPath}`;
    }

    const absoluteUrl = `${minioBaseUrl}/${cleanPath}`;
    console.log(
      "✅ Converting organized path to absolute:",
      src,
      "->",
      absoluteUrl
    );
    return absoluteUrl;
  }

  // Handle bare filenames - assume they are in events folder
  if (!src.includes("/") && !src.startsWith("http")) {
    const minioBaseUrl =
      process.env.NEXT_PUBLIC_MINIO_URL || "http://localhost:9000";
    const absoluteUrl = `${minioBaseUrl}/images/events/${src}`;
    console.log(
      "✅ Converting bare filename to absolute:",
      src,
      "->",
      absoluteUrl
    );
    return absoluteUrl;
  }

  // Handle relative paths starting with /
  if (src.startsWith("/") && !src.startsWith("//")) {
    console.log("✅ Using absolute path:", src);
    return src;
  }

  // Fallback to placeholder
  console.log("⚠️ Using fallback placeholder for:", src);
  return "/assets/images/event-placeholder.png";
}

/**
 * Specific function for event cover images - Always returns absolute URLs
 */
export function getEventCoverImageSrc(src: string | null | undefined): string {
  if (!src || src.trim() === "" || src === "null" || src === "undefined") {
    return "/assets/images/event-cover-placeholder.png";
  }

  // Already absolute MinIO URL - return as is
  if (src.startsWith("http://localhost:9000/") || src.startsWith("https://")) {
    console.log("✅ Using absolute MinIO cover URL:", src);
    return src;
  }

  // Handle organized paths - convert to absolute URL
  if (
    src.startsWith("events/") ||
    src.startsWith("images/events/") ||
    src.startsWith("assets/images/")
  ) {
    const minioBaseUrl =
      process.env.NEXT_PUBLIC_MINIO_URL || "http://localhost:9000";
    let cleanPath = src;

    // Remove 'assets/' prefix if present
    if (cleanPath.startsWith("assets/")) {
      cleanPath = cleanPath.replace("assets/", "");
    }

    // Ensure 'images/' prefix
    if (!cleanPath.startsWith("images/")) {
      cleanPath = `images/${cleanPath}`;
    }

    const absoluteUrl = `${minioBaseUrl}/${cleanPath}`;
    console.log(
      "✅ Converting organized cover path to absolute:",
      src,
      "->",
      absoluteUrl
    );
    return absoluteUrl;
  }

  // Handle bare filenames - assume they are in events folder
  if (!src.includes("/") && !src.startsWith("http")) {
    const minioBaseUrl =
      process.env.NEXT_PUBLIC_MINIO_URL || "http://localhost:9000";
    const absoluteUrl = `${minioBaseUrl}/images/events/${src}`;
    console.log(
      "✅ Converting bare cover filename to absolute:",
      src,
      "->",
      absoluteUrl
    );
    return absoluteUrl;
  }

  // Handle relative paths starting with /
  if (src.startsWith("/") && !src.startsWith("//")) {
    console.log("✅ Using absolute cover path:", src);
    return src;
  }

  // Fallback to placeholder
  console.log("⚠️ Using fallback cover placeholder for:", src);
  return "/assets/images/event-cover-placeholder.png";
}

/**
 * Specific function for category images - Always returns absolute URLs
 */
export function getCategoryImageSrc(src: string | null | undefined): string {
  if (!src || src.trim() === "" || src === "null" || src === "undefined") {
    return "/assets/images/default-category.png";
  }

  // Already absolute URL - return as is
  if (src.startsWith("http://localhost:9000/") || src.startsWith("https://")) {
    console.log("✅ Using absolute MinIO category URL:", src);
    return src;
  }

  // Handle category-specific paths
  if (
    src.startsWith("categories/") ||
    src.startsWith("images/categories/") ||
    src.startsWith("assets/images/")
  ) {
    const minioBaseUrl =
      process.env.NEXT_PUBLIC_MINIO_URL || "http://localhost:9000";
    let cleanPath = src;

    // Remove 'assets/' prefix if present
    if (cleanPath.startsWith("assets/")) {
      cleanPath = cleanPath.replace("assets/", "");
    }

    // Ensure 'images/' prefix
    if (!cleanPath.startsWith("images/")) {
      cleanPath = `images/${cleanPath}`;
    }

    const absoluteUrl = `${minioBaseUrl}/${cleanPath}`;
    console.log(
      "✅ Converting category path to absolute:",
      src,
      "->",
      absoluteUrl
    );
    return absoluteUrl;
  }

  // Handle bare filenames - assume they are in categories folder
  if (!src.includes("/") && !src.startsWith("http")) {
    const minioBaseUrl =
      process.env.NEXT_PUBLIC_MINIO_URL || "http://localhost:9000";
    const absoluteUrl = `${minioBaseUrl}/images/categories/${src}`;
    console.log(
      "✅ Converting bare category filename to absolute:",
      src,
      "->",
      absoluteUrl
    );
    return absoluteUrl;
  }

  // Handle relative paths starting with /
  if (src.startsWith("/") && !src.startsWith("//")) {
    console.log("✅ Using absolute category path:", src);
    return src;
  }

  // Fallback to placeholder
  console.log("⚠️ Using fallback category placeholder for:", src);
  return "/assets/images/default-category.png";
}

/**
 * Transforms an Event object to EventCardData format
 * @param event - The event object from API
 * @returns Transformed event card data
 */
export function transformEventToCardData(event: Event): EventCardData {
  const profileImage = getEventProfileImageSrc(event.profileImage);

  console.log(`🔄 TRANSFORMING EVENT: "${event.name}"`, {
    originalProfileImage: event.profileImage,
    transformedProfileImage: profileImage,
    category: event.category?.name,
  });

  return {
    id: event.id,
    title: event.name,
    image: profileImage,
    category: event.category?.name || "General",
    date: formatEventDateForCard(event.dateTime),
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
 * Format event date for display (string format)
 */
export function formatEventDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "TBD";
    }
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting event date:", error);
    return "TBD";
  }
}

/**
 * Format event time for display
 */
export function formatEventTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "TBD";
    }
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    console.error("Error formatting event time:", error);
    return "TBD";
  }
}

/**
 * Get event cover image (for detail pages)
 */
export function getEventCoverImage(event: Event): string {
  return getEventCoverImageSrc(event.coverImage);
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
  return getCategoryImageSrc(category.image);
}

/**
 * Creates query string from filter parameters
 * @param params - Filter parameters object
 * @returns Query string
 */
export function createEventQueryString(params: Record<string, string>): string {
  return params ? `?${new URLSearchParams(params).toString()}` : "";
}
