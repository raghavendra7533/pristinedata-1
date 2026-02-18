import { ArrowLeftRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchMode } from "./SearchModeToggle";

interface IntentChipProps {
  detectedMode: SearchMode;
  onSwitch: () => void;
}

export default function IntentChip({ detectedMode, onSwitch }: IntentChipProps) {
  return (
    <div className="inline-flex items-center gap-2 animate-fade-in">
      <Badge 
        variant="secondary" 
        className="gap-2 py-1.5 px-3 bg-primary/10 text-primary border-primary/20"
      >
        <Sparkles className="h-3 w-3" />
        Interpreted as {detectedMode === "accounts" ? "Accounts" : "Contacts"}
      </Badge>
      <Button
        variant="ghost"
        size="sm"
        onClick={onSwitch}
        className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-primary"
      >
        <ArrowLeftRight className="h-3 w-3" />
        Switch to {detectedMode === "accounts" ? "Contacts" : "Accounts"}
      </Button>
    </div>
  );
}
