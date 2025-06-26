import { Button } from "@/components/ui/button";
import { Upload, X, FileText } from "lucide-react";

interface FileItem {
  name: string;
  size: number;
  documentUrl: string;
  filename: string;
  uploading?: boolean;
}

interface FileUploadStepProps {
  files: FileItem[];
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (filename: string) => void;
  onNext: () => void;
  onBack: () => void;
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export function FileUploadStep({
  files,
  onFileUpload,
  onRemoveFile,
  onNext,
  onBack,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
}: FileUploadStepProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-6">Upload Your CV</h2>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium mb-2">
            Drop your CV here or click to browse
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Supported formats: PDF, DOC, DOCX (Max 10MB)
          </p>
          <input
            type="file"
            onChange={onFileUpload}
            accept=".pdf,.doc,.docx"
            className="hidden"
            id="file-upload"
            multiple
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            Choose Files
          </Button>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium mb-3">Uploaded Files</h3>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)}
                        {file.uploading && " - Uploading..."}
                      </p>
                    </div>
                  </div>
                  {!file.uploading && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveFile(file.filename)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button
            onClick={onNext}
            disabled={files.filter((f) => !f.uploading).length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Next Step
          </Button>
        </div>
      </div>
    </div>
  );
}
