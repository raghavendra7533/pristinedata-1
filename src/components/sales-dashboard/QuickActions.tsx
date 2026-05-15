import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  onAddToWatchlist: () => void;
}

export function QuickActions({ onAddToWatchlist }: QuickActionsProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start text-sm"
          onClick={() => navigate("/search")}
        >
          <Icon icon="solar:magnifer-linear" className="h-4 w-4 mr-2" />
          Search Contacts
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start text-sm"
          onClick={() => navigate("/opportunities")}
        >
          <Icon icon="solar:bolt-linear" className="h-4 w-4 mr-2" />
          Open a Playbook
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start text-sm"
          onClick={onAddToWatchlist}
        >
          <Icon icon="solar:eye-linear" className="h-4 w-4 mr-2" />
          Add Account to Watchlist
        </Button>
      </div>
    </div>
  );
}
