"use client";

import { useEffect, useState } from "react";
import { UserIcon } from "lucide-react";
import { SwitchRolesModal } from "@/components/switch-roles-modal";
import { checkVolunteerEligibility } from "@/services/role-service";
import { useAuth } from "@/context/auth-context";
import { CurrentRole } from "@/types/user";

interface RoleSwitcherProps {
  triggerClassName?: string;
}

export function RoleSwitcher({ triggerClassName }: RoleSwitcherProps) {
  const [isSwitchRolesModalOpen, setIsSwitchRolesModalOpen] = useState(false);
  const [canSwitchToVolunteer, setCanSwitchToVolunteer] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const { user } = useAuth();

  // Check if user can switch to volunteer role
  useEffect(() => {
    const checkEligibility = async () => {
      setIsChecking(true);
      try {
        // If user is already in volunteer role, they can switch
        if (user?.currentRole === CurrentRole.VOLUNTEER) {
          setCanSwitchToVolunteer(true);
        } else {
          // Otherwise check if they have an approved application
          const isEligible = await checkVolunteerEligibility();
          setCanSwitchToVolunteer(isEligible);
        }
      } catch (error) {
        console.error("Error checking eligibility:", error);
      } finally {
        setIsChecking(false);
      }
    };

    if (user) {
      checkEligibility();
    }
  }, [user]);

  // Don't render anything while checking or if user can't switch roles
  if (isChecking || !canSwitchToVolunteer) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsSwitchRolesModalOpen(true)}
        className={triggerClassName || "flex items-center text-sm py-2"}
      >
        <UserIcon className="mr-2 h-4 w-4" />
        <span>Switch Role</span>
      </button>

      <SwitchRolesModal
        isOpen={isSwitchRolesModalOpen}
        onClose={() => setIsSwitchRolesModalOpen(false)}
        currentRole={user?.currentRole.toLowerCase()}
      />
    </>
  );
}
