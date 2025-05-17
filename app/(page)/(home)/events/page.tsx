"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { getEvents, type Event } from "@/services/event-service"
import { getCategories, type Category } from "@/services/category-service"
import { EventCard } from "@/components/events/event-card"
import { Skeleton } from "@/components/ui/skeleton"

export default function EventsPage() {
  const searchParams = useSearchParams()
  const categoryId = searchParams.get("category")

  const [events, setEvents] = useState<Event[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryId)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const [eventsData, categoriesData] = await Promise.all([
          getEvents(selectedCategory ? { categoryId: selectedCategory, status: "PUBLISHED" } : { status: "PUBLISHED" }),
          getCategories(),
        ])
        setEvents(eventsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [selectedCategory])

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Events</h1>

      {/* Category filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryChange(null)}
          className={`px-4 py-2 rounded-full text-sm ${
            selectedCategory === null ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedCategory === category.id ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Events grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <Skeleton className="w-full h-48" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))
        ) : events.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No events found</p>
          </div>
        ) : (
          events.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.name}
              image={event.profileImage || "/assets/images/event-placeholder.png"}
              category={event.category?.name || "Uncategorized"}
              date={{
                month: new Date(event.dateTime).toLocaleString("en-US", { month: "short" }).toUpperCase(),
                day: new Date(event.dateTime).getDate().toString(),
              }}
              venue={event.locationDesc}
              time={new Date(event.dateTime).toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
              price={0} // Assuming events are free or price is not in the model
              interested={event._count?.interestedUsers || 0}
            />
          ))
        )}
      </div>
    </div>
  )
}
