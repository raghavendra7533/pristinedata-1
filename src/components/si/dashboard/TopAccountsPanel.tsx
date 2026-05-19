import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useUserProfileStore } from "@/lib/si/userProfileStore";
import { IntentScoreBadge } from "@/components/si/shared/IntentScoreBadge";

export function TopAccountsPanel() {
  const navigate = useNavigate();
  const watchedAccounts = useUserProfileStore((s) => s.watchedAccounts);

  const topAccounts = [...watchedAccounts]
    .sort((a, b) => b.intentScore - a.intentScore)
    .slice(0, 5);

  return (
    <div className="rounded-lg border bg-white p-4" style={{ borderColor: "var(--si-card-border)" }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Top by Intent</span>
        <button onClick={() => navigate("/si/watchlist")} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
          View all
        </button>
      </div>

      {topAccounts.length === 0 ? (
        <p className="text-xs text-gray-400">Add accounts to see intent rankings.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {topAccounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between py-1.5 cursor-pointer group"
              onClick={() => navigate(`/si/playbook/${account.id}`)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-indigo-600">{account.accountName[0]}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate group-hover:text-indigo-600 transition-colors">
                    {account.accountName}
                  </p>
                  <p className="text-[10px] text-gray-400 truncate">{account.domain}</p>
                </div>
              </div>
              <IntentScoreBadge score={account.intentScore} label={account.intentLabel} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
