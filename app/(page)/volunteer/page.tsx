'use client';

import React from 'react';
import Link from 'next/link';
import EventCard from '@/app/components/EventCard';

const events = Array.from({ length: 12 }, (_, idx) => ({
  title: "Event New Year Celebration",
  img: "new-year.png",
  date: { month: "NOV", day: "22" },
  venue: "Venue",
  time: "00:00 AM - 00:00 PM",
  price: 4.99,
  interested: 10,
  category: "Entertainment",
}));

const HomePage = () => {
  const dummyData = Array.from({ length: 12 }, (_, i) => ({
    title: 'PROM NIGHT',
    date: 'NOV 22',
    location: 'gardencity.com',
    image: '/images/event.jpg',
    description: 'Join us at this unforgettable prom night experience full of music, lights, and magic!',
  }));

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="bg-blue-900 text-white p-4 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {['Price', 'Date', 'Category', 'Format'].map((filter) => (
          <div key={filter}>
            <p className="font-semibold mb-2">{filter}</p>
            {['Option 1', 'Option 2', 'Option 3'].map((option, idx) => (
              <div key={idx}>
                <label className="text-sm">
                  <input type="checkbox" className="mr-2" />
                  {option}
                </label>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Cards Grid */}
      <EventCard events={events} showSeeMoreButton={false} />
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dummyData.map((event, index) => (
          <div key={index} className="border rounded-lg overflow-hidden shadow-md bg-white">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-purple-700 mb-1">Volunteer Meetup</h3>
              <h2 className="text-lg font-bold text-gray-900">{event.title}</h2>
              <p className="text-sm text-gray-500 mt-1">{event.date}</p>
              <p className="text-sm text-gray-600 mt-2">{event.description}</p>
              <p className="text-sm text-blue-600 mt-2">Location: {event.location}</p>
            </div>
          </div>
        ))}
      </div> */}

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-2">
        {Array.from({ length: 5 }, (_, i) => (
          <button
            key={i}
            className="px-3 py-1 border rounded text-sm hover:bg-gray-200 transition"
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomePage;