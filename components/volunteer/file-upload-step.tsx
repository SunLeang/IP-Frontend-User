import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileItem {
  name: string;
  size: number;
  progress: number;
  completed: boolean;
}

interface FileUploadStepProps {
  files: FileItem[];
  isDragging: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void; 
  onDrop: (e: React.DragEvent) => void;
  onRemoveFile: (fileName: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function FileUploadStep({
  files,
  isDragging,
  onFileUpload,
  onDragOver,
  onDragLeave,
  onDrop,
  onRemoveFile,
  onBack,
  onNext,
}: FileUploadStepProps) {
  return (
    <div>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-lg font-bold mb-1">Upload your CV</h2>
            <p className="text-sm text-gray-500">
              Select and upload your CV file
            </p>
          </div>
          <button className="ml-auto">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center mt-4 ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave} // ✅ This will now receive the event parameter automatically
          onDrop={onDrop}
        >
          <div className="flex flex-col items-center">
            <Upload className="h-10 w-10 text-gray-400 mb-4" />
            <p className="mb-2 font-medium">
              Drop files here or click to upload
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supports: PDF, DOC, DOCX (Max 10MB)
            </p>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={onFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600"
            >
              Select Files
            </label>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {file.completed ? (
                    <span className="text-green-500 text-sm">✓ Uploaded</span>
                  ) : (
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                  <button
                    onClick={() => onRemoveFile(file.name)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext} disabled={files.length === 0}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
