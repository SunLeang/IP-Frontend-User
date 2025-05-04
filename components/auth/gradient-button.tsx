"use client"

import { Button } from "@/components/ui/button"
import type { ReactNode } from "react"

interface GradientButtonProps {
  children: ReactNode
  type?: "button" | "submit" | "reset"
  onClick?: () => void
  className?: string
}

export function GradientButton({ children, type = "button", onClick, className = "" }: GradientButtonProps) {
  return (
    <Button
      type={type}
      onClick={onClick}
      className={`w-full h-12 bg-gradient-to-r from-yellow-300 to-orange-400 hover:from-yellow-400 hover:to-orange-500 text-white font-medium ${className}`}
    >
      {children}
    </Button>
  )
}
