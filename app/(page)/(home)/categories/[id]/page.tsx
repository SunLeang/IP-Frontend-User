"use client";

import { use } from "react";
import { CategoryPageProps } from "@/types/category";
import { useCategory } from "@/hooks/useCategory";
import { CategoryHeader } from "@/components/category/category-header";
import { CategoryEventsGrid } from "@/components/category/category-events-grid";
import { CategoryLoading } from "@/components/category/category-loading";
import { CategoryError } from "@/components/category/category-error";

/**
 * Category Page Component
 * Displays a category with its associated events
 */
export default function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = use(params);
  const { id: categoryId } = resolvedParams;

  const { category, events, isLoading, error, refetch } =
    useCategory(categoryId);

  if (isLoading) {
    return <CategoryLoading />;
  }

  if (error || !category) {
    return (
      <CategoryError
        message={error || "Category not found"}
        onRetry={refetch}
      />
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <CategoryHeader category={category} />
      <CategoryEventsGrid
        events={events}
        isLoading={false}
        categoryName={category.name}
      />
    </main>
  );
}
