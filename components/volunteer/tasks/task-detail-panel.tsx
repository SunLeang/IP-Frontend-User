import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskAssignment } from "@/services/task-service";
import { useState } from "react";

interface TaskDetailPanelProps {
  task: TaskAssignment | null;
  onClose: () => void;
  onUpdateStatus: (status: string) => void;
  isUpdating?: boolean;
}

export function TaskDetailPanel({
  task,
  onClose,
  onUpdateStatus,
  isUpdating = false,
}: TaskDetailPanelProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  if (!task) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const statusOptions = [
    { value: "PENDING", label: "Pending", color: "bg-yellow-500" },
    { value: "IN_PROGRESS", label: "In Progress", color: "bg-blue-500" },
    { value: "COMPLETED", label: "Completed", color: "bg-green-500" },
  ];

  const handleStatusUpdate = () => {
    if (selectedStatus && selectedStatus !== task.status) {
      onUpdateStatus(selectedStatus);
      setSelectedStatus(""); // Reset selection
    }
  };

  return (
    <div className="absolute top-0 right-0 w-full md:w-1/2 lg:w-1/3 bg-white shadow-lg rounded-lg border z-10">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <ChevronLeft
            size={20}
            className="cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={onClose}
          />
          <h3 className="ml-2 text-lg font-semibold">Task Details</h3>
        </div>

        <div className="space-y-4">
          {/* Task ID and Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task ID
            </label>
            <p className="text-sm font-mono bg-gray-100 p-2 rounded">
              {task.task.id}
            </p>
          </div>

          {/* Task Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Name
            </label>
            <p className="text-sm font-semibold">{task.task.name}</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              {task.task.description}
            </p>
          </div>

          {/* Event */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event
            </label>
            <p className="text-sm font-medium">{task.task.event.name}</p>
          </div>

          {/* Current Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Status
            </label>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                task.status
              )}`}
            >
              {task.status.replace("_", " ")}
            </span>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <p className="text-sm">{task.task.type}</p>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <p className="text-sm">{formatDate(task.task.dueDate)}</p>
          </div>

          {/* Assigned By */}
          {task.assignedBy && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned By
              </label>
              <p className="text-sm">{task.assignedBy.fullName}</p>
            </div>
          )}

          {/* Notes */}
          {task.notes && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                {task.notes}
              </p>
            </div>
          )}

          {/* Status Update Section */}
          <div className="pt-4 border-t">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Status
            </label>

            {/* Status Selection Buttons */}
            <div className="grid grid-cols-1 gap-2 mb-3">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedStatus(option.value)}
                  disabled={option.value === task.status}
                  className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                    selectedStatus === option.value
                      ? "border-blue-500 bg-blue-50"
                      : option.value === task.status
                      ? "border-gray-200 bg-gray-100 cursor-not-allowed opacity-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-3 ${option.color}`}
                    />
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                  {option.value === task.status && (
                    <span className="text-xs text-gray-500">(Current)</span>
                  )}
                  {selectedStatus === option.value && (
                    <span className="text-xs text-blue-500">Selected</span>
                  )}
                </button>
              ))}
            </div>

            {/* Update Button */}
            <Button
              onClick={handleStatusUpdate}
              disabled={
                isUpdating || !selectedStatus || selectedStatus === task.status
              }
              className="w-full"
              variant={selectedStatus ? "default" : "outline"}
            >
              {isUpdating
                ? "Updating..."
                : selectedStatus && selectedStatus !== task.status
                ? `Update to ${
                    statusOptions.find((opt) => opt.value === selectedStatus)
                      ?.label
                  }`
                : "Select a different status"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
