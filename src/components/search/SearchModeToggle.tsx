import { Building2, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export type SearchMode = "accounts" | "contacts";

interface SearchModeToggleProps {
  mode: SearchMode;
  onChange: (mode: SearchMode) => void;
  className?: string;
}

export default function SearchModeToggle({ mode, onChange, className }: SearchModeToggleProps) {
  return (
    <div className={cn("inline-flex items-center gap-1 p-1 rounded-full bg-muted/80 backdrop-blur-sm", className)}>
      <button
        onClick={() => onChange("accounts")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
          mode === "accounts"
            ? "bg-primary text-primary-foreground shadow-md"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
      >
        <Building2 className="h-4 w-4" />
        Accounts
      </button>
      <button
        onClick={() => onChange("contacts")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
          mode === "contacts"
            ? "bg-primary text-primary-foreground shadow-md"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
      >
        <Users className="h-4 w-4" />
        Contacts
      </button>
    </div>
  );
}
