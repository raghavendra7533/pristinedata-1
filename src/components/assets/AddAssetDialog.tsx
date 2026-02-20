import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FileUploadZone } from "./FileUploadZone";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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

  const getFileTypeStyle = (type: string) => {
    switch (type) {
      case "pdf":
        return { icon: "solar:document-text-bold", color: "text-red-600 dark:text-red-400", bg: "bg-red-500/10" };
      case "doc":
      case "docx":
        return { icon: "solar:document-bold", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10" };
      case "ppt":
      case "pptx":
        return { icon: "solar:presentation-graph-bold", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" };
      case "txt":
        return { icon: "solar:notes-bold", color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-500/10" };
      default:
        return { icon: "solar:file-bold", color: "text-muted-foreground", bg: "bg-muted" };
    }
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
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Icon icon="solar:documents-linear" className="h-4 w-4 text-primary" />
                  Files to Upload ({pendingFiles.length})
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Icon icon="solar:add-circle-linear" className="h-4 w-4 mr-1.5" />
                  Add More
                </Button>
              </div>

              {pendingFiles.map((pf, index) => {
                const fileType = getFileType(pf.file.name);
                const typeStyle = getFileTypeStyle(fileType);

                return (
                  <div key={index} className="border rounded-lg p-4 space-y-3 bg-card">
                    <div className="flex items-start gap-3">
                      {/* File Icon */}
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", typeStyle.bg)}>
                        <Icon icon={typeStyle.icon} className={cn("h-5 w-5", typeStyle.color)} />
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="font-medium text-sm truncate">{pf.file.name}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                              <span>{(pf.file.size / 1024).toFixed(1)} KB</span>
                              <span>•</span>
                              <Badge variant="outline" className="text-[10px] uppercase font-medium py-0">
                                {fileType}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeFile(index)}
                          >
                            <Icon icon="solar:close-circle-linear" className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`desc-${index}`} className="text-xs text-muted-foreground">
                        Description (optional)
                      </Label>
                      <Textarea
                        id={`desc-${index}`}
                        value={pf.description}
                        onChange={(e) => updateDescription(index, e.target.value)}
                        placeholder="Brief description of this asset..."
                        className="mt-1.5 min-h-[60px] text-sm"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Active Toggle */}
          {pendingFiles.length > 0 && (
            <div className="flex items-center gap-3 pt-3 border-t">
              <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
              <div className="flex-1">
                <Label htmlFor="active" className="text-sm font-medium cursor-pointer">
                  Activate immediately
                </Label>
                <p className="text-xs text-muted-foreground">
                  Include in AI knowledge base right away
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={pendingFiles.length === 0}>
            <Icon icon="solar:upload-linear" className="h-4 w-4 mr-1.5" />
            Upload {pendingFiles.length > 0 && `(${pendingFiles.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
