"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Comment {
  id: string;
  user: {
    name: string;
    image: string;
    time: string;
  };
  rating: number;
  text: string;
  replies?: Comment[];
}

interface CommentSectionProps {
  comments: Comment[];
  totalComments: number;
}

export function CommentSection({
  comments,
  totalComments,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    console.log("Submitting comment:", newComment);
    setNewComment("");
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">
        Comment and Review ({totalComments})
      </h2>

      {/* Comments list */}
      <div className="space-y-4 mb-6">
        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>

      {/* New comment form */}
      <div className="border rounded-lg p-4 mb-6">
        <Textarea
          placeholder="I agree!"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="mb-3 min-h-[100px]"
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button
            className="bg-green-500 hover:bg-green-600"
            onClick={handleSubmitComment}
          >
            Post
          </Button>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-1 mt-4">
        <Button variant="outline" size="sm">
          Prev
        </Button>
        <Button variant="outline" size="sm" className="bg-black text-white">
          1
        </Button>
        <Button variant="outline" size="sm">
          2
        </Button>
        <Button variant="outline" size="sm">
          3
        </Button>
        <span>...</span>
        <Button variant="outline" size="sm">
          10
        </Button>
        <Button variant="outline" size="sm">
          Next
        </Button>
        <Button variant="outline" size="sm">
          Last »
        </Button>
      </div>
    </div>
  );
}

function CommentCard({ comment }: { comment: Comment }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Image
          src={comment.user.image || "/assets/icons/user.png"}
          alt={comment.user.name}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{comment.user.name}</span>
            <span className="text-xs text-gray-500">{comment.user.time}</span>
          </div>

          {comment.rating > 0 && (
            <div className="flex text-yellow-400 my-1">
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
            </div>
          )}

          <p className="text-gray-700 mt-1">{comment.text}</p>

          <div className="flex justify-end mt-2">
            <Button variant="link" size="sm" className="text-blue-600">
              Reply
            </Button>
            <Button variant="link" size="sm" className="text-blue-600">
              Read More
            </Button>
          </div>

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="ml-6 mt-3 space-y-3">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="border-l-2 border-gray-200 pl-3">
                  <div className="flex items-start gap-3">
                    <Image
                      src={reply.user.image || "/assets/icons/user.png"}
                      alt={reply.user.name}
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{reply.user.name}</span>
                        <span className="text-xs text-gray-500">
                          {reply.user.time}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-1">{reply.text}</p>
                      <div className="flex justify-end mt-2">
                        <Button
                          variant="link"
                          size="sm"
                          className="text-blue-600"
                        >
                          Reply
                        </Button>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-blue-600"
                        >
                          Read More
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
