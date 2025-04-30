"use client";
import Image from "next/image";
import React, { useState } from "react";
import Sidebar from "./components/home_components/Sidebar";
import EventCard from "./components/EventCard";

const categories = [
  { title: "Seminar", img: "seminar.png" },
  { title: "Culture", img: "lantern.png" },
  { title: "Festival", img: "balloon.png" },
  { title: "Songkran", img: "songkran.png" },
];

const events = [
  {
    title: "Event New Year Celebration",
    img: "new-year.png",
    date: { month: "NOV", day: "22" },
    venue: "Venue",
    time: "00:00 AM - 00:00 PM",
    price: 4.99,
    interested: 10,
    category: "Entertainment",
  },
  {
    title: "Event Booking and Explore",
    img: "eventx.png",
    date: { month: "NOV", day: "22" },
    venue: "Venue",
    time: "00:00 AM - 00:00 PM",
    price: 4.99,
    interested: 10,
    category: "Entertainment",
  },
  {
    title: "Event Summer Festival",
    img: "summer.png",
    date: { month: "NOV", day: "22" },
    venue: "Venue",
    time: "00:00 AM - 00:00 PM",
    price: 4.99,
    interested: 10,
    category: "Entertainment",
  },
  {
    title: "Event Prom Night",
    img: "prom.png",
    date: { month: "NOV", day: "22" },
    venue: "Venue",
    time: "00:00 AM - 00:00 PM",
    price: 4.99,
    interested: 10,
    category: "Entertainment",
  },

  {
    title: "Event New Year Celebration",
    img: "new-year.png",
    date: { month: "NOV", day: "22" },
    venue: "Venue",
    time: "00:00 AM - 00:00 PM",
    price: 4.99,
    interested: 10,
    category: "Entertainment",
  },
  {
    title: "Event Booking and Explore",
    img: "eventx.png",
    date: { month: "NOV", day: "22" },
    venue: "Venue",
    time: "00:00 AM - 00:00 PM",
    price: 4.99,
    interested: 10,
    category: "Entertainment",
  },
  {
    title: "Event Summer Festival",
    img: "summer.png",
    date: { month: "NOV", day: "22" },
    venue: "Venue",
    time: "00:00 AM - 00:00 PM",
    price: 4.99,
    interested: 10,
    category: "Entertainment",
  },
  {
    title: "Event Prom Night",
    img: "prom.png",
    date: { month: "NOV", day: "22" },
    venue: "Venue",
    time: "00:00 AM - 00:00 PM",
    price: 4.99,
    interested: 10,
    category: "Entertainment",
  },
];

export default function page() {
  const [visibleEventsPopular, setVisibleEventsPopular] = useState(4);
  const [isExpandedPopular, setIsExpandedPopular] = useState(false);

  const [visibleEventsOnline, setVisibleEventsOnline] = useState(4);
  const [isExpandedOnline, setIsExpandedOnline] = useState(false);

  const handleSeeMorePopularEvents = () => {
    setIsExpandedPopular((prev) => !prev);
    setVisibleEventsPopular((prev) => (isExpandedPopular ? 4 : events.length));
  };

  const handleSeeMoreOnlineEvents = () => {
    setIsExpandedOnline((prev) => !prev);
    setVisibleEventsOnline((prev) => (isExpandedOnline ? 4 : events.length));
  };

  function setCurrentPage(page: number): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-gray-900">
      <Sidebar />

      {/* Big Image Top Banner */}
      <section
        className="relative bg-cover bg-center h-[400px]"
        style={{ backgroundImage: "url('/assets/images/banner.png')" }}
      >
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl font-bold text-white">Don't miss out!</h1>
          <h2 className="text-2xl text-white mt-2">
            Explore the <span className="text-yellow-400">vibrant events</span>{" "}
            happening right now.
          </h2>
          <div className="mt-6 w-full max-w-xl">
            <input
              type="text"
              placeholder="Search Events, Categories, Location..."
              className="w-full px-4 py-2 rounded-md focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Popular Categorys */}
      <section className="py-12 px-6 text-center">
        <h2 className="text-2xl font-bold mb-8">
          Explore Popular Events Categories
        </h2>
        <div className="flex flex-wrap justify-center gap-20">
          {categories.map(({ title, img }, index) => (
            <div key={index} className="flex flex-col items-center">
              <Image
                src={`/assets/images/${img}`}
                alt={`${title} img`}
                width={200}
                height={120}
              />
              <span>{title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Event */}
      <section className="py-6 px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Popular Events in Phnom Penh</h2>
          <div className="flex gap-2">
            {["All", "Today", "Tomorrow"].map((date) => (
              <DateButton key={date} date={date} />
            ))}
          </div>
        </div>
        <EventCard
          events={events.slice(0, visibleEventsPopular)}
          onSeeMore={handleSeeMorePopularEvents}
          isExpanded={isExpandedPopular}
          showSeeMoreButton={true}
        />
      </section>

      {/* Discover Best Online Events */}
      <section className="py-6 px-6">
        <h2 className="text-2xl font-bold mb-6">Discover Best Online Events</h2>
        <EventCard
          events={events.slice(0, visibleEventsOnline)}
          onSeeMore={handleSeeMoreOnlineEvents}
          isExpanded={isExpandedOnline}
          showSeeMoreButton={true}
        />
      </section>
    </div>
  );
}

const DateButton = ({ date }: { date: string }) => {
  return (
    <button className="px-3 py-1 bg-gray-200 rounded-full text-sm">
      {date}
    </button>
  );
};
