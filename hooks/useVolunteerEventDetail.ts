import { useState, useEffect, useCallback } from "react";
import { getEventById, Event } from "@/services/event-service";
import { apiGet } from "@/services/api";

// Use the Event type from event-service instead of defining EventData
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

interface TaskPaginationMeta {
  total: number;
  skip: number;
  take: number;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
}

interface UseVolunteerEventDetailReturn {
  event: Event | null;
  attendees: Attendee[];
  volunteers: Volunteer[];
  tasks: TaskData[];
  taskCount: number;
  taskMeta: TaskPaginationMeta;
  isLoading: boolean;
  error: string | null;
  fetchAttendees: () => void;
  fetchVolunteers: () => void;
  fetchTasks: (page?: number) => void;
}

/**
 * Custom hook for managing volunteer event detail data
 * Handles event, attendees, volunteers, and tasks data for volunteer role
 */
export function useVolunteerEventDetail(
  eventId: string
): UseVolunteerEventDetailReturn {
  const [event, setEvent] = useState<Event | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [taskCount, setTaskCount] = useState(0);
  const [taskMeta, setTaskMeta] = useState<TaskPaginationMeta>({
    total: 0,
    skip: 0,
    take: 10,
    hasMore: false,
    currentPage: 1,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Safely extract array from API response
   */
  const extractArrayFromResponse = (response: any): any[] => {
    console.log("Raw API response:", response);

    // If response is already an array
    if (Array.isArray(response)) {
      return response;
    }

    // If response has a data property that's an array
    if (response?.data && Array.isArray(response.data)) {
      return response.data;
    }

    // If response has pagination structure
    if (response?.data?.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    // If response has items property
    if (response?.items && Array.isArray(response.items)) {
      return response.items;
    }

    console.warn("Response is not in expected array format:", response);
    return [];
  };

  /**
   * Fetches basic event data
   */
  const fetchEventData = useCallback(async () => {
    if (!eventId) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log(`Fetching volunteer event detail for: ${eventId}`);

      const eventData = await getEventById(eventId);
      if (eventData) {
        setEvent(eventData);
        console.log(`Successfully loaded volunteer event: ${eventData.name}`);
      } else {
        setError("Event not found");
      }
    } catch (err) {
      console.error("Error fetching volunteer event:", err);
      setError("Failed to load event details");
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  /**
   * Fetches attendees for the event
   */
  const fetchAttendees = useCallback(async () => {
    if (!eventId) return;

    try {
      console.log(`Fetching attendees for volunteer event: ${eventId}`);
      const response = await apiGet(`/api/events/${eventId}/attendees`);

      const attendeeData = extractArrayFromResponse(response);
      setAttendees(attendeeData);
      console.log(`Loaded ${attendeeData.length} attendees:`, attendeeData);
    } catch (err) {
      console.error("Error fetching attendees:", err);
      setAttendees([]);
    }
  }, [eventId]);

  /**
   * Fetches volunteers for the event
   */
  const fetchVolunteers = useCallback(async () => {
    if (!eventId) return;

    try {
      console.log(`Fetching volunteers for event: ${eventId}`);
      // Use the correct endpoint from your backend
      const response = await apiGet(`/api/events/${eventId}/volunteers`);

      const volunteerData = extractArrayFromResponse(response);
      setVolunteers(volunteerData);
      console.log(`Loaded ${volunteerData.length} volunteers:`, volunteerData);
    } catch (err) {
      console.error("Error fetching volunteers:", err);
      setVolunteers([]);
    }
  }, [eventId]);

  /**
   * Fetches tasks for the event with pagination
   */
  const fetchTasks = useCallback(
    async (page: number = 1) => {
      if (!eventId) return;

      try {
        const skip = (page - 1) * 10;
        const take = 10;

        console.log(
          `Fetching tasks for event: ${eventId}, page: ${page}, skip: ${skip}, take: ${take}`
        );

        // Use the new endpoint with pagination
        const response = await apiGet(
          `/api/tasks/events/${eventId}?skip=${skip}&take=${take}`
        );

        console.log("Tasks API response:", response);

        // Handle different response formats
        let tasksData: TaskData[] = [];
        let meta: any = {};

        if (response?.data && Array.isArray(response.data)) {
          // If response has data array and meta
          tasksData = response.data;
          meta = response.meta || {};
        } else if (Array.isArray(response)) {
          // If response is directly an array (no pagination)
          tasksData = response;
          meta = {
            total: response.length,
            skip: 0,
            take: response.length,
            hasMore: false,
          };
        } else {
          console.warn("Unexpected tasks response format:", response);
          tasksData = [];
          meta = { total: 0, skip: 0, take: 10, hasMore: false };
        }

        setTasks(tasksData);
        setTaskCount(meta.total || tasksData.length);

        // Update pagination metadata
        const totalPages = Math.ceil((meta.total || tasksData.length) / 10);
        setTaskMeta({
          total: meta.total || tasksData.length,
          skip: meta.skip || skip,
          take: meta.take || take,
          hasMore:
            meta.hasMore !== undefined ? meta.hasMore : page < totalPages,
          currentPage: page,
          totalPages,
        });

        console.log(
          `Loaded ${tasksData.length} tasks for page ${page}:`,
          tasksData
        );
        console.log("Task pagination meta:", {
          total: meta.total || tasksData.length,
          currentPage: page,
          totalPages,
        });
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setTasks([]);
        setTaskCount(0);
        setTaskMeta({
          total: 0,
          skip: 0,
          take: 10,
          hasMore: false,
          currentPage: 1,
          totalPages: 1,
        });
      }
    },
    [eventId]
  );

  // Fetch event data when eventId changes
  useEffect(() => {
    fetchEventData();
  }, [fetchEventData]);

  return {
    event,
    attendees,
    volunteers,
    tasks,
    taskCount,
    taskMeta,
    isLoading,
    error,
    fetchAttendees,
    fetchVolunteers,
    fetchTasks,
  };
}
