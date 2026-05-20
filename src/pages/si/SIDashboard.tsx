import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useUserProfileStore } from "@/lib/si/userProfileStore";
import { MOCK_SIGNALS, MOCK_WATCHLIST_ACCOUNTS, MOCK_PLAYBOOKS, DEMO_ACCOUNTS } from "@/lib/si/mockData";
import { SummaryCard } from "@/components/si/dashboard/SummaryCard";
import { SignalFeedCard } from "@/components/si/dashboard/SignalFeedCard";
import { ICPSummaryPanel } from "@/components/si/dashboard/ICPSummaryPanel";
import { TopAccountsPanel } from "@/components/si/dashboard/TopAccountsPanel";
import type { SignalType } from "@/lib/si/types";
import { SIGNAL_TYPES } from "@/lib/si/constants";

function countSignalsInWindow(days: number): number {
  const cutoff = Date.now() - days * 86400000;
  return MOCK_SIGNALS.filter((s) => new Date(s.detectedAt).getTime() > cutoff).length;
}

export default function SIDashboard() {
  const navigate = useNavigate();
  const { profile, watchedAccounts, addWatchedAccount } = useUserProfileStore();
  const [demoBannerDismissed, setDemoBannerDismissed] = useState(false);
  const [signalFilter, setSignalFilter] = useState<"all" | SignalType>("all");
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const name = profile?.name ?? "";

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  const signalsThisWeek = countSignalsInWindow(7);
  const signalsLastWeek = countSignalsInWindow(14) - signalsThisWeek;
  const signalDelta = signalsThisWeek - signalsLastWeek;
  const deltaText = `${signalDelta >= 0 ? "+" : ""}${signalDelta} vs last week`;

  const demoAccountIds = new Set(DEMO_ACCOUNTS.map((a) => a.id));
  const isDemoMode = watchedAccounts.length > 0 && watchedAccounts.every((a) => demoAccountIds.has(a.id));
  const watchedAccountIds = new Set(watchedAccounts.map((a) => a.id));

  const sortedSignals = [...MOCK_SIGNALS]
    .sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime())
    .filter((s) => {
      if (signalFilter !== "all" && s.type !== signalFilter) return false;
      if (searchQuery) {
        const account = MOCK_WATCHLIST_ACCOUNTS.find((a) => a.id === s.accountId);
        const q = searchQuery.toLowerCase();
        if (!account?.accountName.toLowerCase().includes(q) && !account?.domain.toLowerCase().includes(q)) return false;
      }
      return true;
    });

  return (
    <div className="flex flex-col min-h-full">
      {/* Top header */}
      <div className="sticky top-0 z-10 border-b px-6 py-3.5 flex items-center justify-between" style={{ backgroundColor: "var(--si-card-bg)", borderColor: "var(--si-card-border)" }}>
        <div>
          <h1 className="text-base font-semibold text-gray-900">{greeting}{name ? `, ${name.split(" ")[0]}` : ""}</h1>
          <p className="text-xs text-gray-400 mt-0.5">{today}</p>
        </div>
        <button
          onClick={() => navigate("/si/icp")}
          className="flex items-center gap-1.5 text-xs font-semibold text-white rounded-md px-3 py-2 transition-colors"
          style={{ backgroundColor: "var(--si-primary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--si-primary-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--si-primary)")}
        >
          <Icon icon="solar:add-circle-linear" width={14} />
          Add Accounts
        </button>
      </div>

      {/* Page body */}
      <div className="flex gap-5 p-6 flex-1">
        {/* Left: main */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">

          {/* Demo banner */}
          {isDemoMode && !demoBannerDismissed && (
            <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon icon="solar:info-circle-linear" width={15} className="text-indigo-500 flex-shrink-0" />
                <p className="text-sm text-indigo-700">These are demo accounts. Add your real accounts to get live signals.</p>
              </div>
              <button onClick={() => setDemoBannerDismissed(true)} className="text-indigo-400 hover:text-indigo-600 ml-3 flex-shrink-0">
                <Icon icon="solar:close-circle-linear" width={16} />
              </button>
            </div>
          )}

          {/* Summary cards */}
          <div className="grid grid-cols-4 gap-3">
            <SummaryCard label="Accounts Watched" value={watchedAccounts.length} delta={3} deltaLabel="added this week" icon="solar:buildings-2-bold" iconColor="#6366F1" />
            <SummaryCard label="Signals This Week" value={signalsThisWeek} delta={signalDelta} deltaLabel="vs last week" icon="solar:pulse-2-bold" iconColor="#10B981" />
            <SummaryCard label="Active Playbooks" value={Object.keys(MOCK_PLAYBOOKS).length} delta={1} deltaLabel="opened this week" icon="solar:document-text-bold" iconColor="#F59E0B" />
            <SummaryCard label="ICP Match Score" value="78%" delta={4} deltaLabel="since last update" icon="solar:target-bold" iconColor="#8B5CF6" />
          </div>

          {/* Signal feed */}
          <div className="flex flex-col gap-3">
            {/* Feed header + filters */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-800">Latest Signals</h2>
              <span className="text-xs text-gray-400">{sortedSignals.length} signals</span>
            </div>

            {/* Filter bar */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Icon icon="solar:magnifer-linear" width={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search accounts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-7 pr-3 py-1.5 text-xs border border-[--si-card-border] rounded-md focus:outline-none focus:border-indigo-400 w-44 bg-transparent text-[--si-text-primary]"
                />
              </div>

              {/* Signal type dropdown */}
              <div className="relative">
                <button
                  onClick={() => setFilterDropdownOpen((o) => !o)}
                  className="flex items-center gap-1.5 text-xs font-medium border border-[--si-card-border] rounded-md px-3 py-1.5 hover:bg-white/5 transition-colors"
                  style={signalFilter !== "all" ? { borderColor: "var(--si-primary)", color: "var(--si-primary)", backgroundColor: "var(--si-card-bg)" } : { color: "#4B5563", backgroundColor: "var(--si-card-bg)" }}
                >
                  <Icon icon="solar:filter-linear" width={13} />
                  {signalFilter === "all" ? "Signal type" : SIGNAL_TYPES[signalFilter].label}
                  <Icon icon={filterDropdownOpen ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"} width={11} />
                </button>

                {filterDropdownOpen && (
                  <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-10" onClick={() => setFilterDropdownOpen(false)} />
                    {/* Dropdown */}
                    <div className="absolute left-0 top-full mt-1.5 z-20 border border-[--si-card-border] rounded-lg shadow-lg py-1 min-w-[160px]" style={{ backgroundColor: "var(--si-card-bg)" }}>
                      <button
                        onClick={() => { setSignalFilter("all"); setFilterDropdownOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center gap-2 hover:bg-white/5 transition-colors ${signalFilter === "all" ? "text-indigo-600" : "text-[--si-text-secondary]"}`}
                      >
                        {signalFilter === "all" && <Icon icon="solar:check-circle-bold" width={13} className="text-indigo-600" />}
                        <span className={signalFilter !== "all" ? "ml-[17px]" : ""}>All signals</span>
                      </button>
                      <div className="border-t border-gray-100 my-1" />
                      {(Object.keys(SIGNAL_TYPES) as SignalType[]).map((type) => (
                        <button
                          key={type}
                          onClick={() => { setSignalFilter(type); setFilterDropdownOpen(false); }}
                          className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center gap-2 hover:bg-white/5 transition-colors ${signalFilter === type ? "text-indigo-600" : "text-[--si-text-secondary]"}`}
                        >
                          {signalFilter === type
                            ? <Icon icon="solar:check-circle-bold" width={13} className="text-indigo-600" />
                            : <span className="w-[13px] h-[13px] rounded-full inline-block flex-shrink-0" style={{ backgroundColor: SIGNAL_TYPES[type].color + "33" }} />
                          }
                          {SIGNAL_TYPES[type].label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {signalFilter !== "all" && (
                <button
                  onClick={() => setSignalFilter("all")}
                  className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
                >
                  <Icon icon="solar:close-circle-linear" width={13} />
                  Clear
                </button>
              )}
            </div>

            {/* Signal list */}
            {sortedSignals.length === 0 ? (
              <div className="rounded-lg border border-[--si-card-border] p-8 text-center" style={{ backgroundColor: "var(--si-card-bg)" }}>
                <Icon icon="solar:radar-linear" width={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No signals match your filters.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {sortedSignals.map((signal) => {
                  const account = MOCK_WATCHLIST_ACCOUNTS.find((a) => a.id === signal.accountId);
                  if (!account) return null;
                  return (
                    <SignalFeedCard
                      key={signal.id}
                      signal={signal}
                      accountName={account.accountName}
                      accountDomain={account.domain}
                      onViewPlaybook={() => navigate(`/si/playbook/${signal.accountId}`)}
                      onAddToWatchlist={!watchedAccountIds.has(account.id) ? () => addWatchedAccount(account) : undefined}
                      isWatched={watchedAccountIds.has(account.id)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right panel */}
        <div className="w-[260px] flex-shrink-0 flex flex-col gap-3">
          <ICPSummaryPanel />
          <TopAccountsPanel />
        </div>
      </div>
    </div>
  );
}
