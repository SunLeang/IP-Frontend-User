import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface EventOrganizerProps {
  organizer?: {
    id: string;
    fullName: string;
  };
}

export function EventOrganizer({ organizer }: EventOrganizerProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Event Organizer</h3>
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
            <Image
              src="/icons/user.png"
              alt="Organizer"
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium">
              {organizer?.fullName || "Event Organizer"}
            </p>
            <p className="text-sm text-gray-600">Event Host</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
