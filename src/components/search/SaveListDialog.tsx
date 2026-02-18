import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CheckCircle2, List } from "lucide-react";

interface SaveListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalCount: number;
  filters: any;
}

export default function SaveListDialog({
  open,
  onOpenChange,
  totalCount,
  filters,
}: SaveListDialogProps) {
  const navigate = useNavigate();
  const [listName, setListName] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    if (!listName.trim()) {
      toast.error("Please enter a list name");
      return;
    }

    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success(
        <>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <div>
              <div className="font-semibold">List saved successfully!</div>
              <div className="text-sm text-muted-foreground mt-1">
                {totalCount.toLocaleString()} accounts saved to "{listName}"
              </div>
            </div>
          </div>
        </>,
        {
          duration: 5000,
          action: {
            label: "View List",
            onClick: () => navigate("/lists"),
          },
        }
      );
      onOpenChange(false);
      
      // Navigate to results with the saved list
      setTimeout(() => {
        navigate(`/results/accounts?list=${encodeURIComponent(listName)}`);
      }, 500);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <List className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Save Account List</DialogTitle>
              <DialogDescription>
                Save {totalCount.toLocaleString()} accounts to a new list
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="list-name">List Name *</Label>
            <Input
              id="list-name"
              placeholder="e.g., Q1 Fintech Prospects"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add notes about this list..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Filter Summary */}
          <div className="rounded-lg border bg-muted/50 p-3 space-y-2">
            <div className="text-sm font-medium">Applied Filters:</div>
            <div className="text-xs text-muted-foreground space-y-1">
              {filters.locations?.length > 0 && (
                <div>• Locations: {filters.locations.join(", ")}</div>
              )}
              {filters.industries?.length > 0 && (
                <div>• Industries: {filters.industries.join(", ")}</div>
              )}
              {filters.employeeSize?.length > 0 && (
                <div>• Employee Size: {filters.employeeSize.join(", ")}</div>
              )}
              {filters.revenue?.length > 0 && (
                <div>• Revenue: {filters.revenue.join(", ")}</div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save List"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
