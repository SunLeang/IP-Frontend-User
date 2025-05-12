"use client";

import { useState } from "react";
import { EventCard } from "./event-card";

interface Event {
  id?: string;
  title: string;
  img: string; // This is named differently than what EventCard expects
  date: {
    month: string;
    day: string;
  };
  venue: string;
  time: string;
  price: number;
  interested: number;
  category: string;
}

interface EventsSectionProps {
  title: string;
  events: Event[];
}

export function EventsSection({ title, events }: EventsSectionProps) {
  const [visibleEvents, setVisibleEvents] = useState(4);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  const handleSeeMore = () => {
    setIsExpanded((prev) => !prev);
    setVisibleEvents((prev) => (isExpanded ? 4 : events.length));
  };

  return (
    <section className="py-8 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>

          <div className="flex gap-2 mt-4 md:mt-0">
            {["All", "Today", "Tomorrow"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1 rounded-full text-sm ${
                  activeTab === tab
                    ? "bg-white shadow-sm"
                    : "bg-gray-200 hover:bg-gray-300 transition-colors"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {events.slice(0, visibleEvents).map((event, index) => (
          <EventCard
            key={index}
            id={event.id || `event-${index}`}
            title={event.title}
            image={event.img.startsWith("/") ? event.img : `/assets/images/${event.img}`}
            category={event.category}
            date={event.date}
            venue={event.venue}
            time={event.time}
            price={event.price}
            interested={event.interested}
          />
        ))}
      </div>

        <div className="text-center mt-8">
          <button
            onClick={handleSeeMore}
            className="px-8 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            {isExpanded ? "See less" : "See more"}
          </button>
        </div>
      </div>
    </section>
  );
}
