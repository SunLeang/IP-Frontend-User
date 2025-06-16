interface VolunteerStatus {
  isVolunteer: boolean;
  applicationStatus: string | null;
  hasApplied: boolean;
}

interface VolunteerDetailStatusBannersProps {
  eventEnded: boolean;
  isAuthenticated: boolean;
  volunteerStatus: VolunteerStatus;
}

export function VolunteerDetailStatusBanners({
  eventEnded,
  isAuthenticated,
  volunteerStatus,
}: VolunteerDetailStatusBannersProps) {
  return (
    <>
      {/* Event Status Indicator */}
      {eventEnded && (
        <div className="mb-6 p-4 bg-gray-100 border-l-4 border-gray-400 rounded">
          <p className="text-gray-700 font-medium">
            ⏰ This event has ended. Volunteer applications are no longer
            accepted.
          </p>
        </div>
      )}

      {/* Volunteer Status Indicator */}
      {isAuthenticated && volunteerStatus.hasApplied && (
        <div
          className={`mb-6 p-4 border-l-4 rounded ${
            volunteerStatus.isVolunteer
              ? "bg-green-50 border-green-400"
              : volunteerStatus.applicationStatus === "REJECTED"
              ? "bg-red-50 border-red-400"
              : "bg-yellow-50 border-yellow-400"
          }`}
        >
          <p
            className={`font-medium ${
              volunteerStatus.isVolunteer
                ? "text-green-700"
                : volunteerStatus.applicationStatus === "REJECTED"
                ? "text-red-700"
                : "text-yellow-700"
            }`}
          >
            {volunteerStatus.isVolunteer &&
              "✅ You are a volunteer for this event!"}
            {volunteerStatus.applicationStatus === "PENDING" &&
              "⏳ Your volunteer application is under review."}
            {volunteerStatus.applicationStatus === "REJECTED" &&
              "❌ Your volunteer application was not accepted."}
          </p>
        </div>
      )}
    </>
  );
}
