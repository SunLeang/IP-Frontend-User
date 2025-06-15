import { useState, useEffect } from "react";
import {
  getVolunteerHistory,
  VolunteerHistoryEvent,
  VolunteerHistoryQuery,
} from "@/services/volunteer-history-service";

interface UseVolunteerHistoryReturn {
  events: VolunteerHistoryEvent[];
  meta: {
    total: number;
    completed: number;
    upcoming: number;
    cancelled: number;
  };
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  setQuery: (query: VolunteerHistoryQuery) => void;
}

/**
 * Custom hook for managing volunteer history data
 */
export function useVolunteerHistory(): UseVolunteerHistoryReturn {
  const [events, setEvents] = useState<VolunteerHistoryEvent[]>([]);
  const [meta, setMeta] = useState({
    total: 0,
    completed: 0,
    upcoming: 0,
    cancelled: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<VolunteerHistoryQuery>({});

  /**
   * Fetches volunteer history data
   */
  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("📡 Fetching volunteer history with query:", query);

      // Clean up query - remove empty/undefined values
      const cleanQuery: VolunteerHistoryQuery = {};

      if (query.status && query.status !== "") {
        cleanQuery.status = query.status;
      }

      if (query.search && query.search !== "" && query.search.trim() !== "") {
        cleanQuery.search = query.search.trim();
      }

      const response = await getVolunteerHistory(cleanQuery);

      setEvents(response.data);
      setMeta(response.meta);

      console.log(
        `✅ Successfully loaded ${response.data.length} volunteer events`
      );
    } catch (err) {
      console.error("❌ Error fetching volunteer history:", err);
      setError("Failed to load volunteer history");
      setEvents([]);
      setMeta({ total: 0, completed: 0, upcoming: 0, cancelled: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refetch function to manually trigger data reload
   */
  const refetch = () => {
    fetchHistory();
  };

  /**
   * Update query and trigger refetch
   */
  const updateQuery = (newQuery: VolunteerHistoryQuery) => {
    console.log("🔄 Updating query:", newQuery);
    setQuery(newQuery);
  };

  // Fetch data when component mounts or query changes
  useEffect(() => {
    fetchHistory();
  }, [query]);

  return {
    events,
    meta,
    isLoading,
    error,
    refetch,
    setQuery: updateQuery,
  };
}
