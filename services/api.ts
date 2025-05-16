import { refreshAccessToken } from "./auth-service"

// Base API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

// Helper to get the access token from localStorage
const getAccessToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken")
  }
  return null
}

// Create a fetch wrapper with authentication
export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  // Get the access token
  const accessToken = getAccessToken()

  // Set up headers with authentication
  const headers = {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...options.headers,
  }

  try {
    // Make the request - ensure endpoint starts with /api
    const apiEndpoint = endpoint.startsWith("/api") ? endpoint : `/api${endpoint}`
    const response = await fetch(`${API_URL}${apiEndpoint}`, {
      ...options,
      headers,
    })

    // Handle 401 Unauthorized errors (token expired)
    if (response.status === 401) {
      try {
        // Try to refresh the token
        const newToken = await refreshAccessToken()

        if (newToken) {
          // Retry the request with the new token
          const newHeaders = {
            ...headers,
            Authorization: `Bearer ${newToken}`,
          }

          return fetch(`${API_URL}${apiEndpoint}`, {
            ...options,
            headers: newHeaders,
          })
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError)
        // Redirect to login if token refresh fails
        if (typeof window !== "undefined") {
          window.location.href = "/login"
        }
        throw new Error("Authentication failed")
      }
    }

    return response
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

// GET request helper
export async function apiGet(endpoint: string) {
  const response = await fetchWithAuth(endpoint)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "API request failed")
  }
  return response.json()
}

// POST request helper
export async function apiPost(endpoint: string, data: any) {
  const response = await fetchWithAuth(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "API request failed")
  }

  return response.json()
}

// PATCH request helper
export async function apiPatch(endpoint: string, data: any) {
  const response = await fetchWithAuth(endpoint, {
    method: "PATCH",
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "API request failed")
  }

  return response.json()
}

// DELETE request helper
export async function apiDelete(endpoint: string) {
  const response = await fetchWithAuth(endpoint, {
    method: "DELETE",
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "API request failed")
  }

  return response.json()
}
