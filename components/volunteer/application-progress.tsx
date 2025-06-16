import { Check } from "lucide-react";

interface ApplicationProgressProps {
  currentStep: number;
}

export function ApplicationProgress({ currentStep }: ApplicationProgressProps) {
  return (
    <div className="mb-8 relative">
      <div className="h-px bg-gray-300 absolute top-1/2 left-0 right-0 -z-10"></div>
      <div className="flex justify-between">
        <div className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 1
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {currentStep > 1 ? <Check className="h-5 w-5" /> : 1}
          </div>
          <span className="mt-2 text-sm font-medium">
            {currentStep === 1 ? "Information" : "Info"}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 2
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {currentStep > 2 ? <Check className="h-5 w-5" /> : 2}
          </div>
          <span className="mt-2 text-sm font-medium">CV</span>
        </div>
        <div className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 3
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
  );
}
