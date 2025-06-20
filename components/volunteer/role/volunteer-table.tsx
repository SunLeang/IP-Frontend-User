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
          <CardTitle className="flex items-center">
            <UserCheck className="h-5 w-5 mr-2 text-gray-600" />
            Volunteers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <UserCheck className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-2">No volunteers found</p>
            <p className="text-sm">Volunteers will appear here once they join this event.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <UserCheck className="h-5 w-5 mr-2 text-gray-600" />
            Volunteers
          </div>
          <Badge variant="secondary" className="text-sm">
            {volunteerList.length} {volunteerList.length === 1 ? 'volunteer' : 'volunteers'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-700 bg-gray-50">
                  Name
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 bg-gray-50">
                  Gender
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 bg-gray-50">
                  Status
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 bg-gray-50">
                  Approved Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {volunteerList.map((volunteer, index) => {
                // Create a unique key using multiple fallbacks
                const uniqueKey =
                  volunteer.id ||
                  volunteer.userId ||
                  volunteer.user?.id ||
                  `${volunteer.user?.fullName}-${index}` ||
                  `volunteer-${index}`;

                return (
                  <tr 
                    key={uniqueKey} 
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mr-4 shadow-sm">
                          <UserCheck className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">
                            {volunteer.user?.fullName || "Unknown Volunteer"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-600 capitalize">
                        {volunteer.user?.gender || "Not specified"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <Badge
                        className={`${getStatusColor(
                          volunteer.status || "unknown"
                        )} font-medium`}
                      >
                        {volunteer.status || "Unknown"}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-600 font-medium">
                        {formatDate(volunteer.approvedAt)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Optional: Add summary footer */}
        {volunteerList.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Total: {volunteerList.length} {volunteerList.length === 1 ? 'volunteer' : 'volunteers'}
              </span>
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Approved: {volunteerList.filter(v => v.status?.toLowerCase() === 'approved').length}
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                  Pending: {volunteerList.filter(v => v.status?.toLowerCase() === 'pending').length}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}