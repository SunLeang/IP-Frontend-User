"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Calendar,
  ChevronDown,
  Heart,
  Home,
  LogOut,
  Phone,
  Settings,
  UserPlus,
  UserIcon as UserSwitch,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SwitchRolesModal } from "@/components/switch-roles-modal"

interface NavbarProps {
  isLoggedIn?: boolean
  userImage?: string
}

export default function Navbar({ isLoggedIn = false, userImage = "/assets/images/avatar.png" }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSwitchRolesModalOpen, setIsSwitchRolesModalOpen] = useState(false)

  const handleSwitchRole = () => {
    setIsSwitchRolesModalOpen(true)
  }

  const handleSelectRole = (role: string) => {
    console.log(`Selected role: ${role}`)
    setIsSwitchRolesModalOpen(false)
  }

  return (
    <>
      <header className="bg-white py-3 px-4 border-b sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/assets/images/logo.png" alt="Eventura" width={40} height={40} />
            <span className="ml-2 font-bold text-lg">eventura</span>
          </Link>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-6">
              <NavItem href="/" icon={<Home size={16} />} label="Home" active />
              <NavItem href="/events" icon={<Calendar size={16} />} label="Events" />
              <NavItem href="/interest" icon={<Heart size={16} />} label="Interest" />
              <NavItem href="/contact-us" icon={<Phone size={16} />} label="Contact Us" />
              <NavItem href="/volunteer" icon={<UserPlus size={16} />} label="Volunteer" />
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex flex-col space-y-1"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`w-6 h-0.5 bg-gray-600 transition-all ${isOpen ? "rotate-45 translate-y-1.5" : ""}`}
            ></span>
            <span className={`w-6 h-0.5 bg-gray-600 transition-all ${isOpen ? "opacity-0" : ""}`}></span>
            <span
              className={`w-6 h-0.5 bg-gray-600 transition-all ${isOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
            ></span>
          </button>

          {/* Auth Buttons or User Profile */}
          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 focus:outline-none">
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200">
                      <Image
                        src={userImage || "/placeholder.svg"}
                        alt="User"
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <ChevronDown size={16} className="text-gray-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="cursor-pointer" onClick={handleSwitchRole}>
                    <UserSwitch className="mr-2 h-4 w-4" />
                    <span>Switch Role</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Setting</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black"
                  asChild
                >
                  <Link href="/signup">Signup</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pt-4 pb-2 px-4 border-t mt-3">
            <nav className="flex flex-col space-y-4">
              <NavItem href="/" icon={<Home size={16} />} label="Home" active />
              <NavItem href="/events" icon={<Calendar size={16} />} label="Events" />
              <NavItem href="/interest" icon={<Heart size={16} />} label="Interest" />
              <NavItem href="/contact-us" icon={<Phone size={16} />} label="Contact Us" />
              <NavItem href="/volunteer" icon={<UserPlus size={16} />} label="Volunteer" />
            </nav>

            {isLoggedIn ? (
              <div className="flex flex-col space-y-2 mt-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={userImage || "/placeholder.svg"}
                      alt="User"
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-medium">Your Account</span>
                </div>
                <button onClick={handleSwitchRole} className="flex items-center text-sm py-2">
                  <UserSwitch className="mr-2 h-4 w-4" />
                  <span>Switch Role</span>
                </button>
                <Link href="/settings" className="flex items-center text-sm py-2">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Setting</span>
                </Link>
                <Link href="/logout" className="flex items-center text-sm py-2 text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log Out</span>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 mt-4 pt-4 border-t">
                <Button variant="outline" size="sm" asChild className="justify-center">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black justify-center"
                  asChild
                >
                  <Link href="/signup">Signup</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Switch Roles Modal */}
      <SwitchRolesModal
        isOpen={isSwitchRolesModalOpen}
        onClose={() => setIsSwitchRolesModalOpen(false)}
        onSelectRole={handleSelectRole}
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
      className={`flex items-center text-sm ${active ? "text-black font-medium" : "text-gray-500 hover:text-black"}`}
    >
      <span className="mr-1.5">{icon}</span>
      {label}
    </Link>
  )
}
