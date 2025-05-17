"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toggleEventInterest, getInterestedEvents } from "@/services/event-service"
import { useAuth } from "./auth-context"

export interface Event {
  id: string
  title: string
  image: string
  category: string
  date: {
    month: string
    day: string
  }
  venue: string
  time: string
  price: number
  interested: number
}

interface InterestContextType {
  interestedEvents: Event[]
  addInterest: (event: Event) => void
  removeInterest: (id: string) => void
  isInterested: (id: string) => boolean
  isLoading: boolean
  error: string | null
}

const InterestContext = createContext<InterestContextType | undefined>(undefined)

export function InterestProvider({ children }: { children: ReactNode }) {
  const [interestedEvents, setInterestedEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user, isAuthenticated } = useAuth()

  // Load interested events from localStorage on mount for guest users
  useEffect(() => {
    if (!isAuthenticated) {
      const storedEvents = localStorage.getItem("interestedEvents")
      if (storedEvents) {
        try {
          setInterestedEvents(JSON.parse(storedEvents))
        } catch (error) {
          console.error("Failed to parse interested events from localStorage:", error)
        }
      }
    }
  }, [isAuthenticated])

  // Load interested events from API when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchInterestedEvents()
    }
  }, [isAuthenticated])

  const fetchInterestedEvents = async () => {
    if (!isAuthenticated) return

    setIsLoading(true)
    setError(null)

    try {
      const events = await getInterestedEvents()
      if (events && events.length > 0) {
        const transformedEvents = events.map((event) => ({
          id: event.id,
          title: event.name,
          image: event.profileImage || "/assets/images/event-placeholder.png",
          category: event.category?.name || "Uncategorized",
          date: {
            month: new Date(event.dateTime).toLocaleString("en-US", { month: "short" }).substring(0, 3).toUpperCase(),
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
        }))
        setInterestedEvents(transformedEvents)
      } else {
        setInterestedEvents([])
      }
    } catch (error) {
      console.error("Failed to fetch interested events:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch interested events")
    } finally {
      setIsLoading(false)
    }
  }

  // Save interested events to localStorage whenever they change (for guest users)
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("interestedEvents", JSON.stringify(interestedEvents))
    }
  }, [interestedEvents, isAuthenticated])

  const addInterest = async (event: Event) => {
    if (!isAuthenticated) {
      // For guest users, store in localStorage
      setInterestedEvents((prev) => {
        if (prev.some((e) => e.id === event.id)) {
          return prev
        }
        return [...prev, event]
      })
      return
    }

    setError(null)
    try {
      const result = await toggleEventInterest(event.id)
      if (result.success) {
        setInterestedEvents((prev) => {
          if (prev.some((e) => e.id === event.id)) {
            return prev
          }
          return [...prev, event]
        })
      }
    } catch (error) {
      console.error("Failed to add interest:", error)
      setError(error instanceof Error ? error.message : "Failed to add interest")
    }
  }

  const removeInterest = async (eventId: string) => {
    if (!isAuthenticated) {
      // For guest users, remove from localStorage
      setInterestedEvents((prev) => prev.filter((event) => event.id !== eventId))
      return
    }

    setError(null)
    try {
      const result = await toggleEventInterest(eventId)
      if (result.success) {
        setInterestedEvents((prev) => prev.filter((event) => event.id !== eventId))
      }
    } catch (error) {
      console.error("Failed to remove interest:", error)
      setError(error instanceof Error ? error.message : "Failed to remove interest")
    }
  }

  const isInterested = (eventId: string) => {
    return interestedEvents.some((event) => event.id === eventId)
  }

  return (
    <InterestContext.Provider
      value={{
        interestedEvents,
        addInterest,
        removeInterest,
        isInterested,
        isLoading,
        error,
      }}
    >
      {children}
    </InterestContext.Provider>
  )
}

export function useInterest() {
  const context = useContext(InterestContext)
  if (context === undefined) {
    throw new Error("useInterest must be used within an InterestProvider")
  }
  return context
}
