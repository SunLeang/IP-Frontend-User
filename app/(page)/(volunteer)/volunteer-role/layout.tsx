"use client";

import { useEffect } from "react";
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

  // Simple auth check without complex cookie syncing
  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Check user role from context only
    if (user?.currentRole !== "VOLUNTEER") {
      router.push("/unauthorized");
      return;
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || user?.currentRole !== "VOLUNTEER") {
    return null;
  }

  return (
    <ProtectedRoute requiredCurrentRole={CurrentRole.VOLUNTEER}>
      <div className="min-h-screen bg-gray-50">
        <VolunteerNavbar />
        <main className="pb-10">{children}</main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
