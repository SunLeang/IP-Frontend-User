interface EventTableProps {
  events: Array<{
    id: number;
    name: string;
    attendeeCount: number;
    attendeeCapacity: number;
    volunteerCount: string;
    progress: number;
  }>;
}

export function EventTable({ events }: EventTableProps) {
  if (!events || events.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-medium">Statistic Event Details</h2>
        </div>
        <div className="p-4 text-center text-gray-500">
          No volunteer events found
        </div>
      </div>
    );
  }

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
              <tr key={event.id} className="border-b">
                <td className="p-4">{event.name}</td>
                <td className="p-4">
                  {event.attendeeCount}/{event.attendeeCapacity}
                </td>
                <td className="p-4">{event.volunteerCount}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${event.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">
                      {event.progress}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
