"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Helper function to ensure image paths are properly formatted
function getValidImageSrc(src: string | undefined | null): string {
  if (!src) return "/assets/images/category-placeholder.png";

  if (src.startsWith("http") || src.startsWith("/")) {
    return src;
  }

  return `/assets/images/${src}`;
}

interface CategoryPageProps {
  params: {
    id: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { id } = params;

  const [category, setCategory] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategoryAndEvents = async () => {
      try {
        // Fetch category data
        const categoryResponse = await fetch(`/api/categories/${id}`);
        if (!categoryResponse.ok) {
          throw new Error("Failed to fetch category");
        }
        const categoryData = await categoryResponse.json();
        setCategory(categoryData);

        // Fetch events for this category
        const eventsResponse = await fetch(`/api/events?categoryId=${id}`);
        if (!eventsResponse.ok) {
          throw new Error("Failed to fetch events");
        }
        const eventsData = await eventsResponse.json();
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryAndEvents();
  }, [id]);

  // Use the helper function where needed
  const categoryImageSrc = category?.image
    ? getValidImageSrc(category.image)
    : null;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {category && (
        <>
          <h1>{category.name}</h1>
          {categoryImageSrc && (
            <img src={categoryImageSrc} alt={category.name} />
          )}
          <p>{category.description}</p>

          <h2>Events in this category</h2>
          {events.length > 0 ? (
            <div className="events-grid">
              {events.map((event) => (
                <div key={event.id} className="event-card">
                  <h3>{event.title}</h3>
                  {/* Add more event details as needed */}
                </div>
              ))}
            </div>
          ) : (
            <p>No events found in this category.</p>
          )}
        </>
      )}
    </div>
  );
}
