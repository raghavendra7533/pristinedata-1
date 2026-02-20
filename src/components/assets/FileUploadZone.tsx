import { useCallback, useState } from "react";
import { Icon } from "@iconify/react";
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
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => {
      const sizeMB = file.size / (1024 * 1024);
      return sizeMB <= maxSize;
    });
    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  }, [onFilesSelected, maxSize]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      onFilesSelected(files);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        "border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer",
        "hover:border-primary/50 hover:bg-primary/5",
        isDragging && "border-primary bg-primary/10 scale-[1.02]"
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
      <div className={cn(
        "w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-colors",
        isDragging ? "bg-primary/20" : "bg-muted"
      )}>
        <Icon
          icon={isDragging ? "solar:cloud-download-bold" : "solar:upload-bold"}
          className={cn(
            "h-8 w-8 transition-colors",
            isDragging ? "text-primary" : "text-muted-foreground"
          )}
        />
      </div>
      <p className="text-base font-semibold mb-1">
        {isDragging ? "Drop files here" : "Drop files here or click to browse"}
      </p>
      <p className="text-sm text-muted-foreground mb-4">
        Supports PDF, Word, PowerPoint, and text files
      </p>
      <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Icon icon="solar:document-text-linear" className="h-3.5 w-3.5 text-red-500" />
          PDF
        </span>
        <span className="flex items-center gap-1">
          <Icon icon="solar:document-linear" className="h-3.5 w-3.5 text-blue-500" />
          Word
        </span>
        <span className="flex items-center gap-1">
          <Icon icon="solar:presentation-graph-linear" className="h-3.5 w-3.5 text-amber-500" />
          PPT
        </span>
        <span className="flex items-center gap-1">
          <Icon icon="solar:notes-linear" className="h-3.5 w-3.5 text-slate-500" />
          TXT
        </span>
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        Maximum {maxSize}MB per file
      </p>
    </div>
  );
};
