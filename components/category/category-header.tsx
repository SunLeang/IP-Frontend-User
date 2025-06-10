import Image from "next/image";
import { SafeImage } from "@/components/safe-image-prof";
import { Category } from "@/types/category";

/**
 * Props for CategoryHeader component
 */
interface CategoryHeaderProps {
  category: Category;
}

/**
 * Category Header Component
 * Displays category name, image, and description in a hero-style layout
 */
export function CategoryHeader({ category }: CategoryHeaderProps) {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Category Image */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <SafeImage
                src={category.image}
                alt={`${category.name} category`}
                width={160}
                height={160}
                className="w-full h-full object-cover"
                fallback="/assets/images/category-placeholder.png"
              />
            </div>
          </div>

          {/* Category Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {category.name}
            </h1>

            {category.description && (
              <p className="text-lg md:text-xl opacity-90 max-w-2xl">
                {category.description}
              </p>
            )}

            {!category.description && (
              <p className="text-lg md:text-xl opacity-90 max-w-2xl">
                Discover amazing {category.name.toLowerCase()} events happening
                near you
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Decorative overlay */}
      <div className="absolute inset-0 bg-black/20"></div>
    </section>
  );
}
