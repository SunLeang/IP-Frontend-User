"use client";

import { useEffect, useState } from "react";
import { HeroSection } from "@/components/hero-section";
import { CategorySection } from "@/components/home/category-section";
import { EventsSection } from "@/components/home/events-section";
import { getCategories, type Category } from "@/services/category-service";
import { getEvents, type Event } from "@/services/event-service";
import { getValidImageSrc } from "@/lib/image-utils";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [publishedEvents, setPublishedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);

        const eventsData = await getEvents({ status: "PUBLISHED" });
        setPublishedEvents(Array.isArray(eventsData) ? eventsData : []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const fallbackCategories = [
    { id: "1", name: "Seminar", image: "/assets/images/seminar.png" },
    { id: "2", name: "Culture", image: "/assets/images/lantern.png" },
    { id: "3", name: "Festival", image: "/assets/images/balloon.png" },
    { id: "4", name: "Songkran", image: "/assets/images/songkran.png" },
  ];

  const fallbackEvents = [
    {
      id: "1",
      name: "Event New Year Celebration",
      profileImage: "/assets/constants/billboard.png", // Use fallback image
      dateTime: new Date().toISOString(),
      locationDesc: "Venue",
      status: "PUBLISHED" as const,
      acceptingVolunteers: true,
      categoryId: "1",
      organizerId: "1",
      description: "A great event",
      category: { id: "1", name: "Entertainment" },
      _count: { interestedUsers: 10 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const displayCategories =
    categories.length > 0 ? categories : fallbackCategories;
  const displayEvents =
    publishedEvents.length > 0 ? publishedEvents : fallbackEvents;

  const transformedEvents = displayEvents.map((event) => {
    return {
      id: event.id,
      title: event.name,
      img: getValidImageSrc(event.profileImage), // This will handle external URLs safely
      date: {
        month: new Date(event.dateTime)
          .toLocaleString("en-US", { month: "short" })
          .toUpperCase(),
        day: new Date(event.dateTime).getDate().toString(),
      },
      venue: event.locationDesc,
      time: new Date(event.dateTime).toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
      price: 0,
      interested: event._count?.interestedUsers || 0,
      category: event.category?.name || "Uncategorized",
    };
  });

  const upcomingEvents = transformedEvents.filter(
    (event) => new Date(event.date.month + " " + event.date.day) > new Date()
  );
  const popularEvents = [...transformedEvents].sort(
    (a, b) => b.interested - a.interested
  );

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-gray-900">
      <HeroSection />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-auto my-4 max-w-4xl">
          <p>{error}</p>
        </div>
      )}

      <CategorySection
        categories={displayCategories.map((cat) => ({
          id: cat.id,
          title: cat.name,
          img: cat.image || `/assets/constants/billboard.png`,
        }))}
        isLoading={isLoading}
      />

      <EventsSection
        title="Popular Events"
        events={popularEvents.slice(0, 8)}
        isLoading={isLoading}
      />

      <EventsSection
        title="Upcoming Events"
        events={upcomingEvents.slice(0, 8)}
        isLoading={isLoading}
      />
    </main>
  );
}
