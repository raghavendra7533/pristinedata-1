import { useState } from "react";
import type { ICPAccount, ICPConfig, WatchlistAccount } from "@/lib/si/types";
import { MOCK_ICP_RESULTS } from "@/lib/si/mockData";
import { useUserProfileStore } from "@/lib/si/userProfileStore";
import ICPControlsPanel from "@/components/si/icp/ICPControlsPanel";
import AccountResultsTable from "@/components/si/icp/AccountResultsTable";

const DEFAULT_ICP: ICPConfig = {
  industries: [],
  employeeMin: 0,
  employeeMax: 10000,
  revenueMin: 0,
  revenueMax: 500,
  geographies: [],
  jobTitles: [],
  seniorityLevels: [],
};

export default function SIICPDiscovery() {
  const { profile, addWatchedAccount } = useUserProfileStore();
  const initialIcp: ICPConfig = profile?.icp ?? DEFAULT_ICP;

  const [accounts, setAccounts] = useState<ICPAccount[]>(MOCK_ICP_RESULTS);

  const handleUpdate = (icp: ICPConfig) => {
    useUserProfileStore.setState((s) => ({
      profile: s.profile
        ? { ...s.profile, icp }
        : {
            name: "",
            email: "",
            company: "",
            icp,
            signalPreferences: [],
            signalDelivery: "platform" as const,
            role: "",
          },
    }));
    // MVP: filtering is server-side; return all mock results
    setAccounts(MOCK_ICP_RESULTS);
  };

  const handleAddToWatchlist = (account: ICPAccount) => {
    const watchlistAccount: WatchlistAccount = {
      id: account.id,
      accountName: account.companyName,
      domain: account.domain,
      industry: account.industry,
      revenue: account.revenue,
      employees: String(account.employees),
      location: account.location,
      addedAt: new Date().toISOString(),
      monitoredSignals: [],
      signals: [],
      intentScore: account.icpScore,
      intentLabel: account.icpScore >= 70 ? "Hot" : account.icpScore >= 40 ? "Warm" : "Cold",
    };
    addWatchedAccount(watchlistAccount);
    // Mark as watched in local state
    setAccounts((prev) =>
      prev.map((a) => (a.id === account.id ? { ...a, isWatched: true } : a))
    );
  };

  return (
    <div data-theme="si" className="flex h-screen">
      {/* Left panel */}
      <div
        className="w-[380px] flex-shrink-0 border-r border-[--si-card-border] overflow-y-auto p-4"
        style={{ backgroundColor: "var(--si-card-bg)" }}
      >
        <ICPControlsPanel initialIcp={initialIcp} onUpdate={handleUpdate} />
      </div>

      {/* Right panel */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
            ICP Discovery
          </p>
          <h1 className="text-2xl font-bold text-gray-900">Target Accounts</h1>
          <p className="text-sm text-gray-500 mt-1">
            Companies that match your ideal customer profile. Add them to your watchlist to track buying signals.
          </p>
        </div>
        <AccountResultsTable accounts={accounts} onAddToWatchlist={handleAddToWatchlist} />
      </div>
    </div>
  );
}
