"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import { getEventById } from "@/services/event-service";
import { applyForVolunteer } from "@/services/volunteer-service";
import { useAuth } from "@/context/auth-context";
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

  // State management
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    age: "",
    status: "",
    organization: "",
    reason: "",
  });
  const [files, setFiles] = useState<
    { name: string; size: number; progress: number; completed: boolean }[]
  >([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Fetch event data
  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    const fetchEvent = async () => {
      setIsLoading(true);
      try {
        const eventData = await getEventById(id);
        if (eventData) {
          setEvent(eventData);
          if (user) {
            setFormData((prevData) => ({
              ...prevData,
              fullName: user.fullName || "",
              gender: user.gender || "",
              age: user.age?.toString() || "",
              organization: user.org || "",
            }));
          }
        } else {
          setErrorMessage("Event not found");
          setShowErrorModal(true);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        setErrorMessage("Failed to load event details");
        setShowErrorModal(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id, isAuthenticated, authLoading, user]);

  // Event handlers
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // New function to handle direct step navigation
  const handleGoToStep = (targetStep: number) => {
    if (targetStep >= 1 && targetStep <= 3) {
      setStep(targetStep);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (
        !formData.fullName ||
        !formData.gender ||
        !formData.age ||
        !formData.status
      ) {
        setErrorMessage("Please fill in all required fields");
        setShowErrorModal(true);
        return;
      }
    }
    if (step === 2) {
      if (files.length === 0) {
        setErrorMessage("Please upload your CV");
        setShowErrorModal(true);
        return;
      }
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
      setIsSubmitting(true);

      if (!formData.reason || !formData.reason.trim()) {
        setErrorMessage("Please explain why you want to volunteer");
        setShowErrorModal(true);
        return;
      }
      if (files.length === 0) {
        setErrorMessage("Please upload your CV");
        setShowErrorModal(true);
        return;
      }

      const cvPath = `/uploads/cv/${files[0].name}`;
      await applyForVolunteer({
        eventId: id,
        whyVolunteer: formData.reason,
        cvPath: cvPath,
      });

      setShowSuccessModal(true);
    } catch (error: any) {
      console.error("Error submitting volunteer application:", error);
      setErrorMessage(
        error.message || "Failed to submit your application. Please try again."
      );
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
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
            onGoToStep={handleGoToStep} // Pass the new navigation function
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
