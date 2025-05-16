import { apiGet } from "./api"

export interface Category {
  id: string
  name: string
  image?: string
}

export async function getCategories(): Promise<Category[]> {
  try {
    return await apiGet("/categories")
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return []
  }
}
