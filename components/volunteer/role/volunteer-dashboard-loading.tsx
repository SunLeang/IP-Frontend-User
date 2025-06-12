import { Skeleton } from "@/components/ui/skeleton";

export function VolunteerDashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Event Banner Loading */}
      <div className="bg-blue-50 py-6">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-80 mb-4" />
          <div className="relative w-full h-[200px] md:h-[250px] rounded-lg overflow-hidden">
            <Skeleton className="w-full h-full" />
          </div>
        </div>
      </div>

      {/* Dashboard Content Loading */}
      <div className="container mx-auto px-4 py-6">
        <Skeleton className="h-6 w-32 mb-4" />

        {/* Stats Cards Loading */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border">
              <Skeleton className="h-12 w-12 mb-3" />
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </div>

        {/* Download Button Loading */}
        <div className="flex justify-end mb-6">
          <Skeleton className="h-10 w-40" />
        </div>

        {/* Events Table Loading */}
        <div className="bg-white rounded-lg border">
          <Skeleton className="h-12 w-full mb-4" />
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full mb-2" />
          ))}
        </div>
      </div>
    </div>
  );
}
