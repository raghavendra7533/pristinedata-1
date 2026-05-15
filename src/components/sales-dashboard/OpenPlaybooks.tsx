import { Button } from "@/components/ui/button";
import { mockOpenPlaybooks } from "@/mocks/salesDashboardMocks";

const actionColors: Record<string, string> = {
  "Send follow-up": "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  "Schedule call": "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400",
  "Share case study": "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
};

export function OpenPlaybooks() {
  // TODO: Replace mockOpenPlaybooks with GET /api/playbooks/open API call
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Open Playbooks</h3>
        <p className="text-xs text-muted-foreground">Accounts you've looked at but not yet actioned</p>
      </div>
      <div className="divide-y divide-border">
        {mockOpenPlaybooks.map((pb) => (
          <div key={pb.id} className="flex items-center gap-3 px-4 py-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-semibold text-foreground truncate">{pb.accountName}</span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                    actionColors[pb.nextBestAction] ?? "bg-muted text-muted-foreground"
                  }`}
                >
                  {pb.nextBestAction}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {pb.contactName} · {pb.contactTitle}
              </p>
              <p className="text-xs text-muted-foreground">{pb.lastOpenedAt}</p>
            </div>
            <Button size="sm" variant="outline" className="text-xs h-7 flex-shrink-0">
              Resume
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
