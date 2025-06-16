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

// Helper function to ensure image paths are properly formatted
function getValidImageSrc(src: string | undefined | null): string {
  if (!src) return "/assets/images/event-placeholder.png";
  if (src.startsWith("http") || src.startsWith("/")) return src;
  return `/assets/images/${src}`;
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
  }, [user]);

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

  const handleNext = () => {
    const validation = validateStep(step);
    if (!validation.isValid) {
      setErrorMessage(validation.errorMessage || "Validation failed");
      setShowErrorModal(true);
      return;
    }
    setStep((prev) => Math.min(3, prev + 1));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        name: file.name,
        size: file.size,
        progress: 100,
        completed: true,
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map((file) => ({
        name: file.name,
        size: file.size,
        progress: 100,
        completed: true,
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (fileName: string) => {
    setFiles((prev) => prev.filter((file) => file.name !== fileName));
  };

  const handleSubmit = async () => {
    try {
      await submitApplication();
      setShowSuccessModal(true);
    } catch (error: any) {
      setErrorMessage(
        error.message || "Failed to submit your application. Please try again."
      );
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

  return (
    <div className="min-h-screen bg-white pb-10">
      <div className="container mx-auto px-4 py-6">
        <VolunteerDetailHeader
          eventName={event?.name}
          eventImage={getValidImageSrc(event?.profileImage)}
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
            files={files}
            isDragging={isDragging}
            onFileUpload={handleFileUpload}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onRemoveFile={removeFile}
            onBack={handleBack}
            onNext={handleNext}
          />
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <ApplicationReviewStep
            formData={formData}
            files={files}
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
