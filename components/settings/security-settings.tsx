"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { SettingsHeader } from "./settings-header";
import { useAuth } from "@/context/auth-context";
import { apiPatch } from "@/services/api";

export function SecuritySettings() {
  const { user } = useAuth();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [dialog, setDialog] = useState({
    isOpen: false,
    type: "success" as "success" | "error" | "warning",
    title: "",
    message: "",
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const showDialog = (
    type: "success" | "error" | "warning",
    title: string,
    message: string
  ) => {
    setDialog({ isOpen: true, type, title, message });
  };

  const validatePasswords = () => {
    if (!passwordForm.currentPassword) {
      showDialog(
        "warning",
        "Missing Current Password",
        "Please enter your current password."
      );
      return false;
    }

    if (!passwordForm.newPassword) {
      showDialog(
        "warning",
        "Missing New Password",
        "Please enter a new password."
      );
      return false;
    }

    if (passwordForm.newPassword.length < 8) {
      showDialog(
        "warning",
        "Password Too Short",
        "New password must be at least 8 characters long."
      );
      return false;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showDialog(
        "error",
        "Passwords Don't Match",
        "New password and confirmation password don't match. Please check and try again."
      );
      return false;
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      showDialog(
        "warning",
        "Same Password",
        "New password must be different from your current password."
      );
      return false;
    }

    return true;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswords()) {
      return;
    }

    if (!user?.id) return;

    try {
      setIsUpdating(true);

      await apiPatch(`/api/users/${user.id}`, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      // Clear form on success
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      showDialog(
        "success",
        "Password Updated",
        "Your password has been updated successfully!"
      );
    } catch (error: any) {
      console.error("Error updating password:", error);

      // Handle specific error messages
      const errorMessage = error.response?.data?.message;

      if (errorMessage === "Current password is incorrect") {
        showDialog(
          "error",
          "Incorrect Password",
          "The current password you entered is incorrect. Please try again."
        );
      } else if (errorMessage?.includes("password")) {
        showDialog("error", "Password Error", errorMessage);
      } else {
        showDialog(
          "error",
          "Update Failed",
          "Failed to update password. Please try again later."
        );
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const getDialogIcon = () => {
    switch (dialog.type) {
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case "error":
        return <XCircle className="h-6 w-6 text-red-600" />;
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
      default:
        return null;
    }
  };

  return (
    <div>
      <SettingsHeader
        title="Security Settings"
        description="Manage your account security"
      />

      <div className="p-8 space-y-8">
        {/* Password Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key size={20} />
              Password
            </CardTitle>
            <CardDescription>
              Change your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter your current password"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter your new password"
                    required
                    minLength={8}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Password must be at least 8 characters long.
                </p>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm your new password"
                    required
                    minLength={8}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Dialog for messages */}
      <Dialog
        open={dialog.isOpen}
        onOpenChange={(open) =>
          setDialog((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getDialogIcon()}
              {dialog.title}
            </DialogTitle>
            <DialogDescription className="text-base">
              {dialog.message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setDialog((prev) => ({ ...prev, isOpen: false }))} // ✅ Fixed: Added missing closing parenthesis
              className={
                dialog.type === "success"
                  ? "bg-green-600 hover:bg-green-700"
                  : dialog.type === "error"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-yellow-600 hover:bg-yellow-700"
              }
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
