import { useState, useEffect } from "react";
import {
  getEventComments,
  getEventCommentsCount,
  getEventRatingStats,
  createCommentRating,
  updateCommentRating,
  deleteCommentRating,
  checkUserAttendance,
  getAttendanceStatus,
  CommentRating,
  CommentRatingStats,
  CreateCommentRatingData,
  UpdateCommentRatingData,
  AttendanceStatusResponse,
} from "@/services/comment-rating-service";
import { useAuth } from "@/context/auth-context";

interface UseCommentRatingReturn {
  comments: CommentRating[];
  stats: CommentRatingStats | null;
  totalComments: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  userAttended: boolean;
  attendanceStatus: AttendanceStatusResponse | null;
  checkingAttendance: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  createComment: (data: CreateCommentRatingData) => Promise<void>;
  updateComment: (id: string, data: UpdateCommentRatingData) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  refetch: () => void;
}

/**
 * Custom hook for managing event comments and ratings with pagination
 */
export function useCommentRating(
  eventId: string,
  limit: number = 10
): UseCommentRatingReturn {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentRating[]>([]);
  const [stats, setStats] = useState<CommentRatingStats | null>(null);
  const [totalComments, setTotalComments] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userAttended, setUserAttended] = useState(false);
  const [attendanceStatus, setAttendanceStatus] =
    useState<AttendanceStatusResponse | null>(null);
  const [checkingAttendance, setCheckingAttendance] = useState(false);

  // Calculate pagination values
  const totalPages = Math.ceil(totalComments / limit);
  const hasMore = currentPage < totalPages;

  /**
   * Check if user attended the event
   */
  const checkAttendance = async () => {
    if (!user || !eventId) {
      setUserAttended(false);
      setAttendanceStatus(null);
      setCheckingAttendance(false);
      return;
    }

    try {
      setCheckingAttendance(true);
      setError(null);

      console.log(
        `Starting attendance check for user ${user.id} on event ${eventId}`
      );

      // Get detailed attendance status (this should not throw for missing records)
      const detailedStatus = await getAttendanceStatus(eventId);
      setAttendanceStatus(detailedStatus);

      // Simple boolean check for UI (this should not throw for missing records)
      const attended = await checkUserAttendance(eventId);
      setUserAttended(attended);

      console.log(`Attendance check completed:`, {
        attended,
        detailedStatus,
        eventId,
        userId: user.id,
      });
    } catch (error) {
      console.error("Error checking attendance:", error);

      // Set safe default values - don't show error to user for missing attendance
      setUserAttended(false);
      setAttendanceStatus({
        hasAttended: false,
        attendanceStatus: "NOT_REGISTERED",
        eventStatus: "UNKNOWN",
      });

      // Only set error for actual system errors, not missing attendance records
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      if (
        !errorMessage.includes("not found") &&
        !errorMessage.includes("404")
      ) {
        setError("Failed to check attendance status");
      }
    } finally {
      setCheckingAttendance(false);
    }
  };

  /**
   * Fetch comments for current page
   */
  const fetchComments = async (page: number = currentPage) => {
    if (!eventId) return;

    try {
      setIsLoading(true);
      setError(null);

      console.log(`Fetching comments for event ${eventId}, page ${page}`);

      const [commentsData, commentsCount, statsData] = await Promise.all([
        getEventComments(eventId, page, limit),
        getEventCommentsCount(eventId),
        getEventRatingStats(eventId),
      ]);

      setComments(commentsData);
      setTotalComments(commentsCount);
      setStats(statsData);

      console.log(`Loaded ${commentsData.length} comments for page ${page}`);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("Failed to load comments");
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Navigate to specific page
   */
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  /**
   * Navigate to next page
   */
  const nextPage = () => {
    if (hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  /**
   * Navigate to previous page
   */
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  /**
   * Create a new comment and rating
   */
  const createComment = async (data: CreateCommentRatingData) => {
    if (!userAttended) {
      throw new Error("Only event attendees can post comments and ratings");
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const newComment = await createCommentRating(data);

      // Add to the beginning of current comments if on first page
      if (currentPage === 1) {
        setComments((prev) => [newComment, ...prev.slice(0, limit - 1)]);
      }

      // Update total count
      setTotalComments((prev) => prev + 1);

      // Refresh stats
      const updatedStats = await getEventRatingStats(eventId);
      setStats(updatedStats);

      console.log("Comment created successfully");
    } catch (err: any) {
      console.error("Error creating comment:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create comment";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Update an existing comment
   */
  const updateComment = async (id: string, data: UpdateCommentRatingData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const updatedComment = await updateCommentRating(id, data);

      // Update comment in current list
      setComments((prev) =>
        prev.map((comment) => (comment.id === id ? updatedComment : comment))
      );

      // Refresh stats if rating was updated
      if (data.rating !== undefined) {
        const updatedStats = await getEventRatingStats(eventId);
        setStats(updatedStats);
      }

      console.log("Comment updated successfully");
    } catch (err: any) {
      console.error("Error updating comment:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update comment";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Delete a comment
   */
  const deleteComment = async (id: string) => {
    try {
      setIsSubmitting(true);
      setError(null);

      await deleteCommentRating(id);

      // Remove comment from current list
      setComments((prev) => prev.filter((comment) => comment.id !== id));

      // Update total count
      setTotalComments((prev) => Math.max(0, prev - 1));

      // Refresh stats
      const updatedStats = await getEventRatingStats(eventId);
      setStats(updatedStats);

      // If current page is empty and not the first page, go to previous page
      if (comments.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }

      console.log("Comment deleted successfully");
    } catch (err: any) {
      console.error("Error deleting comment:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete comment";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Refetch current page and attendance status
   */
  const refetch = () => {
    if (eventId) {
      fetchComments(currentPage);
      if (user) {
        checkAttendance();
      }
    }
  };

  // Check attendance when user or eventId changes
  useEffect(() => {
    if (eventId && user) {
      checkAttendance();
    } else {
      setUserAttended(false);
      setAttendanceStatus(null);
      setCheckingAttendance(false);
    }
  }, [user, eventId]);

  // Fetch comments when eventId or currentPage changes
  useEffect(() => {
    if (eventId) {
      fetchComments(currentPage);
    }
  }, [eventId, currentPage]);

  return {
    comments,
    stats,
    totalComments,
    currentPage,
    totalPages,
    hasMore,
    isLoading,
    isSubmitting,
    error,
    userAttended,
    attendanceStatus,
    checkingAttendance,
    goToPage,
    nextPage,
    prevPage,
    createComment,
    updateComment,
    deleteComment,
    refetch,
  };
}
