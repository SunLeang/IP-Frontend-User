// context/auth-context.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPost } from "@/services/api";
import {
  clearAuthData,
  storeAuthData,
  validateAuthResponse,
  getStoredUser,
} from "@/utils/auth-utils";
import { SystemRole, CurrentRole, User } from "@/types/user"; // Import from centralized types

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  username?: string;
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    clearAuthData();
    const response = await apiPost("/api/auth/login", {
      email: email.trim().toLowerCase(),
      password,
    });
    const validated = validateAuthResponse(response);
    storeAuthData(validated);
    setUser(validated.user);
    setIsAuthenticated(true);
    // Redirect based on role
    const redirect =
      validated.user.currentRole === CurrentRole.VOLUNTEER
        ? "/volunteer-role/dashboard"
        : "/";
    router.push(redirect);
  };

  const register = async (data: RegisterData) => {
    const response = await apiPost("/api/auth/register", data);
    const validated = validateAuthResponse(response);
    storeAuthData(validated);
    setUser(validated.user);
    setIsAuthenticated(true);
    router.push(`/login?email=${encodeURIComponent(data.email)}`);
  };

  const logout = async () => {
    try {
      await apiPost("/api/auth/logout", {});
    } finally {
      clearAuthData();
      setUser(null);
      setIsAuthenticated(false);
      router.push("/");
    }
  };

  const switchRole = async (role: CurrentRole) => {
    try {
      setIsLoading(true);
      const response = await apiPost("/api/users/switch-role", { role });
      const validated = validateAuthResponse(response);
      storeAuthData(validated);
      setUser(validated.user);
      setIsAuthenticated(true);
      const redirect =
        role === CurrentRole.VOLUNTEER ? "/volunteer-role/dashboard" : "/";
      router.push(redirect);
    } catch (error) {
      console.error("Failed to switch role:", error);
      throw new Error("Failed to switch role. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const hasCurrentRole = (role: CurrentRole): boolean =>
    user?.currentRole === role || getStoredUser()?.currentRole === role;
  const hasRole = (role: SystemRole): boolean =>
    user?.systemRole === role || getStoredUser()?.systemRole === role;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = getStoredUser();
        const accessToken = localStorage.getItem("accessToken");

        if (storedUser && accessToken) {
          // Verify token is still valid by making a test request
          try {
            const userData = await apiGet("/api/auth/profile");
            if (userData) {
              setUser(storedUser);
              setIsAuthenticated(true);
            } else {
              throw new Error("Invalid token");
            }
          } catch (error) {
            // Token might be expired, try refresh
            console.log("Token validation failed, attempting refresh...");

            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
              try {
                const refreshResponse = await fetch(
                  `${
                    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3100"
                  }/api/auth/refresh`,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refreshToken }),
                  }
                );

                if (refreshResponse.ok) {
                  const data = await refreshResponse.json();
                  const validated = validateAuthResponse(data);
                  storeAuthData(validated);
                  setUser(validated.user);
                  setIsAuthenticated(true);
                } else {
                  throw new Error("Refresh failed");
                }
              } catch (refreshError) {
                console.log("Refresh failed, clearing auth data");
                clearAuthData();
                setUser(null);
                setIsAuthenticated(false);
              }
            } else {
              clearAuthData();
              setUser(null);
              setIsAuthenticated(false);
            }
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Failed to initialize auth state:", error);
        clearAuthData();
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
