import Image from "next/image";

interface VolunteerDashboardEventBannerProps {
  eventName?: string;
  eventImage?: string;
}

export function VolunteerDashboardEventBanner({
  eventName = "BookFair Event",
  eventImage = "/icons/user.png",
}: VolunteerDashboardEventBannerProps) {
  return (
    <div className="bg-blue-50 py-6">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">
          You&apos;re volunteering for {eventName}
        </h1>
        <div className="relative w-full h-[200px] md:h-[250px] rounded-lg overflow-hidden">
          <Image
            src={eventImage}
            alt={eventName}
            fill
            className="object-cover"
            onError={(e) => {
              // Fallback to default image on error
              (e.target as HTMLImageElement).src = "/icons/user.png";
            }}
          />
        </div>
      </div>
    </div>
  );
}
