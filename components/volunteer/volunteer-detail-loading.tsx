import { Skeleton } from "@/components/ui/skeleton";
import { HeroSection } from "@/components/hero-section";

export function VolunteerDetailLoading() {
  return (
    <div className="min-h-screen bg-white pb-10">
      <HeroSection />
      <div className="container mx-auto px-4 py-6">
        <Skeleton className="h-10 w-3/4 mb-6" />
        <Skeleton className="h-6 w-1/2 mb-3" />
        <div className="flex items-start mb-2">
          <Skeleton className="h-5 w-5 mr-3 mt-0.5" />
          <Skeleton className="h-5 w-1/3" />
        </div>
        <div className="flex items-start mb-6">
          <Skeleton className="h-5 w-5 mr-3 mt-0.5" />
          <Skeleton className="h-5 w-1/4" />
        </div>
        <Skeleton className="h-6 w-1/2 mb-3" />
        <Skeleton className="h-20 w-full mb-4" />
        <Skeleton className="h-20 w-full mb-4" />
        <Skeleton className="h-6 w-1/3 mb-3" />
        <div className="flex flex-col gap-2 mb-6">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
    </div>
  );
}
