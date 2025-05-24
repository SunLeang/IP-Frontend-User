"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navigation/navbar";
import { Footer } from "@/components/footer/footer";
import { CurrentRole } from "@/types/user";
import ProtectedRoute from "@/components/auth/protected-route";

export default function AttendeeRoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Check user role when layout mounts
  useEffect(() => {
    // Direct check from localStorage for immediate response
    try {
      const userJson = localStorage.getItem("user");
      const accessToken = localStorage.getItem("accessToken");

      if (!userJson || !accessToken) {
        // Not logged in - that's fine, public pages can be accessible
        return;
      }

      const user = JSON.parse(userJson);
      if (user.currentRole === "VOLUNTEER") {
        console.log("Volunteer trying to access attendee page - redirecting");
        router.push("/volunteer-role/dashboard");
      }
    } catch (error) {
      console.error("Error checking auth:", error);
    }
  }, [router]);

  // Only wrap with ProtectedRoute for pages that require authentication
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
