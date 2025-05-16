"use client"

import { useEffect, useState } from "react"
import { HeroSection } from "@/components/hero-section"
import { CategorySection } from "@/components/home/category-section"
import { EventsSection } from "@/components/home/events-section"
import { getCategories, type Category } from "@/services/category-service"
import { getPopularEvents, getOnlineEvents, type Event } from "@/services/event-service"

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([])
  const [popularEvents, setPopularEvents] = useState<Event[]>([])
  const [onlineEvents, setOnlineEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const [categoriesData, popularEventsData, onlineEventsData] = await Promise.all([
          getCategories(),
          getPopularEvents(),
          getOnlineEvents(),
        ])

        setCategories(categoriesData)
        setPopularEvents(popularEventsData)
        setOnlineEvents(onlineEventsData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Fallback data in case API fails or returns empty
  const fallbackCategories = [
    { id: "1", name: "Seminar", image: "seminar.png" },
    { id: "2", name: "Culture", image: "lantern.png" },
    { id: "3", name: "Festival", image: "balloon.png" },
    { id: "4", name: "Songkran", image: "songkran.png" },
  ]

  const fallbackEvents = [
    {
      id: "1",
      name: "Event New Year Celebration",
      profileImage: "new-year.png",
      dateTime: new Date().toISOString(),
      locationDesc: "Venue",
      status: "PUBLISHED" as const,
      acceptingVolunteers: true,
      categoryId: "1",
      organizerId: "1",
      description: "A great event",
      category: { id: "1", name: "Entertainment" },
      interestedCount: 10,
    },
    {
      id: "2",
      name: "Event Booking and Explore",
      profileImage: "eventx.png",
      dateTime: new Date().toISOString(),
      locationDesc: "Venue",
      status: "PUBLISHED" as const,
      acceptingVolunteers: true,
      categoryId: "2",
      organizerId: "1",
      description: "A great event",
      category: { id: "2", name: "Educational & Business" },
      interestedCount: 10,
    },
    {
      id: "3",
      name: "Event Summer Festival",
      profileImage: "summer.png",
      dateTime: new Date().toISOString(),
      locationDesc: "Venue",
      status: "PUBLISHED" as const,
      acceptingVolunteers: true,
      categoryId: "1",
      organizerId: "1",
      description: "A great event",
      category: { id: "1", name: "Entertainment" },
      interestedCount: 10,
    },
    {
      id: "4",
      name: "Event Prom Night",
      profileImage: "prom.png",
      dateTime: new Date().toISOString(),
      locationDesc: "Venue",
      status: "PUBLISHED" as const,
      acceptingVolunteers: true,
      categoryId: "1",
      organizerId: "1",
      description: "A great event",
      category: { id: "1", name: "Entertainment" },
      interestedCount: 10,
    },
  ]

  // Use API data if available, otherwise use fallback data
  const displayCategories = categories.length > 0 ? categories : fallbackCategories
  const displayPopularEvents = popularEvents.length > 0 ? popularEvents : fallbackEvents
  const displayOnlineEvents = onlineEvents.length > 0 ? onlineEvents : fallbackEvents

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-gray-900">
      <HeroSection />
      <CategorySection
        categories={displayCategories.map((cat) => ({
          id: cat.id,
          title: cat.name,
          img: cat.image || `${cat.name.toLowerCase()}.png`,
        }))}
      />
      <EventsSection
        title="Popular Events in Phnom Penh"
        events={displayPopularEvents.map((event) => ({
          id: event.id,
          title: event.name,
          img: event.profileImage || "event-placeholder.png",
          date: {
            month: new Date(event.dateTime).toLocaleString("en-US", { month: "short" }).toUpperCase(),
            day: new Date(event.dateTime).getDate().toString(),
          },
          venue: event.locationDesc,
          time: new Date(event.dateTime).toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
          price: 4.99, // This should come from the API
          interested: event.interestedCount || 0,
          category: event.category?.name || "Uncategorized",
        }))}
        isLoading={isLoading}
      />
      <EventsSection
        title="Discover Best Online Events"
        events={displayOnlineEvents.map((event) => ({
          id: event.id,
          title: event.name,
          img: event.profileImage || "event-placeholder.png",
          date: {
            month: new Date(event.dateTime).toLocaleString("en-US", { month: "short" }).toUpperCase(),
            day: new Date(event.dateTime).getDate().toString(),
          },
          venue: event.locationDesc,
          time: new Date(event.dateTime).toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
          price: 4.99, // This should come from the API
          interested: event.interestedCount || 0,
          category: event.category?.name || "Uncategorized",
        }))}
        isLoading={isLoading}
      />
    </main>
  )
}
