"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  toggleEventInterest,
  getInterestedEvents,
} from "@/services/event-service";
import { useAuth } from "./auth-context";

export interface Event {
  id: string;
  title: string;
  image: string;
  category: string;
  date: {
    month: string;
    day: string;
  };
  venue: string;
  time: string;
  price: number;
  interested: number;
}

interface InterestContextType {
  interestedEvents: Event[];
  addInterest: (event: Event) => Promise<void>;
  removeInterest: (id: string) => Promise<void>;
  isInterested: (id: string) => boolean;
  isLoading: boolean;
  error: string | null;
  refreshInterests: () => Promise<void>;
}

const InterestContext = createContext<InterestContextType | undefined>(
  undefined
);

export function InterestProvider({ children }: { children: ReactNode }) {
  const [interestedEvents, setInterestedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  // Function to fetch interested events from API
  const fetchInterestedEvents = async () => {
    if (!isAuthenticated) {
      // For non-authenticated users, load from localStorage
      const storedEvents = localStorage.getItem("interestedEvents");
      if (storedEvents) {
        try {
          setInterestedEvents(JSON.parse(storedEvents));
        } catch (error) {
          console.error(
            "Failed to parse interested events from localStorage:",
            error
          );
        }
      }
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Fetching interested events from API...");
      const events = await getInterestedEvents();
      console.log("Fetched events:", events);

      if (events && Array.isArray(events) && events.length > 0) {
        const transformedEvents = events.map((event) => ({
          id: event.id,
          title: event.name,
          image: event.profileImage || "/assets/images/event-placeholder.png",
          category: event.category?.name || "Uncategorized",
          date: {
            month: new Date(event.dateTime)
              .toLocaleString("en-US", { month: "short" })
              .substring(0, 3)
              .toUpperCase(),
            day: new Date(event.dateTime).getDate().toString(),
          },
          venue: event.locationDesc,
          time: new Date(event.dateTime).toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
          price: 0,
          interested: event._count?.interestedUsers || 0,
        }));

        console.log("Transformed events:", transformedEvents);
        setInterestedEvents(transformedEvents);

        // Also sync to localStorage for backup
        localStorage.setItem(
          "interestedEvents",
          JSON.stringify(transformedEvents)
        );
      } else {
        console.log("No interested events found");
        setInterestedEvents([]);
        localStorage.removeItem("interestedEvents");
      }
    } catch (error) {
      console.error("Failed to fetch interested events:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch interested events"
      );

      // Fallback to localStorage if API fails
      const storedEvents = localStorage.getItem("interestedEvents");
      if (storedEvents) {
        try {
          setInterestedEvents(JSON.parse(storedEvents));
        } catch (parseError) {
          console.error("Failed to parse stored events:", parseError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load interested events when component mounts or authentication changes
  useEffect(() => {
    fetchInterestedEvents();
  }, [isAuthenticated]); // Re-fetch when auth status changes

  const addInterest = async (event: Event) => {
    if (!isAuthenticated) {
      // For guest users, store in localStorage
      setInterestedEvents((prev) => {
        if (prev.some((e) => e.id === event.id)) {
          return prev;
        }
        const newEvents = [...prev, event];
        localStorage.setItem("interestedEvents", JSON.stringify(newEvents));
        return newEvents;
      });
      return;
    }

    // Optimistic update - add to UI immediately
    setInterestedEvents((prev) => {
      if (prev.some((e) => e.id === event.id)) {
        return prev;
      }
      return [...prev, event];
    });

    setError(null);
    try {
      console.log("Adding interest for event:", event.id);
      const result = await toggleEventInterest(event.id);
      console.log("Add interest result:", result);

      if (result.success) {
        // Update localStorage
        const updatedEvents = [...interestedEvents, event];
        localStorage.setItem("interestedEvents", JSON.stringify(updatedEvents));
      } else {
        // Revert optimistic update on failure
        setInterestedEvents((prev) => prev.filter((e) => e.id !== event.id));
      }
    } catch (error) {
      console.error("Failed to add interest:", error);
      setError(
        error instanceof Error ? error.message : "Failed to add interest"
      );

      // Revert optimistic update on error
      setInterestedEvents((prev) => prev.filter((e) => e.id !== event.id));
    }
  };

  const removeInterest = async (eventId: string) => {
    if (!isAuthenticated) {
      // For guest users, remove from localStorage
      setInterestedEvents((prev) => {
        const newEvents = prev.filter((event) => event.id !== eventId);
        localStorage.setItem("interestedEvents", JSON.stringify(newEvents));
        return newEvents;
      });
      return;
    }

    // Optimistic update - remove from UI immediately
    const eventToRemove = interestedEvents.find((e) => e.id === eventId);
    setInterestedEvents((prev) => prev.filter((event) => event.id !== eventId));

    setError(null);
    try {
      console.log("Removing interest for event:", eventId);
      const result = await toggleEventInterest(eventId);
      console.log("Remove interest result:", result);

      if (result.success) {
        // Update localStorage
        const updatedEvents = interestedEvents.filter((e) => e.id !== eventId);
        localStorage.setItem("interestedEvents", JSON.stringify(updatedEvents));
      } else {
        // Revert optimistic update on failure
        if (eventToRemove) {
          setInterestedEvents((prev) => [...prev, eventToRemove]);
        }
      }
    } catch (error) {
      console.error("Failed to remove interest:", error);
      setError(
        error instanceof Error ? error.message : "Failed to remove interest"
      );

      // Revert optimistic update on error
      if (eventToRemove) {
        setInterestedEvents((prev) => [...prev, eventToRemove]);
      }
    }
  };

  const isInterested = (eventId: string) => {
    return interestedEvents.some((event) => event.id === eventId);
  };

  const refreshInterests = async () => {
    await fetchInterestedEvents();
  };

  return (
    <InterestContext.Provider
      value={{
        interestedEvents,
        addInterest,
        removeInterest,
        isInterested,
        isLoading,
        error,
        refreshInterests,
      }}
    >
      {children}
    </InterestContext.Provider>
  );
}

export function useInterest() {
  const context = useContext(InterestContext);
  if (context === undefined) {
    throw new Error("useInterest must be used within an InterestProvider");
  }
  return context;
}
