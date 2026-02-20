import { Icon } from "@iconify/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Asset } from "@/pages/PersonalizationAssets";

interface AssetCardProps {
  asset: Asset;
  onToggleActive: (id: string) => void;
  onRemove: (id: string) => void;
}

const getFileIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return "solar:document-text-bold";
    case "doc":
    case "docx":
      return "solar:document-bold";
    case "ppt":
    case "pptx":
      return "solar:presentation-graph-bold";
    case "txt":
      return "solar:notes-bold";
    default:
      return "solar:file-bold";
  }
};

const getFileTypeStyle = (type: string) => {
  switch (type) {
    case "pdf":
      return { icon: "text-red-600 dark:text-red-400", bg: "bg-red-500/10" };
    case "doc":
    case "docx":
      return { icon: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10" };
    case "ppt":
    case "pptx":
      return { icon: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" };
    case "txt":
      return { icon: "text-slate-600 dark:text-slate-400", bg: "bg-slate-500/10" };
    default:
      return { icon: "text-muted-foreground", bg: "bg-muted" };
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
  const typeStyle = getFileTypeStyle(asset.type);

  return (
    <Card className={cn(
      "group hover:border-border/80 transition-all",
      !asset.isActive && "opacity-60"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* File Type Icon */}
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
            typeStyle.bg
          )}>
            <Icon icon={getFileIcon(asset.type)} className={cn("h-6 w-6", typeStyle.icon)} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-semibold text-sm truncate mb-1">{asset.title}</h3>
                {asset.description && (
                  <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                    {asset.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleActive(asset.id);
                  }}
                  title={asset.isActive ? "Deactivate" : "Activate"}
                >
                  <Icon
                    icon={asset.isActive ? "solar:eye-closed-linear" : "solar:eye-linear"}
                    className="h-4 w-4"
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(asset.id);
                  }}
                  title="Remove"
                >
                  <Icon icon="solar:trash-bin-trash-linear" className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="secondary"
                className={cn(
                  "text-[10px] uppercase font-bold tracking-wide border",
                  asset.isActive
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                    : "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20"
                )}
              >
                {asset.isActive ? "Active" : "Inactive"}
              </Badge>
              <Badge variant="outline" className="text-[10px] uppercase font-medium">
                {asset.type}
              </Badge>
              {asset.fileSize && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Icon icon="solar:server-linear" className="h-3 w-3" />
                  {formatFileSize(asset.fileSize)}
                </span>
              )}
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Icon icon="solar:clock-circle-linear" className="h-3 w-3" />
                {formatDate(asset.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
