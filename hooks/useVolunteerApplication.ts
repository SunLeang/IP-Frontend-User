import { useState, useEffect } from "react";
import { Event } from "@/types/event";
import { getEventById } from "@/services/event-service";
import { applyForVolunteer } from "@/services/volunteer-service";

interface FormData {
  fullName: string;
  gender: string;
  age: string;
  status: string;
  organization: string;
  reason: string;
}

interface FileItem {
  name: string;
  size: number;
  progress: number;
  completed: boolean;
}

interface UseVolunteerApplicationReturn {
  event: Event | null;
  isLoading: boolean;
  error: string | null;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  files: FileItem[];
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>;
  isSubmitting: boolean;
  submitApplication: () => Promise<boolean>;
  prefillUserData: (user: any) => void;
  validateStep: (step: number) => { isValid: boolean; errorMessage?: string };
}

/**
 * Custom hook for managing volunteer application process
 * Handles event fetching, form data, file management, and submission
 */
export function useVolunteerApplication(
  eventId: string,
  isAuthenticated: boolean
): UseVolunteerApplicationReturn {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    gender: "",
    age: "",
    status: "",
    organization: "",
    reason: "",
  });

  const [files, setFiles] = useState<FileItem[]>([]);

  /**
   * Fetches event data for the application
   */
  const fetchEvent = async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log(`Fetching event for application: ${eventId}`);

      const eventData = await getEventById(eventId);
      if (eventData) {
        setEvent(eventData);
        console.log(
          `Successfully loaded event for application: ${eventData.name}`
        );
      } else {
        setError("Event not found");
      }
    } catch (err) {
      console.error("Error fetching event:", err);
      setError("Failed to load event details");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Prefills form data with user information
   */
  const prefillUserData = (user: any) => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        fullName: user.fullName || "",
        gender: user.gender || "",
        age: user.age?.toString() || "",
        organization: user.org || "",
      }));

      console.log("Pre-filled form with user data");
    }
  };

  /**
   * Validates form data for a specific step
   */
  const validateStep = (
    step: number
  ): { isValid: boolean; errorMessage?: string } => {
    switch (step) {
      case 1:
        if (
          !formData.fullName ||
          !formData.gender ||
          !formData.age ||
          !formData.status
        ) {
          return {
            isValid: false,
            errorMessage: "Please fill in all required fields",
          };
        }
        return { isValid: true };

      case 2:
        if (files.length === 0) {
          return {
            isValid: false,
            errorMessage: "Please upload your CV",
          };
        }
        return { isValid: true };

      case 3:
        if (!formData.reason || !formData.reason.trim()) {
          return {
            isValid: false,
            errorMessage: "Please explain why you want to volunteer",
          };
        }
        if (files.length === 0) {
          return {
            isValid: false,
            errorMessage: "Please upload your CV",
          };
        }
        return { isValid: true };

      default:
        return { isValid: true };
    }
  };

  /**
   * Submits the volunteer application
   */
  const submitApplication = async (): Promise<boolean> => {
    try {
      setIsSubmitting(true);

      // Final validation
      const validation = validateStep(3);
      if (!validation.isValid) {
        throw new Error(validation.errorMessage);
      }

      console.log("Submitting volunteer application...");

      const cvPath = `/uploads/cv/${files[0].name}`;
      await applyForVolunteer({
        eventId,
        whyVolunteer: formData.reason,
        cvPath: cvPath,
      });

      console.log("Volunteer application submitted successfully");
      return true;
    } catch (error: any) {
      console.error("Error submitting volunteer application:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch event when authenticated and eventId available
  useEffect(() => {
    if (isAuthenticated && eventId) {
      fetchEvent();
    }
  }, [eventId, isAuthenticated]);

  return {
    event,
    isLoading,
    error,
    formData,
    setFormData,
    files,
    setFiles,
    isSubmitting,
    submitApplication,
    prefillUserData,
    validateStep,
  };
}
