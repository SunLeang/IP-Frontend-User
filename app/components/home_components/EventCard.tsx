"use client";
import Image from "next/image";
import React, { useState } from "react";

interface Event {
  title: string;
  img: string;
  date: { month: string; day: string };
  venue: string;
  time: string;
  price: number;
  interested: number;
  category: string;
}

interface EventCardProps {
  events: Event[];
  onSeeMore: () => void;
  isExpanded: boolean;
}
export default function EventCard({
  events,
  onSeeMore,
  isExpanded,
}: EventCardProps) {
  return (
    <div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {events.map(
          (
            { title, img, date, venue, time, price, interested, category },
            index
          ) => (
            <div
              key={index}
              className="rounded-lg overflow-hidden shadow-md border"
            >
              {/* Image */}
              <div className="relative">
                <div>
                  <Image
                    src={`/assets/images/${img}`}
                    alt={`${title} img`}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-0 bg-orange-300 text-sm text-white px-2 py-1">
                    {category}
                  </div>
                </div>
                {/* Top-right Save Icon (optional) */}
                <div className="absolute top-2 right-2 bg-white p-1 rounded-full shadow">
                  <span>☆</span> {/* You can replace with real icon */}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                {/* Date and Title */}
                <div className="flex gap-4 items-start">
                  <div className="text-center">
                    <div className="text-md font-semibold text-purple-800">
                      {date.month}
                    </div>
                    <div className="text-xl font-bold">{date.day}</div>
                  </div>
                  <div>
                    <h3 className="text-md font-semibold leading-tight">
                      {title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{venue}</p>
                  </div>
                </div>

                {/* Time, Price, Interested */}
                <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                  <div>
                    <p>{time}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>₹ {price}</span>
                    <span>★ {interested} interested</span>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* See More */}
      {events.length > 0 && (
        <div className="flex justify-center mt-10">
          <button onClick={onSeeMore} className="px-6 py-2 border rounded-full">
            {isExpanded ? "See Less" : "See More"}
          </button>
        </div>
      )}
    </div>
  );
}
