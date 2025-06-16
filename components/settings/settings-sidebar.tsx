"use client";

import { User, Mail, Lock, CreditCard, Bell, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  {
    id: "profile",
    label: "Profile",
    description: "Manage your personal information",
    icon: User,
  },
  {
    id: "account",
    label: "Account",
    description: "Email and password settings",
    icon: Mail,
  },
  {
    id: "security",
    label: "Security",
    description: "Password and authentication",
    icon: Shield,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Email and push preferences",
    icon: Bell,
  },
  {
    id: "billing",
    label: "Billing",
    description: "Payment methods and invoices",
    icon: CreditCard,
  },
];

export function SettingsSidebar({ activeTab, onTabChange }: SettingsSidebarProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-start gap-3 p-4 rounded-lg text-left transition-all duration-200",
                isActive
                  ? "bg-blue-50 border border-blue-200 text-blue-700 shadow-sm"
                  : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
              )}
            >
              <Icon 
                size={20} 
                className={cn(
                  "mt-0.5 flex-shrink-0",
                  isActive ? "text-blue-600" : "text-gray-400"
                )} 
              />
              <div className="min-w-0 flex-1">
                <div className="font-medium">{item.label}</div>
                <div className="text-sm text-gray-500 mt-0.5">
                  {item.description}
                </div>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}