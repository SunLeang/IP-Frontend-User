"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import type { SystemRole, CurrentRole } from "@/types/user";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredSystemRole?: SystemRole;
  requiredCurrentRole?: CurrentRole;
}

export default function ProtectedRoute({
  children,
  requiredSystemRole,
  requiredCurrentRole,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasRole, hasCurrentRole, user } =
    useAuth();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (isLoading) {
      console.log("Auth state is loading, waiting...");
      return;
    }

    console.log("Protected Route Check:", {
      isAuthenticated,
      userRole: user?.currentRole,
      requiredRole: requiredCurrentRole,
      hasToken: !!localStorage.getItem("accessToken"),
      storageUser: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user") || "{}").currentRole
        : "none",
    });

    // Get data directly from localStorage first for more reliable checks
    const storedUserString = localStorage.getItem("user");
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = storedUserString ? JSON.parse(storedUserString) : null;

    // Check authentication state combining context and localStorage
    const isReallyAuthenticated = !!(storedUser && storedToken);

    if (!isReallyAuthenticated) {
      console.log("User not authenticated, redirecting to login");
      setRedirecting(true);
      router.push(
        `/login?from=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }

    // Check current role directly from localStorage for reliability
    if (
      requiredCurrentRole &&
      storedUser?.currentRole !== requiredCurrentRole
    ) {
      console.log("Role mismatch:", {
        stored: storedUser?.currentRole,
        required: requiredCurrentRole,
      });
      setRedirecting(true);
      router.push("/unauthorized");
      return;
    }

    // Check system role (admin, etc.)
    if (requiredSystemRole && !hasRole(requiredSystemRole)) {
      setRedirecting(true);
      console.log("System role mismatch:", {
        userRole: user?.systemRole,
        requiredRole: requiredSystemRole,
      });

      const redirectTimer = setTimeout(() => {
        router.push("/unauthorized");
      }, 100);

      return () => clearTimeout(redirectTimer);
    }
  }, [
    isLoading,
    isAuthenticated,
    hasRole,
    hasCurrentRole,
    requiredSystemRole,
    requiredCurrentRole,
    router,
    user,
  ]);

  // Show loading indicator while checking auth or during redirect
  if (isLoading || redirecting) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated and has correct role, render content
  if (isAuthenticated) {
    // But check roles first
    if (requiredSystemRole && !hasRole(requiredSystemRole)) {
      return null;
    }

    if (requiredCurrentRole && !hasCurrentRole(requiredCurrentRole)) {
      return null;
    }

    return <>{children}</>;
  }

  // Otherwise render nothing
  return null;
}
