import { Skeleton } from "@/components/ui/skeleton";

/**
 * Category Loading Component
 * Displays loading skeletons for category page while data is being fetched
 */
export function CategoryLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Loading */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Category Image Skeleton */}
            <div className="flex-shrink-0">
              <Skeleton className="w-32 h-32 md:w-40 md:h-40 rounded-full" />
            </div>

            {/* Category Info Skeleton */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <Skeleton className="h-8 md:h-10 w-64 mx-auto md:mx-0" />
              <Skeleton className="h-6 w-96 mx-auto md:mx-0" />
              <Skeleton className="h-6 w-80 mx-auto md:mx-0" />
            </div>
          </div>
        </div>
      </section>

      {/* Content Loading */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Section Header Skeleton */}
          <div className="text-center mb-8 space-y-2">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>

          {/* Events Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <Skeleton className="w-full h-48" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
