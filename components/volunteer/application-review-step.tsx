import { Button } from "@/components/ui/button";
import {
  FileText,
  User,
  MapPin,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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

interface ApplicationReviewStepProps {
  formData: FormData;
  files: FileItem[];
  eventName?: string;
  onBack: () => void;
  onSubmit: () => void;
  onGoToStep?: (step: number) => void; // New prop for direct step navigation
  isSubmitting?: boolean;
}

export function ApplicationReviewStep({
  formData,
  files,
  eventName,
  onBack,
  onSubmit,
  onGoToStep,
  isSubmitting = false,
}: ApplicationReviewStepProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Review Your Application</h2>
        <p className="text-gray-600">
          Please review all information before submitting your volunteer
          application
        </p>
      </div>

      {/* Event Information */}
      {eventName && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <MapPin className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-semibold text-blue-800">Event</h3>
          </div>
          <p className="text-blue-700 font-medium">{eventName}</p>
        </div>
      )}

      {/* Personal Information */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-600 mr-2" />
              <h3 className="font-semibold text-gray-800">
                Personal Information
              </h3>
            </div>
          </div>
          {onGoToStep && (
            <button
              onClick={() => onGoToStep(1)}
              className="ml-auto text-blue-600 hover:text-blue-800 flex items-center text-sm"
            >
              <span>Edit</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">
              Full Name
            </label>
            <p className="text-gray-900 font-medium">
              {formData.fullName || "Not provided"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Gender</label>
            <p className="text-gray-900 font-medium">
              {formData.gender || "Not provided"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Age</label>
            <p className="text-gray-900 font-medium">
              {formData.age || "Not provided"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Status</label>
            <p className="text-gray-900 font-medium">
              {formData.status || "Not provided"}
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-600">
              Organization
            </label>
            <p className="text-gray-900 font-medium">
              {formData.organization || "Not provided"}
            </p>
          </div>
        </div>

        {/* Motivation Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">
              Why do you want to be a volunteer?
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <p className="text-gray-900 whitespace-pre-wrap text-sm">
                {formData.reason || "No motivation provided"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Uploaded Files - Similar to FileUploadStep */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center">
              <Upload className="h-5 w-5 text-gray-600 mr-2" />
              <h3 className="font-semibold text-gray-800">
                Uploaded Documents
              </h3>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Your CV and supporting documents
            </p>
          </div>
          {onGoToStep && (
            <button
              onClick={() => onGoToStep(2)}
              className="ml-auto text-blue-600 hover:text-blue-800 flex items-center text-sm"
            >
              <span>Edit</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          )}
        </div>

        {files.length > 0 ? (
          <div className="mt-4 space-y-4">
            {files.map((file, index) => (
              <div key={index} className="bg-gray-100 rounded-md p-3">
                <div className="flex items-start">
                  <div className="bg-red-100 text-red-800 p-1 rounded mr-3">
                    <span className="text-xs font-bold">
                      {file.name.split(".").pop()?.toUpperCase() || "FILE"}
                    </span>
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
                  <div className="text-gray-400">
                    <FileText className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-10 w-10 text-gray-400 mb-4 mx-auto" />
            <p className="text-gray-500">No files uploaded</p>
            <p className="text-sm text-gray-400 mt-1">
              Please go back to upload your CV
            </p>
          </div>
        )}
      </div>

      {/* Important Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-amber-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-amber-800">
              Important Notice
            </h3>
            <div className="mt-2 text-sm text-amber-700">
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Please ensure all information provided is accurate and
                  complete
                </li>
                <li>
                  Your application will be reviewed by the event organizers
                </li>
                <li>
                  You will receive a notification with the decision within 3-5
                  business days
                </li>
                <li>Once submitted, you cannot modify your application</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Steps */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 mb-3">Quick Navigation</h4>
        <div className="flex justify-between">
          <button
            onClick={() => onGoToStep && onGoToStep(1)}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
            disabled={isSubmitting}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Step 1: Information
          </button>

          <button
            onClick={() => onGoToStep && onGoToStep(2)}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
            disabled={isSubmitting}
          >
            Step 2: CV Upload
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 pt-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="w-1/2 py-6"
          disabled={isSubmitting}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to CV Upload
        </Button>
        <Button
          onClick={onSubmit}
          className="w-1/2 py-6 bg-green-500 hover:bg-green-600 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            </div>
          ) : (
            "Submit Application"
          )}
        </Button>
      </div>

      {/* Additional Information */}
      <div className="text-center text-sm text-gray-500 pt-4 border-t">
        <p>
          By submitting this application, you agree to our{" "}
          <a href="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
