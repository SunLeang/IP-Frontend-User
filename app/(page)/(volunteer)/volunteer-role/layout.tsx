"use client";

import ProtectedRoute from "@/components/auth/protected-route";
import { VolunteerNavbar } from "@/components/navigation/volunteer-navbar";
import { Footer } from "@/components/footer/footer";
import { CurrentRole } from "@/types/user";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VolunteerRoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Run this check immediately when layout mounts
  useEffect(() => {
    // Direct check from localStorage
    try {
      const userJson = localStorage.getItem("user");
      const accessToken = localStorage.getItem("accessToken");

      if (!userJson || !accessToken) {
        console.error("No auth data found");
        router.push("/login");
        return;
      }

      const user = JSON.parse(userJson);
      if (user.currentRole !== "VOLUNTEER") {
        console.error("User is not a volunteer");
        router.push("/unauthorized");
        return;
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      router.push("/login");
    }
  }, [router]);

  return (
    <ProtectedRoute requiredCurrentRole={CurrentRole.VOLUNTEER}>
      <VolunteerNavbar />
      <main>{children}</main>
      <Footer />
    </ProtectedRoute>
  );
}
