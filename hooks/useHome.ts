import { useState, useEffect } from "react";
import { Category, getCategories } from "@/services/category-service";
import { Event, getEvents } from "@/services/event-service";
import { EventStatus } from "@/types/event";
import {
  transformEventToCardData,
  getValidImageSrc,
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
  if (
    !imagePath ||
    imagePath.trim() === "" ||
    imagePath === "null" ||
    imagePath === "undefined"
  ) {
    console.log("No category image, using fallback");
    return "/assets/images/default-category.png";
  }

  // Handle MinIO URLs
  if (
    imagePath.startsWith("http://localhost:9000/") ||
    imagePath.startsWith("https://")
  ) {
    console.log("Using MinIO category image:", imagePath);
    return imagePath;
  }

  // Handle other cases
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
        const [categoriesData, eventsData] = await Promise.all([
          getCategories(),
          getEvents({ status: EventStatus.PUBLISHED }),
        ]);

        console.log("🏠 HOME: Raw categories from API:", categoriesData);
        console.log("🏠 HOME: Raw events from API:", eventsData);

        // Log specific image data
        categoriesData.forEach((cat: Category, index: number) => {
          console.log(
            `🏷️ Category ${index}: ${cat.name} - Image: ${cat.image}`
          );
        });

        eventsData.forEach((event: Event, index: number) => {
          console.log(`📅 Event ${index}: ${event.name} - Images:`, {
            profile: event.profileImage,
            cover: event.coverImage,
            location: event.locationImage,
          });
        });

        setCategories(categoriesData);
        setPublishedEvents(Array.isArray(eventsData) ? eventsData : []);
      } catch (err) {
        console.error("Error fetching home data:", err);
        setError("Failed to load data. Please try again later.");
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
    console.log(`🏷️ CATEGORY "${cat.name}": ${cat.image} -> ${processedImage}`);

    return {
      id: cat.id,
      title: cat.name,
      img: processedImage,
    };
  });

  // Process events with MinIO image handling
  const transformedEvents = displayEvents.map((event, index) => {
    console.log(
      `📋 PROCESSING EVENT ${index + 1}/${displayEvents.length}: "${
        event.name
      }"`
    );
    console.log(`📋 Event images:`, {
      profileImage: event.profileImage,
      coverImage: event.coverImage,
      locationImage: event.locationImage,
    });

    const transformed = transformEventToCardData(event);

    console.log(`📋 TRANSFORMED RESULT:`, {
      eventName: transformed.title,
      finalImage: transformed.image,
    });

    return transformed;
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
