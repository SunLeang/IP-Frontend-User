import { apiGet, apiPatch } from "./api";

export interface TaskAssignment {
  id: string;
  status: string;
  assignedAt: string;
  completedAt?: string;
  notes?: string;
  task: {
    id: string;
    name: string;
    description: string;
    type: string;
    status: string;
    dueDate: string;
    event: {
      id: string;
      name: string;
    };
  };
  assignedBy?: {
    id: string;
    fullName: string;
  };
}

export interface TaskResponse {
  data: TaskAssignment[];
  meta: {
    total: number;
    skip: number;
    take: number;
    hasMore: boolean;
  };
}

export interface TaskQueryParams {
  status?: string;
  eventId?: string;
  search?: string;
  skip?: number;
  take?: number;
}

/**
 * Fetch volunteer's own tasks
 */
export async function getMyTasks(
  params?: TaskQueryParams
): Promise<TaskResponse> {
  try {
    console.log("Fetching my tasks with params:", params);

    const queryString = params
      ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
      : "";

    const response = await apiGet(`/api/tasks/my-tasks${queryString}`);
    console.log("My tasks response:", response);

    return response;
  } catch (error) {
    console.error("Failed to fetch my tasks:", error);
    throw error;
  }
}

/**
 * Update task assignment status
 */
export async function updateTaskStatus(
  assignmentId: string,
  status: string,
  notes?: string
): Promise<TaskAssignment> {
  try {
    console.log(
      `Updating task assignment ${assignmentId} to status: ${status}`
    );

    const updateData: any = { status };
    if (notes) {
      updateData.notes = notes;
    }

    const response = await apiPatch(
      `/api/tasks/assignments/${assignmentId}`,
      updateData
    );
    console.log("Task status updated:", response);

    return response;
  } catch (error) {
    console.error("Failed to update task status:", error);
    throw error;
  }
}

/**
 * Get tasks for a specific event (volunteer's tasks only)
 */
export async function getMyEventTasks(
  eventId: string,
  params?: TaskQueryParams
): Promise<TaskResponse> {
  try {
    console.log(`Fetching my tasks for event ${eventId} with params:`, params);

    const queryString = params
      ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
      : "";

    const response = await apiGet(
      `/api/tasks/events/${eventId}/my-tasks${queryString}`
    );
    console.log("My event tasks response:", response);

    return response;
  } catch (error) {
    console.error("Failed to fetch my event tasks:", error);
    throw error;
  }
}
