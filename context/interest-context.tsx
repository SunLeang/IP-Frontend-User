"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

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
}

const InterestContext = createContext<InterestContextType | undefined>(undefined)

export function InterestProvider({ children }: { children: ReactNode }) {
  const [interestedEvents, setInterestedEvents] = useState<Event[]>([])

  // Load interested events from localStorage on mount
  useEffect(() => {
    const storedEvents = localStorage.getItem("interestedEvents")
    if (storedEvents) {
      try {
        setInterestedEvents(JSON.parse(storedEvents))
      } catch (error) {
        console.error("Failed to parse interested events from localStorage:", error)
      }
    }
  }, [])

  // Save interested events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("interestedEvents", JSON.stringify(interestedEvents))
  }, [interestedEvents])

  const addInterest = (event: Event) => {
    setInterestedEvents((prev) => {
      // Check if event already exists
      if (prev.some((e) => e.id === event.id)) {
        return prev
      }
      return [...prev, event]
    })
  }

  const removeInterest = (id: string) => {
    setInterestedEvents((prev) => prev.filter((event) => event.id !== id))
  }

  const isInterested = (id: string) => {
    return interestedEvents.some((event) => event.id === id)
  }

  return (
    <InterestContext.Provider value={{ interestedEvents, addInterest, removeInterest, isInterested }}>
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
