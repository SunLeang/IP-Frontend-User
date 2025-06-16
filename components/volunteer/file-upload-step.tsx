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
  onDragLeave: () => void;
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
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <div className="flex flex-col items-center">
            <Upload className="h-10 w-10 text-gray-400 mb-4" />
            <p className="mb-2 font-medium">
              Drop files here or click to upload
            </p>
            <p className="text-sm text-gray-500">PDF, DOC, DOCX (max 5MB)</p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={onFileUpload}
              accept=".pdf,.doc,.docx"
            />
            <label
              htmlFor="file-upload"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
            >
              Upload Files
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
                    onClick={() => onRemoveFile(file.name)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex space-x-4 mt-6">
        <Button variant="outline" onClick={onBack} className="w-1/2 py-6">
          Back
        </Button>
        <Button
          onClick={onNext}
          className="w-1/2 py-6 bg-green-500 hover:bg-green-600"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
