import { Check } from "lucide-react";

export function VolunteerDetailRequirements() {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-3">Requirement:</h2>
      <p className="mb-2">Volunteer Requirements:</p>
      <ul className="mb-4">
        <li className="flex items-start mb-2">
          <Check className="h-5 w-5 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
          <span>
            No experience needed – just enthusiasm and willingness to help!
          </span>
        </li>
        <li className="flex items-start mb-2">
          <Check className="h-5 w-5 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
          <span>Willingness to work as part of a team.</span>
        </li>
        <li className="flex items-start mb-2">
          <Check className="h-5 w-5 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
          <span>
            A sense of responsibility and commitment to assigned tasks.
          </span>
        </li>
        <li className="flex items-start mb-2">
          <Check className="h-5 w-5 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
          <span>Must submit a CV for registration.</span>
        </li>
      </ul>
      <p>If you're excited to be part of this event, apply now!</p>
    </div>
  );
}
