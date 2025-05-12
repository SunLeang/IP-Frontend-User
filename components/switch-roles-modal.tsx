"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface SwitchRolesModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectRole: (role: string) => void
  currentRole?: string
}

export function SwitchRolesModal({ isOpen, onClose, onSelectRole }: SwitchRolesModalProps) {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)

    if (isOpen) {
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  const handleSelectRole = (role: string) => {
    onSelectRole(role)

    // Redirect based on role
    if (role === "volunteer") {
      router.push("/volunteer-role/dashboard")
    } else if (role === "attendee") {
      router.push("/")
    }
  }

  if (!mounted || !isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/50">
      <div className="w-full max-w-md h-full bg-[#001337] text-white animate-in slide-in-from-right">
        <div className="flex justify-between items-center p-6">
          <h2 className="text-2xl font-bold">Switch Roles</h2>
          <button onClick={onClose} className="text-white hover:text-gray-300">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <Button
            onClick={() => handleSelectRole("attendee")}
            className="w-full justify-start bg-white hover:bg-gray-100 text-black h-14 text-lg"
          >
            <div className="bg-blue-500 rounded-full p-1 mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            User (Attendee)
          </Button>

          <Button
            onClick={() => handleSelectRole("volunteer")}
            className="w-full justify-start bg-white hover:bg-gray-100 text-black h-14 text-lg"
          >
            <div className="bg-gray-600 rounded-full p-1 mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 11v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-8" />
                <path d="M18 7v4H6V7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1z" />
                <path d="M12 6V3" />
                <path d="M10 9h4" />
              </svg>
            </div>
            Volunteer
          </Button>
        </div>
      </div>
    </div>
  )
}
