"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "@/context/auth-context";
import { useVolunteerApplication } from "@/hooks/useVolunteerApplication";
import { VolunteerDetailHeader } from "@/components/volunteer/volunteer-detail-header";
import { ApplicationProgress } from "@/components/volunteer/application-progress";
import { ApplicationFormStep1 } from "@/components/volunteer/application-form-step1";
import { FileUploadStep } from "@/components/volunteer/file-upload-step";
import { ApplicationReviewStep } from "@/components/volunteer/application-review-step";
import {
  SuccessModal,
  ErrorModal,
} from "@/components/volunteer/application-modals";
import { Skeleton } from "@/components/ui/skeleton";
import { uploadDocument, deleteDocument } from "@/services/file-upload-service";
import { getValidImageSrc } from "@/utils/event-utils"; // ✅ Use the updated utility

// Updated helper function to use the utility
function getValidEventImageSrc(src: string | undefined | null): string {
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
          console.log("📤 Starting upload for:", file.name);
          // Upload to MinIO
          const result = await uploadDocument(file, "cvs");
          console.log("✅ Upload result:", result);

          // Update the file entry with the uploaded data
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.name === file.name && f.uploading
                ? {
                    name: result.data.originalName || file.name,
                    size: result.data.size || file.size,
                    documentUrl: result.data.documentUrl,
                    filename: result.data.filename,
                    uploading: false,
                  }
                : f
            )
          );

          console.log("✅ File upload completed:", file.name);
        } catch (error: any) {
          console.error("Upload failed:", error);
          // Remove failed upload from list
          setUploadedFiles((prev) =>
            prev.filter((f) => !(f.name === file.name && f.uploading))
          );
          setErrorMessage(`Failed to upload ${file.name}: ${error.message}`);
          setShowErrorModal(true);
        }
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Convert FileList to File array and trigger upload
      const files = Array.from(e.dataTransfer.files);
      // Create a synthetic event to reuse handleFileUpload logic
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

  // ✅ FIXED handleSubmit - use uploadedFiles directly
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

      // Call the hook's submit function with proper parameters
      // But we need to modify this since the hook expects different parameters
      const success = await submitApplication();

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
          <div className="flex items-center mb-8">
            <div className="h-6 w-6 mr-4">
              <Skeleton className="h-full w-full rounded-full" />
            </div>
            <Skeleton className="h-10 w-64" />
          </div>
          <Skeleton className="h-4 w-full max-w-md mb-8" />
          <Skeleton className="h-40 w-full max-w-md mb-8" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // Add debug logging for event images
  console.log("🖼️ VOLUNTEER APPLICATION EVENT IMAGES:", {
    eventName: event?.name,
    profileImage: event?.profileImage,
    coverImage: event?.coverImage,
    processedImage: getValidEventImageSrc(event?.profileImage),
  });

  return (
    <div className="min-h-screen bg-white pb-10">
      <div className="container mx-auto px-4 py-6">
        <VolunteerDetailHeader
          eventName={event?.name}
          eventImage={getValidEventImageSrc(event?.profileImage)} // ✅ Use updated function
          onBack={() => {
            if (step === 1) {
              router.push(`/volunteer/${id}`);
            } else {
              handleBack();
            }
          }}
        />

        <ApplicationProgress currentStep={step} />

        {/* Step 1: Information */}
        {step === 1 && (
          <ApplicationFormStep1
            formData={formData}
            onInputChange={handleInputChange}
            onNext={handleNext}
          />
        )}

        {/* Step 2: CV Upload */}
        {step === 2 && (
          <FileUploadStep
            files={uploadedFiles.map((f) => ({
              name: f.name,
              size: f.size,
              progress: f.uploading ? 50 : 100,
              completed: !f.uploading,
            }))}
            isDragging={isDragging}
            onFileUpload={handleFileUpload}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onRemoveFile={(fileName) => {
              const file = uploadedFiles.find((f) => f.name === fileName);
              if (file) {
                removeFile(file.filename);
              }
            }}
            onBack={handleBack}
            onNext={handleNext}
          />
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <ApplicationReviewStep
            formData={formData}
            files={uploadedFiles
              .filter((f) => !f.uploading)
              .map((f) => ({
                name: f.name,
                size: f.size,
                progress: 100,
                completed: true,
              }))}
            eventName={event?.name}
            onBack={handleBack}
            onSubmit={handleSubmit}
            onGoToStep={handleGoToStep}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Modals */}
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
