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
  const { switchRole } = useAuth();
  const router = useRouter();

  const handleSelectRole = async (role: CurrentRole) => {
    setLoading(true);
    try {
      // First close modal
      onClose();

      // Create a form and submit it to the backend directly
      // This bypasses all the client-side auth state management issues
      const form = document.createElement("form");
      form.method = "POST";
      form.action = `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3100"
      }/api/users/switch-role-redirect`;

      // Add the role to switch to
      const roleInput = document.createElement("input");
      roleInput.type = "hidden";
      roleInput.name = "role";
      roleInput.value = role;
      form.appendChild(roleInput);

      // Add the redirect URL based on the role
      const redirectInput = document.createElement("input");
      redirectInput.type = "hidden";
      redirectInput.name = "redirectUrl";
      redirectInput.value =
        role === CurrentRole.VOLUNTEER
          ? `${window.location.origin}/volunteer-role/dashboard?t=${Date.now()}`
          : `${window.location.origin}/?t=${Date.now()}`;
      form.appendChild(redirectInput);

      // Add the authorization token
      const tokenInput = document.createElement("input");
      tokenInput.type = "hidden";
      tokenInput.name = "token";
      tokenInput.value = localStorage.getItem("accessToken") || "";
      form.appendChild(tokenInput);

      // Append to document, submit, and remove
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    } catch (error) {
      console.error("Error switching role:", error);
      alert("Failed to switch role. Please try again.");
      setLoading(false);
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
              variant={currentRole === "attendee" ? "default" : "outline"}
              className="h-24 flex flex-col items-center justify-center"
              onClick={() => handleSelectRole(CurrentRole.ATTENDEE)}
              disabled={loading || currentRole === "attendee"}
            >
              <User className="w-10 h-10 mb-2 text-blue-500" />
              Attendee
            </Button>

            <Button
              variant={currentRole === "volunteer" ? "default" : "outline"}
              className="h-24 flex flex-col items-center justify-center"
              onClick={() => handleSelectRole(CurrentRole.VOLUNTEER)}
              disabled={loading || currentRole === "volunteer"}
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
