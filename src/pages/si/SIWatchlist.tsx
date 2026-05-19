import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { MOCK_WATCHLIST_ACCOUNTS } from "@/lib/si/mockData";
import { useUserProfileStore } from "@/lib/si/userProfileStore";
import { WatchlistFilterBar } from "@/components/si/watchlist/WatchlistFilterBar";
import { AccountWatchCard } from "@/components/si/watchlist/AccountWatchCard";
import { AddAccountModal } from "@/components/si/watchlist/AddAccountModal";
import type { WatchlistAccount, SignalType } from "@/lib/si/types";

const TIME_RANGE_DAYS: Record<"24h" | "7d" | "30d", number> = {
  "24h": 1,
  "7d": 7,
  "30d": 30,
};

function dedupeById(accounts: WatchlistAccount[]): WatchlistAccount[] {
  const seen = new Set<string>();
  return accounts.filter((a) => {
    if (seen.has(a.id)) return false;
    seen.add(a.id);
    return true;
  });
}

export default function SIWatchlist() {
  const navigate = useNavigate();
  const { watchedAccounts, addWatchedAccount } = useUserProfileStore();

  const [signalFilter, setSignalFilter] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("7d");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());

  // Merge store accounts with mock accounts, dedupe by id
  const allAccounts = useMemo(
    () => dedupeById([...watchedAccounts, ...MOCK_WATCHLIST_ACCOUNTS]),
    [watchedAccounts]
  );

  const filteredAccounts = useMemo(() => {
    const cutoff = new Date("2026-05-17T00:00:00.000Z");
    cutoff.setDate(cutoff.getDate() - TIME_RANGE_DAYS[timeRange]);

    return allAccounts.filter((account) => {
      // Remove filter
      if (removedIds.has(account.id)) return false;

      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !account.accountName.toLowerCase().includes(q) &&
          !account.domain.toLowerCase().includes(q)
        ) {
          return false;
        }
      }

      // Signal type filter
      if (signalFilter !== "all") {
        const hasSignalType = account.signals.some((s) => s.type === signalFilter);
        if (!hasSignalType) return false;
      }

      // Time range filter — keep account if at least one signal is within range
      const hasRecentSignal = account.signals.some(
        (s) => new Date(s.detectedAt) >= cutoff
      );
      if (!hasRecentSignal) return false;

      return true;
    });
  }, [allAccounts, removedIds, searchQuery, signalFilter, timeRange]);

  function handleAdd(domain: string, signals: SignalType[]) {
    const domainClean = domain.toLowerCase().replace(/^https?:\/\//, "");
    const accountName = domainClean
      .split(".")[0]
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const newAccount: WatchlistAccount = {
      id: `domain-${Date.now()}`,
      accountName,
      domain: domainClean,
      industry: "SaaS",
      revenue: "Unknown",
      employees: "Unknown",
      location: "Unknown",
      addedAt: new Date().toISOString(),
      monitoredSignals: signals,
      signals: [],
      intentScore: 0,
      intentLabel: "Cold",
    };

    addWatchedAccount(newAccount);
    setShowAddModal(false);
  }

  function handleRemove(id: string) {
    setRemovedIds((prev) => new Set([...prev, id]));
  }

  const totalSignals = filteredAccounts.reduce((sum, a) => sum + a.signals.length, 0);

  return (
    <div data-theme="si" className="p-6 flex flex-col gap-4">
      {/* Header */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
          Watchlist
        </p>
        <div className="flex items-baseline gap-2">
          <h1 className="text-2xl font-bold text-gray-900">What's new this week</h1>
          <span className="text-sm text-gray-400 font-normal">
            · {filteredAccounts.length} accounts, {totalSignals} signals
          </span>
        </div>
      </div>

      {/* Filter bar */}
      <WatchlistFilterBar
        activeSignalFilter={signalFilter}
        onSignalFilterChange={setSignalFilter}
        activeTimeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Account cards or empty state */}
      {filteredAccounts.length === 0 ? (
        <div className="rounded-[12px] border border-[--si-card-border] bg-[--si-card-bg] p-12 flex flex-col items-center gap-3 text-center">
          <Icon icon="solar:eye-linear" className="w-10 h-10 text-[--si-text-muted]" />
          <p className="text-sm text-[--si-text-secondary] max-w-xs">
            Your watchlist is empty. Add accounts to start monitoring signals.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="rounded-full bg-[--si-primary] text-white px-4 py-2 text-sm font-medium hover:bg-[--si-primary-hover] transition-colors mt-1"
          >
            Add Account
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredAccounts.map((account) => (
            <AccountWatchCard
              key={account.id}
              account={account}
              onViewPlaybook={() => navigate(`/si/playbook/${account.id}`)}
              onRemove={() => handleRemove(account.id)}
            />
          ))}
        </div>
      )}

      {/* Add account modal */}
      <AddAccountModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAdd}
      />
    </div>
  );
}
