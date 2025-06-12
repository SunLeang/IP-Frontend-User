import { Button } from "@/components/ui/button";

interface VolunteerDashboardErrorProps {
  error: string;
  onRetry: () => void;
}

export function VolunteerDashboardError({
  error,
  onRetry,
}: VolunteerDashboardErrorProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Event Banner - Still show even on error */}
      <div className="bg-blue-50 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4">
            You&apos;re volunteering for BookFair Event
          </h1>
          <div className="relative w-full h-[200px] md:h-[250px] rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Image unavailable</span>
          </div>
        </div>
      </div>

      {/* Error Content */}
      <div className="container mx-auto px-4 py-6 flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to Load Dashboard
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "Unable to load dashboard data. Please try again."}
          </p>
          <Button onClick={onRetry} className="bg-blue-500 hover:bg-blue-600">
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
