import { TaskAssignment } from "@/services/task-service";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface TaskListProps {
  tasks: TaskAssignment[];
  onTaskSelect: (taskId: string) => void;
  onTaskStatusUpdate: (taskId: string, status: string) => void;
  selectedTaskId?: string | null;
}

export function TaskList({
  tasks,
  onTaskSelect,
  onTaskStatusUpdate,
  selectedTaskId,
}: TaskListProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "logistic":
        return "bg-purple-100 text-purple-800";
      case "assistance":
        return "bg-blue-100 text-blue-800";
      case "media":
        return "bg-green-100 text-green-800";
      case "it":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const statusOptions = [
    { value: "PENDING", label: "Pending", color: "text-yellow-600" },
    { value: "IN_PROGRESS", label: "In Progress", color: "text-blue-600" },
    { value: "COMPLETED", label: "Completed", color: "text-green-600" },
  ];

  const handleStatusUpdate = (taskId: string, newStatus: string) => {
    onTaskStatusUpdate(taskId, newStatus);
    setOpenDropdown(null);
  };

  const toggleDropdown = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === taskId ? null : taskId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  return (
    <tbody>
      {tasks.map((taskAssignment, index) => {
        const isDropdownOpen = openDropdown === taskAssignment.id;
        const isLastRows = index >= tasks.length - 2; // Last 2 rows

        return (
          <tr
            key={taskAssignment.id}
            className={`border-b hover:bg-gray-50 cursor-pointer ${
              selectedTaskId === taskAssignment.id ? "bg-blue-50" : ""
            } ${isDropdownOpen ? "relative z-50" : ""}`}
            onClick={() => onTaskSelect(taskAssignment.id)}
          >
            <td className="px-4 py-3 text-sm">{index + 1}</td>
            <td className="px-4 py-3 text-sm font-mono">
              {taskAssignment.task.id.substring(0, 8)}
            </td>
            <td className="px-4 py-3 text-sm font-medium">
              {taskAssignment.task.name}
            </td>
            <td className="px-4 py-3">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  taskAssignment.status
                )}`}
              >
                {taskAssignment.status.replace("_", " ")}
              </span>
            </td>
            <td className="px-4 py-3">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                  taskAssignment.task.type
                )}`}
              >
                {taskAssignment.task.type}
              </span>
            </td>
            <td className="px-4 py-3 text-sm text-gray-600">
              {formatDate(taskAssignment.task.dueDate)}
            </td>
            <td className="px-4 py-3">
              <div
                className="relative"
                ref={isDropdownOpen ? dropdownRef : null}
              >
                <button
                  onClick={(e) => toggleDropdown(taskAssignment.id, e)}
                  className={`inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
                    isDropdownOpen ? "ring-2 ring-blue-500 border-blue-500" : ""
                  }`}
                >
                  Update Status
                  <ChevronDown
                    size={12}
                    className={`ml-1 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div
                    className={`absolute ${
                      isLastRows ? "bottom-full mb-1" : "top-full mt-1"
                    } right-0 w-44 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] animate-in fade-in-0 zoom-in-95 duration-100`}
                    style={{
                      boxShadow:
                        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    }}
                  >
                    <div className="py-1">
                      {statusOptions.map((option, optionIndex) => (
                        <button
                          key={option.value}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusUpdate(taskAssignment.id, option.value);
                          }}
                          disabled={option.value === taskAssignment.status}
                          className={`group flex items-center justify-between w-full px-4 py-2.5 text-sm transition-colors duration-150 ${
                            option.value === taskAssignment.status
                              ? "bg-gray-50 cursor-not-allowed opacity-60"
                              : "hover:bg-gray-50 cursor-pointer"
                          } ${option.color} ${
                            optionIndex === 0 ? "rounded-t-lg" : ""
                          } ${
                            optionIndex === statusOptions.length - 1
                              ? "rounded-b-lg"
                              : ""
                          }`}
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-2.5 h-2.5 rounded-full mr-3 ${
                                option.value === "PENDING"
                                  ? "bg-yellow-400"
                                  : option.value === "IN_PROGRESS"
                                  ? "bg-blue-400"
                                  : "bg-green-400"
                              }`}
                            />
                            <span className="font-medium">{option.label}</span>
                          </div>
                          {option.value === taskAssignment.status && (
                            <span className="text-xs text-gray-400 font-normal">
                              Current
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </td>
          </tr>
        );
      })}
    </tbody>
  );
}
