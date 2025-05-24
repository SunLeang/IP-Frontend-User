"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Calendar, Check, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/hero-section";
import { getEventById } from "@/services/event-service";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

// Helper function to ensure image paths are properly formatted
function getValidImageSrc(src: string | undefined | null): string {
  if (!src) return "/assets/images/event-placeholder.png";

  if (src.startsWith("http") || src.startsWith("/")) {
    return src;
  }

  return `/assets/images/${src}`;
}

export default function VolunteerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = React.use(params as unknown as Promise<{ id: string }>);
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      setIsLoading(true);
      try {
        const data = await getEventById(id);
        if (data) {
          setEvent(data);
        } else {
          setError("Event not found");
        }
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Failed to load event details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleApply = () => {
    // Redirect to application form
    router.push(`/volunteer/apply/${id}`);
  };

  // Format date from dateTime string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return {
      day: dayNames[date.getDay()],
      date: date.getDate(),
      month: monthNames[date.getMonth()],
      year: date.getFullYear(),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pb-10">
        <HeroSection />
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="h-10 w-3/4 mb-6" />
          <Skeleton className="h-6 w-1/2 mb-3" />
          <div className="flex items-start mb-2">
            <Skeleton className="h-5 w-5 mr-3 mt-0.5" />
            <Skeleton className="h-5 w-1/3" />
          </div>
          <div className="flex items-start mb-6">
            <Skeleton className="h-5 w-5 mr-3 mt-0.5" />
            <Skeleton className="h-5 w-1/4" />
          </div>
          <Skeleton className="h-6 w-1/2 mb-3" />
          <Skeleton className="h-20 w-full mb-4" />
          <Skeleton className="h-20 w-full mb-4" />
          <Skeleton className="h-6 w-1/3 mb-3" />
          <div className="flex flex-col gap-2 mb-6">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-white pb-10">
        <HeroSection />
        <div className="container mx-auto px-4 py-6 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            {error || "Event not found"}
          </h2>
          <p className="mb-6">
            Sorry, we couldn't load the volunteer opportunity details
          </p>
          <Button asChild>
            <Link href="/volunteer">Browse Other Opportunities</Link>
          </Button>
        </div>
      </div>
    );
  }

  const formattedDate = formatDate(event.dateTime);

  return (
    <div className="min-h-screen bg-white pb-10">
      {/* Hero Banner */}
      <HeroSection />

      <div className="container mx-auto px-4 py-6">
        {/* Event Title */}
        <h1 className="text-2xl font-bold mb-6">{event.name}</h1>

        {/* Date and Time */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Date and Time</h2>
          <div className="flex items-start mb-2">
            <Calendar className="h-5 w-5 mr-3 mt-0.5 text-gray-500" />
            <span>
              {formattedDate.day}, {formattedDate.date} {formattedDate.month}{" "}
              {formattedDate.year}
            </span>
          </div>
          <div className="flex items-start mb-2">
            <Clock className="h-5 w-5 mr-3 mt-0.5 text-gray-500" />
            <span>{formattedDate.time}</span>
          </div>
        </div>

        {/* Why Volunteer? */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Why Volunteer?</h2>
          <p className="mb-4">
            Volunteer for {event.name} - Make a Difference & Gain Experience!
          </p>
          <p className="mb-4">{event.description}</p>
          <p className="mb-2">Benefits of Volunteering:</p>
          <ul className="mb-4">
            <li className="flex items-start mb-2">
              <Check className="h-5 w-5 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
              <span>Gain valuable experience and skills</span>
            </li>
            <li className="flex items-start mb-2">
              <Check className="h-5 w-5 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
              <span>Network with professionals in the field</span>
            </li>
            <li className="flex items-start mb-2">
              <Check className="h-5 w-5 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
              <span>Certificate of participation</span>
            </li>
            <li className="flex items-start mb-2">
              <Check className="h-5 w-5 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
              <span>Be part of an amazing community event</span>
            </li>
            <li className="flex items-start mb-2">
              <Check className="h-5 w-5 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
              <span>Free entry to the event</span>
            </li>
          </ul>
          <p className="mb-6">
            Join us in making this event special while enjoying great perks.
            Apply today! 🎉
          </p>
          <Link href={`/events/${id}`}>
            <Button className="w-full py-6">Check Event</Button>
          </Link>
        </div>

        {/* Requirements */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Requirement:</h2>
          <p className="mb-2">Volunteer Requirements:</p>
          <ul className="mb-4">
            <li className="flex items-start mb-2">
              <Check className="h-5 w-5 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
              <span>
                No experience needed – just enthusiasm and willingness to help!
              </span>
            </li>
            <li className="flex items-start mb-2">
              <Check className="h-5 w-5 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
              <span>Willingness to work as part of a team.</span>
            </li>
            <li className="flex items-start mb-2">
              <Check className="h-5 w-5 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
              <span>
                A sense of responsibility and commitment to assigned tasks.
              </span>
            </li>
            <li className="flex items-start mb-2">
              <Check className="h-5 w-5 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
              <span>Must submit a CV for registration.</span>
            </li>
          </ul>
          <p>If you're excited to be part of this event, apply now!</p>
        </div>

        {/* Location */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Location</h2>
          <div className="flex items-start mb-3">
            <MapPin className="h-5 w-5 mr-3 mt-0.5 text-gray-500" />
            <div>
              <p>{event.locationDesc}</p>
            </div>
          </div>
          {event.locationImage && (
            <div className="rounded-lg overflow-hidden border border-gray-200 ml-8">
              <Image
                src={getValidImageSrc(event.locationImage)}
                alt="Event location map"
                width={600}
                height={300}
                className="w-full h-auto"
              />
            </div>
          )}
        </div>

        {/* Hosted by */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Hosted by</h2>
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                <Image
                  src="/icons/user.png"
                  alt="Host"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-medium">
                {event.organizer?.fullName || "Event Organizer"}
              </span>
            </div>
          </div>
        </div>

        {/* Apply Button - Fixed at bottom on mobile */}
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t md:relative md:border-0 md:p-0 md:mt-8">
          <Button
            onClick={handleApply}
            className="w-full py-6 bg-green-500 hover:bg-green-600"
          >
            Apply Now
          </Button>
        </div>

        {/* Spacer for fixed button on mobile */}
        <div className="h-20 md:h-0"></div>
      </div>
    </div>
  );
}
