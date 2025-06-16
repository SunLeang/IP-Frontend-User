import { Button } from "@/components/ui/button";

interface VolunteerPaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function VolunteerPagination({
  currentPage = 1,
  totalPages = 2,
  onPageChange,
}: VolunteerPaginationProps) {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-center items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="px-3"
          onClick={() => onPageChange?.(1)}
          disabled={currentPage === 1}
        >
          <span className="sr-only">First</span>
          <span aria-hidden="true">« First</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="px-3"
          onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <span className="sr-only">Previous</span>
          <span aria-hidden="true">‹ Back</span>
        </Button>
        <Button variant="default" size="sm" className="px-3 bg-[#001337]">
          1
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="px-3"
          onClick={() => onPageChange?.(2)}
        >
          2
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="px-3"
          onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <span className="sr-only">Next</span>
          <span aria-hidden="true">Next ›</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="px-3"
          onClick={() => onPageChange?.(totalPages)}
          disabled={currentPage === totalPages}
        >
          <span className="sr-only">Last</span>
          <span aria-hidden="true">Last »</span>
        </Button>
      </div>
    </div>
  );
}
