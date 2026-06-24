import { Icon } from "@iconify/react";
import { SIGNAL_TYPES } from "@/lib/si/constants";
import type { WatchlistAccount } from "@/lib/si/types";

interface AccountWatchCardProps {
  account: WatchlistAccount;
  hasPlaybook?: boolean;
  onViewAccount: () => void;
  onViewPlaybook: () => void;
  onRemove: () => void;
}

function formatRelativeTime(isoDate: string): string {
  const now = new Date("2026-05-17T00:00:00.000Z");
  const date = new Date(isoDate);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

export function AccountWatchCard({
  account,
  hasPlaybook = false,
  onViewAccount,
  onViewPlaybook,
  onRemove,
}: AccountWatchCardProps) {
  const recentSignals = [...account.signals]
    .sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime())
    .slice(0, 3);

  const topSignalColor =
    recentSignals.length > 0 ? SIGNAL_TYPES[recentSignals[0].type]?.color : "#E5E7EB";

return (
      <div
        className="rounded-[12px] flex flex-col"
        style={{
          border: "1px solid var(--si-card-border)",
          borderLeft: `3px solid ${topSignalColor}`,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          backgroundColor: "var(--si-card-bg)",
        }}
      >
        {/* Content row */}
        <div className="flex flex-1 px-5 py-4 gap-6 min-w-0">

          {/* Left column: account identity + score */}
          <div className="flex flex-col gap-0.5 w-44 shrink-0">
            <div className="flex items-center gap-2 mb-0.5">
              <img
                src={`https://www.google.com/s2/favicons?sz=32&domain=${account.domain}`}
                alt={account.accountName}
                className="w-5 h-5 rounded-sm object-contain flex-shrink-0"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
              <span className="text-[15px] font-semibold text-gray-900 leading-tight">
                {account.accountName}
              </span>
            </div>
            <span className="text-xs text-gray-400 mb-1">{account.domain}</span>

            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-bold text-gray-900 leading-none">
                {account.intentScore}
              </span>
              {account.intentDelta !== undefined && account.intentDelta !== 0 && (
                <span
                  className="text-xs font-semibold"
                  style={{ color: account.intentDelta > 0 ? "#10B981" : "#EF4444" }}
                >
                  {account.intentDelta > 0 ? "▲" : "▼"}
                  {Math.abs(account.intentDelta)}
                </span>
              )}
            </div>

            <span className="text-[11px] text-gray-400 mt-1.5">
              {account.industry} · {account.revenue}
            </span>
            <span className="text-[11px] text-gray-400">
              {account.employees} · {account.location}
            </span>
          </div>

          {/* Center: signals — timeline layout */}
          <div className="flex-1 flex flex-col min-w-0 py-0.5">
            {recentSignals.length === 0 ? (
              <span className="text-sm text-gray-400 mt-1">No signals yet</span>
            ) : (
              recentSignals.map((signal, i) => {
                const config = SIGNAL_TYPES[signal.type];
                const isLast = i === recentSignals.length - 1;
                return (
                  <div key={signal.id} className="flex gap-2.5">
                    <div className="flex flex-col items-center shrink-0">
                      <div
                        className="w-2 h-2 rounded-full shrink-0 mt-[5px]"
                        style={{ backgroundColor: config.color }}
                      />
                      {!isLast && (
                        <div className="w-px flex-1 bg-gray-200 mt-1" />
                      )}
                    </div>
                    <div className={`flex-1 min-w-0 ${!isLast ? "pb-4" : ""}`}>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider"
                          style={{ color: config.color }}
                        >
                          {config.label}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          · {formatRelativeTime(signal.detectedAt)}
                        </span>
                      </div>
                      <p className="text-[13px] font-normal text-gray-900 leading-snug">
                        {signal.headline ?? signal.summary}
                      </p>
                      {signal.headline && (
                        <p className="text-[12px] text-gray-400 leading-snug mt-0.5">
                          {signal.summary}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Bottom action strip */}
        <div
          className="flex items-center border-t px-3 py-0"
          style={{ borderColor: "var(--si-card-border)" }}
        >
          <button
            onClick={onViewAccount}
            className="flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Icon icon="solar:building-2-linear" className="w-4 h-4" />
            View Account
          </button>

          <div className="w-px h-4 bg-gray-200 mx-1" />

          <button
            onClick={onViewPlaybook}
            className="flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Icon icon={hasPlaybook ? "solar:notebook-bookmark-linear" : "solar:bolt-linear"} className="w-4 h-4" />
            {hasPlaybook ? "View Playbook" : "Generate Playbook"}
          </button>

          {/* Spacer */}
          <div className="flex-1" />

          <button
            onClick={onRemove}
            className="flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-medium text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Icon icon="solar:trash-bin-minimalistic-linear" className="w-4 h-4" />
            Remove
          </button>
        </div>

      </div>
  );
}
