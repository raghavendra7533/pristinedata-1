import { FileText, FileSpreadsheet, Presentation, File, Trash2, Eye, EyeOff, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Asset } from "@/pages/PersonalizationAssets";

interface AssetCardProps {
  asset: Asset;
  onToggleActive: (id: string) => void;
  onRemove: (id: string) => void;
}

const getFileIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return <FileText className="h-8 w-8" />;
    case "doc":
    case "docx":
      return <FileText className="h-8 w-8" />;
    case "ppt":
    case "pptx":
      return <Presentation className="h-8 w-8" />;
    case "txt":
      return <File className="h-8 w-8" />;
    default:
      return <File className="h-8 w-8" />;
  }
};

const getFileTypeColor = (type: string) => {
  switch (type) {
    case "pdf":
      return "text-red-500";
    case "doc":
    case "docx":
      return "text-blue-500";
    case "ppt":
    case "pptx":
      return "text-orange-500";
    case "txt":
      return "text-gray-500";
    default:
      return "text-gray-400";
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
};

export const AssetCard = ({ asset, onToggleActive, onRemove }: AssetCardProps) => {
  return (
    <Card className={!asset.isActive ? "opacity-60" : ""}>
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className={`flex-shrink-0 ${getFileTypeColor(asset.type)}`}>
            {getFileIcon(asset.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-sm truncate">{asset.title}</h3>
              <div className="flex gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onToggleActive(asset.id)}
                  title={asset.isActive ? "Deactivate" : "Activate"}
                >
                  {asset.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onRemove(asset.id)}
                  title="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {asset.description && (
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {asset.description}
              </p>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={asset.isActive ? "default" : "secondary"} className="text-xs">
                {asset.isActive ? "Active" : "Inactive"}
              </Badge>
              <Badge variant="outline" className="text-xs uppercase">
                {asset.type}
              </Badge>
              {asset.fileSize && (
                <span className="text-xs text-muted-foreground">
                  {formatFileSize(asset.fileSize)}
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                {formatDate(asset.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
