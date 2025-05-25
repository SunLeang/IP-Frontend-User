"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Calendar, Check, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/hero-section";
import { getEventById } from "@/services/event-service";
import { getUserVolunteerApplications } from "@/services/volunteer-service"; // Add this import
import { useAuth } from "@/context/auth-context";
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
  const { user, isAuthenticated } = useAuth(); // auth context
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventEnded, setEventEnded] = useState(false);
  const [volunteerStatus, setVolunteerStatus] = useState<{
    isVolunteer: boolean;
    applicationStatus: string | null;
    hasApplied: boolean;
  }>({
    isVolunteer: false,
    applicationStatus: null,
    hasApplied: false,
  });

  useEffect(() => {
    const fetchEventDetails = async () => {
      setIsLoading(true);
      try {
        const data = await getEventById(id);
        if (data) {
          setEvent(data);

          // Check if event has ended
          const eventDate = new Date(data.dateTime);
          const now = new Date();
          setEventEnded(eventDate < now);
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

  // Check user's volunteer status for this event
  useEffect(() => {
    const checkVolunteerStatus = async () => {
      if (!isAuthenticated || !user) {
        return;
      }

      try {
        const applications = await getUserVolunteerApplications();
        const eventApplication = applications.find(
          (app: any) => app.eventId === id
        );

        if (eventApplication) {
          setVolunteerStatus({
            isVolunteer: eventApplication.status === "APPROVED",
            applicationStatus: eventApplication.status,
            hasApplied: true,
          });
        } else {
          setVolunteerStatus({
            isVolunteer: false,
            applicationStatus: null,
            hasApplied: false,
          });
        }
      } catch (error) {
        console.error("Error checking volunteer status:", error);
      }
    };

    checkVolunteerStatus();
  }, [id, isAuthenticated, user]);

  const handleApply = () => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      router.push(`/login?redirect=${encodeURIComponent(`/volunteer/${id}`)}`);
      return;
    }

    // Only allow navigation if user hasn't applied and event hasn't ended
    if (!volunteerStatus.hasApplied && !eventEnded) {
      router.push(`/volunteer/apply/${id}`);
    }
  };

  // Function to get button text and state
  const getButtonState = () => {
    if (!isAuthenticated) {
      return {
        text: "Login to Apply",
        disabled: false,
        className: "w-full py-6 bg-blue-500 hover:bg-blue-600",
      };
    }

    if (eventEnded) {
      return {
        text: "Event Has Ended",
        disabled: true,
        className: "w-full py-6 bg-gray-400 cursor-not-allowed",
      };
    }

    if (volunteerStatus.isVolunteer) {
      return {
        text: "You're Already a Volunteer",
        disabled: true,
        className: "w-full py-6 bg-green-400 cursor-not-allowed",
      };
    }

    if (volunteerStatus.hasApplied) {
      const statusText =
        {
          PENDING: "Application Submitted - Please Wait",
          REJECTED: "Application Rejected",
          APPROVED: "You're Already a Volunteer",
        }[volunteerStatus.applicationStatus || "PENDING"] ||
        "Application Submitted - Please Wait";

      return {
        text: statusText,
        disabled: true,
        className:
          volunteerStatus.applicationStatus === "REJECTED"
            ? "w-full py-6 bg-red-400 cursor-not-allowed"
            : "w-full py-6 bg-yellow-400 cursor-not-allowed",
      };
    }

    return {
      text: "Apply Now",
      disabled: false,
      className: "w-full py-6 bg-green-500 hover:bg-green-600",
    };
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
  const buttonState = getButtonState();

  return (
    <div className="min-h-screen bg-white pb-10">
      {/* Hero Banner */}
      <HeroSection />

      <div className="container mx-auto px-4 py-6">
        {/* Event Title */}
        <h1 className="text-2xl font-bold mb-6">{event.name}</h1>

        {/* Event Status Indicator */}
        {eventEnded && (
          <div className="mb-6 p-4 bg-gray-100 border-l-4 border-gray-400 rounded">
            <p className="text-gray-700 font-medium">
              ⏰ This event has ended. Volunteer applications are no longer
              accepted.
            </p>
          </div>
        )}

        {/* Volunteer Status Indicator */}
        {isAuthenticated && volunteerStatus.hasApplied && (
          <div
            className={`mb-6 p-4 border-l-4 rounded ${
              volunteerStatus.isVolunteer
                ? "bg-green-50 border-green-400"
                : volunteerStatus.applicationStatus === "REJECTED"
                ? "bg-red-50 border-red-400"
                : "bg-yellow-50 border-yellow-400"
            }`}
          >
            <p
              className={`font-medium ${
                volunteerStatus.isVolunteer
                  ? "text-green-700"
                  : volunteerStatus.applicationStatus === "REJECTED"
                  ? "text-red-700"
                  : "text-yellow-700"
              }`}
            >
              {volunteerStatus.isVolunteer &&
                "✅ You are a volunteer for this event!"}
              {volunteerStatus.applicationStatus === "PENDING" &&
                "⏳ Your volunteer application is under review."}
              {volunteerStatus.applicationStatus === "REJECTED" &&
                "❌ Your volunteer application was not accepted."}
            </p>
          </div>
        )}

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
            disabled={buttonState.disabled}
            className={buttonState.className}
          >
            {buttonState.text}
          </Button>
        </div>

        {/* Spacer for fixed button on mobile */}
        <div className="h-20 md:h-0"></div>
      </div>
    </div>
  );
}
