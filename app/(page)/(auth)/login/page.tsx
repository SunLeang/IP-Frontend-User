// login.tsx
"use client";

import type React from "react";
import { useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { SharedAuthLayout, AuthDivider } from "@/components/auth/SharedAuthLayout";
import { AuthSocialButtons } from "@/components/auth/AuthSocialButtons";
import { useAuthForm } from "@/hooks/useAuthForm";

export default function LoginPage() {
  const { login } = useAuth();
  const {
    form: { data: formData, setData: setFormData, error, isLoading },
    handlers: { change: handleChange, submit: handleSubmit, toggleShowPassword },
    password: { show: showPassword },
  } = useAuthForm({ email: "", password: "" }, (data) => login(data.email, data.password), "/");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setFormData((prev) => ({ ...prev, email: emailParam }));
    }
  }, [setFormData]);

  return (
    <SharedAuthLayout title="Login">
      <AuthSocialButtons action="Login" />
      <AuthDivider />
      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">Forgot Password?</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
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
        </div>
        <Button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-medium mt-4"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
      <div className="text-center pt-2">
        <p className="text-sm text-center text-gray-600">
          Don't have an account? <Link href="/signup" className="text-blue-600 hover:underline">Sign up</Link>
        </p>
      </div>
    </SharedAuthLayout>
  );
}