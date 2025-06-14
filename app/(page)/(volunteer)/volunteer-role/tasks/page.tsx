"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVolunteerTasks } from "@/hooks/useVolunteerTasks";
import { TaskAssignment } from "@/services/task-service";
import { TaskList } from "@/components/volunteer/tasks/task-list";
import { TaskDetailPanel } from "@/components/volunteer/tasks/task-detail-panel";
import { TaskFilters } from "@/components/volunteer/tasks/task-filters";

export default function VolunteerTasksPage() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isUpdatingTask, setIsUpdatingTask] = useState(false);

  const {
    tasks,
    isLoading,
    error,
    totalTasks,
    refreshTasks,
    updateTask,
    setFilter,
    currentFilter,
  } = useVolunteerTasks();

  // Filter tasks based on search and status
  const filteredTasks = useMemo(() => {
    return tasks.filter((taskAssignment) => {
      const matchesSearch =
        !searchTerm ||
        taskAssignment.task.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        taskAssignment.task.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        !selectedStatus || taskAssignment.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchTerm, selectedStatus]);

  // Get selected task details
  const selectedTask = useMemo(() => {
    return tasks.find((task) => task.id === selectedTaskId) || null;
  }, [tasks, selectedTaskId]);

  // Event handlers
  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskId(taskId === selectedTaskId ? null : taskId);
  };

  const handleTaskStatusUpdate = async (
    assignmentId: string,
    status: string
  ) => {
    try {
      setIsUpdatingTask(true);
      await updateTask(assignmentId, status);

      // Show success message (you can implement toast notifications here)
      console.log(`Task status updated to ${status}`);
    } catch (error) {
      console.error("Failed to update task status:", error);
      // Show error message (you can implement toast notifications here)
    } finally {
      setIsUpdatingTask(false);
    }
  };

  const handleStatusUpdate = async (status: string) => {
    if (!selectedTaskId) return;
    await handleTaskStatusUpdate(selectedTaskId, status);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const handleRefresh = () => {
    refreshTasks();
  };

  const handleCloseTaskDetail = () => {
    setSelectedTaskId(null);
  };

  // Loading state
  if (isLoading && tasks.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={handleRefresh}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-4">Your Volunteer Tasks</h1>

        {/* Breadcrumb */}
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Tasks</span>
            <span className="text-sm text-gray-500 mx-2">›</span>
            <span className="text-sm font-medium">My Assignments</span>
          </div>

          {/* Filters */}
          <TaskFilters
            searchTerm={searchTerm}
            selectedStatus={selectedStatus}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
            onRefresh={handleRefresh}
          />
        </div>

        <div className="relative">
          {/* Task List - Added relative positioning and z-index management */}
          <div className="bg-white rounded-lg shadow-sm overflow-visible relative z-10">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-left sticky top-0 z-20">
                  <tr>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">
                      No.
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">
                      ID
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">
                      Description
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">
                      Status
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">
                      Type
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">
                      Due Date
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <TaskList
                  tasks={filteredTasks}
                  onTaskSelect={handleTaskSelect}
                  onTaskStatusUpdate={handleTaskStatusUpdate}
                  selectedTaskId={selectedTaskId}
                />
              </table>
            </div>

            {/* Empty state */}
            {filteredTasks.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tasks found
                </h3>
                <p className="text-gray-500">
                  {searchTerm || selectedStatus
                    ? "Try adjusting your filters to see more tasks."
                    : "You don't have any assigned tasks yet."}
                </p>
              </div>
            )}
          </div>

          {/* Task Detail Panel */}
          <TaskDetailPanel
            task={selectedTask}
            onClose={handleCloseTaskDetail}
            onUpdateStatus={handleStatusUpdate}
            isUpdating={isUpdatingTask}
          />
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Showing {filteredTasks.length} of {totalTasks} tasks
          </div>
          <div className="flex items-center space-x-2">
            <select className="border rounded-md px-2 py-1 text-sm">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <Button
              variant="outline"
              size="icon"
              disabled={currentFilter.skip === 0}
              onClick={() =>
                setFilter({
                  skip: Math.max(
                    0,
                    (currentFilter.skip || 0) - (currentFilter.take || 10)
                  ),
                })
              }
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={
                !isLoading && filteredTasks.length < (currentFilter.take || 10)
              }
              onClick={() =>
                setFilter({
                  skip: (currentFilter.skip || 0) + (currentFilter.take || 10),
                })
              }
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
