import { Button } from "@/components/ui/button";

interface VolunteerStatus {
  isVolunteer: boolean;
  applicationStatus: string | null;
  hasApplied: boolean;
}

interface VolunteerDetailApplyButtonProps {
  isAuthenticated: boolean;
  eventEnded: boolean;
  volunteerStatus: VolunteerStatus;
  onApply: () => void;
}

export function VolunteerDetailApplyButton({
  isAuthenticated,
  eventEnded,
  volunteerStatus,
  onApply,
}: VolunteerDetailApplyButtonProps) {
  // Function to get button text and state
  const getButtonState = () => {
    if (!isAuthenticated) {
      return {
        text: "Login to Apply",
        disabled: false,
        className: "w-full py-6 bg-blue-500 hover:bg-blue-600",
      };
    }

    if (eventEnded) {
      return {
        text: "Event Has Ended",
        disabled: true,
        className: "w-full py-6 bg-gray-400 cursor-not-allowed",
      };
    }

    if (volunteerStatus.isVolunteer) {
      return {
        text: "You're Already a Volunteer",
        disabled: true,
        className: "w-full py-6 bg-green-400 cursor-not-allowed",
      };
    }

    if (volunteerStatus.hasApplied) {
      const statusText =
        {
          PENDING: "Application Submitted - Please Wait",
          REJECTED: "Application Rejected",
          APPROVED: "You're Already a Volunteer",
        }[volunteerStatus.applicationStatus || "PENDING"] ||
        "Application Submitted - Please Wait";

      return {
        text: statusText,
        disabled: true,
        className:
          volunteerStatus.applicationStatus === "REJECTED"
            ? "w-full py-6 bg-red-400 cursor-not-allowed"
            : "w-full py-6 bg-yellow-400 cursor-not-allowed",
      };
    }

    return {
      text: "Apply Now",
      disabled: false,
      className: "w-full py-6 bg-green-500 hover:bg-green-600",
    };
  };

  const buttonState = getButtonState();

  return (
    <>
      {/* Apply Button - Fixed at bottom on mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t md:relative md:border-0 md:p-0 md:mt-8">
        <Button
          onClick={onApply}
          disabled={buttonState.disabled}
          className={buttonState.className}
        >
          {buttonState.text}
        </Button>
      </div>

      {/* Spacer for fixed button on mobile */}
      <div className="h-20 md:h-0"></div>
    </>
  );
}
