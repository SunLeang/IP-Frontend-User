import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessModalProps {
  isOpen: boolean;
  onContinue: () => void;
}

interface ErrorModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export function SuccessModal({ isOpen, onContinue }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-green-500 mb-4">SUCCESS</h2>
          <p className="text-gray-700 mb-2">Thank you for your application.</p>
          <p className="text-gray-700 mb-4">
            We will review it and provide our feedback to you.
          </p>
          <p className="text-gray-700 mb-6">
            You will receive a confirmation notification shortly.
          </p>
          <Button
            onClick={onContinue}
            className="w-full bg-green-500 hover:bg-green-600"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ErrorModal({ isOpen, message, onClose }: ErrorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
            <X className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-red-500 mb-4">ERROR</h2>
          <p className="text-gray-700 mb-6">{message}</p>
          <Button
            onClick={onClose}
            className="w-full bg-red-500 hover:bg-red-600"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
