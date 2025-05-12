"use client";

import { useState } from "react";
import { Checkbox } from "@/components/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/events/event-card";
import { HeroSection } from "@/components/hero-section";

export default function EventsPage() {
  const [currentPage, setCurrentPage] = useState(1);

  // Sample events data
  const events = Array.from({ length: 12 }, (_, i) => ({
    id: `event-${i + 1}`,
    title: "Event title that can go up to two lines",
    image: "/assets/images/new-year.png",
    category: "Technology & Innovation",
    date: {
      month: "NOV",
      day: "22",
    },
    venue: "Venue",
    time: "00:00 AM - 00:00 PM",
    price: 5.0,
    interested: 10,
  }));

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Hero Banner */}
      <HeroSection />

      {/* Filters Section */}
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-xl font-bold mb-4">Filters</h2>
        <div className="bg-[#001337] text-white rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Price Filter */}
            <div>
              <h3 className="font-semibold mb-3">Price</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox
                    id="free"
                    className="border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                  />
                  <label htmlFor="free" className="ml-2 text-sm">
                    Free
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="paid"
                    className="border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                  />
                  <label htmlFor="paid" className="ml-2 text-sm">
                    Paid
                  </label>
                </div>
              </div>
            </div>

            {/* Date Filter */}
            <div>
              <h3 className="font-semibold mb-3">Date</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox
                    id="today"
                    className="border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                  />
                  <label htmlFor="today" className="ml-2 text-sm">
                    Today
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="tomorrow"
                    className="border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                  />
                  <label htmlFor="tomorrow" className="ml-2 text-sm">
                    Tomorrow
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="this-week"
                    className="border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                  />
                  <label htmlFor="this-week" className="ml-2 text-sm">
                    This Week
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="this-weekend"
                    className="border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                  />
                  <label htmlFor="this-weekend" className="ml-2 text-sm">
                    This Weekend
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="pick-date"
                    className="border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                  />
                  <label htmlFor="pick-date" className="ml-2 text-sm">
                    Pick a Date
                  </label>
                </div>
              </div>
              <button className="text-sm text-blue-300 mt-2">More</button>
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="font-semibold mb-3">Category</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox
                    id="adventure"
                    className="border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                  />
                  <label htmlFor="adventure" className="ml-2 text-sm">
                    Adventure Travel
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="art"
                    className="border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                  />
                  <label htmlFor="art" className="ml-2 text-sm">
                    Art Exhibitions
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="auctions"
                    className="border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                  />
                  <label htmlFor="auctions" className="ml-2 text-sm">
                    Auctions & Fundraisers
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="beer"
                    className="border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                  />
                  <label htmlFor="beer" className="ml-2 text-sm">
                    Beer Festivals
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="benefit"
                    className="border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                  />
                  <label htmlFor="benefit" className="ml-2 text-sm">
                    Benefit Concerts
                  </label>
                </div>
              </div>
              <button className="text-sm text-blue-300 mt-2">More</button>
            </div>

            {/* Format Filter */}
            <div>
              <h3 className="font-semibold mb-3">Format</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox
                    id="community"
                    className="border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                  />
                  <label htmlFor="community" className="ml-2 text-sm">
                    Community Engagement
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="concerts"
                    className="border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                  />
                  <label htmlFor="concerts" className="ml-2 text-sm">
                    Concerts & Performances
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="conferences"
                    className="border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                  />
                  <label htmlFor="conferences" className="ml-2 text-sm">
                    Conferences
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="experiential"
                    className="border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                  />
                  <label htmlFor="experiential" className="ml-2 text-sm">
                    Experiential Events
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="festivals"
                    className="border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                  />
                  <label htmlFor="festivals" className="ml-2 text-sm">
                    Festivals & Fairs
                  </label>
                </div>
              </div>
              <button className="text-sm text-blue-300 mt-2">More</button>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              image={event.image}
              category={event.category}
              date={event.date}
              venue={event.venue}
              time={event.time}
              price={event.price}
              interested={event.interested}
            />
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center space-x-2">
          <Button variant="outline" size="sm" className="px-3">
            <span className="sr-only">First</span>
            <span aria-hidden="true">« First</span>
          </Button>
          <Button variant="outline" size="sm" className="px-3">
            <span className="sr-only">Previous</span>
            <span aria-hidden="true">‹ Back</span>
          </Button>
          <Button variant="outline" size="sm" className="px-3">
            1
          </Button>
          <Button variant="default" size="sm" className="px-3 bg-[#001337]">
            2
          </Button>
          <Button variant="outline" size="sm" className="px-3">
            3
          </Button>
          <Button variant="outline" size="sm" className="px-3">
            4
          </Button>
          <span className="px-2">...</span>
          <Button variant="outline" size="sm" className="px-3">
            25
          </Button>
          <Button variant="outline" size="sm" className="px-3">
            <span className="sr-only">Next</span>
            <span aria-hidden="true">Next ›</span>
          </Button>
          <Button variant="outline" size="sm" className="px-3">
            <span className="sr-only">Last</span>
            <span aria-hidden="true">Last »</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
