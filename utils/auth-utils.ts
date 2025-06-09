// services/auth-utils.ts
export const clearAuthData = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  document.cookie = "accessToken=; Max-Age=0; path=/; SameSite=Lax";
  document.cookie = "userRole=; Max-Age=0; path=/; SameSite=Lax";
};

export const storeAuthData = (response: { accessToken: string; refreshToken?: string; user: any }) => {
  localStorage.setItem("accessToken", response.accessToken);
  if (response.refreshToken) {
    localStorage.setItem("refreshToken", response.refreshToken);
  }
  localStorage.setItem("user", JSON.stringify(response.user));
  document.cookie = `accessToken=${response.accessToken}; path=/; max-age=900; SameSite=Lax`;
  document.cookie = `userRole=${response.user.currentRole}; path=/; max-age=900; SameSite=Lax`;
};

export const validateAuthResponse = (response: any): { accessToken: string; user: any; refreshToken?: string } => {
  if (!response || typeof response !== "object" || !response.user || !response.accessToken) {
    throw new Error("Invalid response from server");
  }
  return {
    ...response,
    user: {
      ...response.user,
      currentRole: response.user.currentRole || "ATTENDEE", // Default to ATTENDEE only if undefined
    },
  };
};

export const getStoredUser = (): any | null => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};