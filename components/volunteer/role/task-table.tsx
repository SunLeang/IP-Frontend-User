import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, User } from "lucide-react";
import { VolunteerPagination } from "@/components/volunteer/volunteer-pagination";

interface TaskData {
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  dueDate: string;
  assignments: {
    id: string;
    volunteer: {
      id: string;
      fullName: string;
    };
    status: string;
  }[];
}

interface TaskPaginationMeta {
  total: number;
  skip: number;
  take: number;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
}

interface TaskTableProps {
  tasks: TaskData[];
  taskMeta: TaskPaginationMeta;
  onPageChange: (page: number) => void;
}

export function TaskTable({ tasks, taskMeta, onPageChange }: TaskTableProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "setup":
        return "bg-purple-100 text-purple-800";
      case "cleanup":
        return "bg-orange-100 text-orange-800";
      case "registration":
        return "bg-blue-100 text-blue-800";
      case "assistance":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "No due date";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Ensure tasks is always an array and filter out invalid entries
  const taskList = Array.isArray(tasks)
    ? tasks.filter((task) => task && (task.id || task.name))
    : [];

  if (taskMeta.total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No tasks found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            Tasks ({taskMeta.total} total)
            <span className="text-sm font-normal text-gray-500 ml-2">
              Showing {taskMeta.skip + 1}-
              {Math.min(taskMeta.skip + taskMeta.take, taskMeta.total)} of{" "}
              {taskMeta.total}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {taskList.map((task, index) => {
              // Create a unique key using multiple fallbacks
              const uniqueKey =
                task.id || `${task.name}-${index}` || `task-${index}`;

              return (
                <div
                  key={uniqueKey}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1">
                        {task.name || "Unnamed Task"}
                      </h4>
                      <p className="text-gray-600 text-sm mb-2">
                        {task.description || "No description available"}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge className={getTypeColor(task.type || "unknown")}>
                          {task.type || "Unknown"}
                        </Badge>
                        <Badge
                          className={getStatusColor(task.status || "unknown")}
                        >
                          {task.status || "Unknown"}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>Due: {formatDate(task.dueDate)}</p>
                    </div>
                  </div>

                  {task.assignments &&
                    Array.isArray(task.assignments) &&
                    task.assignments.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <h5 className="font-medium text-sm mb-2">
                          Assigned Volunteers:
                        </h5>
                        <div className="space-y-2">
                          {task.assignments.map(
                            (assignment, assignmentIndex) => {
                              // Create unique key for assignments
                              const assignmentKey =
                                assignment.id ||
                                assignment.volunteer?.id ||
                                `${assignment.volunteer?.fullName}-${assignmentIndex}` ||
                                `assignment-${uniqueKey}-${assignmentIndex}`;

                              return (
                                <div
                                  key={assignmentKey}
                                  className="flex items-center justify-between"
                                >
                                  <div className="flex items-center">
                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                                      <User className="h-3 w-3 text-blue-600" />
                                    </div>
                                    <span className="text-sm font-medium">
                                      {assignment.volunteer?.fullName ||
                                        "Unknown Volunteer"}
                                    </span>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {assignment.status || "Unknown"}
                                  </Badge>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Pagination Component */}
      {taskMeta.totalPages > 1 && (
        <div className="mt-4">
          <VolunteerPagination
            currentPage={taskMeta.currentPage}
            totalPages={taskMeta.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
