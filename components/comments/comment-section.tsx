import { CommentCard } from "./comment-card";
import { CommentForm } from "./comment-form";
import { CommentPagination } from "./comment-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useCommentRating } from "@/hooks/useCommentRating";
import { useAuth } from "@/context/auth-context";
import { hasEventEnded } from "@/utils/event-utils";

interface CommentSectionProps {
  eventId: string;
  eventDateTime: string;
}

/**
 * Main Comment Section Component
 * Integrates all comment functionality with pagination
 */
export function CommentSection({
  eventId,
  eventDateTime,
}: CommentSectionProps) {
  const { user } = useAuth();
  const eventEnded = hasEventEnded(eventDateTime);

  const {
    comments,
    stats,
    totalComments,
    currentPage,
    totalPages,
    isLoading,
    isSubmitting,
    error,
    userAttended,
    attendanceStatus,
    checkingAttendance,
    goToPage,
    createComment,
    updateComment,
    deleteComment,
  } = useCommentRating(eventId);

  // Show form only if:
  // 1. Event has ended
  // 2. User is logged in
  // 3. User attended the event
  const showForm = eventEnded && user && userAttended;

  return (
    <div className="mt-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">
          Reviews & Comments ({totalComments})
        </h2>

        {/* Rating Summary */}
        {stats && stats.totalRatings > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={
                    i < Math.round(stats.averageRating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {stats.averageRating.toFixed(1)} ({stats.totalRatings} ratings)
            </span>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Comment Form - Only for ended events and attendees */}
      {showForm && (
        <CommentForm
          eventId={eventId}
          onSubmit={createComment}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Event Status Messages */}
      {!eventEnded && (
        <div className="bg-blue-50 text-blue-700 p-4 rounded-md mb-6">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              Comments and ratings will be available after the event ends.
            </span>
          </div>
        </div>
      )}

      {/* User Not Logged In */}
      {!user && eventEnded && (
        <div className="bg-amber-50 text-amber-700 p-4 rounded-md mb-6">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              Please log in to view and share your experience of this event.
            </span>
          </div>
        </div>
      )}

      {/* User Didn't Attend Event */}
      {user && eventEnded && !userAttended && !checkingAttendance && (
        <div className="bg-orange-50 text-orange-700 p-4 rounded-md mb-6">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-medium">Only attendees can post reviews</p>
              <p className="text-sm mt-1">
                You need to have attended this event to share your experience.
                {attendanceStatus && (
                  <span className="block text-xs mt-1 opacity-75">
                    Status:{" "}
                    {attendanceStatus.attendanceStatus || "Not registered"}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Checking Attendance Status */}
      {checkingAttendance && user && eventEnded && (
        <div className="bg-gray-50 text-gray-700 p-4 rounded-md mb-6">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
            <span>Checking your attendance status...</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        /* No Comments State */
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No comments yet
          </h3>
          <p className="text-gray-600">
            {!eventEnded
              ? "Comments will appear here after the event ends."
              : !user
              ? "Log in to view comments from event attendees."
              : !userAttended && !checkingAttendance
              ? "Only event attendees can share their experience. Comments from participants will appear here."
              : checkingAttendance
              ? "Loading..."
              : "Be the first attendee to share your experience!"}
          </p>
        </div>
      ) : (
        /* Comments List */
        <>
          <div className="space-y-4 mb-6">
            {comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                onUpdate={updateComment}
                onDelete={deleteComment}
                isSubmitting={isSubmitting}
              />
            ))}
          </div>

          {/* Pagination */}
          <CommentPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
}
