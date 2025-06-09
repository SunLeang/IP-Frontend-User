// components/auth/SharedAuthLayout.tsx
import type React from "react";
import { Separator } from "@/components/ui/separator";

interface SharedAuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function SharedAuthLayout({ children, title }: SharedAuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}
      <div className="hidden md:flex md:w-1/2 bg-[#001337] text-white p-8 flex-col justify-center">
        <div className="mx-auto max-w-md space-y-6">
          <h1 className="text-4xl font-bold leading-tight">Discover tailored events.</h1>
          <h2 className="text-3xl font-bold leading-tight">Sign up for personalized recommendations today!</h2>
        </div>
      </div>
      {/* Right Panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-8 bg-white">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">{title}</h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export function AuthDivider() {
  return (
    <div className="relative py-2">
      <div className="absolute inset-0 flex items-center">
        <Separator className="w-full" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-4 text-sm text-gray-500">OR</span>
      </div>
    </div>
  );
}