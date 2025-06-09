"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Download,
  Star,
  Calendar,
  Clock,
  MapPin,
  Users,
  UserCheck,
  ClipboardList,
} from "lucide-react";
import Image from "next/image";
import { getEventById } from "@/services/event-service";
import { apiGet } from "@/services/api";

// Helper function to ensure image paths are properly formatted
function getValidImageSrc(src: string | undefined | null): string {
  if (!src) return "/placeholder.svg";
  if (src.startsWith("http")) return src;
  return src.startsWith("/") ? src : `/${src}`;
}

interface EventData {
  id: string;
  name: string;
  description: string;
  dateTime: string;
  locationDesc: string;
  profileImage?: string;
  coverImage?: string;
  status: string;
  category?: {
    name: string;
  };
  organizer?: {
    id: string;
    fullName: string;
  };
  _count?: {
    attendingUsers?: number;
    volunteers?: number;
    tasks?: number;
  };
}

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

export default function VolunteerEventPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const [activeTab, setActiveTab] = useState("details");
  const [isStarred, setIsStarred] = useState(false);
  const [event, setEvent] = useState<EventData | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch event data
  useEffect(() => {
    const fetchEventData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const eventData = await getEventById(id);
        if (eventData) {
          setEvent(eventData);
        } else {
          setError("Event not found");
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Failed to load event details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventData();
  }, [id]);

  // Fetch attendees when attendee tab is active
  useEffect(() => {
    if (activeTab === "attendee" && event) {
      fetchAttendees();
    }
  }, [activeTab, event]);

  // Fetch volunteers when volunteer tab is active
  useEffect(() => {
    if (activeTab === "volunteer" && event) {
      fetchVolunteers();
      fetchTasks();
    }
  }, [activeTab, event]);

  const fetchAttendees = async () => {
    try {
      const response = await apiGet(`/api/events/${id}/attendees`);
      setAttendees(response || []);
    } catch (err) {
      console.error("Error fetching attendees:", err);
      setAttendees([]);
    }
  };

  const fetchVolunteers = async () => {
    try {
      const response = await apiGet(`/api/volunteer/event/${id}/volunteers`);
      setVolunteers(response || []);
    } catch (err) {
      console.error("Error fetching volunteers:", err);
      setVolunteers([]);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await apiGet(`/api/tasks?eventId=${id}`);
      setTasks(response.data || response || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTasks([]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString("en-US", { weekday: "long" }),
      date: date.getDate().toString(),
      month: date.toLocaleDateString("en-US", { month: "long" }),
      year: date.getFullYear().toString(),
    };
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const startTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    // Assuming 4-hour duration
    const endDate = new Date(date.getTime() + 4 * 60 * 60 * 1000);
    const endTime = endDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${startTime} - ${endTime}`;
  };

  const formatDisplayDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pb-10">
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <div className="flex justify-center mb-6">
            <Skeleton className="h-10 w-80" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-white pb-10">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error || "Event not found"}</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  const eventDate = formatDate(event.dateTime);

  return (
    <div className="min-h-screen bg-white pb-10">
      <div className="container mx-auto px-4 py-6">
        {/* Event Title */}
        <h1 className="text-xl font-bold mb-4">
          You&apos;re volunteering for {event.name}
        </h1>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-md border border-gray-200">
            <Button
              variant={activeTab === "details" ? "default" : "ghost"}
              className={`rounded-none ${
                activeTab === "details" ? "bg-blue-500" : ""
              }`}
              onClick={() => setActiveTab("details")}
            >
              Details
            </Button>
            <Button
              variant={activeTab === "attendee" ? "default" : "ghost"}
              className={`rounded-none border-l border-r ${
                activeTab === "attendee" ? "bg-blue-500" : ""
              }`}
              onClick={() => setActiveTab("attendee")}
            >
              Attendee ({event._count?.attendingUsers || 0})
            </Button>
            <Button
              variant={activeTab === "volunteer" ? "default" : "ghost"}
              className={`rounded-none ${
                activeTab === "volunteer" ? "bg-blue-500" : ""
              }`}
              onClick={() => setActiveTab("volunteer")}
            >
              Volunteer ({event._count?.volunteers || 0})
            </Button>
          </div>
          <Button
            variant="outline"
            className="ml-auto"
            onClick={() => window.print()}
          >
            <Download size={16} className="mr-2" />
            Download Report
          </Button>
        </div>

        {/* Details Tab Content */}
        {activeTab === "details" && (
          <div>
            {/* Event Header */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{event.name}</h2>
                    <Badge variant="secondary">
                      {event.category?.name || "Event"}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsStarred(!isStarred)}
                  >
                    <Star
                      className={`h-5 w-5 ${
                        isStarred ? "fill-yellow-400 text-yellow-400" : ""
                      }`}
                    />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                    <div>
                      <div className="font-semibold">{eventDate.day}</div>
                      <div className="text-sm text-gray-600">
                        {eventDate.date} {eventDate.month} {eventDate.year}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-green-500" />
                    <div>
                      <div className="font-semibold">Time</div>
                      <div className="text-sm text-gray-600">
                        {formatTime(event.dateTime)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-red-500" />
                    <div>
                      <div className="font-semibold">Location</div>
                      <div className="text-sm text-gray-600">
                        {event.locationDesc}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Image */}
                <div className="relative h-64 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={getValidImageSrc(
                      event.coverImage || event.profileImage
                    )}
                    alt={event.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    About this event
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {event.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Host Information */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Event Organizer</h3>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <div className="font-semibold">
                      {event.organizer?.fullName || "Event Organizer"}
                    </div>
                    <div className="text-sm text-gray-600">Event Host</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">
                    {event._count?.attendingUsers || 0}
                  </div>
                  <div className="text-sm text-gray-600">Attendees</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <UserCheck className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">
                    {event._count?.volunteers || 0}
                  </div>
                  <div className="text-sm text-gray-600">Volunteers</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <ClipboardList className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                  <div className="text-2xl font-bold">
                    {event._count?.tasks || 0}
                  </div>
                  <div className="text-sm text-gray-600">Tasks</div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Attendee Tab Content */}
        {activeTab === "attendee" && (
          <div>
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    Event Attendees ({attendees.length})
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">ID</th>
                        <th className="text-left py-2">Name</th>
                        <th className="text-left py-2">Status</th>
                        <th className="text-left py-2">Gender</th>
                        <th className="text-left py-2">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendees.length > 0 ? (
                        attendees.map((attendee, index) => (
                          <tr key={attendee.id} className="border-b">
                            <td className="py-2">
                              {String(index + 1).padStart(6, "0")}
                            </td>
                            <td className="py-2">{attendee.user.fullName}</td>
                            <td className="py-2">
                              <Badge
                                variant={
                                  attendee.status === "JOINED"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {attendee.status}
                              </Badge>
                            </td>
                            <td className="py-2">
                              {attendee.user.gender || "N/A"}
                            </td>
                            <td className="py-2">
                              {formatDisplayDate(attendee.joinedAt)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="text-center py-8 text-gray-500"
                          >
                            No attendees found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Volunteer Tab Content */}
        {activeTab === "volunteer" && (
          <div className="space-y-6">
            {/* Volunteers Table */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    Event Volunteers ({volunteers.length})
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">ID</th>
                        <th className="text-left py-2">Name</th>
                        <th className="text-left py-2">Status</th>
                        <th className="text-left py-2">Gender</th>
                        <th className="text-left py-2">Approved Date</th>
                        <th className="text-left py-2">Tasks Assigned</th>
                      </tr>
                    </thead>
                    <tbody>
                      {volunteers.length > 0 ? (
                        volunteers.map((volunteer, index) => (
                          <tr key={volunteer.id} className="border-b">
                            <td className="py-2">
                              {String(index + 1).padStart(6, "0")}
                            </td>
                            <td className="py-2">{volunteer.user.fullName}</td>
                            <td className="py-2">
                              <Badge
                                variant={
                                  volunteer.status === "APPROVED"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {volunteer.status}
                              </Badge>
                            </td>
                            <td className="py-2">
                              {volunteer.user.gender || "N/A"}
                            </td>
                            <td className="py-2">
                              {volunteer.approvedAt
                                ? formatDisplayDate(volunteer.approvedAt)
                                : "N/A"}
                            </td>
                            <td className="py-2">
                              {volunteer.assignedTasks?.length || 0}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center py-8 text-gray-500"
                          >
                            No volunteers found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Tasks Table */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    Event Tasks ({tasks.length})
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Task Name</th>
                        <th className="text-left py-2">Type</th>
                        <th className="text-left py-2">Status</th>
                        <th className="text-left py-2">Due Date</th>
                        <th className="text-left py-2">Assigned To</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.length > 0 ? (
                        tasks.map((task) => (
                          <tr key={task.id} className="border-b">
                            <td className="py-2 font-medium">{task.name}</td>
                            <td className="py-2">{task.type}</td>
                            <td className="py-2">
                              <Badge
                                variant={
                                  task.status === "COMPLETED"
                                    ? "default"
                                    : task.status === "IN_PROGRESS"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {task.status}
                              </Badge>
                            </td>
                            <td className="py-2">
                              {formatDisplayDate(task.dueDate)}
                            </td>
                            <td className="py-2">
                              {task.assignments.length > 0 ? (
                                <div className="space-y-1">
                                  {task.assignments.map((assignment) => (
                                    <div
                                      key={assignment.id}
                                      className="text-sm"
                                    >
                                      {assignment.volunteer.fullName}
                                      <Badge
                                        className="ml-2 text-xs"
                                        variant="outline"
                                      >
                                        {assignment.status}
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-gray-500">
                                  Unassigned
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="text-center py-8 text-gray-500"
                          >
                            No tasks found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
