import { clearAuthData } from "../utils/auth-utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3100";

export async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;
    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    if (!response.ok) throw new Error("Failed to refresh token");
    const data = await response.json();
    localStorage.setItem("accessToken", data.accessToken);
    if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);
    return data.accessToken;
  } catch {
    clearAuthData();
    return null;
  }
}

export async function getUserProfile() {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) throw new Error("No access token available");
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) throw new Error("Failed to fetch user profile");
    return response.json();
  } catch (error) {
    throw error;
  }
}