"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { CurrentRole } from "@/types/user";
import ProtectedRoute from "@/components/auth/protected-route";
import { VolunteerNavbar } from "@/components/navigation/volunteer-navbar";
import { Footer } from "@/components/footer/footer";

export default function VolunteerRoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  // One-time cookie-to-localStorage sync (only runs once on component mount)
  useEffect(() => {
    // Skip if we've already checked auth
    if (hasCheckedAuth) return;

    const syncAuthState = () => {
      try {
        const getCookie = (name: string) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop()?.split(";").shift();
          return null;
        };

        // Check for user cookie
        const userCookie = getCookie("user");
        if (userCookie) {
          try {
            const userData = JSON.parse(decodeURIComponent(userCookie));

            // Get current localStorage user
            const storedUser = localStorage.getItem("user");
            const currentUser = storedUser ? JSON.parse(storedUser) : null;

            // Only update if different (prevents unnecessary updates)
            if (
              !currentUser ||
              currentUser.currentRole !== userData.currentRole
            ) {
              console.log("Updating localStorage from cookies - roles differ");
              localStorage.setItem("user", JSON.stringify(userData));

              // Update tokens too if available
              const accessToken = getCookie("accessToken");
              if (accessToken) localStorage.setItem("accessToken", accessToken);

              const refreshToken = getCookie("refreshToken");
              if (refreshToken)
                localStorage.setItem("refreshToken", refreshToken);
            }
          } catch (error) {
            console.error("Error parsing user cookie:", error);
          }
        }

        setHasCheckedAuth(true);
      } catch (error) {
        console.error("Error in auth sync:", error);
        setHasCheckedAuth(true);
      }
    };

    syncAuthState();
  }, [hasCheckedAuth]);

  // Emergency redirect if not a volunteer - only runs after loading is complete
  useEffect(() => {
    if (isLoading || !hasCheckedAuth) return;

    if (isAuthenticated) {
      const userJson = localStorage.getItem("user");
      if (!userJson) return;

      try {
        const userData = JSON.parse(userJson);
        if (userData.currentRole !== "VOLUNTEER") {
          console.error("Not a volunteer, redirecting");
          router.push("/unauthorized");
        }
      } catch (error) {
        console.error("Error checking user role:", error);
      }
    }
  }, [isLoading, isAuthenticated, router, hasCheckedAuth]);

  return (
    <ProtectedRoute requiredCurrentRole={CurrentRole.VOLUNTEER}>
      <VolunteerNavbar />
      <main>{children}</main>
      <Footer />
    </ProtectedRoute>
  );
}
