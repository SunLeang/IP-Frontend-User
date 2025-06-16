import { apiGet, apiPost, apiPatch, apiDelete } from "./api";

export interface CommentRating {
  id: string;
  commentText: string;
  rating: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    fullName: string;
    username: string;
  };
  event?: {
    id: string;
    name: string;
    dateTime: string;
  };
}

export interface CommentRatingStats {
  averageRating: number;
  totalRatings: number;
  highestRating: number;
  lowestRating: number;
  ratingDistribution: {
    rating: number;
    count: number;
  }[];
}

export interface CreateCommentRatingData {
  commentText: string;
  rating: number;
  eventId: string;
}

export interface UpdateCommentRatingData {
  commentText?: string;
  rating?: number;
  status?: string;
}

export interface AttendanceStatusResponse {
  hasAttended: boolean;
  attendanceStatus?: string;
  checkedInAt?: string;
  eventStatus: string;
}

/**
 * Get comments and ratings for an event with pagination
 */
export async function getEventComments(
  eventId: string,
  page: number = 1,
  limit: number = 10
): Promise<CommentRating[]> {
  try {
    console.log(`Fetching comments for event ${eventId}, page ${page}`);

    const response = await apiGet(`/api/comments-ratings/event/${eventId}`);

    // Implement client-side pagination since backend returns all comments
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return Array.isArray(response) ? response.slice(startIndex, endIndex) : [];
  } catch (error) {
    console.error("Failed to fetch event comments:", error);
    return [];
  }
}

/**
 * Get total count of comments for an event
 */
export async function getEventCommentsCount(eventId: string): Promise<number> {
  try {
    const response = await apiGet(`/api/comments-ratings/event/${eventId}`);
    return Array.isArray(response) ? response.length : 0;
  } catch (error) {
    console.error("Failed to fetch event comments count:", error);
    return 0;
  }
}

/**
 * Get rating statistics for an event
 */
export async function getEventRatingStats(
  eventId: string
): Promise<CommentRatingStats | null> {
  try {
    console.log(`Fetching rating stats for event ${eventId}`);
    const response = await apiGet(
      `/api/comments-ratings/event/${eventId}/stats`
    );
    return response;
  } catch (error) {
    console.error("Failed to fetch event rating stats:", error);
    return null;
  }
}

/**
 * Create a new comment and rating
 */
export async function createCommentRating(
  data: CreateCommentRatingData
): Promise<CommentRating> {
  try {
    console.log("Creating comment and rating:", data);
    const response = await apiPost("/api/comments-ratings", data);
    return response;
  } catch (error) {
    console.error("Failed to create comment and rating:", error);
    throw error;
  }
}

/**
 * Update a comment and rating
 */
export async function updateCommentRating(
  id: string,
  data: UpdateCommentRatingData
): Promise<CommentRating> {
  try {
    console.log(`Updating comment ${id}:`, data);
    const response = await apiPatch(`/api/comments-ratings/${id}`, data);
    return response;
  } catch (error) {
    console.error("Failed to update comment and rating:", error);
    throw error;
  }
}

/**
 * Delete a comment and rating
 */
export async function deleteCommentRating(id: string): Promise<void> {
  try {
    console.log(`Deleting comment ${id}`);
    await apiDelete(`/api/comments-ratings/${id}`);
  } catch (error) {
    console.error("Failed to delete comment and rating:", error);
    throw error;
  }
}

/**
 * Get current user's comments and ratings
 */
export async function getMyComments(): Promise<CommentRating[]> {
  try {
    const response = await apiGet("/api/comments-ratings/my-comments");
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error("Failed to fetch my comments:", error);
    return [];
  }
}

/**
 * Check if current user attended a specific event
 */
export async function checkUserAttendance(eventId: string): Promise<boolean> {
  try {
    console.log(`Checking user attendance for event ${eventId}`);

    // Use the attendance check endpoint from your backend
    const response = await apiGet(`/api/attendance/check/${eventId}`);

    // Check if user has attended (status = 'JOINED')
    const hasAttended = response?.hasAttended || false;

    console.log(`User attendance status:`, {
      hasAttended,
      attendanceStatus: response?.attendanceStatus,
      eventStatus: response?.eventStatus,
    });

    return hasAttended;
  } catch (error: any) {
    console.log("Error checking user attendance:", error);

    // Check if it's a 404 error (attendance record not found)
    if (
      error?.response?.status === 404 ||
      error?.message?.includes("not found")
    ) {
      console.log(
        "No attendance record found - user has not registered for this event"
      );
      return false;
    }

    // For other errors, also return false but log the error
    console.error("Failed to check user attendance:", error);
    return false;
  }
}

/**
 * Get detailed attendance status for debugging
 * UPDATED: Better error handling
 */
export async function getAttendanceStatus(
  eventId: string
): Promise<AttendanceStatusResponse | null> {
  try {
    const response = await apiGet(`/api/attendance/check/${eventId}`);
    return response;
  } catch (error: any) {
    console.log("Error getting attendance status:", error);

    // Return a default response for missing attendance records
    if (
      error?.response?.status === 404 ||
      error?.message?.includes("not found")
    ) {
      return {
        hasAttended: false,
        attendanceStatus: "NOT_REGISTERED",
        eventStatus: "UNKNOWN",
      };
    }

    console.error("Failed to get attendance status:", error);
    return null;
  }
}
