import { refreshAccessToken } from "./auth-service";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3100";

// Add a global refresh promise to prevent multiple simultaneous refresh calls
let refreshPromise: Promise<string | null> | null = null;

const getAccessToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

const getAuthHeader = (): Record<string, string> => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function apiRequest(endpoint: string, method: string, data?: any) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
  };

  const config: RequestInit = { method, headers };
  if (data) config.body = JSON.stringify(data);

  let response = await fetch(`${API_URL}${endpoint}`, config);

  // Handle 401 errors with token refresh
  if (response.status === 401 && !endpoint.includes("/auth/")) {
    console.log("Access token expired, attempting refresh...");

    // Use the global refresh promise to prevent multiple simultaneous refresh calls
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken();
    }

    try {
      const newAccessToken = await refreshPromise;

      if (newAccessToken) {
        console.log("Token refreshed successfully, retrying request...");
        headers.Authorization = `Bearer ${newAccessToken}`;
        response = await fetch(`${API_URL}${endpoint}`, { ...config, headers });
      } else {
        console.log("Token refresh failed, redirecting to login...");
        // Clear auth data and redirect to login
        if (typeof window !== "undefined") {
          const { clearAuthData } = await import("../utils/auth-utils");
          clearAuthData();
          window.location.href = "/login";
        }
        throw new Error("Session expired - Please log in again");
      }
    } finally {
      // Reset the refresh promise
      refreshPromise = null;
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error: ${response.statusText}`);
  }

  return response.status === 204 ? null : response.json();
}

export const apiGet = (endpoint: string) => 
  apiRequest(endpoint, "GET");
export const apiPost = (endpoint: string, data: any) =>
  apiRequest(endpoint, "POST", data);
export const apiPut = (endpoint: string, data: any) =>
  apiRequest(endpoint, "PUT", data);
export const apiPatch = (endpoint: string, data: any) =>
  apiRequest(endpoint, "PATCH", data);
export const apiDelete = (endpoint: string) => 
  apiRequest(endpoint, "DELETE");
