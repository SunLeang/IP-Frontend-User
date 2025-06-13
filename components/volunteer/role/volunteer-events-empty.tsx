import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function VolunteerEventsEmpty() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Your Volunteer Events</h1>
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">
          You haven't volunteered for any events yet.
        </p>
        <Button onClick={() => router.push("/volunteer")}>
          Browse Volunteer Opportunities
        </Button>
      </div>
    </div>
  );
}
