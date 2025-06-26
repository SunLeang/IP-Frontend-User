"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth-context";
import { useVolunteerApplication } from "@/hooks/useVolunteerApplication";
import { uploadDocument, deleteDocument } from "@/services/file-upload-service";
import { VolunteerDetailHeader } from "@/components/volunteer/volunteer-detail-header";
import { ApplicationProgress } from "@/components/volunteer/application-progress";
import { ApplicationFormStep1 } from "@/components/volunteer/application-form-step1"; // ✅ FIXED: Remove dash
import { FileUploadStep } from "@/components/volunteer/file-upload-step";
import { ApplicationReviewStep } from "@/components/volunteer/application-review-step";
import {
  SuccessModal,
  ErrorModal,
} from "@/components/volunteer/application-modals";
import { getValidImageSrc } from "@/utils/event-utils";

//  Updated helper function to use the utility with proper null checks
function getValidEventImageSrc(src: string | undefined | null): string {
  if (!src) {
    return "/assets/images/event-placeholder.png";
  }
  return getValidImageSrc(src) || "/assets/images/event-placeholder.png";
}

export default function VolunteerApplicationPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = React.use(params as unknown as Promise<{ id: string }>);
  const router = useRouter();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();

  // UI state
  const [step, setStep] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // File state
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{
      name: string;
      size: number;
      documentUrl: string;
      filename: string;
      uploading?: boolean;
    }>
  >([]);

  // Use custom hook for application logic
  const {
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
  } = useVolunteerApplication(id, isAuthenticated);

  // Authentication check
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push(
        `/login?redirect=${encodeURIComponent(`/volunteer/apply/${id}`)}`
      );
      return;
    }
  }, [isAuthenticated, authLoading, router, id]);

  // Prefill user data when user is available
  useEffect(() => {
    if (user) {
      prefillUserData(user);
    }
  }, [user, prefillUserData]);

  // Handle API errors
  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      setShowErrorModal(true);
    }
  }, [error]);

  // Event handlers
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoToStep = (targetStep: number) => {
    if (targetStep >= 1 && targetStep <= 3) {
      setStep(targetStep);
    }
  };

  // SIMPLIFIED handleNext - validate files directly without hook sync
  const handleNext = () => {
    console.log("🔍 Validating step:", step);

    if (step === 1) {
      // Validate Step 1 - Personal Information
      if (!formData.fullName?.trim()) {
        setErrorMessage("Full name is required");
        setShowErrorModal(true);
        return;
      }
      if (!formData.gender?.trim()) {
        setErrorMessage("Gender is required");
        setShowErrorModal(true);
        return;
      }
      if (!formData.age?.trim()) {
        setErrorMessage("Age is required");
        setShowErrorModal(true);
        return;
      }
      if (!formData.status?.trim()) {
        setErrorMessage("Status is required");
        setShowErrorModal(true);
        return;
      }
      if (!formData.reason?.trim()) {
        setErrorMessage("Please explain why you want to volunteer");
        setShowErrorModal(true);
        return;
      }
    } else if (step === 2) {
      // Validate Step 2 - File Upload
      const completedFiles = uploadedFiles.filter((f) => !f.uploading);
      console.log("📁 Completed files:", completedFiles.length);

      if (completedFiles.length === 0) {
        setErrorMessage("Please upload your CV before proceeding");
        setShowErrorModal(true);
        return;
      }

      // Check if any files are still uploading
      const uploadingFiles = uploadedFiles.filter((f) => f.uploading);
      if (uploadingFiles.length > 0) {
        setErrorMessage("Please wait for all files to finish uploading");
        setShowErrorModal(true);
        return;
      }
    }

    // Move to next step
    setStep((prev) => Math.min(3, prev + 1));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  // Drag handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);

      for (const file of selectedFiles) {
        // Add file to list with uploading status
        const tempFileEntry = {
          name: file.name,
          size: file.size,
          documentUrl: "",
          filename: "",
          uploading: true,
        };

        setUploadedFiles((prev) => [...prev, tempFileEntry]);

        try {
          console.log("📤 Uploading file:", file.name);
          const response = await uploadDocument(file, "cvs");
          console.log("📥 Upload response:", response);

          // Update the file entry with upload results
          setUploadedFiles((prev) =>
            prev.map((item) =>
              item.name === file.name && item.uploading
                ? {
                    name: file.name,
                    size: file.size,
                    documentUrl: response.data.documentUrl,
                    filename: response.data.filename,
                    uploading: false,
                  }
                : item
            )
          );

          console.log("✅ File uploaded successfully:", response.data.filename);
        } catch (error: any) {
          console.error("❌ File upload failed:", error);

          // Remove the failed upload from the list
          setUploadedFiles((prev) =>
            prev.filter((item) => !(item.name === file.name && item.uploading))
          );

          setErrorMessage(error.message || "Failed to upload file");
          setShowErrorModal(true);
        }
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      const syntheticEvent = {
        target: { files: e.dataTransfer.files },
      } as React.ChangeEvent<HTMLInputElement>;

      await handleFileUpload(syntheticEvent);
    }
  };

  const removeFile = async (filename: string) => {
    try {
      if (filename) {
        await deleteDocument(filename);
      }
      setUploadedFiles((prev) =>
        prev.filter((file) => file.filename !== filename)
      );
    } catch (error) {
      console.error("Failed to delete file:", error);
    }
  };

  // use uploadedFiles directly
  const handleSubmit = async () => {
    try {
      console.log("🚀 Submitting application...");
      console.log("📁 Available files:", uploadedFiles);

      // Validate files
      const completedFiles = uploadedFiles.filter((f) => !f.uploading);
      if (completedFiles.length === 0) {
        setErrorMessage("Please upload your CV");
        setShowErrorModal(true);
        return;
      }

      // Validate form data
      if (!formData.reason?.trim()) {
        setErrorMessage("Please explain why you want to volunteer");
        setShowErrorModal(true);
        return;
      }

      // Use the documentUrl from MinIO for the application
      const cvPath = completedFiles[0].documentUrl;
      console.log("📄 Using CV path:", cvPath);

      const success = await submitApplication({
        eventId: id,
        whyVolunteer: formData.reason,
        cvPath: cvPath,
      });

      if (success) {
        setShowSuccessModal(true);
      }
    } catch (error: any) {
      console.error("❌ Application submission failed:", error);
      setErrorMessage(error.message || "Failed to submit application");
      setShowErrorModal(true);
    }
  };

  const handleContinue = () => {
    router.push("/volunteer");
  };

  // Loading states
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-white pb-10">
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="h-4 w-full max-w-md mb-8" />
          <Skeleton className="h-40 w-full max-w-md mb-8" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // Add debug logging for event images with null checks
  console.log("🖼️ VOLUNTEER APPLICATION EVENT IMAGES:", {
    eventName: event?.name || "No event name",
    profileImage: event?.profileImage || "No profile image",
    coverImage: event?.coverImage || "No cover image",
    processedImage: event
      ? getValidEventImageSrc(event.profileImage)
      : "No event",
  });

  return (
    <div className="min-h-screen bg-white pb-10">
      <div className="container mx-auto px-4 py-6">
        {/* Add null check for event */}
        <VolunteerDetailHeader
          eventName={event?.name || "Loading..."}
          eventImage={
            event ? getValidEventImageSrc(event.profileImage) : undefined
          }
          onBack={() => {
            if (step === 1) {
              router.back();
            } else {
              handleBack();
            }
          }}
        />

        <ApplicationProgress currentStep={step} />

        {step === 1 && (
          <ApplicationFormStep1
            formData={formData}
            onInputChange={handleInputChange}
            onNext={handleNext}
          />
        )}

        {step === 2 && (
          <FileUploadStep
            files={uploadedFiles}
            onFileUpload={handleFileUpload}
            onRemoveFile={removeFile}
            onNext={handleNext}
            onBack={handleBack}
            isDragging={isDragging}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          />
        )}

        {step === 3 && (
          <ApplicationReviewStep
            formData={formData}
            files={uploadedFiles}
            onSubmit={handleSubmit}
            onBack={handleBack}
            onGoToStep={handleGoToStep}
            isSubmitting={isSubmitting}
          />
        )}

        <SuccessModal isOpen={showSuccessModal} onContinue={handleContinue} />
        <ErrorModal
          isOpen={showErrorModal}
          message={errorMessage}
          onClose={() => setShowErrorModal(false)}
        />
      </div>
    </div>
  );
}
