import { useState, useEffect } from "react";
import { getCategories } from "@/services/category-service";
import { getEvents } from "@/services/event-service";
import type { Category } from "@/types/category";
import type { Event } from "@/types/event";
import { EventStatus } from "@/types/event";
import {
  getValidImageSrc,
  formatEventDateForCard,
  formatEventTime,
} from "@/utils/event-utils";

/**
 * Return type for useHome hook
 */
interface UseHomeReturn {
  categories: Array<{ id: string; title: string; img: string }>;
  popularEvents: Array<any>;
  upcomingEvents: Array<any>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Helper function to process category images from MinIO
 */
function processCategoryImage(imagePath: string | null | undefined): string {
  console.log("🏷️ Processing category image:", imagePath);

  if (
    !imagePath ||
    imagePath.trim() === "" ||
    imagePath === "null" ||
    imagePath === "undefined"
  ) {
    return "/assets/images/seminar.png"; // fallback for categories
  }

  // Handle MinIO URLs
  if (
    imagePath.startsWith("http://localhost:9000/") ||
    imagePath.startsWith("https://")
  ) {
    console.log("✅ Using direct MinIO URL:", imagePath);
    return imagePath;
  }

  // Handle MinIO bucket paths
  if (imagePath.includes("/") && imagePath.startsWith("images/")) {
    const minioUrl = `http://localhost:9000/${imagePath}`;
    console.log("✅ Constructed MinIO URL:", minioUrl);
    return minioUrl;
  }

  // Handle just filename
  if (!imagePath.includes("/")) {
    const minioUrl = `http://localhost:9000/images/${imagePath}`;
    console.log("✅ Constructed MinIO URL from filename:", minioUrl);
    return minioUrl;
  }

  // Use the main utility as fallback
  return getValidImageSrc(imagePath);
}

/**
 * Custom hook for managing home page data
 */
export function useHome(): UseHomeReturn {
  const [categories, setCategories] = useState<Category[]>([]);
  const [publishedEvents, setPublishedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        console.log("🏠 HOME: Starting data fetch...");

        // Use string value instead of enum
        const [categoriesData, eventsData] = await Promise.all([
          getCategories(),
          getEvents({ status: "PUBLISHED" as any }), // Use string instead of enum
        ]);

        console.log("🏠 HOME: Raw categories from API:", categoriesData);
        console.log("🏠 HOME: Raw events from API:", eventsData);

        // Ensure we have arrays
        const safeCategories = Array.isArray(categoriesData)
          ? categoriesData
          : [];
        const safeEvents = Array.isArray(eventsData) ? eventsData : [];

        // Log specific image data
        safeCategories.forEach((cat: Category, index: number) => {
          console.log(`🏷️ RAW CATEGORY ${index + 1}: "${cat.name}"`, {
            id: cat.id,
            image: cat.image,
            isMinIOImage: cat.image?.includes("localhost:9000"),
          });
        });

        safeEvents.forEach((event: Event, index: number) => {
          console.log(`📅 RAW EVENT ${index + 1}: "${event.name}"`, {
            id: event.id,
            profileImage: event.profileImage,
            coverImage: event.coverImage,
            isMinIOProfile: event.profileImage?.includes("localhost:9000"),
            isMinIOCover: event.coverImage?.includes("localhost:9000"),
          });
        });

        setCategories(safeCategories);
        setPublishedEvents(safeEvents);
      } catch (err) {
        console.error("❌ Error fetching home data:", err);
        setError("Failed to load data. Please try again later.");
        // Set empty arrays on error
        setCategories([]);
        setPublishedEvents([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Fallback data - only used if API returns no data
  const fallbackCategories: Category[] = [
    { id: "1", name: "Seminar", image: "/assets/images/seminar.png" },
    { id: "2", name: "Culture", image: "/assets/images/lantern.png" },
    { id: "3", name: "Festival", image: "/assets/images/balloon.png" },
    { id: "4", name: "Songkran", image: "/assets/images/songkran.png" },
  ];

  // Process data - prioritize API data
  const displayCategories =
    categories.length > 0 ? categories : fallbackCategories;
  const displayEvents = publishedEvents.length > 0 ? publishedEvents : [];

  console.log("🏠 HOME: Processing categories:", displayCategories.length);
  console.log("🏠 HOME: Processing events:", displayEvents.length);

  // Process categories with MinIO image handling
  const transformedCategories = displayCategories.map((cat) => {
    const processedImage = processCategoryImage(cat.image);
    console.log(
      `🏷️ CATEGORY: "${cat.name}" - Original: ${cat.image} -> Processed: ${processedImage}`
    );

    return {
      id: cat.id,
      title: cat.name,
      img: processedImage,
    };
  });

  // Process events with MinIO image handling
  const transformedEvents = displayEvents.map((event, index) => {
    const processedImage = getValidImageSrc(event.profileImage);
    console.log(
      `📅 EVENT ${index + 1}: "${event.name}" - Original: ${
        event.profileImage
      } -> Processed: ${processedImage}`
    );

    return {
      id: event.id,
      title: event.name,
      image: processedImage,
      category: event.category?.name || "General",
      date: formatEventDateForCard(event.dateTime),
      venue: event.locationDesc,
      time: formatEventTime(event.dateTime),
      price: 0,
      interested: event._count?.interestedUsers || 0,
    };
  });

  // Filter events by date
  const now = new Date();
  const upcomingEvents = transformedEvents.filter((event, index) => {
    const originalEvent = displayEvents[index];
    return new Date(originalEvent.dateTime) > now;
  });

  const popularEvents = [...transformedEvents].sort(
    (a, b) => b.interested - a.interested
  );

  console.log("🏠 HOME FINAL RESULTS:", {
    categoriesCount: transformedCategories.length,
    popularEventsCount: popularEvents.length,
    upcomingEventsCount: upcomingEvents.length,
    sampleCategoryImages: transformedCategories.slice(0, 3).map((c) => ({
      title: c.title,
      image: c.img,
    })),
    sampleEventImages: popularEvents.slice(0, 3).map((e) => ({
      title: e.title,
      image: e.image,
    })),
  });

  return {
    categories: transformedCategories,
    popularEvents: popularEvents.slice(0, 8),
    upcomingEvents: upcomingEvents.slice(0, 8),
    isLoading,
    error,
  };
}
