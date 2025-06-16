import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CreateCommentRatingData } from "@/services/comment-rating-service";

interface CommentFormProps {
  eventId: string;
  onSubmit: (data: CreateCommentRatingData) => Promise<void>;
  isSubmitting?: boolean;
}

/**
 * Comment Form Component
 * Form for creating new comments and ratings
 */
export function CommentForm({
  eventId,
  onSubmit,
  isSubmitting = false,
}: CommentFormProps) {
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentText.trim() || rating === 0) {
      return;
    }

    try {
      await onSubmit({
        commentText: commentText.trim(),
        rating,
        eventId,
      });

      // Reset form
      setCommentText("");
      setRating(0);
      setHoveredRating(0);
    } catch (error) {
      console.error("Failed to submit comment:", error);
    }
  };

  const displayRating = hoveredRating || rating;

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded-lg p-4 mb-6 bg-white"
    >
      <h3 className="font-medium mb-3">Rate and Review This Event</h3>

      {/* Rating Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Your Rating</label>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i + 1)}
              onMouseEnter={() => setHoveredRating(i + 1)}
              onMouseLeave={() => setHoveredRating(0)}
              className="text-2xl focus:outline-none transition-colors"
              disabled={isSubmitting}
            >
              <span
                className={
                  i < displayRating ? "text-yellow-400" : "text-gray-300"
                }
              >
                ★
              </span>
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm text-gray-600 self-center">
              {rating}/5
            </span>
          )}
        </div>
      </div>

      {/* Comment Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Your Review</label>
        <Textarea
          placeholder="Share your experience with this event..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="min-h-[100px]"
          disabled={isSubmitting}
        />
      </div>

      {/* Submit Actions */}
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setCommentText("");
            setRating(0);
            setHoveredRating(0);
          }}
          disabled={isSubmitting}
        >
          Clear
        </Button>
        <Button
          type="submit"
          className="bg-green-500 hover:bg-green-600"
          disabled={isSubmitting || !commentText.trim() || rating === 0}
        >
          {isSubmitting ? "Posting..." : "Post Review"}
        </Button>
      </div>
    </form>
  );
}
