"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Mail, Smartphone } from "lucide-react";
import { SettingsHeader } from "./settings-header";

export function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState({
    events: true,
    comments: false,
    marketing: false,
    security: true,
  });

  const [pushNotifications, setPushNotifications] = useState({
    events: true,
    comments: true,
    reminders: true,
  });

  return (
    <div>
      <SettingsHeader
        title="Notification Settings"
        description="Choose what notifications you want to receive"
      />

      <div className="p-8 space-y-8">
        {/* Email Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail size={20} />
              Email Notifications
            </CardTitle>
            <CardDescription>
              Manage email notifications sent to your inbox
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-events" className="text-base font-medium">
                  Event Updates
                </Label>
                <p className="text-sm text-gray-600">
                  Get notified about events you're interested in
                </p>
              </div>
              <Switch
                id="email-events"
                checked={emailNotifications.events}
                onCheckedChange={(checked) =>
                  setEmailNotifications((prev) => ({
                    ...prev,
                    events: checked,
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label
                  htmlFor="email-comments"
                  className="text-base font-medium"
                >
                  Comments & Reviews
                </Label>
                <p className="text-sm text-gray-600">
                  Notifications about comments on your reviews
                </p>
              </div>
              <Switch
                id="email-comments"
                checked={emailNotifications.comments}
                onCheckedChange={(checked) =>
                  setEmailNotifications((prev) => ({
                    ...prev,
                    comments: checked,
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label
                  htmlFor="email-marketing"
                  className="text-base font-medium"
                >
                  Marketing & Promotions
                </Label>
                <p className="text-sm text-gray-600">
                  Special offers and promotional content
                </p>
              </div>
              <Switch
                id="email-marketing"
                checked={emailNotifications.marketing}
                onCheckedChange={(checked) =>
                  setEmailNotifications((prev) => ({
                    ...prev,
                    marketing: checked,
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label
                  htmlFor="email-security"
                  className="text-base font-medium"
                >
                  Security Alerts
                </Label>
                <p className="text-sm text-gray-600">
                  Important security and account notifications
                </p>
              </div>
              <Switch
                id="email-security"
                checked={emailNotifications.security}
                onCheckedChange={(checked) =>
                  setEmailNotifications((prev) => ({
                    ...prev,
                    security: checked,
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Push Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone size={20} />
              Push Notifications
            </CardTitle>
            <CardDescription>
              Manage push notifications on your devices
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-events" className="text-base font-medium">
                  Event Reminders
                </Label>
                <p className="text-sm text-gray-600">
                  Reminders about upcoming events
                </p>
              </div>
              <Switch
                id="push-events"
                checked={pushNotifications.events}
                onCheckedChange={(checked) =>
                  setPushNotifications((prev) => ({ ...prev, events: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label
                  htmlFor="push-comments"
                  className="text-base font-medium"
                >
                  New Comments
                </Label>
                <p className="text-sm text-gray-600">
                  When someone comments on your reviews
                </p>
              </div>
              <Switch
                id="push-comments"
                checked={pushNotifications.comments}
                onCheckedChange={(checked) =>
                  setPushNotifications((prev) => ({
                    ...prev,
                    comments: checked,
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label
                  htmlFor="push-reminders"
                  className="text-base font-medium"
                >
                  General Reminders
                </Label>
                <p className="text-sm text-gray-600">
                  App updates and general reminders
                </p>
              </div>
              <Switch
                id="push-reminders"
                checked={pushNotifications.reminders}
                onCheckedChange={(checked) =>
                  setPushNotifications((prev) => ({
                    ...prev,
                    reminders: checked,
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
