"use client"

import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"

interface JoinButtonProps {
  isJoined: boolean
  onClick: () => void
  className?: string
}

export function JoinButton({ isJoined, onClick, className = "" }: JoinButtonProps) {
  return isJoined ? (
    <Button onClick={onClick} variant="outline" className={`${className}`}>
      Cancel
    </Button>
  ) : (
    <Button onClick={onClick} className={`bg-green-500 hover:bg-green-600 ${className}`}>
      <UserPlus className="mr-2 h-5 w-5" />
      Join event
    </Button>
  )
}
