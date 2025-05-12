"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Facebook, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen">

      {/* Left Panel */}
      <div className="hidden md:flex md:w-1/2 bg-[#001337] text-white p-8 flex-col justify-center">
        <div className="mx-auto max-w-md space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Discover tailored events.
          </h1>
          <h2 className="text-3xl font-bold leading-tight">
            Sign up for personalized recommendations today!
          </h2>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-8 bg-white">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Create Account</h1>
          </div>

          {/* Social Login Buttons */}

          { /* Google Button */}
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 h-12 border-gray-300 hover:bg-gray-50"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z"
                />
              </svg>
              <span>Sign up with Google</span>
            </Button>

            {/* Facebook Button */}
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 h-12 border-gray-300 hover:bg-gray-50"
            >
              <Facebook size={20} />
              <span>Sign up with Facebook</span>
            </Button>
          </div>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-gray-500">OR</span>
            </div>
          </div>

          {/* Signup Form */}
          <form className="space-y-5">

            {/* Full Name Input */}
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-sm font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  className="pl-10 h-12"
                />
              </div>
            </div>

            {/* E-mail Input */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">
                E-mail Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your e-mail"
                  className="pl-10 h-12"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="pl-10 pr-10 h-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 8 characters long
              </p>
            </div>

            {/* Create Account Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-medium mt-4"
            >
              Create Account
            </Button>
          </form>

            {/*Already have account */}
          <div className="text-center pt-2">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
