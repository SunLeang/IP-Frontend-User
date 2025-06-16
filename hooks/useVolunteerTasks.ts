import { useState, useEffect, useCallback } from "react";
import {
  getMyTasks,
  updateTaskStatus,
  TaskAssignment,
  TaskQueryParams,
} from "@/services/task-service";

interface UseVolunteerTasksReturn {
  tasks: TaskAssignment[];
  isLoading: boolean;
  error: string | null;
  totalTasks: number;
  hasMore: boolean;
  refreshTasks: () => void;
  updateTask: (
    assignmentId: string,
    status: string,
    notes?: string
  ) => Promise<void>;
  setFilter: (filter: TaskQueryParams) => void;
  currentFilter: TaskQueryParams;
}

/**
 * Custom hook for managing volunteer's own tasks
 */
export function useVolunteerTasks(): UseVolunteerTasksReturn {
  const [tasks, setTasks] = useState<TaskAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalTasks, setTotalTasks] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<TaskQueryParams>({
    take: 10,
    skip: 0,
  });

  /**
   * Fetch tasks from API
   */
  const fetchTasks = useCallback(
    async (filter: TaskQueryParams = currentFilter) => {
      setIsLoading(true);
      setError(null);

      try {
        console.log("Fetching tasks with filter:", filter);
        const response = await getMyTasks(filter);

        setTasks(response.data || []);
        setTotalTasks(response.meta?.total || 0);
        setHasMore(response.meta?.hasMore || false);

        console.log(`Loaded ${response.data?.length || 0} tasks`);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks");
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    },
    [currentFilter]
  );

  /**
   * Update task status
   */
  const updateTask = useCallback(
    async (assignmentId: string, status: string, notes?: string) => {
      try {
        const updatedTask = await updateTaskStatus(assignmentId, status, notes);

        // Update local state
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === assignmentId
              ? {
                  ...task,
                  status: updatedTask.status,
                  notes: updatedTask.notes,
                }
              : task
          )
        );

        console.log(`Task ${assignmentId} status updated to ${status}`);
      } catch (err) {
        console.error("Error updating task:", err);
        throw err;
      }
    },
    []
  );

  /**
   * Set filter and refresh tasks
   */
  const setFilter = useCallback((filter: TaskQueryParams) => {
    setCurrentFilter((prev) => ({ ...prev, ...filter }));
  }, []);

  /**
   * Refresh tasks with current filter
   */
  const refreshTasks = useCallback(() => {
    fetchTasks(currentFilter);
  }, [fetchTasks, currentFilter]);

  // Fetch tasks when filter changes
  useEffect(() => {
    fetchTasks(currentFilter);
  }, [fetchTasks, currentFilter]);

  return {
    tasks,
    isLoading,
    error,
    totalTasks,
    hasMore,
    refreshTasks,
    updateTask,
    setFilter,
    currentFilter,
  };
}
