"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { SystemRole, type CurrentRole } from "@/types/user";
import { switchUserRole } from "@/services/role-service";

// Types
export interface User {
  id: string;
  email: string;
  username?: string;
  fullName: string;
  gender?: string;
  age?: number;
  org?: string;
  systemRole: SystemRole;
  currentRole: CurrentRole;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (role: SystemRole) => boolean;
  hasCurrentRole: (role: CurrentRole) => boolean;
  switchRole: (role: CurrentRole) => Promise<boolean>;
}

export interface RegisterData {
  email: string;
  password: string;
  username?: string;
  fullName: string;
  gender?: string;
  age?: number;
  org?: string;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isLoading: true,
  });
  const router = useRouter();

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedAccessToken = localStorage.getItem("accessToken");
        const storedRefreshToken = localStorage.getItem("refreshToken");

        setAuthState({
          user: storedUser ? JSON.parse(storedUser) : null,
          accessToken: storedAccessToken,
          refreshToken: storedRefreshToken,
          isLoading: false,
        });
      } catch (error) {
        console.error("Failed to load auth state:", error);
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    loadAuthState();
  }, []);

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    if (!authState.isLoading) {
      if (authState.user) {
        localStorage.setItem("user", JSON.stringify(authState.user));
      } else {
        localStorage.removeItem("user");
      }

      if (authState.accessToken) {
        localStorage.setItem("accessToken", authState.accessToken);
      } else {
        localStorage.removeItem("accessToken");
      }

      if (authState.refreshToken) {
        localStorage.setItem("refreshToken", authState.refreshToken);
      } else {
        localStorage.removeItem("refreshToken");
      }
    }
  }, [authState]);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3100"
        }/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();

      // Immediately update localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      setAuthState({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        isLoading: false,
      });

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Register function
  const register = async (userData: RegisterData) => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3100"
        }/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json();

      // Immediately update localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      setAuthState({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        isLoading: false,
      });

      return data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      if (authState.accessToken && authState.refreshToken) {
        await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3100"
          }/api/auth/logout`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authState.accessToken}`,
            },
            body: JSON.stringify({ refreshToken: authState.refreshToken }),
          }
        );
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      setAuthState({
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
      });

      router.push("/login");
    }
  };

  // Switch role function
  const switchRole = async (role: CurrentRole) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      // Call the backend to switch roles and get new tokens
      const response = await switchUserRole(role);

      // Verify we have all the required data from the backend
      if (response && response.user && response.accessToken) {
        // Force currentRole to match the requested role regardless of backend response
        const updatedUser = {
          ...response.user,
          currentRole: role,
        };

        console.log("Updating auth state with new role:", role);

        // Update localStorage with the new user and tokens
        localStorage.setItem("user", JSON.stringify(updatedUser));
        localStorage.setItem("accessToken", response.accessToken);

        if (response.refreshToken) {
          localStorage.setItem("refreshToken", response.refreshToken);
        }

        // Then update state
        setAuthState({
          user: updatedUser,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken || authState.refreshToken,
          isLoading: false,
        });

        return true;
      } else {
        console.error("Invalid response from role switching API:", response);
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return false;
      }
    } catch (error) {
      console.error("Failed to switch role:", error);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  // Role checking helpers
  const hasRole = (role: SystemRole): boolean => {
    if (!authState.user) return false;

    // Define role hierarchy
    const roleHierarchy = {
      [SystemRole.SUPER_ADMIN]: 3,
      [SystemRole.ADMIN]: 2,
      [SystemRole.USER]: 1,
    };

    const userRoleWeight = roleHierarchy[authState.user.systemRole];
    const requiredRoleWeight = roleHierarchy[role];

    return userRoleWeight >= requiredRoleWeight;
  };

  const hasCurrentRole = (role: CurrentRole): boolean => {
    // IMPROVED ROLE CHECKING: First check auth state
    if (authState.user && authState.user.currentRole === role) {
      return true;
    }

    // If auth state doesn't have the role, check localStorage as fallback
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        return user.currentRole === role;
      }
    } catch (e) {
      console.error("Error checking role in localStorage:", e);
    }

    return false;
  };

  const value = {
    ...authState,
    login,
    register,
    logout,
    switchRole,
    isAuthenticated: !!authState.user && !!authState.accessToken,
    hasRole,
    hasCurrentRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
