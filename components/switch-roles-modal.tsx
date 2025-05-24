"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, User, Users } from "lucide-react";
import { CurrentRole } from "@/types/user";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { apiPost } from "@/services/api";

interface SwitchRolesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole?: string;
}

export function SwitchRolesModal({
  isOpen,
  onClose,
  currentRole = "attendee",
}: SwitchRolesModalProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Normalize the currentRole to lowercase for consistent comparison
  const normalizedCurrentRole = currentRole?.toLowerCase() || "attendee";

  const handleSelectRole = async (role: CurrentRole) => {
    setLoading(true);
    try {
      onClose();

      console.log(`Attempting to switch to role: ${role}`);

      const response = await apiPost("/api/users/switch-role", { role });

      if (!response || !response.accessToken) {
        throw new Error("Failed to switch role");
      }

      console.log(`Successfully switched to ${role}`, response);

      // Update localStorage immediately
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Update cookies for middleware
      document.cookie = `accessToken=${response.accessToken}; path=/; max-age=900`;
      document.cookie = `userRole=${role}; path=/; max-age=900`;
      document.cookie = `user=${encodeURIComponent(
        JSON.stringify(response.user)
      )}; path=/; max-age=900`;

      // Force redirect with page reload to ensure clean state
      if (role === CurrentRole.VOLUNTEER) {
        window.location.href = "/volunteer-role/dashboard";
      } else {
        window.location.href = "/";
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error switching role:", error);
      setLoading(false);

      // Show error to user
      alert(`Failed to switch to ${role} role: ${errorMessage}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Switch Role</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={
                normalizedCurrentRole === "attendee" ? "default" : "outline"
              }
              className="h-24 flex flex-col items-center justify-center"
              onClick={() => handleSelectRole(CurrentRole.ATTENDEE)}
              disabled={loading || normalizedCurrentRole === "attendee"}
            >
              <User className="w-10 h-10 mb-2 text-blue-500" />
              Attendee
            </Button>

            <Button
              variant={
                normalizedCurrentRole === "volunteer" ? "default" : "outline"
              }
              className="h-24 flex flex-col items-center justify-center"
              onClick={() => handleSelectRole(CurrentRole.VOLUNTEER)}
              disabled={loading || normalizedCurrentRole === "volunteer"}
            >
              <Users className="w-10 h-10 mb-2 text-green-500" />
              Volunteer
            </Button>
          </div>

          {loading && (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
