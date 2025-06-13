import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface EventDetailTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  attendeeCount: number;
  volunteerCount: number;
  onDownloadReport: () => void;
}

export function EventDetailTabs({
  activeTab,
  onTabChange,
  attendeeCount,
  volunteerCount,
  onDownloadReport,
}: EventDetailTabsProps) {
  return (
    <div className="flex justify-center mb-6">
      <div className="inline-flex rounded-md border border-gray-200">
        <Button
          variant={activeTab === "details" ? "default" : "ghost"}
          className={`rounded-none ${
            activeTab === "details" ? "bg-blue-500" : ""
          }`}
          onClick={() => onTabChange("details")}
        >
          Details
        </Button>
        <Button
          variant={activeTab === "attendee" ? "default" : "ghost"}
          className={`rounded-none border-l border-r ${
            activeTab === "attendee" ? "bg-blue-500" : ""
          }`}
          onClick={() => onTabChange("attendee")}
        >
          Attendee ({attendeeCount})
        </Button>
        <Button
          variant={activeTab === "volunteer" ? "default" : "ghost"}
          className={`rounded-none ${
            activeTab === "volunteer" ? "bg-blue-500" : ""
          }`}
          onClick={() => onTabChange("volunteer")}
        >
          Volunteer ({volunteerCount})
        </Button>
      </div>
      <Button variant="outline" className="ml-auto" onClick={onDownloadReport}>
        <Download size={16} className="mr-2" />
        Download Report
      </Button>
    </div>
  );
}
