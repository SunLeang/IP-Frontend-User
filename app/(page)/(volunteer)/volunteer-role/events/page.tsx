"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Calendar, MapPin, Users } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getMyVolunteerEvents,
  VolunteerEvent,
} from "@/services/volunteer-service";
import { Skeleton } from "@/components/ui/skeleton";
import { getValidImageSrc } from "@/lib/image-utils"; // Add this import

export default function VolunteerEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<VolunteerEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVolunteerEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const volunteerEvents = await getMyVolunteerEvents();
        setEvents(volunteerEvents);
      } catch (err) {
        console.error("Error fetching volunteer events:", err);
        setError("Failed to load volunteer events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVolunteerEvents();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const startTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    // Assuming 4-hour duration, you might want to get this from backend
    const endDate = new Date(date.getTime() + 4 * 60 * 60 * 1000);
    const endTime = endDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${startTime} - ${endTime}`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Your Volunteer Events</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Your Volunteer Events</h1>
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Your Volunteer Events</h1>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            You haven't volunteered for any events yet.
          </p>
          <Button onClick={() => router.push("/volunteer")}>
            Browse Volunteer Opportunities
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Your Volunteer Events</h1>
      <p className="text-gray-600 mb-6">
        You are volunteering for {events.length} event
        {events.length !== 1 ? "s" : ""}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card
            key={event.id}
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push(`/volunteer-role/events/${event.id}`)}
          >
            <div className="relative h-48">
              <Image
                src={getValidImageSrc(event.profileImage || event.coverImage)}
                alt={event.name}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== "/assets/constants/billboard.png") {
                    target.src = "/assets/constants/billboard.png";
                  }
                }}
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2">{event.name}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {formatDate(event.dateTime)} • {formatTime(event.dateTime)}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="truncate">{event.locationDesc}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{event._count?.attendingUsers || 0} attendees</span>
                  </div>
                  <span className="text-blue-600">
                    {event._count?.volunteers || 0} volunteers
                  </span>
                </div>
                {event.category && (
                  <div className="text-xs text-gray-500">
                    Category: {event.category.name}
                  </div>
                )}
              </div>
              <Button className="w-full mt-4 bg-blue-500 hover:bg-blue-600">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
