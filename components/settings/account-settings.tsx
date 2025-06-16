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
import { Badge } from "@/components/ui/badge";
import { Mail, Calendar, Check } from "lucide-react";
import { SettingsHeader } from "./settings-header";

export function AccountSettings() {
  const [emailForm, setEmailForm] = useState({
    newEmail: "",
    confirmEmail: "",
  });

  const currentEmail = "john.doe@example.com";
  const accountCreated = "January 15, 2024";
  const isEmailVerified = true;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailForm.newEmail !== emailForm.confirmEmail) {
      alert("Emails don't match. Please try again.");
      return;
    }
    console.log("Email change submitted:", emailForm);
  };

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
                  <p className="text-gray-600">{currentEmail}</p>
                  {isEmailVerified && (
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
                  <p className="text-gray-600">{accountCreated}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Email */}
        <Card>
          <CardHeader>
            <CardTitle>Change Email Address</CardTitle>
            <CardDescription>
              Update the email address associated with your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <Label htmlFor="newEmail">New Email Address</Label>
                <Input
                  id="newEmail"
                  name="newEmail"
                  type="email"
                  value={emailForm.newEmail}
                  onChange={handleEmailChange}
                  placeholder="Enter your new email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirmEmail">Confirm Email Address</Label>
                <Input
                  id="confirmEmail"
                  name="confirmEmail"
                  type="email"
                  value={emailForm.confirmEmail}
                  onChange={handleEmailChange}
                  placeholder="Confirm your new email"
                  required
                />
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit">Update Email</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
              <div>
                <p className="font-medium text-red-900">Delete Account</p>
                <p className="text-sm text-red-700">
                  Once you delete your account, there is no going back.
                </p>
              </div>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
