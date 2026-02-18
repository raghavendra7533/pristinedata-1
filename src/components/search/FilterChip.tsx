import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Operator = "=" | "≠" | "≥" | "≤" | "contains" | "not contains";

interface FilterChipProps {
  value: string;
  operator?: Operator;
  onRemove: () => void;
  onOperatorChange?: (op: Operator) => void;
  showOperator?: boolean;
  variant?: "default" | "secondary" | "outline";
  className?: string;
}

const operators: Operator[] = ["=", "≠", "≥", "≤", "contains", "not contains"];

export default function FilterChip({
  value,
  operator = "=",
  onRemove,
  onOperatorChange,
  showOperator = false,
  variant = "secondary",
  className,
}: FilterChipProps) {
  return (
    <Badge
      variant={variant}
      className={cn(
        "gap-1.5 py-1.5 px-3 text-sm font-normal transition-all duration-200 hover:shadow-sm group",
        className
      )}
    >
      {showOperator && onOperatorChange && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-0.5 text-xs font-mono text-primary hover:text-primary/80 transition-colors">
              {operator}
              <ChevronDown className="h-2.5 w-2.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[100px]">
            {operators.map((op) => (
              <DropdownMenuItem
                key={op}
                onClick={() => onOperatorChange(op)}
                className={cn(
                  "font-mono text-sm",
                  op === operator && "bg-primary/10 text-primary"
                )}
              >
                {op}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <span className="truncate max-w-[150px]">{value}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="ml-0.5 hover:text-destructive transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
}
