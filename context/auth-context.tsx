"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { SystemRole, type CurrentRole } from "@/types/user"

// Types
export interface User {
  id: string
  email: string
  username?: string
  fullName: string
  systemRole: SystemRole
  currentRole: CurrentRole
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
  hasRole: (role: SystemRole) => boolean
  hasCurrentRole: (role: CurrentRole) => boolean
}

export interface RegisterData {
  email: string
  password: string
  username?: string
  fullName: string
  gender?: string
  age?: number
  org?: string
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isLoading: true,
  })
  const router = useRouter()

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const storedUser = localStorage.getItem("user")
        const storedAccessToken = localStorage.getItem("accessToken")
        const storedRefreshToken = localStorage.getItem("refreshToken")

        setAuthState({
          user: storedUser ? JSON.parse(storedUser) : null,
          accessToken: storedAccessToken,
          refreshToken: storedRefreshToken,
          isLoading: false,
        })
      } catch (error) {
        console.error("Failed to load auth state:", error)
        setAuthState((prev) => ({ ...prev, isLoading: false }))
      }
    }

    loadAuthState()
  }, [])

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    if (!authState.isLoading) {
      if (authState.user) {
        localStorage.setItem("user", JSON.stringify(authState.user))
      } else {
        localStorage.removeItem("user")
      }

      if (authState.accessToken) {
        localStorage.setItem("accessToken", authState.accessToken)
      } else {
        localStorage.removeItem("accessToken")
      }

      if (authState.refreshToken) {
        localStorage.setItem("refreshToken", authState.refreshToken)
      } else {
        localStorage.removeItem("refreshToken")
      }
    }
  }, [authState])

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Login failed")
      }

      const data = await response.json()

      setAuthState({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        isLoading: false,
      })

      return data
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  // Register function
  const register = async (userData: RegisterData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Registration failed")
      }

      const data = await response.json()

      setAuthState({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        isLoading: false,
      })

      return data
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  // Logout function
  const logout = async () => {
    try {
      if (authState.accessToken && authState.refreshToken) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.accessToken}`,
          },
          body: JSON.stringify({ refreshToken: authState.refreshToken }),
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Clear auth state regardless of API response
      setAuthState({
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
      })

      router.push("/login")
    }
  }

  // Role checking helpers
  const hasRole = (role: SystemRole): boolean => {
    if (!authState.user) return false

    // Define role hierarchy
    const roleHierarchy = {
      [SystemRole.SUPER_ADMIN]: 3,
      [SystemRole.ADMIN]: 2,
      [SystemRole.USER]: 1,
    }

    const userRoleWeight = roleHierarchy[authState.user.systemRole]
    const requiredRoleWeight = roleHierarchy[role]

    return userRoleWeight >= requiredRoleWeight
  }

  const hasCurrentRole = (role: CurrentRole): boolean => {
    if (!authState.user) return false
    return authState.user.currentRole === role
  }

  const value = {
    ...authState,
    login,
    register,
    logout,
    isAuthenticated: !!authState.user && !!authState.accessToken,
    hasRole,
    hasCurrentRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
