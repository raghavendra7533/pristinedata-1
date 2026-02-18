import { useState, ReactNode } from "react";
import { ChevronDown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface UnifiedFilterSectionProps {
  title: string;
  icon: ReactNode;
  chipCount?: number;
  defaultOpen?: boolean;
  onReset?: () => void;
  children: ReactNode;
  className?: string;
}

export default function UnifiedFilterSection({
  title,
  icon,
  chipCount = 0,
  defaultOpen = false,
  onReset,
  children,
  className,
}: UnifiedFilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className={cn("rounded-2xl border bg-card/80 backdrop-blur-sm", className)}>
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors rounded-t-2xl">
          <div className="flex items-center gap-3">
            <span className="text-primary">{icon}</span>
            <span className="font-medium">{title}</span>
            {chipCount > 0 && (
              <Badge variant="secondary" className="h-5 px-2 text-xs">
                {chipCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {chipCount > 0 && onReset && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onReset();
                }}
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            )}
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-4 pb-4 space-y-4">
          <div className="h-px bg-border -mx-4" />
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
