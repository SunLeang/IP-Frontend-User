import { MoreVertical } from "lucide-react"

interface EventTableProps {
  events: Array<{
    id: number
    name: string
    attendeeCount: number
    attendeeCapacity: number
    volunteerCount: string
    progress: number
  }>
}

export function EventTable({ events }: EventTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="font-medium">Statistic Event Details</h2>
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-500"
          >
            <path d="M3 9h18M3 15h18"></path>
          </svg>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 text-sm font-medium text-gray-500">No.</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500">Event</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500">Attendee</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500">Volunteer</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500"></th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-t">
                <td className="px-4 py-3 text-sm">{event.id}</td>
                <td className="px-4 py-3 text-sm font-medium">{event.name}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium">{event.progress}%</span>
                      <span className="text-xs text-gray-500">
                        {event.attendeeCount}/{event.attendeeCapacity}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${event.progress === 100 ? "bg-green-500" : "bg-yellow-500"}`}
                        style={{ width: `${event.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{event.volunteerCount}</td>
                <td className="px-4 py-3">
                  <button>
                    <MoreVertical size={16} className="text-gray-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
