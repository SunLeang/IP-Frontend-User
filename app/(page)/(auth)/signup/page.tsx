"use client";

import type React from "react";
import { useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import type { RegisterData } from "@/context/auth-context";
import { SharedAuthLayout, AuthDivider } from "@/components/auth/SharedAuthLayout";
import { AuthSocialButtons } from "@/components/auth/AuthSocialButtons";
import { useAuthForm } from "@/hooks/useAuthForm";

export default function SignupPage() {
  const { register } = useAuth();
  const {
    form: { data: formData, setData: setFormData, error, isLoading },
    handlers: { change: handleChange, submit: handleSubmit, toggleShowPassword },
    password: { show: showPassword },
  } = useAuthForm<RegisterData>({ email: "", password: "", fullName: "", username: "" }, register);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setFormData((prev) => ({ ...prev, email: emailParam }));
    }
  }, [setFormData]);

  return (
    <SharedAuthLayout title="Create Account">
      <AuthSocialButtons action="Sign up" />
      <AuthDivider />
      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}
        <div className="space-y-1.5">
          <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              className="pl-10 h-12"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="username" className="text-sm font-medium">Username (Optional)</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Choose a username"
              className="pl-10 h-12"
              value={formData.username || ""}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium">E-mail Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your e-mail"
              className="pl-10 h-12"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-medium">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              className="pl-10 pr-10 h-12"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
        </div>
        <Button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-medium mt-4"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
      <div className="text-center pt-2">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">Log In</Link>
        </p>
      </div>
    </SharedAuthLayout>
  );
}