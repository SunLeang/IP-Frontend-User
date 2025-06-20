"use client";

import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Mail, Calendar, Check, AlertTriangle } from "lucide-react";
import { SettingsHeader } from "./settings-header";
import { useAuth } from "@/context/auth-context";
import { apiGet } from "@/services/api";

export function AccountSettings() {
  const { user } = useAuth();
  const [emailForm, setEmailForm] = useState({
    newEmail: "",
    confirmEmail: "",
  });
  const [userInfo, setUserInfo] = useState({
    email: "",
    createdAt: "",
    isEmailVerified: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        const userData = await apiGet(`/api/users/${user.id}`);
        setUserInfo({
          email: userData.email || "",
          createdAt: new Date(userData.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          isEmailVerified: true, // Assume verified for now
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user?.id]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Since backend doesn't support email change, show message
    alert("Email changes are not currently supported. Please contact support if you need to change your email address.");
  };

  const handleDeleteAccount = () => {
    // Since backend might not support account deletion, show confirmation
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    
    if (confirmed) {
      alert("Account deletion is not currently available. Please contact support to delete your account.");
    }
  };

  if (isLoading) {
    return (
      <div>
        <SettingsHeader
          title="Account Settings"
          description="Manage your account information and preferences"
        />
        <div className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SettingsHeader
        title="Account Settings"
        description="Manage your account information and preferences"
      />

      <div className="p-8 space-y-8">
        {/* Account Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail size={20} />
              Account Overview
            </CardTitle>
            <CardDescription>Your account details and status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Email Address</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-gray-600">{userInfo.email}</p>
                  {userInfo.isEmailVerified && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Check size={12} />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Member Since</p>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar size={16} className="text-gray-400" />
                  <p className="text-gray-600">{userInfo.createdAt}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Change Notice */}
        <Card>
          <CardHeader>
            <CardTitle>Email Address</CardTitle>
            <CardDescription>
              Email address management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border border-blue-200 rounded-lg bg-blue-50">
              <div className="flex items-center gap-3">
                <Mail className="text-blue-600" size={20} />
                <div>
                  <p className="font-medium text-blue-900">
                    Email changes not available
                  </p>
                  <p className="text-sm text-blue-700">
                    Contact support if you need to change your email address.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Account Management</CardTitle>
            <CardDescription>
              Account deletion and data management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-red-600" size={20} />
                <div>
                  <p className="font-medium text-red-900">Delete Account</p>
                  <p className="text-sm text-red-700">
                    Contact support to delete your account and all associated data.
                  </p>
                </div>
              </div>
              <Button variant="destructive" onClick={handleDeleteAccount}>
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}