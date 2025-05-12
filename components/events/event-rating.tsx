"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"

interface EventRatingProps {
  onClose: () => void
  onSubmit: (rating: number, feedback: string) => void
}

export function EventRating({ onClose, onSubmit }: EventRatingProps) {
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")

  const handleSubmit = () => {
    onSubmit(rating, feedback)
  }

  return (
    <div className="border rounded-lg p-4 mb-6 relative">
      <button onClick={onClose} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
        <X size={18} />
      </button>

      <h3 className="font-medium mb-2">Rate Our Event!</h3>
      <p className="text-sm text-gray-500 mb-3">Help us improve our event by letting us know:</p>

      <div className="flex justify-center mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} onClick={() => setRating(star)} className="text-2xl px-2">
            <span className={star <= rating ? "text-yellow-400" : "text-gray-300"}>★</span>
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-2">Can you tell us more?</p>
      <Textarea
        placeholder="Add feedback"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className="mb-3"
      />

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  )
}
