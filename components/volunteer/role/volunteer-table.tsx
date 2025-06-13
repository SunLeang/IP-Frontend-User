import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCheck } from "lucide-react";

interface Volunteer {
  id: string;
  userId: string;
  user: {
    id: string;
    fullName: string;
    gender?: string;
  };
  status: string;
  approvedAt?: string;
  assignedTasks?: {
    id: string;
    task: {
      name: string;
      type: string;
    };
    status: string;
  }[];
}

interface VolunteerTableProps {
  volunteers: Volunteer[];
}

export function VolunteerTable({ volunteers }: VolunteerTableProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
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

  // Ensure volunteers is always an array and filter out invalid entries
  const volunteerList = Array.isArray(volunteers)
    ? volunteers.filter(
        (volunteer) =>
          volunteer && (volunteer.id || volunteer.userId || volunteer.user?.id)
      )
    : [];

  if (volunteerList.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Volunteers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No volunteers found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Volunteers ({volunteerList.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">Name</th>
                <th className="text-left py-3 px-4 font-medium">Gender</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">
                  Approved Date
                </th>
                <th className="text-left py-3 px-4 font-medium">
                  Assigned Tasks
                </th>
              </tr>
            </thead>
            <tbody>
              {volunteerList.map((volunteer, index) => {
                // Create a unique key using multiple fallbacks
                const uniqueKey =
                  volunteer.id ||
                  volunteer.userId ||
                  volunteer.user?.id ||
                  `${volunteer.user?.fullName}-${index}` ||
                  `volunteer-${index}`;

                return (
                  <tr key={uniqueKey} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <UserCheck className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="font-medium">
                          {volunteer.user?.fullName || "Unknown Volunteer"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-600">
                        {volunteer.user?.gender || "Not specified"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        className={getStatusColor(
                          volunteer.status || "unknown"
                        )}
                      >
                        {volunteer.status || "Unknown"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {formatDate(volunteer.approvedAt)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        {volunteer.assignedTasks &&
                        Array.isArray(volunteer.assignedTasks) &&
                        volunteer.assignedTasks.length > 0 ? (
                          volunteer.assignedTasks.map(
                            (assignment, taskIndex) => {
                              // Create unique key for tasks
                              const taskKey =
                                assignment.id ||
                                `${assignment.task?.name}-${taskIndex}` ||
                                `task-${uniqueKey}-${taskIndex}`;

                              return (
                                <div key={taskKey} className="text-sm">
                                  <span className="font-medium">
                                    {assignment.task?.name || "Unknown Task"}
                                  </span>
                                  <Badge
                                    className="ml-2 text-xs"
                                    variant="outline"
                                  >
                                    {assignment.status || "Unknown"}
                                  </Badge>
                                </div>
                              );
                            }
                          )
                        ) : (
                          <span className="text-gray-500 text-sm">
                            No tasks assigned
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
