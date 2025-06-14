import { clearAuthData } from "../utils/auth-utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3100";

export async function refreshAccessToken(): Promise<string | null> {
  try {
    console.log("Starting token refresh process...");

    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      console.log("No refresh token found");
      return null;
    }

    console.log("Sending refresh request to backend...");

    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      console.log(`Refresh failed with status: ${response.status}`);
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    console.log("Refresh response received:", {
      hasAccessToken: !!data.accessToken,
      hasRefreshToken: !!data.refreshToken,
    });

    if (!data.accessToken) {
      console.log("No access token in refresh response");
      throw new Error("No access token in response");
    }

    // Update tokens in localStorage
    localStorage.setItem("accessToken", data.accessToken);
    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
    }

    // Update user data if provided
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    // Update cookies for SSR
    document.cookie = `accessToken=${data.accessToken}; path=/; max-age=900; SameSite=Lax`;
    if (data.user?.currentRole) {
      document.cookie = `userRole=${data.user.currentRole}; path=/; max-age=900; SameSite=Lax`;
    }

    console.log("Token refresh completed successfully");
    return data.accessToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
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