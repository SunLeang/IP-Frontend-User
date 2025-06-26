"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { useAuth } from "./auth-context";
import {
  toggleEventInterest,
  getInterestedEvents,
} from "@/services/event-service";

// Update Event interface to match EventCardData
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
  attending?: number;
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  // Use refs to control fetching and prevent infinite loops
  const hasInitialized = useRef(false);
  const fetchingRef = useRef(false);
  const lastAuthState = useRef<boolean | null>(null);

  // Stable fetch function that doesn't change on every render
  const fetchInterestedEvents = useCallback(
    async (force = false) => {
      // Prevent duplicate calls
      if (fetchingRef.current && !force) {
        console.log("Already fetching, skipping...");
        return;
      }

      // Only fetch if auth state actually changed or it's forced
      if (
        !force &&
        lastAuthState.current === isAuthenticated &&
        hasInitialized.current
      ) {
        console.log("Auth state hasn't changed, skipping fetch");
        return;
      }

      fetchingRef.current = true;
      setIsLoading(true);
      setError(null);

      try {
        console.log("Fetching interested events...", {
          isAuthenticated,
          force,
        });

        if (!isAuthenticated) {
          // Handle guest users - load from localStorage
          const storedEvents = localStorage.getItem("interestedEvents");
          if (storedEvents) {
            try {
              const parsed = JSON.parse(storedEvents);
              if (Array.isArray(parsed)) {
                setInterestedEvents(parsed);
              } else {
                setInterestedEvents([]);
              }
            } catch (error) {
              console.error("Error parsing stored events:", error);
              setInterestedEvents([]);
              localStorage.removeItem("interestedEvents");
            }
          } else {
            setInterestedEvents([]);
          }
        } else {
          // Handle authenticated users - fetch from API
          const events = await getInterestedEvents();

          if (events && Array.isArray(events)) {
            // Transform API events to match Event interface
            const transformedEvents: Event[] = events.map((apiEvent: any) => ({
              id: apiEvent.id,
              title: apiEvent.name,
              image: apiEvent.profileImage || "",
              category: apiEvent.category?.name || "General",
              date: {
                month: new Date(apiEvent.dateTime)
                  .toLocaleDateString("en-US", { month: "short" })
                  .toUpperCase(),
                day: new Date(apiEvent.dateTime).toLocaleDateString("en-US", {
                  day: "2-digit",
                }),
              },
              venue: apiEvent.locationDesc || "",
              time: new Date(apiEvent.dateTime).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }),
              price: 0,
              interested: apiEvent._count?.interestedUsers || 0,
              attending: apiEvent._count?.attendingUsers || 0,
            }));

            setInterestedEvents(transformedEvents);
            // Also update localStorage
            localStorage.setItem(
              "interestedEvents",
              JSON.stringify(transformedEvents)
            );
          } else {
            setInterestedEvents([]);
          }
        }

        // Update tracking variables
        lastAuthState.current = isAuthenticated;
        hasInitialized.current = true;
      } catch (error) {
        console.error("Failed to fetch interested events:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch events"
        );

        // Fallback to localStorage on error
        if (isAuthenticated) {
          const storedEvents = localStorage.getItem("interestedEvents");
          if (storedEvents) {
            try {
              const parsed = JSON.parse(storedEvents);
              if (Array.isArray(parsed)) {
                setInterestedEvents(parsed);
              }
            } catch (parseError) {
              console.error("Error parsing fallback events:", parseError);
            }
          }
        }
      } finally {
        setIsLoading(false);
        fetchingRef.current = false;
      }
    },
    [isAuthenticated]
  );

  // Effect to handle authentication changes
  useEffect(() => {
    // Only fetch if auth state actually changed or we haven't initialized
    if (lastAuthState.current !== isAuthenticated || !hasInitialized.current) {
      fetchInterestedEvents();
    }
  }, [isAuthenticated, fetchInterestedEvents]);

  const addInterest = useCallback(
    async (event: Event) => {
      // Optimistic update
      setInterestedEvents((prev) => {
        if (prev.some((e) => e.id === event.id)) return prev;
        const newEvents = [...prev, event];
        localStorage.setItem("interestedEvents", JSON.stringify(newEvents));
        return newEvents;
      });

      if (!isAuthenticated) return;

      try {
        const result = await toggleEventInterest(event.id);
        if (!result.success || !result.isInterested) {
          // Rollback on failure
          setInterestedEvents((prev) => prev.filter((e) => e.id !== event.id));
          const storedEvents = localStorage.getItem("interestedEvents");
          if (storedEvents) {
            const parsed = JSON.parse(storedEvents);
            const filtered = parsed.filter((e: Event) => e.id !== event.id);
            localStorage.setItem("interestedEvents", JSON.stringify(filtered));
          }
        }
      } catch (error) {
        console.error("Failed to add interest:", error);
        // Rollback on error
        setInterestedEvents((prev) => prev.filter((e) => e.id !== event.id));
        setError("Failed to add interest");
      }
    },
    [isAuthenticated]
  );

  const removeInterest = useCallback(
    async (eventId: string) => {
      // Store for rollback
      const eventToRemove = interestedEvents.find((e) => e.id === eventId);

      // Optimistic update
      setInterestedEvents((prev) => {
        const newEvents = prev.filter((event) => event.id !== eventId);
        localStorage.setItem("interestedEvents", JSON.stringify(newEvents));
        return newEvents;
      });

      if (!isAuthenticated) return;

      try {
        const result = await toggleEventInterest(eventId);
        if (!result.success || result.isInterested) {
          // Rollback on failure
          if (eventToRemove) {
            setInterestedEvents((prev) => {
              const newEvents = [...prev, eventToRemove];
              localStorage.setItem(
                "interestedEvents",
                JSON.stringify(newEvents)
              );
              return newEvents;
            });
          }
        }
      } catch (error) {
        console.error("Failed to remove interest:", error);
        // Rollback on error
        if (eventToRemove) {
          setInterestedEvents((prev) => {
            const newEvents = [...prev, eventToRemove];
            localStorage.setItem("interestedEvents", JSON.stringify(newEvents));
            return newEvents;
          });
        }
        setError("Failed to remove interest");
      }
    },
    [isAuthenticated, interestedEvents]
  );

  const isInterested = useCallback(
    (eventId: string) => {
      return interestedEvents.some((event) => event.id === eventId);
    },
    [interestedEvents]
  );

  const refreshInterests = useCallback(async () => {
    await fetchInterestedEvents(true);
  }, [fetchInterestedEvents]);

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
