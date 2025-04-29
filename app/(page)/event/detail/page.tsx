"use client";
import { useState } from "react";
import { Calendar, Clock, MapPin, Share2 } from "lucide-react";
import Image from "next/image";

export default function EventDetail() {
  const [joined, setJoined] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleCancelJoin = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    setJoined(false);
    setShowCancelModal(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-gray-900">
      {/* Top Banner */}
      <section
        className="relative bg-cover bg-center h-[400px]"
        style={{ backgroundImage: "url('/assets/images/banner.png')" }}
      >
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl font-bold text-white">Don't miss out!</h1>
          <h2 className="text-2xl text-white mt-2">
            Explore the <span className="text-yellow-400">vibrant events</span> happening right now.
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

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Event Details */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Sound of Eventura Event</h1>
            <p className="text-gray-600 flex items-center gap-2 mt-1">
              <Calendar size={16} /> Sunday, 10 November 2025
            </p>
            <p className="text-gray-600 flex items-center gap-2">
              <Clock size={16} /> 5:00 PM - 9:30 PM
            </p>
            <a href="#" className="text-blue-600 text-sm underline">
              + Add to Calendar
            </a>
          </div>

          {/* Right Panel */}
          <div className="space-y-2 text-right">
            <div className="flex items-center justify-end gap-2">
              <button className="text-gray-500 hover:text-gray-700">
                <Share2 />
              </button>
              <button className="text-gray-500 hover:text-gray-700 text-xl">
                ★
              </button>
            </div>

            {/* Joined / Cancel Buttons */}
            <div className="flex gap-2 justify-end">
              {joined && (
                <>
                  <button className="bg-green-500 text-white px-4 py-1 rounded">
                    Joined
                  </button>
                  <button
                    className="border px-4 py-1 rounded"
                    onClick={handleCancelJoin}
                  >
                    Cancel
                  </button>
                </>
              )}
              {!joined && (
                <button
                  className="bg-blue-500 text-white px-4 py-1 rounded"
                  onClick={() => setJoined(true)}
                >
                  Join Event
                </button>
              )}
            </div>

            <div className="text-sm text-gray-700">
              <strong>Ticket Information</strong>
              <p>This event is free to join.</p>
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <h2 className="text-lg font-semibold mb-1">Location</h2>
          <p className="text-gray-600 flex items-center gap-2">
            <MapPin size={16} /> Russian Conf Norodom Boulevard, Phnom Penh 120404
          </p>
          <div className="mt-2">
            {/* Map */}
            <div className="rounded overflow-hidden">
              <Image
                src="/assets/images/map.png"
                alt="Map"
                width={800}
                height={400}
              />
            </div>
          </div>
        </div>

        {/* Hosted By */}
        <div>
          <h2 className="text-lg font-semibold mb-1">Hosted by</h2>
          <div className="flex items-center gap-4 mt-2">
            <Image
              src="/assets/images/logo.png"
              width={50}
              height={50}
              alt="host logo"
            />
            <div>
              <p className="font-medium">Jeffrey Zin</p>
              <button className="bg-purple-100 text-purple-700 px-3 py-1 rounded text-sm mt-1">
                Like
              </button>
            </div>
          </div>
        </div>

        {/* Event Description */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Event Description</h2>
          <p className="text-gray-800 mb-2">
            Get ready to kick off the Christmas season in Mumbai with{" "}
            <strong>SOUND OF CHRISTMAS - your favourite LIVE Christmas concert!</strong>
          </p>
          <p className="italic text-gray-600 mb-2">
            City Youth Movement invites you to the 4th edition of our annual
            Christmas festivities - by the youth and for the youth! Feat. your
            favourite worship leaders, carols, quizzes and some exciting
            surprises!
          </p>
          <p className="text-gray-800 mb-2">
            Bring your family and friends and sing along your favourite Christmas
            carols on the 2nd of December, 6:30 PM onwards at the Balgandharva
            Rang Mandir, Bandra West. Book your tickets now!
          </p>
          <p className="font-semibold mt-4 mb-1">3 Reasons to attend the event:</p>
          <ol className="list-decimal list-inside text-gray-800 space-y-1">
            <li>The FIRST Christmas concert of Mumbai!</li>
            <li>A special Christmas Choir!</li>
            <li>Special Dance performances and many more surprises!</li>
          </ol>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-md shadow-lg p-6 w-[90%] max-w-md text-center">
            <h2 className="text-xl font-semibold text-orange-500 mb-2">
              Are you sure?
            </h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to cancel your attendance at this event?
              <br />
              Please confirm your choice.
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 border rounded text-gray-700"
                onClick={() => setShowCancelModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={confirmCancel}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
