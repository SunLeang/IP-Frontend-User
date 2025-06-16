import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CommentPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

/**
 * Comment Pagination Component
 * Similar to volunteer task pagination but designed for comments
 */
export function CommentPagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: CommentPaginationProps) {
  if (totalPages <= 1) return null;

  /**
   * Generate page numbers to display
   */
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const pages: (number | string)[] = [];

    // Always show first page
    pages.push(1);

    // Calculate start and end of middle section
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    // Add ellipsis after first page if needed
    if (start > 2) {
      pages.push("...");
    }

    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (end < totalPages - 1) {
      pages.push("...");
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center space-x-1 mt-6">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className="px-3"
      >
        <ChevronLeft size={16} className="mr-1" />
        <span className="sr-only">Previous</span>
        <span aria-hidden="true">Prev</span>
      </Button>

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => (
        <span key={index}>
          {page === "..." ? (
            <span className="px-3 py-2 text-gray-500">...</span>
          ) : (
            <Button
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => typeof page === "number" && onPageChange(page)}
              disabled={isLoading}
              className={`px-3 ${
                currentPage === page
                  ? "bg-[#001337] text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {page}
            </Button>
          )}
        </span>
      ))}

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className="px-3"
      >
        <span className="sr-only">Next</span>
        <span aria-hidden="true">Next</span>
        <ChevronRight size={16} className="ml-1" />
      </Button>
    </div>
  );
}
