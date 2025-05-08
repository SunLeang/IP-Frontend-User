"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Bell, ChevronDown, History, Home, ClipboardList, Calendar } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { SwitchRolesModal } from "@/components/switch-roles-modal"

export function VolunteerNavbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSwitchRolesModalOpen, setIsSwitchRolesModalOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleSwitchRole = (role: string) => {
    setIsSwitchRolesModalOpen(false)
    if (role === "attendee") {
      // Redirect to user homepage
      router.push("/")
    }
  }

  return (
    <>
      <header className="bg-white py-3 px-4 border-b sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/volunteer-role/dashboard" className="flex items-center">
            <Image src="/assets/images/logo.png" alt="Eventura" width={32} height={32} />
            <span className="ml-2 font-bold text-lg">eventura</span>
          </Link>

          {/* Center Navigation */}
          <nav className="flex items-center absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-6">
              <NavItem
                href="/volunteer-role/dashboard"
                icon={<Home size={16} />}
                label="Home"
                active={pathname === "/volunteer-role/dashboard"}
              />
              <NavItem
                href="/volunteer-role/events"
                icon={<Calendar size={16} />}
                label="Events"
                active={pathname.includes("/volunteer-role/events")}
              />
              <NavItem
                href="/volunteer-role/tasks"
                icon={<ClipboardList size={16} />}
                label="Tasks"
                active={pathname === "/volunteer-role/tasks"}
              />
              <NavItem
                href="/volunteer-role/history"
                icon={<History size={16} />}
                label="History"
                active={pathname === "/volunteer-role/history"}
              />
            </div>
          </nav>

          {/* Right Side - User Profile & Notifications */}
          <div className="flex items-center gap-4">
            <button className="relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                2
              </span>
            </button>

            <div className="relative">
              <button className="flex items-center gap-2" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src="/icons/user.png"
                    alt="User"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <ChevronDown size={16} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false)
                      setIsSwitchRolesModalOpen(true)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Switch Role
                  </button>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Setting
                  </Link>
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Log Out
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <SwitchRolesModal
        isOpen={isSwitchRolesModalOpen}
        onClose={() => setIsSwitchRolesModalOpen(false)}
        onSelectRole={handleSwitchRole}
        currentRole="volunteer"
      />
    </>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  active?: boolean
}

function NavItem({ href, icon, label, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center text-sm ${
        active ? "text-blue-500 border-b-2 border-blue-500 pb-3 -mb-3" : "text-gray-500 hover:text-blue-500"
      }`}
    >
      <span className="mr-1.5">{icon}</span>
      {label}
    </Link>
  )
}
