import { Button } from "@/components/ui/button";

interface VolunteerDashboardActionsProps {
  onDownloadReport?: () => void;
}

export function VolunteerDashboardActions({
  onDownloadReport,
}: VolunteerDashboardActionsProps) {
  const handleDownloadReport = () => {
    if (onDownloadReport) {
      onDownloadReport();
    } else {
      // Default download behavior
      console.log("Download report functionality to be implemented");
      // To be implemented :(
    }
  };

  return (
    <div className="flex justify-end mb-6">
      <Button
        variant="outline"
        className="text-blue-500 border-blue-500"
        onClick={handleDownloadReport}
      >
        Download Report
      </Button>
    </div>
  );
}
