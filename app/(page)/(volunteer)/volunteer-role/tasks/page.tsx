"use client"

import { useState } from "react"
import { Search, ChevronLeft, ChevronRight, Eye, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function VolunteerTasksPage() {
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [tasks, setTasks] = useState([
    {
      id: "ev-000001",
      description: "Event Setup & Cleanup",
      status: "Pending",
      type: "Logistic",
      date: "12-12-2024",
      details: "Help arrange tables, book displays, banners, and decorations before and after the event.",
    },
    {
      id: "ev-000002",
      description: "Book Organization",
      status: "Pending",
      type: "Logistic",
      date: "12-12-2024",
      details: "Sort and organize books by genre, author, and age group for easy browsing.",
    },
    {
      id: "ev-000003",
      description: "Guest Assistance",
      status: "Pending",
      type: "Assistance",
      date: "12-12-2024",
      details: "Guide visitors, answer questions, and help them find books they're interested in.",
    },
    {
      id: "ev-000004",
      description: "Inventory Management",
      status: "Done",
      type: "Logistic",
      date: "12-12-2024",
      details: "Track book inventory, sales, and help with restocking popular titles.",
    },
    {
      id: "ev-000005",
      description: "Event Photography",
      status: "Done",
      type: "Media",
      date: "12-12-2024",
      details: "Take photos of the event, attendees, and special moments for social media and documentation.",
    },
    {
      id: "ev-000006",
      description: "Safety & Security Awareness",
      status: "Pending",
      type: "Assistance",
      date: "12-12-2024",
      details: "Monitor the venue for any safety concerns and report issues to event coordinators.",
    },
    {
      id: "ev-000007",
      description: "Visitor Feedback Collection",
      status: "Done",
      type: "Media",
      date: "12-12-2024",
      details: "Collect feedback from visitors about their experience and suggestions for improvement.",
    },
    {
      id: "ev-000008",
      description: "Announcement Assistance",
      status: "Pending",
      type: "Assistance",
      date: "12-12-2024",
      details: "Help with announcements, author introductions, and event scheduling.",
    },
    {
      id: "ev-000009",
      description: "Decor & Atmosphere",
      status: "Done",
      type: "IT",
      date: "12-12-2024",
      details: "Create an inviting atmosphere with decorations, lighting, and music.",
    },
    {
      id: "ev-000010",
      description: "Vendor & Exhibitor Support",
      status: "Done",
      type: "Assistance",
      date: "12-12-2024",
      details: "Assist vendors and exhibitors with setup, technical needs, and general support.",
    },
  ])

  const handleViewTask = (taskId: string) => {
    setSelectedTask(taskId)
  }

  const handleCompleteTask = (taskId: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: "Done" } : task)))
  }

  const handleCloseTaskDetail = () => {
    setSelectedTask(null)
  }

  const selectedTaskData = tasks.find((task) => task.id === selectedTask)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">You&apos;re volunteering for BookFair Event</h1>

        <div className="flex items-center mb-4">
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Events</span>
            <span className="text-sm text-gray-500 mx-2">›</span>
            <span className="text-sm font-medium">Volunteers</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search..." className="pl-10 w-64" />
            </div>
            <Button variant="outline" size="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </Button>
            <Button variant="outline" size="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
            </Button>
          </div>
        </div>

        <div className="relative">
          {/* Task List */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">No.</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">ID</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">Description</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">Types</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">Date</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500"></th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => (
                  <tr key={task.id} className="border-t">
                    <td className="px-4 py-3 text-sm">{index + 1}</td>
                    <td className="px-4 py-3 text-sm">{task.id}</td>
                    <td className="px-4 py-3 text-sm font-medium">{task.description}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          task.status === "Done" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{task.type}</td>
                    <td className="px-4 py-3 text-sm">
                      {task.status === "Pending" && index === 1 ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center text-xs"
                          onClick={() => handleViewTask(task.id)}
                        >
                          <Eye size={14} className="mr-1" />
                          View
                        </Button>
                      ) : task.status === "Pending" && index === 2 ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center text-xs bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                          onClick={() => handleCompleteTask(task.id)}
                        >
                          <Check size={14} className="mr-1" />
                          Complete
                        </Button>
                      ) : (
                        task.date
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleViewTask(task.id)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-gray-500"
                        >
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="19" cy="12" r="1" />
                          <circle cx="5" cy="12" r="1" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">1-10 of 100</div>
            <div className="flex items-center space-x-2">
              <select className="border rounded-md px-2 py-1 text-sm">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <Button variant="outline" size="icon" disabled>
                <ChevronLeft size={16} />
              </Button>
              <Button variant="outline" size="icon">
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>

          {/* Task Detail Panel */}
          {selectedTask && selectedTaskData && (
            <div className="absolute top-0 right-0 w-full md:w-1/2 lg:w-1/3 bg-white shadow-lg rounded-lg border z-10">
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <ChevronLeft
                    size={20}
                    className="cursor-pointer text-gray-500 hover:text-gray-700"
                    onClick={handleCloseTaskDetail}
                  />
                  <h3 className="text-lg font-medium ml-2">Tasks-{selectedTaskData.id}</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-500">Name</label>
                    <p className="font-medium">{selectedTaskData.description}</p>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500">Type</label>
                    <p className="font-medium">{selectedTaskData.type}</p>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500">Status</label>
                    <p className="font-medium">{selectedTaskData.status}</p>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500">Description:</label>
                    <p className="text-sm">{selectedTaskData.details}</p>
                  </div>

                  {selectedTaskData.status === "Pending" && (
                    <div className="flex justify-end">
                      <Button
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          handleCompleteTask(selectedTaskData.id)
                          handleCloseTaskDetail()
                        }}
                      >
                        Done
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
