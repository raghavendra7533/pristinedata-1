import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { MOCK_WATCHLIST_ACCOUNTS } from "@/lib/si/mockData";
import { useUserProfileStore } from "@/lib/si/userProfileStore";
import { WatchlistFilterBar } from "@/components/si/watchlist/WatchlistFilterBar";
import { AccountWatchCard } from "@/components/si/watchlist/AccountWatchCard";
import { CreateWatchlistModal } from "@/components/si/watchlist/CreateWatchlistModal";
import type { WatchlistAccount, SignalType } from "@/lib/si/types";

interface WatchedContact {
  id: string;
  name: string;
  title: string;
  company: string;
  domain: string;
  addedAt: string;
  latestSignal?: string;
  signalDate?: string;
}

const MOCK_WATCHED_CONTACTS: WatchedContact[] = [
  { id: "c-1", name: "Sarah Chen", title: "VP of Sales", company: "Lattice", domain: "lattice.com", addedAt: "2026-05-10T00:00:00Z", latestSignal: "Promoted to VP of Sales", signalDate: "2026-05-15T00:00:00Z" },
  { id: "c-2", name: "Marcus Webb", title: "Head of Revenue Ops", company: "Rippling", domain: "rippling.com", addedAt: "2026-05-08T00:00:00Z", latestSignal: "Changed jobs from Salesforce", signalDate: "2026-05-12T00:00:00Z" },
  { id: "c-3", name: "Priya Kapoor", title: "CRO", company: "Gong", domain: "gong.io", addedAt: "2026-05-01T00:00:00Z", latestSignal: "Published post on AI in sales", signalDate: "2026-05-17T00:00:00Z" },
  { id: "c-4", name: "James O'Brien", title: "Director of Demand Gen", company: "HubSpot", domain: "hubspot.com", addedAt: "2026-04-28T00:00:00Z" },
];

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
  const { watchedAccounts, addWatchedAccount, profile } = useUserProfileStore();

  const [activeTab, setActiveTab] = useState<"accounts" | "contacts">("accounts");
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

  function handleAdd(accountNames: string[], signals: SignalType[]) {
    for (const name of accountNames) {
      const domain = name.toLowerCase().replace(/\s+/g, "") + ".com";
      const newAccount: WatchlistAccount = {
        id: `name-${Date.now()}-${name}`,
        accountName: name,
        domain,
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
    }
    setShowAddModal(false);
  }

  function handleRemove(id: string) {
    setRemovedIds((prev) => new Set([...prev, id]));
  }

  const totalSignals = filteredAccounts.reduce((sum, a) => sum + a.signals.length, 0);

  return (
    <div data-theme="si" className="p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
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
        <div className="flex items-center gap-2 mt-1">
          {activeTab === "accounts" && (
            <>
              <button
                onClick={() => navigate("/si/icp-discovery")}
                className="flex items-center gap-1.5 rounded-full border border-[--si-card-border] px-3 py-1.5 text-sm font-medium text-[--si-text-secondary] hover:bg-gray-50 transition-colors"
              >
                <Icon icon="solar:filter-linear" className="w-4 h-4" />
                Build from ICP
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 rounded-full bg-[--si-primary] text-white px-3 py-1.5 text-sm font-medium hover:bg-[--si-primary-hover] transition-colors"
              >
                <Icon icon="solar:add-circle-linear" className="w-4 h-4" />
                Add Accounts
              </button>
            </>
          )}
          {activeTab === "contacts" && (
            <button
              className="flex items-center gap-1.5 rounded-full bg-[--si-primary] text-white px-3 py-1.5 text-sm font-medium hover:bg-[--si-primary-hover] transition-colors"
            >
              <Icon icon="solar:add-circle-linear" className="w-4 h-4" />
              Add Contact
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[--si-card-border]">
        {(["accounts", "contacts"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? "border-[--si-primary] text-[--si-primary]"
                : "border-transparent text-[--si-text-secondary] hover:text-gray-700"
            }`}
          >
            {tab === "accounts" ? `Accounts (${allAccounts.length - removedIds.size})` : `Contacts (${MOCK_WATCHED_CONTACTS.length})`}
          </button>
        ))}
      </div>

      {/* Contacts tab */}
      {activeTab === "contacts" && (
        <div className="flex flex-col gap-3">
          {MOCK_WATCHED_CONTACTS.map((contact) => (
            <div
              key={contact.id}
              className="rounded-xl border border-[--si-card-border] bg-[--si-card-bg] p-4 flex items-center gap-4 hover:border-[--si-primary]/30 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm flex-shrink-0">
                {contact.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{contact.name}</p>
                <p className="text-xs text-gray-400">{contact.title} · {contact.company}</p>
              </div>
              {contact.latestSignal && (
                <div className="text-right flex-shrink-0 max-w-[220px]">
                  <p className="text-xs font-medium text-gray-700 truncate">{contact.latestSignal}</p>
                  <p className="text-[11px] text-gray-400">
                    {contact.signalDate
                      ? `${Math.floor((Date.now() - new Date(contact.signalDate).getTime()) / 86400000)}d ago`
                      : ""}
                  </p>
                </div>
              )}
              <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
                <Icon icon="solar:trash-bin-minimalistic-linear" className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Accounts tab */}
      {activeTab === "accounts" && watchedAccounts.length === 0 && (() => {
        const role = profile?.role ?? "";
        const isSDR = /sdr|bdr|business development|outbound/i.test(role);
        const isAE = !isSDR;
        return (
          <div className="bg-[--si-card-bg] border border-[--si-card-border] rounded-xl p-4 flex flex-col gap-3">
            <p className="text-xs font-semibold text-[--si-text-secondary] uppercase tracking-wide">
              Get started
            </p>
            <div className="flex gap-3">
              {/* Left card — Add Accounts */}
              <div className="rounded-xl border border-[--si-card-border] p-4 flex flex-col gap-2 flex-1">
                {isAE && (
                  <span className="self-start text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    Recommended for you
                  </span>
                )}
                <Icon icon="solar:user-check-rounded-linear" className="w-6 h-6 text-[--si-text-secondary]" />
                <p className="text-sm font-semibold text-gray-900">I know who I want to target</p>
                <p className="text-xs text-[--si-text-secondary]">
                  Add specific accounts and contacts you're already working.
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="self-start text-sm font-medium text-[--si-primary] hover:underline"
                >
                  Add Accounts →
                </button>
              </div>
              {/* Right card — Build from ICP */}
              <div className="rounded-xl border border-[--si-card-border] p-4 flex flex-col gap-2 flex-1">
                {isSDR && (
                  <span className="self-start text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    Recommended for you
                  </span>
                )}
                <Icon icon="solar:target-linear" className="w-6 h-6 text-[--si-text-secondary]" />
                <p className="text-sm font-semibold text-gray-900">Help me find the right accounts</p>
                <p className="text-xs text-[--si-text-secondary]">
                  Use ICP filters to discover companies that match your criteria.
                </p>
                <button
                  onClick={() => navigate("/si/icp")}
                  className="self-start text-sm font-medium text-[--si-primary] hover:underline"
                >
                  Build from ICP →
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {activeTab === "accounts" && (
        <>
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
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => navigate("/si/icp-discovery")}
                  className="rounded-full border border-[--si-card-border] px-4 py-2 text-sm font-medium text-[--si-text-secondary] hover:bg-gray-50 transition-colors"
                >
                  Build from ICP
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="rounded-full bg-[--si-primary] text-white px-4 py-2 text-sm font-medium hover:bg-[--si-primary-hover] transition-colors"
                >
                  Add Accounts
                </button>
              </div>
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
        </>
      )}

      {/* Create watchlist modal */}
      <CreateWatchlistModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAdd}
      />
    </div>
  );
}
