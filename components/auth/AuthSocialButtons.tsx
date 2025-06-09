// components/auth/AuthSocialButtons.tsx
import { Button } from "@/components/ui/button";
import { Facebook } from "lucide-react";

interface AuthSocialButtonsProps {
  action: "Login" | "Sign up";
}

export function AuthSocialButtons({ action }: AuthSocialButtonsProps) {
  return (
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
        <span>{action} with Google</span>
      </Button>
      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2 h-12 border-gray-300 hover:bg-gray-50"
      >
        <Facebook size={20} />
        <span>{action} with Facebook</span>
      </Button>
    </div>
  );
}