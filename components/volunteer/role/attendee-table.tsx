import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

interface Attendee {
  id: string;
  user: {
    id: string;
    fullName: string;
    gender?: string;
  };
  status: string;
  joinedAt: string;
}

interface AttendeeTableProps {
  attendees: Attendee[];
}

export function AttendeeTable({ attendees }: AttendeeTableProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "joined":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
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

  // Ensure attendees is always an array and filter out invalid entries
  const attendeeList = Array.isArray(attendees)
    ? attendees.filter(
        (attendee) => attendee && (attendee.id || attendee.user?.id)
      )
    : [];

  if (attendeeList.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attendees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No attendees found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendees ({attendeeList.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">Name</th>
                <th className="text-left py-3 px-4 font-medium">Gender</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {attendeeList.map((attendee, index) => {
                // Create a unique key using multiple fallbacks
                const uniqueKey =
                  attendee.id ||
                  attendee.user?.id ||
                  `${attendee.user?.fullName}-${index}` ||
                  `attendee-${index}`;

                return (
                  <tr key={uniqueKey} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium">
                          {attendee.user?.fullName || "Unknown User"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-600">
                        {attendee.user?.gender || "Not specified"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        className={getStatusColor(attendee.status || "unknown")}
                      >
                        {attendee.status || "Unknown"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {formatDate(attendee.joinedAt)}
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
