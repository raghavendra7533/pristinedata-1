import { useCallback } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
}

export const FileUploadZone = ({ 
  onFilesSelected, 
  accept = ".pdf,.doc,.docx,.ppt,.pptx,.txt",
  maxSize = 10,
  multiple = true 
}: FileUploadZoneProps) => {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => {
      const sizeMB = file.size / (1024 * 1024);
      return sizeMB <= maxSize;
    });
    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  }, [onFilesSelected, maxSize]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      onFilesSelected(files);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={cn(
        "border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer",
        "hover:border-primary/50 hover:bg-accent/5"
      )}
      onClick={() => document.getElementById('file-upload')?.click()}
    >
      <input
        id="file-upload"
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInput}
      />
      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      <p className="text-lg font-medium mb-2">Drop files here or click to browse</p>
      <p className="text-sm text-muted-foreground">
        Supports PDF, Word, PowerPoint, and text files (max {maxSize}MB each)
      </p>
    </div>
  );
};
