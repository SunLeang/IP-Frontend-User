"use client"

import { Button } from "@/components/ui/button"

interface CancelConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function CancelConfirmationModal({ isOpen, onClose, onConfirm }: CancelConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 animate-in fade-in zoom-in duration-300">
        <h2 className="text-2xl font-bold text-center text-orange-500 mb-4">Are you sure?</h2>

        <p className="text-center text-gray-700 text-lg mb-2">
          Are you sure you want to cancel your attending on this event?
        </p>
        <p className="text-center text-gray-600 mb-6">Please confirm your choice.</p>

        <div className="flex gap-4">
          <Button variant="outline" className="flex-1 py-6 border-gray-300" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1 py-6 bg-green-500 hover:bg-green-600" onClick={onConfirm}>
            Yes
          </Button>
        </div>
      </div>
    </div>
  )
}
