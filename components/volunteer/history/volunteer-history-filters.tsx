import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface VolunteerHistoryFiltersProps {
  searchTerm: string;
  selectedStatus: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (status: string) => void;
  onRefresh: () => void;
}

export function VolunteerHistoryFilters({
  searchTerm,
  selectedStatus,
  onSearchChange,
  onStatusChange,
  onRefresh,
}: VolunteerHistoryFiltersProps) {
  const statusOptions = [
    { value: "", label: "All Events" },
    { value: "COMPLETED", label: "Completed" },
    { value: "PUBLISHED", label: "Upcoming" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  return (
    <div className="flex items-center gap-4 mb-8">
      {/* Status Filter */}
      <select
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        className="border rounded-md px-3 py-2 text-sm bg-white"
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search events..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Refresh Button */}
      <Button variant="outline" onClick={onRefresh}>
        Refresh
      </Button>
    </div>
  );
}
