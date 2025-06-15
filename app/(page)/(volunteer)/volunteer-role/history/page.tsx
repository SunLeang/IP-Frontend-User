"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVolunteerHistory } from "@/hooks/useVolunteerHistory";
import { VolunteerHistoryGrid } from "@/components/volunteer/history/volunteer-history-grid";
import { VolunteerHistoryFilters } from "@/components/volunteer/history/volunteer-history-filters";

export default function VolunteerHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const { events, meta, isLoading, error, refetch, setQuery } =
    useVolunteerHistory();

  // Handle search and filter changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setQuery({ search: value, status: selectedStatus || undefined });
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setQuery({ search: searchTerm || undefined, status: status || undefined });
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Your Volunteer Journey</h1>

          {/* Stats Summary */}
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-lg">{meta.total}</div>
              <div className="text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-green-600">
                {meta.completed}
              </div>
              <div className="text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-blue-600">
                {meta.upcoming}
              </div>
              <div className="text-gray-600">Upcoming</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <VolunteerHistoryFilters
          searchTerm={searchTerm}
          selectedStatus={selectedStatus}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onRefresh={handleRefresh}
        />

        {/* Error State */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Events Grid */}
        <VolunteerHistoryGrid events={events} isLoading={isLoading} />

        {/* Pagination */}
        {events.length > 0 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <Button variant="outline" size="sm" className="px-3">
              <ChevronLeft size={16} className="mr-1" />
              <span className="sr-only">First</span>
              <span aria-hidden="true">First</span>
            </Button>
            <Button variant="outline" size="sm" className="px-3">
              <span className="sr-only">Back</span>
              <span aria-hidden="true">Back</span>
            </Button>
            <Button variant="outline" size="sm" className="px-3">
              1
            </Button>
            <Button variant="default" size="sm" className="px-3 bg-[#001337]">
              2
            </Button>
            <Button variant="outline" size="sm" className="px-3">
              3
            </Button>
            <Button variant="outline" size="sm" className="px-3">
              4
            </Button>
            <span className="px-2">...</span>
            <Button variant="outline" size="sm" className="px-3">
              25
            </Button>
            <Button variant="outline" size="sm" className="px-3">
              <span className="sr-only">Next</span>
              <span aria-hidden="true">Next</span>
              <ChevronRight size={16} className="ml-1" />
            </Button>
            <Button variant="outline" size="sm" className="px-3">
              <span className="sr-only">Last</span>
              <span aria-hidden="true">Last</span>
              <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
