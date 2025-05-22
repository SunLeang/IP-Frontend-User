import { refreshAccessToken } from "./auth-service";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3100";

// Helper to get the access token from localStorage
const getAccessToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

// Create auth header with proper typing
const getAuthHeader = (): Record<string, string> => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function apiGet(endpoint: string) {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    };

    let response = await fetch(`${API_URL}${endpoint}`, {
      method: "GET",
      headers,
    });

    if (response.status === 401) {
      // Try to refresh token
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        // Retry original request with new token
        const retryHeaders: Record<string, string> = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newAccessToken}`,
        };
        response = await fetch(`${API_URL}${endpoint}`, {
          method: "GET",
          headers: retryHeaders,
        });
      } else {
        throw new Error("Unauthorized - Please log in");
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in apiGet(${endpoint}):`, error);
    throw error;
  }
}

export async function apiPost(endpoint: string, data: any) {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      console.error(
        "Authentication error: User is not authenticated or token expired"
      );
      // Optionally redirect to login
      // if (typeof window !== "undefined") window.location.href = "/login"
      throw new Error("Unauthorized - Please log in");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`API Error (${response.status}):`, errorData);
      throw new Error(errorData.message || `Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in apiPost(${endpoint}):`, error);
    throw error;
  }
}

export async function apiPut(endpoint: string, data: any) {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      console.error(
        "Authentication error: User is not authenticated or token expired"
      );
      // Optionally redirect to login
      // if (typeof window !== "undefined") window.location.href = "/login"
      throw new Error("Unauthorized - Please log in");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`API Error (${response.status}):`, errorData);
      throw new Error(errorData.message || `Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in apiPut(${endpoint}):`, error);
    throw error;
  }
}

export async function apiPatch(endpoint: string, data: any) {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      console.error(
        "Authentication error: User is not authenticated or token expired"
      );
      // Optionally redirect to login
      // if (typeof window !== "undefined") window.location.href = "/login"
      throw new Error("Unauthorized - Please log in");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`API Error (${response.status}):`, errorData);
      throw new Error(errorData.message || `Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in apiPatch(${endpoint}):`, error);
    throw error;
  }
}

export async function apiDelete(endpoint: string) {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers,
    });

    if (response.status === 401) {
      console.error(
        "Authentication error: User is not authenticated or token expired"
      );
      // Optionally redirect to login
      // if (typeof window !== "undefined") window.location.href = "/login"
      throw new Error("Unauthorized - Please log in");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`API Error (${response.status}):`, errorData);
      throw new Error(errorData.message || `Error: ${response.statusText}`);
    }

    // Some DELETE endpoints might not return content
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in apiDelete(${endpoint}):`, error);
    throw error;
  }
}
