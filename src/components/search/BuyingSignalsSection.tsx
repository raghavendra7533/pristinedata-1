import { useState } from "react";
import { Zap, FolderOpen, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";

interface SavedSignalPick {
  id: string;
  label: string;
  signalCount: number;
  accountCount: number;
  createdAt: string;
  description: string;
}

interface BuyingSignalsSectionProps {
  selectedPickId: string | null;
  onPickChange: (pickId: string | null) => void;
  onOpenComposer: () => void;
}

// Mock saved signal picks
const initialSavedPicks: SavedSignalPick[] = [
  {
    id: "1",
    label: "High Intent Q1",
    signalCount: 3,
    accountCount: 1456,
    createdAt: "2024-12-01",
    description: "Cloud Migration, Digital Transformation, AI/ML",
  },
  {
    id: "2",
    label: "Hiring Surge Signals",
    signalCount: 4,
    accountCount: 2843,
    createdAt: "2024-11-28",
    description: "Hiring in Sales, Engineering, Marketing",
  },
  {
    id: "3",
    label: "Growth Indicators",
    signalCount: 5,
    accountCount: 987,
    createdAt: "2024-11-25",
    description: "New Funding, New Office, New Partnership",
  },
];

export default function BuyingSignalsSection({
  selectedPickId,
  onPickChange,
  onOpenComposer,
}: BuyingSignalsSectionProps) {
  const [savedPicks, setSavedPicks] = useState<SavedSignalPick[]>(initialSavedPicks);
  const [savedPicksOpen, setSavedPicksOpen] = useState(true);

  const loadSavedPick = (pick: SavedSignalPick) => {
    onPickChange(pick.id);
    toast.success(`Loaded "${pick.label}"`, {
      description: `${pick.signalCount} signals, ${pick.accountCount.toLocaleString()} accounts`,
    });
  };

  const deleteSavedPick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedPicks(savedPicks.filter(p => p.id !== id));
    if (selectedPickId === id) {
      onPickChange(null);
    }
    toast.success("Signal pick deleted");
  };

  return (
    <div className="space-y-4">
      {/* Saved Signal Picks */}
      <Collapsible open={savedPicksOpen} onOpenChange={setSavedPicksOpen}>
        <CollapsibleTrigger asChild>
          <button className="flex items-center justify-between w-full text-sm font-medium hover:text-primary transition-colors">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Saved Signal Picks ({savedPicks.length})
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${savedPicksOpen ? "rotate-180" : ""}`} />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3">
          {savedPicks.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {savedPicks.map((pick) => (
                <div
                  key={pick.id}
                  onClick={() => loadSavedPick(pick)}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all hover:border-primary/50 ${
                    selectedPickId === pick.id 
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20" 
                      : "bg-muted/30 hover:bg-muted/50"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">{pick.label}</span>
                      {selectedPickId === pick.id && (
                        <Badge variant="default" className="text-[10px] h-5">Active</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {pick.signalCount} signal{pick.signalCount !== 1 ? 's' : ''}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs font-medium text-primary">
                        {pick.accountCount.toLocaleString()} accounts
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {pick.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive shrink-0"
                    onClick={(e) => deleteSavedPick(pick.id, e)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No saved signal picks yet. Create one to filter by buying signals.
            </p>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Create New Button */}
      <div className="pt-2">
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={onOpenComposer}
        >
          <Zap className="h-4 w-4" />
          Create New Signal Pick
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Build a new buying signals filter to add to your search
        </p>
      </div>
    </div>
  );
}
