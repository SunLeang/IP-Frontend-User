"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Save, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { SettingsHeader } from "./settings-header";
import { useAuth } from "@/context/auth-context";
import { apiGet, apiPatch } from "@/services/api";

export function ProfileSettings() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    gender: "",
    age: "",
    org: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [dialog, setDialog] = useState({
    isOpen: false,
    type: "success" as "success" | "error" | "warning",
    title: "",
    message: "",
  });

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const userData = await apiGet(`/api/users/${user.id}`);
        setFormData({
          fullName: userData.fullName || "",
          email: userData.email || "",
          username: userData.username || "",
          gender: userData.gender || "",
          age: userData.age?.toString() || "",
          org: userData.org || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        showDialog(
          "error",
          "Loading Error",
          "Failed to load your profile data. Please refresh the page and try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user?.id]);

  const showDialog = (
    type: "success" | "error" | "warning",
    title: string,
    message: string
  ) => {
    setDialog({ isOpen: true, type, title, message });
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      showDialog(
        "warning",
        "Missing Full Name",
        "Please enter your full name."
      );
      return false;
    }

    if (
      formData.age &&
      (parseInt(formData.age) < 1 || parseInt(formData.age) > 120)
    ) {
      showDialog(
        "warning",
        "Invalid Age",
        "Please enter a valid age between 1 and 120."
      );
      return false;
    }

    return true;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!user?.id) return;

    try {
      setIsSaving(true);

      // Prepare update data
      const updateData = {
        fullName: formData.fullName.trim(),
        username: formData.username.trim() || null,
        gender: formData.gender.trim() || null,
        age: formData.age ? parseInt(formData.age) : null,
        org: formData.org.trim() || null,
      };

      await apiPatch(`/api/users/${user.id}`, updateData);

      showDialog(
        "success",
        "Profile Updated",
        "Your profile has been updated successfully!"
      );
    } catch (error: any) {
      console.error("Error updating profile:", error);

      // Handle specific error messages
      const errorMessage = error.response?.data?.message;

      if (errorMessage?.includes("username")) {
        showDialog(
          "error",
          "Username Error",
          "This username is already taken. Please choose a different one."
        );
      } else if (errorMessage?.includes("validation")) {
        showDialog(
          "error",
          "Validation Error",
          "Please check your input and try again."
        );
      } else {
        showDialog(
          "error",
          "Update Failed",
          "Failed to update your profile. Please try again later."
        );
      }
    } finally {
      setIsSaving(false);
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

  if (isLoading) {
    return (
      <div>
        <SettingsHeader
          title="Profile Settings"
          description="Update your personal information and profile details"
        />
        <div className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SettingsHeader
        title="Profile Settings"
        description="Update your personal information and profile details"
      />

      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Email cannot be changed here. Use the Account settings to
                  update your email.
                </p>
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Leave empty if you don't want to set a username.
                </p>
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Input
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  placeholder="e.g., Male, Female, Other"
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter your age"
                />
              </div>
              <div>
                <Label htmlFor="org">Organization</Label>
                <Input
                  id="org"
                  name="org"
                  value={formData.org}
                  onChange={handleChange}
                  placeholder="Enter your organization"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <Button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <Save size={16} />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
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
              onClick={() => setDialog((prev) => ({ ...prev, isOpen: false }))}
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
