import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VolunteerDetailBenefitsProps {
  eventName: string;
  eventDescription: string;
  eventId: string;
}

export function VolunteerDetailBenefits({
  eventName,
  eventDescription,
  eventId,
}: VolunteerDetailBenefitsProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-3">Why Volunteer?</h2>
      <p className="mb-4">
        Volunteer for {eventName} - Make a Difference & Gain Experience!
      </p>
      <p className="mb-4">{eventDescription}</p>
      <p className="mb-2">Benefits of Volunteering:</p>
      <ul className="mb-4">
        <li className="flex items-start mb-2">
          <Check className="h-5 w-5 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
          <span>Gain valuable experience and skills</span>
        </li>
        <li className="flex items-start mb-2">
          <Check className="h-5 w-5 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
          <span>Network with professionals in the field</span>
        </li>
        <li className="flex items-start mb-2">
          <Check className="h-5 w-5 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
          <span>Certificate of participation</span>
        </li>
        <li className="flex items-start mb-2">
          <Check className="h-5 w-5 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
          <span>Be part of an amazing community event</span>
        </li>
        <li className="flex items-start mb-2">
          <Check className="h-5 w-5 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
          <span>Free entry to the event</span>
        </li>
      </ul>
      <p className="mb-6">
        Join us in making this event special while enjoying great perks. Apply
        today! 🎉
      </p>
      <Link href={`/events/${eventId}`}>
        <Button className="w-full py-6">Check Event</Button>
      </Link>
    </div>
  );
}
