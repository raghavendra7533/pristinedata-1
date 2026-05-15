import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { mockSignals, AccountSignal } from "@/mocks/salesDashboardMocks";
import { cn } from "@/lib/utils";

const urgencyStyles: Record<AccountSignal["urgency"], string> = {
  high: "border-l-4 border-l-red-500",
  medium: "border-l-4 border-l-yellow-400",
  low: "border-l-4 border-l-border",
};

const urgencyBadgeStyles: Record<AccountSignal["urgency"], string> = {
  high: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",
  medium: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
  low: "bg-muted text-muted-foreground",
};

export function SignalFeed() {
  // TODO: Replace mockSignals with GET /api/signals API call
  return (
    <div className="space-y-3">
      {mockSignals.map((signal) => (
        <div
          key={signal.id}
          className={cn(
            "bg-card border border-border rounded-xl overflow-hidden",
            urgencyStyles[signal.urgency]
          )}
        >
          <div className="p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <span className="font-semibold text-sm text-foreground">{signal.accountName}</span>
                <span className="mx-2 text-muted-foreground">·</span>
                <span className="text-sm text-foreground">{signal.signal}</span>
              </div>
              <span
                className={cn(
                  "flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full",
                  urgencyBadgeStyles[signal.urgency]
                )}
              >
                {signal.urgency}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-1">{signal.timeAgo}</p>
            <div className="mt-3 bg-primary/5 border border-primary/20 rounded-lg p-3 text-xs text-foreground leading-relaxed">
              <span className="font-semibold text-primary">Recommended: </span>
              {signal.recommendedAction}
            </div>
            <div className="mt-3 flex justify-end">
              <Button size="sm" variant="outline" className="text-xs h-7">
                <Icon icon="solar:bolt-linear" className="h-3.5 w-3.5 mr-1" />
                Open Playbook
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
