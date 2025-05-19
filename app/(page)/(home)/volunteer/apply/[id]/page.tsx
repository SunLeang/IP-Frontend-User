"use client";
import { useState } from "react";
import type React from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";
import { ArrowLeft, Check, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function VolunteerApplicationPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const router = useRouter();
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

  // Sample event data
  const event = {
    id,
    title: "Sound of eventura event",
    image: "/assets/images/event-melody.jpg",
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
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

  const handleSubmit = () => {
    try {
      // Simulate API call
      console.log("Form submitted:", { ...formData, files });

      // Check if required fields are filled
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

      // Check if CV is uploaded
      if (files.length === 0) {
        setErrorMessage("Please upload your CV");
        setShowErrorModal(true);
        return;
      }

      // If everything is valid, show success modal
      setShowSuccessModal(true);
    } catch { 
      setErrorMessage("Something went wrong. Please try again.");
      setShowErrorModal(true);
    }
  };

  const handleContinue = () => {
    // Redirect to volunteer page
    router.push("/volunteer");
  };

  return (
    <div className="min-h-screen bg-white pb-10">
      <div className="container mx-auto px-4 py-6">
        {/* Back button and title */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => {
              if (step === 1) {
                router.push(`/volunteer/${id}`);
              } else {
                handleBack();
              }
            }}
            className="mr-4"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-3xl font-bold">Apply for volunteer</h1>
        </div>

        {/* Progress indicator */}
        <div className="mb-8 relative">
          <div className="h-px bg-gray-300 absolute top-1/2 left-0 right-0 -z-10"></div>
          <div className="flex justify-between">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step > 1 ? <Check className="h-5 w-5" /> : 1}
              </div>
              <span className="mt-2 text-sm font-medium">
                {step === 1 ? "Information" : "Info"}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step > 2 ? <Check className="h-5 w-5" /> : 2}
              </div>
              <span className="mt-2 text-sm font-medium">CV</span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 3
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                3
              </div>
              <span className="mt-2 text-sm font-medium">Review</span>
            </div>
          </div>
        </div>

        {/* Event title and image */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{event.title}</h2>
          <div className="rounded-lg overflow-hidden mb-6">
            <Image
              src={event.image || "/placeholder.svg"}
              alt={event.title}
              width={400}
              height={250}
              className="w-full max-w-md h-auto object-cover"
            />
          </div>
        </div>

        {/* Step 1: Information */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <Label htmlFor="fullName" className="block mb-2">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Input Hint"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="gender" className="block mb-2">
                Gender <span className="text-red-500">*</span>
              </Label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="" disabled>
                  Input Hint
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <Label htmlFor="age" className="block mb-2">
                Age <span className="text-red-500">*</span>
              </Label>
              <Input
                id="age"
                name="age"
                type="number"
                placeholder="Input Hint"
                value={formData.age}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="status" className="block mb-2">
                Status <span className="text-red-500">*</span>
              </Label>
              <Input
                id="status"
                name="status"
                placeholder="Input Hint"
                value={formData.status}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="organization" className="block mb-2">
                Organization
              </Label>
              <Input
                id="organization"
                name="organization"
                placeholder="Input Hint"
                value={formData.organization}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="reason" className="block mb-2">
                Why do you want to be a volunteer?
              </Label>
              <Textarea
                id="reason"
                name="reason"
                placeholder="Describe what's special about your event & other important details."
                value={formData.reason}
                onChange={handleInputChange}
                className="w-full min-h-[200px]"
              />
            </div>

            <Button
              onClick={handleNext}
              className="w-full py-6 bg-green-500 hover:bg-green-600"
            >
              Next
            </Button>
          </div>
        )}

        {/* Step 2: CV Upload */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Submit CV</h2>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <Upload className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <h3 className="font-medium">Upload files</h3>
                  <p className="text-sm text-gray-500">
                    Select and upload the files oof your choice
                  </p>
                </div>
                <button className="ml-auto">
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center">
                  <Upload className="h-10 w-10 text-gray-400 mb-4" />
                  <p className="mb-2 font-medium">
                    Choose a file or drag & drop it here
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    JPEG, PNG, PDF, and MP4 formats, up to 50MB
                  </p>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="bg-white border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50">
                      Browse File
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      multiple
                      accept=".jpeg,.jpg,.png,.pdf,.mp4"
                    />
                  </label>
                </div>
              </div>

              {files.length > 0 && (
                <div className="mt-4 space-y-4">
                  {files.map((file, index) => (
                    <div key={index} className="bg-gray-100 rounded-md p-3">
                      <div className="flex items-start">
                        <div className="bg-red-100 text-red-800 p-1 rounded mr-3">
                          <span className="text-xs font-bold">PDF</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{file.name}</p>
                          <div className="flex items-center text-xs text-gray-500">
                            <span>
                              {Math.round(file.size / 1024)} KB of{" "}
                              {Math.round(file.size / 1024)} KB
                            </span>
                            {!file.completed && (
                              <>
                                <span className="mx-2">•</span>
                                <span>Uploading...</span>
                              </>
                            )}
                            {file.completed && (
                              <>
                                <span className="mx-2">•</span>
                                <span className="flex items-center">
                                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                                  Completed
                                </span>
                              </>
                            )}
                          </div>
                          {!file.completed && (
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full"
                                style={{ width: `${file.progress}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeFile(file.name)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {file.completed ? (
                            <X className="h-5 w-5" />
                          ) : (
                            <X className="h-5 w-5 text-gray-400 opacity-50" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={handleBack}
                className="w-1/2 py-6"
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                className="w-1/2 py-6 bg-green-500 hover:bg-green-600"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Review</h2>
            <div className="space-y-6 mb-8">
              <div>
                <Label className="block mb-2">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <p className="border rounded-md px-3 py-2">
                  {formData.fullName || "Not provided"}
                </p>
              </div>

              <div>
                <Label className="block mb-2">
                  Gender <span className="text-red-500">*</span>
                </Label>
                <p className="border rounded-md px-3 py-2">
                  {formData.gender || "Not provided"}
                </p>
              </div>

              <div>
                <Label className="block mb-2">
                  Age <span className="text-red-500">*</span>
                </Label>
                <p className="border rounded-md px-3 py-2">
                  {formData.age || "Not provided"}
                </p>
              </div>

              <div>
                <Label className="block mb-2">
                  Status <span className="text-red-500">*</span>
                </Label>
                <p className="border rounded-md px-3 py-2">
                  {formData.status || "Not provided"}
                </p>
              </div>

              <div>
                <Label className="block mb-2">Organization</Label>
                <p className="border rounded-md px-3 py-2">
                  {formData.organization || "Not provided"}
                </p>
              </div>

              <div>
                <Label className="block mb-2">
                  Why do you want to be a volunteer?
                </Label>
                <p className="border rounded-md px-3 py-2 min-h-[100px]">
                  {formData.reason || "Not provided"}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">CV</h3>
                {files.length > 0 ? (
                  <div className="space-y-4">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="bg-gray-100 rounded-md p-3 flex items-start"
                      >
                        <div className="bg-red-100 text-red-800 p-1 rounded mr-3">
                          <span className="text-xs font-bold">PDF</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{file.name}</p>
                          <div className="flex items-center text-xs text-gray-500">
                            <span>
                              {Math.round(file.size / 1024)} KB of{" "}
                              {Math.round(file.size / 1024)} KB
                            </span>
                            <span className="mx-2">•</span>
                            <span className="flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                              Completed
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(file.name)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-red-500">No CV uploaded</p>
                )}
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={handleBack}
                className="w-1/2 py-6"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                className="w-1/2 py-6 bg-green-500 hover:bg-green-600"
              >
                Submit
              </Button>
            </div>
          </div>
        )}
        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6 animate-in fade-in zoom-in duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-green-500 mb-4">
                  SUCCESS
                </h2>
                <p className="text-gray-700 mb-2">
                  Thank you for your request.
                </p>
                <p className="text-gray-700 mb-4">
                  We are will go through and provide our feedback to you.
                </p>
                <p className="text-gray-700 mb-6">
                  Shortly you will find a confirmation in notification.
                </p>
                <Button
                  onClick={handleContinue}
                  className="w-full py-4 bg-green-500 hover:bg-green-600"
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Error Modal */}
        {showErrorModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6 animate-in fade-in zoom-in duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
                  <X className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-red-500 mb-4">ERROR</h2>
                <p className="text-gray-700 mb-6">{errorMessage}</p>
                <Button
                  onClick={() => setShowErrorModal(false)}
                  className="w-full py-4 bg-red-500 hover:bg-red-600"
                >
                  Okay
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
