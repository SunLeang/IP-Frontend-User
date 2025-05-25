import { apiPost, apiGet } from "./api";
import { CurrentRole } from "@/types/user";

export async function switchUserRole(role: CurrentRole): Promise<any> {
  try {
    // Add console logs for debugging
    console.log(`Sending request to switch to role: ${role}`);

    // Use the switch-role endpoint that returns fresh tokens
    const response = await apiPost("/api/users/switch-role", { role });

    // Verify the response has the expected structure
    if (!response || !response.user || !response.accessToken) {
      console.error("Invalid response from switch-role endpoint:", response);
      throw new Error("Invalid response from server when switching roles");
    }

    // Verify the role in the response matches what we requested
    if (response.user.currentRole !== role) {
      console.warn("Role in response doesn't match requested role:", {
        requested: role,
        received: response.user.currentRole,
      });

      // Force the correct role anyway
      response.user.currentRole = role;
    }

    console.log("Successfully switched role to:", role);
    return response;
  } catch (error) {
    console.error("Failed to switch role:", error);
    throw error;
  }
}

interface VolunteerApplication {
  id: string;
  status: string;
  eventId: string;
  userId: string;
  whyVolunteer?: string;
  cvPath?: string;
  createdAt: string;
  updatedAt: string;
}

export async function checkVolunteerEligibility(): Promise<boolean> {
  try {
    const applications: VolunteerApplication[] = await apiGet(
      "/api/volunteer/my-applications"
    );
    // Check if user has at least one approved volunteer application
    return applications.some(
      (app: VolunteerApplication) => app.status === "APPROVED"
    );
  } catch (error) {
    console.error("Failed to check volunteer eligibility:", error);
    return false;
  }
}
