import { apiGet, apiPost } from "./api"

export interface Event {
  id: string
  name: string
  description: string
  profileImage?: string
  coverImage?: string
  dateTime: string
  locationDesc: string
  locationImage?: string
  status: "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED"
  acceptingVolunteers: boolean
  categoryId: string
  category?: {
    id: string
    name: string
    image?: string
  }
  organizerId: string
  organizer?: {
    id: string
    fullName: string
  }
  interestedCount?: number
}

export async function getEvents(params?: Record<string, string>): Promise<Event[]> {
  try {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ""
    return await apiGet(`/events${queryString}`)
  } catch (error) {
    console.error("Failed to fetch events:", error)
    return []
  }
}

export async function getPopularEvents(): Promise<Event[]> {
  try {
    return await apiGet("/events/popular")
  } catch (error) {
    console.error("Failed to fetch popular events:", error)
    return []
  }
}

export async function getOnlineEvents(): Promise<Event[]> {
  try {
    return await apiGet("/events/online")
  } catch (error) {
    console.error("Failed to fetch online events:", error)
    return []
  }
}

export async function getEventById(id: string): Promise<Event | null> {
  try {
    return await apiGet(`/events/${id}`)
  } catch (error) {
    console.error(`Failed to fetch event with id ${id}:`, error)
    return null
  }
}

export async function toggleEventInterest(eventId: string): Promise<{ success: boolean }> {
  try {
    return await apiPost(`/events/${eventId}/interest`, {})
  } catch (error) {
    console.error(`Failed to toggle interest for event ${eventId}:`, error)
    return { success: false }
  }
}
