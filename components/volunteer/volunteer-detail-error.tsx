import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/hero-section";

interface VolunteerDetailErrorProps {
  error: string;
}

export function VolunteerDetailError({ error }: VolunteerDetailErrorProps) {
  return (
    <div className="min-h-screen bg-white pb-10">
      <HeroSection />
      <div className="container mx-auto px-4 py-6 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">
          {error || "Event not found"}
        </h2>
        <p className="mb-6">
          Sorry, we couldn't load the volunteer opportunity details
        </p>
        <Button asChild>
          <Link href="/volunteer">Browse Other Opportunities</Link>
        </Button>
      </div>
    </div>
  );
}
