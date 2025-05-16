"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import type { SystemRole, CurrentRole } from "@/types/user"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredSystemRole?: SystemRole
  requiredCurrentRole?: CurrentRole
}

export default function ProtectedRoute({ children, requiredSystemRole, requiredCurrentRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasRole, hasCurrentRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    if (!isLoading && isAuthenticated) {
      // Check system role if required
      if (requiredSystemRole && !hasRole(requiredSystemRole)) {
        router.push("/unauthorized")
        return
      }

      // Check current role if required
      if (requiredCurrentRole && !hasCurrentRole(requiredCurrentRole)) {
        router.push("/unauthorized")
        return
      }
    }
  }, [isLoading, isAuthenticated, hasRole, hasCurrentRole, requiredSystemRole, requiredCurrentRole, router])

  // Show nothing while checking authentication
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  // If not authenticated, don't render children
  if (!isAuthenticated) {
    return null
  }

  // If role check is required and user doesn't have the role, don't render children
  if (requiredSystemRole && !hasRole(requiredSystemRole)) {
    return null
  }

  // If current role check is required and user doesn't have the role, don't render children
  if (requiredCurrentRole && !hasCurrentRole(requiredCurrentRole)) {
    return null
  }

  // If all checks pass, render the protected content
  return <>{children}</>
}
