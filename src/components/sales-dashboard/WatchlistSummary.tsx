import { mockWatchlistSummary } from "@/mocks/salesDashboardMocks";

export function WatchlistSummary() {
  // TODO: Replace mockWatchlistSummary with GET /api/watchlist/summary API call
  const { totalWatching, signalsThisWeek } = mockWatchlistSummary;

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Watchlist</h3>
        <a href="/account-search" className="text-xs text-primary hover:underline">
          View full watchlist →
        </a>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted/40 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-foreground">{totalWatching}</div>
          <div className="text-xs text-muted-foreground mt-0.5">Accounts watching</div>
        </div>
        <div className="bg-primary/5 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-primary">{signalsThisWeek}</div>
          <div className="text-xs text-muted-foreground mt-0.5">Signals this week</div>
        </div>
      </div>
    </div>
  );
}
