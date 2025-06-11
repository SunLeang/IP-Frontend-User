import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

interface VolunteerDetailHeaderProps {
  eventName?: string;
  eventImage?: string;
  onBack?: () => void;
}

export function VolunteerDetailHeader({
  eventName,
  eventImage,
  onBack,
}: VolunteerDetailHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <>
      {/* Back button and title */}
      <div className="flex items-center mb-8">
        <button onClick={handleBack} className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-3xl font-bold">Volunteer Details</h1>
      </div>

      {/* Event title and image */}
      {eventName && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{eventName}</h2>
          {eventImage && (
            <div className="rounded-lg overflow-hidden mb-6">
              <Image
                src={eventImage}
                alt={eventName}
                width={400}
                height={250}
                className="w-full max-w-md h-auto object-cover"
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}
