import { apiGet } from "./api"

export interface Category {
  id: string
  name: string
  image?: string
}

export async function getCategories(): Promise<Category[]> {
  try {
    // The endpoint is likely /api/event-categories instead of /api/categories
    return await apiGet("/api/event-categories")
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return []
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    return await apiGet(`/api/event-categories/${id}`)
  } catch (error) {
    console.error(`Failed to fetch category with id ${id}:`, error)
    return null
  }
}
