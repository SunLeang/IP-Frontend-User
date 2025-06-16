import { apiGet } from "./api";

export interface VolunteerHistoryEvent {
  id: string;
  name: string;
  description: string;
  dateTime: string;
  locationDesc: string;
  locationImage?: string;
  profileImage?: string;
  coverImage?: string;
  status: string;
  volunteerStatus: string;
  approvedAt?: string;
  category?: {
    id: string;
    name: string;
    image?: string;
  };
  organizer?: {
    id: string;
    fullName: string;
    email: string;
  };
  _count?: {
    attendingUsers?: number;
    volunteers?: number;
    tasks?: number;
  };
}

export interface VolunteerHistoryResponse {
  data: VolunteerHistoryEvent[];
  meta: {
    total: number;
    completed: number;
    upcoming: number;
    cancelled: number;
  };
}

export interface VolunteerHistoryQuery {
  status?: string;
  search?: string;
}

/**
 * Get volunteer's event history
 */
export async function getVolunteerHistory(
  query?: VolunteerHistoryQuery
): Promise<VolunteerHistoryResponse> {
  try {
    console.log("Fetching volunteer history with query:", query);

    // Build query parameters - filter out undefined values
    const params = new URLSearchParams();

    if (query?.status && query.status !== "") {
      params.append("status", query.status);
    }

    if (query?.search && query.search !== "" && query.search !== "undefined") {
      params.append("search", query.search);
    }

    const queryString = params.toString();
    const url = queryString
      ? `/api/volunteer/history?${queryString}`
      : "/api/volunteer/history";

    console.log("📡 Making API call to:", url);

    const response = await apiGet(url);
    console.log("Volunteer history response:", response);

    return response;
  } catch (error) {
    console.error("Failed to fetch volunteer history:", error);
    return {
      data: [],
      meta: {
        total: 0,
        completed: 0,
        upcoming: 0,
        cancelled: 0,
      },
    };
  }
}

/**
 * Get detailed volunteer event history by ID
 */
export async function getVolunteerEventDetail(
  eventId: string
): Promise<VolunteerHistoryEvent | null> {
  try {
    console.log(`Fetching volunteer event detail for: ${eventId}`);
    const response = await apiGet(`/api/volunteer/history/${eventId}`);
    console.log("Volunteer event detail response:", response);
    return response;
  } catch (error) {
    console.error("Failed to fetch volunteer event detail:", error);
    return null;
  }
}
