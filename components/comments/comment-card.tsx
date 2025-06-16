import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { CommentRating } from "@/services/comment-rating-service";
import { useAuth } from "@/context/auth-context";

interface CommentCardProps {
  comment: CommentRating;
  onUpdate: (
    id: string,
    data: { commentText?: string; rating?: number }
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isSubmitting?: boolean;
}

/**
 * Individual Comment Card Component
 * Displays a single comment with rating and interaction options
 */
export function CommentCard({
  comment,
  onUpdate,
  onDelete,
  isSubmitting = false,
}: CommentCardProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.commentText);
  const [editRating, setEditRating] = useState(comment.rating);
  const [showMenu, setShowMenu] = useState(false);

  const isOwner = user?.id === comment.user.id;
  const canEdit = isOwner && !isSubmitting;

  /**
   * Format date for display
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  /**
   * Handle edit submission
   */
  const handleEditSubmit = async () => {
    try {
      await onUpdate(comment.id, {
        commentText: editText,
        rating: editRating,
      });
      setIsEditing(false);
      setShowMenu(false);
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  /**
   * Handle edit cancellation
   */
  const handleEditCancel = () => {
    setEditText(comment.commentText);
    setEditRating(comment.rating);
    setIsEditing(false);
    setShowMenu(false);
  };

  /**
   * Handle delete confirmation
   */
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await onDelete(comment.id);
        setShowMenu(false);
      } catch (error) {
        console.error("Failed to delete comment:", error);
      }
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex items-start gap-3">
        {/* User Avatar */}
        <Image
          src="/icons/user.png"
          alt={comment.user.fullName}
          width={40}
          height={40}
          className="rounded-full"
        />

        <div className="flex-1">
          {/* User Info and Menu */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">
                {comment.user.fullName}
              </span>
              <span className="text-xs text-gray-500">
                @{comment.user.username}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500">
                {formatDate(comment.createdAt)}
              </span>
            </div>

            {/* Actions Menu */}
            {canEdit && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMenu(!showMenu)}
                  className="h-8 w-8 p-0"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>

                {showMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-white border rounded-md shadow-lg z-10 min-w-[120px]">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Rating Display */}
          <div className="flex text-yellow-400 my-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={
                  i < comment.rating ? "text-yellow-400" : "text-gray-300"
                }
              >
                ★
              </span>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              ({comment.rating}/5)
            </span>
          </div>

          {/* Comment Content or Edit Form */}
          {isEditing ? (
            <div className="space-y-3">
              {/* Rating Editor */}
              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setEditRating(i + 1)}
                      className="text-2xl focus:outline-none"
                    >
                      <span
                        className={
                          i < editRating ? "text-yellow-400" : "text-gray-300"
                        }
                      >
                        ★
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Editor */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Comment
                </label>
                <Textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="min-h-[80px]"
                  placeholder="Share your experience..."
                />
              </div>

              {/* Edit Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleEditSubmit}
                  disabled={isSubmitting || !editText.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 mt-1">{comment.commentText}</p>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div className="fixed inset-0 z-5" onClick={() => setShowMenu(false)} />
      )}
    </div>
  );
}
