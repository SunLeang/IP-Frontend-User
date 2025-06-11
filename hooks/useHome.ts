import { useState, useEffect } from "react";
import { Category, getCategories } from "@/services/category-service";
import { Event, getEvents } from "@/services/event-service";
import { EventStatus } from "@/types/event";
import { transformEventToCardData } from "@/utils/event-utils";

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
 * Helper function to ensure image paths are valid for Next.js
 */
function normalizeImagePath(imagePath: string | null | undefined): string {
  if (
    !imagePath ||
    imagePath.trim() === "" ||
    imagePath === "null" ||
    imagePath === "undefined"
  ) {
    return ""; // Return empty string, let components handle fallback
  }

  // If it's already absolute or external, return as-is
  if (
    imagePath.startsWith("/") ||
    imagePath.startsWith("http") ||
    imagePath.startsWith("data:")
  ) {
    return imagePath;
  }

  // If it's relative, add leading slash
  return `/${imagePath}`;
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
          getEvents({ status: "PUBLISHED" }),
        ]);

        console.log("🏠 HOME: Raw categories from API:", categoriesData);
        console.log("🏠 HOME: Raw events from API:", eventsData);

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

  const fallbackEvents: Event[] = [
    {
      id: "fallback-1",
      name: "Sample Event (No Image)",
      description:
        "This is a sample event with no image - should show billboard.png",
      profileImage: null, // No image - should show fallback
      coverImage: null,
      dateTime: new Date().toISOString(),
      locationDesc: "Sample Venue",
      locationImage: null,
      status: EventStatus.PUBLISHED,
      acceptingVolunteers: true,
      categoryId: "1",
      organizerId: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: {
        id: "1",
        name: "Sample Category",
        image: null, // This should NOT affect event images
      },
      organizer: {
        id: "1",
        fullName: "Sample Organizer",
      },
      _count: {
        interestedUsers: 5,
        attendingUsers: 2,
        volunteers: 1,
      },
    },
  ];

  // Process data - prioritize API data
  const displayCategories =
    categories.length > 0 ? categories : fallbackCategories;
  const displayEvents =
    publishedEvents.length > 0 ? publishedEvents : fallbackEvents;

  console.log("🏠 HOME: Processing categories:", displayCategories.length);
  console.log("🏠 HOME: Processing events:", displayEvents.length);

  // Process categories separately from events
  const transformedCategories = displayCategories.map((cat) => {
    const normalizedImage = normalizeImagePath(cat.image);
    console.log(
      `🏷️ CATEGORY "${cat.name}": ${cat.image} -> ${normalizedImage}`
    );
    return {
      id: cat.id,
      title: cat.name,
      img: normalizedImage,
    };
  });

  // Process events independently
  const transformedEvents = displayEvents.map((event, index) => {
    console.log(
      `📋 PROCESSING EVENT ${index + 1}/${displayEvents.length}: "${
        event.name
      }"`
    );
    console.log(`📋 Event images:`, {
      profileImage: event.profileImage,
      coverImage: event.coverImage,
    });

    const transformed = transformEventToCardData(event);

    console.log(`📋 TRANSFORMED RESULT:`, {
      eventName: transformed.title,
      finalImage: transformed.image,
    });

    return transformed;
  });

  // Better date filtering
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
    sampleEventImages: popularEvents
      .slice(0, 3)
      .map((e) => ({ title: e.title, image: e.image })),
  });

  return {
    categories: transformedCategories,
    popularEvents: popularEvents.slice(0, 8),
    upcomingEvents: upcomingEvents.slice(0, 8),
    isLoading,
    error,
  };
}
