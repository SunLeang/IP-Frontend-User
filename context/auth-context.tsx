"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { CurrentRole, SystemRole } from "@/types/user";
import { apiGet, apiPost } from "@/services/api"; // Make sure this import is added
import { getUserProfile } from "@/services/auth-service";

// Types
export interface User {
  id: string;
  email: string;
  fullName: string;
  systemRole: SystemRole;
  currentRole: CurrentRole;
  profileImage?: string;
  gender?: string;
  age?: number;
  org?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: CurrentRole) => Promise<void>;
  hasCurrentRole: (role: CurrentRole) => boolean;
  hasRole: (role: SystemRole) => boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  username?: string;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await apiPost("/api/auth/login", { email, password });

      if (!response || !response.accessToken) {
        throw new Error("Invalid response from server");
      }

      // Store tokens securely
      localStorage.setItem("accessToken", response.accessToken);
      if (response.refreshToken) {
        localStorage.setItem("refreshToken", response.refreshToken);
      }

      // Store user data
      localStorage.setItem("user", JSON.stringify(response.user));

      // Also set cookies for middleware
      document.cookie = `accessToken=${response.accessToken}; path=/; max-age=900`;
      document.cookie = `user=${encodeURIComponent(
        JSON.stringify(response.user)
      )}; path=/; max-age=900`;
      document.cookie = `userRole=${response.user.currentRole}; path=/; max-age=900`;

      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error: unknown) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Register function
  const register = async (data: RegisterData) => {
    try {
      const response = await apiPost("/api/auth/register", data);

      if (!response || !response.accessToken) {
        throw new Error("Invalid response from server");
      }

      // Store tokens securely
      localStorage.setItem("accessToken", response.accessToken);
      if (response.refreshToken) {
        localStorage.setItem("refreshToken", response.refreshToken);
      }

      // Store user data
      localStorage.setItem("user", JSON.stringify(response.user));

      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error: unknown) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await apiPost("/api/auth/logout", {});
    } catch (error: unknown) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      // Clear cookies
      document.cookie = "accessToken=; Max-Age=0; path=/;";
      document.cookie = "refreshToken=; Max-Age=0; path=/;";
      document.cookie = "user=; Max-Age=0; path=/;";
      document.cookie = "userRole=; Max-Age=0; path=/;";

      // Update state
      setUser(null);
      setIsAuthenticated(false);

      // Redirect to home
      router.push("/");
    }
  };

  // Switch role function
  const switchRole = async (role: CurrentRole) => {
    try {
      setIsLoading(true);

      const response = await apiPost("/api/users/switch-role", { role });

      if (!response || !response.accessToken) {
        throw new Error("Failed to switch role");
      }

      // Update local storage
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Update cookies
      document.cookie = `accessToken=${response.accessToken}; path=/; max-age=900`;
      document.cookie = `userRole=${role}; path=/; max-age=900`;
      document.cookie = `user=${encodeURIComponent(
        JSON.stringify(response.user)
      )}; path=/; max-age=900`;

      // Update state
      setUser(response.user);
      setIsLoading(false);

      // Redirect based on role
      if (role === CurrentRole.VOLUNTEER) {
        window.location.href = "/volunteer-role/dashboard";
      } else {
        window.location.href = "/";
      }
    } catch (error: unknown) {
      console.error("Error switching role:", error);
      setIsLoading(false);
      throw error;
    }
  };

  // Check if user has a specific current role
  const hasCurrentRole = (role: CurrentRole): boolean => {
    if (user?.currentRole === role) return true;

    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return false;

      const userData = JSON.parse(userStr);
      return userData.currentRole === role;
    } catch (error: unknown) {
      console.error("Error checking role in localStorage:", error);
      return false;
    }
  };

  // Check if user has a specific system role
  const hasRole = (role: SystemRole): boolean => {
    if (user?.systemRole === role) return true;

    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return false;

      const userData = JSON.parse(userStr);
      return userData.systemRole === role;
    } catch (error: unknown) {
      console.error("Error checking system role in localStorage:", error);
      return false;
    }
  };

  // Helper function to get cookie value
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return null;
  };

  // Initialize auth state from localStorage or cookies
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Get role from the non-HttpOnly cookie
        const userRole = getCookie("userRole");

        // Try to get user from localStorage first
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const userData = JSON.parse(userStr);

          // Update role if cookie has different value
          if (userRole && userData.currentRole !== userRole) {
            userData.currentRole = userRole;
            localStorage.setItem("user", JSON.stringify(userData));
          }

          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // If not in localStorage, try to fetch from API
          try {
            const userData = await apiGet("/api/users/me");
            if (userData) {
              // Update role if cookie has different value
              if (userRole && userData.currentRole !== userRole) {
                userData.currentRole = userRole;
              }

              localStorage.setItem("user", JSON.stringify(userData));
              setUser(userData);
              setIsAuthenticated(true);
            }
          } catch (apiError: unknown) {
            console.error("Error fetching user from API:", apiError);
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error: unknown) {
        console.error("Error fetching user data:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    switchRole,
    hasCurrentRole,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
