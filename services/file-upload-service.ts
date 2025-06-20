// Create user-frontend/services/file-upload-service.ts
import { apiPost, apiDelete } from "./api";

export interface FileUploadResponse {
  success: boolean;
  message: string;
  data: {
    documentUrl: string;
    filename: string;
    originalName: string;
    size: number;
    mimetype: string;
    uploadedBy: string;
    uploadedAt: string;
  };
}

// Get the API URL with fallback
const getApiUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.warn("⚠️ NEXT_PUBLIC_API_URL not found, using fallback");
    return "http://localhost:3100"; // fallback URL
  }
  return apiUrl;
};

export async function uploadDocument(
  file: File,
  folder: string = "cvs"
): Promise<FileUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const apiUrl = getApiUrl();
  const uploadUrl = `${apiUrl}/api/file-upload/minio/document?folder=${folder}`;

  console.log("📤 Uploading document to:", uploadUrl);
  console.log("📁 File details:", {
    name: file.name,
    size: file.size,
    type: file.type,
    folder: folder,
  });

  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No authentication token found. Please log in again.");
    }

    console.log("🔑 Using token:", token ? "✅ Present" : "❌ Missing");

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type for FormData, browser will set it with boundary
      },
    });

    console.log("📥 Upload response status:", response.status);

    if (!response.ok) {
      let errorMessage = `Upload failed: ${response.statusText}`;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        console.error("❌ Upload error details:", errorData);
      } catch (parseError) {
        console.error("❌ Could not parse error response");
        const errorText = await response.text();
        console.error("❌ Raw error response:", errorText);
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log("✅ Upload successful:", result);
    return result;
  } catch (error) {
    console.error("❌ Error uploading document:", error);
    throw error;
  }
}

export async function deleteDocument(filename: string): Promise<void> {
  const apiUrl = getApiUrl();
  const deleteUrl = `${apiUrl}/api/file-upload/minio/document/${encodeURIComponent(
    filename
  )}`;

  console.log("🗑️ Deleting document from:", deleteUrl);

  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No authentication token found. Please log in again.");
    }

    const response = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = `Delete failed: ${response.statusText}`;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        // Ignore parse error for delete
      }

      throw new Error(errorMessage);
    }

    console.log("✅ Document deleted successfully");
  } catch (error) {
    console.error("❌ Error deleting document:", error);
    throw error;
  }
}

// Alternative: Use xisting API wrapper (if it supports FormData)
// export async function uploadDocumentViaAPI(
//   file: File,
//   folder: string = "cvs"
// ): Promise<FileUploadResponse> {
//   console.log("📤 Uploading via API wrapper...");

//   try {
//     // we need to use direct fetch for FormData uploads
//     return await uploadDocument(file, folder);
//   } catch (error) {
//     console.error("❌ API wrapper upload failed:", error);
//     throw error;
//   }
// }
