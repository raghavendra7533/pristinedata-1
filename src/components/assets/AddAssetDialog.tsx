import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FileUploadZone } from "./FileUploadZone";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Asset } from "@/pages/PersonalizationAssets";

interface AddAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (asset: Omit<Asset, "id" | "createdAt" | "updatedAt">) => void;
}

interface PendingFile {
  file: File;
  description: string;
}

export const AddAssetDialog = ({ open, onOpenChange, onAdd }: AddAssetDialogProps) => {
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [isActive, setIsActive] = useState(true);

  const handleFilesSelected = (files: File[]) => {
    const newPendingFiles = files.map(file => ({
      file,
      description: ""
    }));
    setPendingFiles(prev => [...prev, ...newPendingFiles]);
  };

  const removeFile = (index: number) => {
    setPendingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const updateDescription = (index: number, description: string) => {
    setPendingFiles(prev => prev.map((pf, i) => 
      i === index ? { ...pf, description } : pf
    ));
  };

  const getFileType = (filename: string): Asset["type"] => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === "pdf") return "pdf";
    if (ext === "doc") return "doc";
    if (ext === "docx") return "docx";
    if (ext === "ppt") return "ppt";
    if (ext === "pptx") return "pptx";
    if (ext === "txt") return "txt";
    return "txt";
  };

  const handleUpload = async () => {
    if (pendingFiles.length === 0) return;

    for (const { file, description } of pendingFiles) {
      // In a real implementation, you would read the file content here
      // For now, we'll just store metadata
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onAdd({
          title: file.name,
          description: description || `Uploaded ${file.type || 'file'}`,
          content: content || "[File content]",
          type: getFileType(file.name),
          isActive,
          fileSize: file.size,
        });
      };
      reader.readAsText(file);
    }

    // Reset form
    setPendingFiles([]);
    setIsActive(true);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Assets</DialogTitle>
          <DialogDescription>
            Upload documents to enhance AI personalization. Supports PDF, Word, PowerPoint, and text files.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* File Upload Zone */}
          {pendingFiles.length === 0 && (
            <FileUploadZone onFilesSelected={handleFilesSelected} />
          )}

          {/* Pending Files List */}
          {pendingFiles.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">
                  Files to Upload ({pendingFiles.length})
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Add More Files
                </Button>
              </div>

              {pendingFiles.map((pf, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{pf.file.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {(pf.file.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs uppercase">
                        {getFileType(pf.file.name)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`desc-${index}`} className="text-xs">
                      Description (optional)
                    </Label>
                    <Textarea
                      id={`desc-${index}`}
                      value={pf.description}
                      onChange={(e) => updateDescription(index, e.target.value)}
                      placeholder="Brief description of this asset..."
                      className="mt-1 min-h-[60px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Active Toggle */}
          {pendingFiles.length > 0 && (
            <div className="flex items-center space-x-2 pt-2 border-t">
              <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
              <Label htmlFor="active" className="font-normal">
                Activate immediately (include in AI model)
              </Label>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={pendingFiles.length === 0}>
            Upload {pendingFiles.length > 0 && `(${pendingFiles.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
