import { refreshAccessToken } from "./auth-service";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3100";

const getAccessToken = () => typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

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

  if (response.status === 401 && !endpoint.includes("/auth/")) {
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) {
      headers.Authorization = `Bearer ${newAccessToken}`;
      response = await fetch(`${API_URL}${endpoint}`, { ...config, headers });
    } else {
      throw new Error("Unauthorized - Please log in");
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error: ${response.statusText}`);
  }

  return response.status === 204 ? null : response.json();
}

export const apiGet = (endpoint: string) => apiRequest(endpoint, "GET");
export const apiPost = (endpoint: string, data: any) => apiRequest(endpoint, "POST", data);
export const apiPut = (endpoint: string, data: any) => apiRequest(endpoint, "PUT", data);
export const apiPatch = (endpoint: string, data: any) => apiRequest(endpoint, "PATCH", data);
export const apiDelete = (endpoint: string) => apiRequest(endpoint, "DELETE");