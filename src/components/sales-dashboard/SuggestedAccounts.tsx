import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { mockSuggestedAccounts } from "@/mocks/salesDashboardMocks";

export function SuggestedAccounts() {
  // TODO: Replace mockSuggestedAccounts with GET /api/accounts/suggested API call
  const [added, setAdded] = useState<string[]>([]);

  const handleAdd = (id: string, name: string) => {
    setAdded((prev) => [...prev, id]);
    // TODO: Replace with POST /api/watchlist API call
    toast.success(`${name} added to watchlist`);
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Suggested Accounts</h3>
        <p className="text-xs text-muted-foreground">ICP matches not yet on your watchlist</p>
      </div>
      <div className="divide-y divide-border">
        {mockSuggestedAccounts.map((acct) => (
          <div key={acct.id} className="px-4 py-3 flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{acct.accountName}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{acct.reason}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-7 flex-shrink-0"
              disabled={added.includes(acct.id)}
              onClick={() => handleAdd(acct.id, acct.accountName)}
            >
              {added.includes(acct.id) ? (
                <>
                  <Icon icon="solar:check-circle-linear" className="h-3.5 w-3.5 mr-1" />
                  Added
                </>
              ) : (
                <>
                  <Icon icon="solar:add-circle-linear" className="h-3.5 w-3.5 mr-1" />
                  Add to Watchlist
                </>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
