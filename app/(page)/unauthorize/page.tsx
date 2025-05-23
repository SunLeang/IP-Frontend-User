"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { SwitchRolesModal } from "@/components/switch-roles-modal";
import { useState } from "react";
import { CurrentRole } from "@/types/user";
import { checkVolunteerEligibility } from "@/services/role-service";

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user, hasCurrentRole } = useAuth();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [canSwitchToVolunteer, setCanSwitchToVolunteer] = useState(false);

  // Check if user can switch to volunteer role
  useState(() => {
    const checkEligibility = async () => {
      if (user) {
        // If user is already volunteer or has approved application
        const isEligible = await checkVolunteerEligibility();
        setCanSwitchToVolunteer(
          isEligible || user.currentRole === CurrentRole.VOLUNTEER
        );
      }
    };
    checkEligibility();
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>

        <div className="bg-red-50 p-4 rounded-md mb-6">
          <p className="text-red-800">
            You don&apos;t have permission to access this page.
          </p>
        </div>

        <p className="mb-6 text-gray-600">
          {user ? (
            <>
              You are logged in as{" "}
              <span className="font-semibold">{user.fullName}</span> with role{" "}
              <span className="font-semibold">{user.systemRole}</span> and
              current role{" "}
              <span className="font-semibold">{user.currentRole}</span>.
            </>
          ) : (
            "You need to be logged in to access this resource."
          )}
        </p>

        <div className="flex flex-col space-y-3">
          {user && canSwitchToVolunteer && (
            <Button
              onClick={() => setShowRoleModal(true)}
              variant="default"
              className="w-full"
            >
              Switch Role
            </Button>
          )}

          <Button onClick={() => router.push("/")} className="w-full">
            Go to Home
          </Button>

          {!user && (
            <Button
              onClick={() => router.push("/login")}
              variant="outline"
              className="w-full"
            >
              Log In
            </Button>
          )}
        </div>
      </div>

      <SwitchRolesModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        currentRole={user?.currentRole.toLowerCase()}
      />
    </div>
  );
}
