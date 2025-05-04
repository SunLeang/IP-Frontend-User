"use client"

import { Button } from "@/components/ui/button"
import type { ReactNode } from "react"

interface SocialButtonProps {
  icon: ReactNode
  provider: string
  action: "Login" | "Sign up"
  onClick?: () => void
}

export function SocialButton({ icon, provider, action, onClick }: SocialButtonProps) {
  return (
    <Button variant="outline" className="w-full flex items-center justify-center gap-2 h-12" onClick={onClick}>
      {icon}
      <span>
        {action} with {provider}
      </span>
    </Button>
  )
}
