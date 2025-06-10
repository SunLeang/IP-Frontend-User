import { Category } from "@/types/category";

/**
 * Props for EventsFilter component
 */
interface EventsFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  isLoading?: boolean;
}

/**
 * Events Filter Component
 * Displays category filter buttons for events page
 */
export function EventsFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  isLoading = false,
}: EventsFilterProps) {
  return (
    <div className="mb-8 flex flex-wrap gap-2">
      {/* All Events Button */}
      <button
        onClick={() => onCategoryChange(null)}
        disabled={isLoading}
        className={`px-4 py-2 rounded-full text-sm transition-colors ${
          selectedCategory === null
            ? "bg-blue-600 text-white"
            : "bg-gray-200 hover:bg-gray-300"
        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        All
      </button>

      {/* Category Filter Buttons */}
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          disabled={isLoading}
          className={`px-4 py-2 rounded-full text-sm transition-colors ${
            selectedCategory === category.id
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
