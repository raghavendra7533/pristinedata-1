import { useState } from "react";
import type { WatchlistAccount, Stakeholder } from "@/lib/si/types";
import { IntentScoreBadge } from "@/components/si/shared/IntentScoreBadge";
import { StakeholderCard } from "./StakeholderCard";
import { SIGNAL_TYPES } from "@/lib/si/constants";
import type { SignalType } from "@/lib/si/types";

interface AccountContextPanelProps {
  account: WatchlistAccount;
  stakeholders: Stakeholder[];
  onAddStakeholder: () => void;
}

function SignalRow({ signal }: { signal: { id: string; type: string; summary: string } }) {
  const [expanded, setExpanded] = useState(false);
  const color = SIGNAL_TYPES[signal.type as SignalType]?.color ?? "#6366F1";
  return (
    <div
      className="flex flex-col gap-1.5 rounded-lg px-3 py-2.5"
      style={{ border: `1px solid ${color}30`, backgroundColor: color + "0a" }}
    >
      <span
        className="text-xs font-bold"
        style={{ color }}
      >
        {SIGNAL_TYPES[signal.type as SignalType]?.label ?? signal.type}
      </span>
      <p className="text-xs text-[--si-text-secondary] leading-relaxed">
        <span className={expanded ? "" : "line-clamp-2"}>{signal.summary}</span>
        {signal.summary.length > 80 && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="ml-1 font-medium hover:underline whitespace-nowrap"
            style={{ color }}
          >
            {expanded ? "less" : "more"}
          </button>
        )}
      </p>
    </div>
  );
}

export function AccountContextPanel({ account, stakeholders, onAddStakeholder }: AccountContextPanelProps) {
  const [imgError, setImgError] = useState(false);
  const recentSignals = account.signals.slice(0, 5);

  return (
    <div className="flex flex-col gap-4">
      {/* Account name + favicon */}
      <div className="flex items-center gap-2.5">
        {!imgError ? (
          <img
            src={`https://www.google.com/s2/favicons?sz=32&domain=${account.domain}`}
            alt={account.accountName}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-semibold text-white bg-indigo-500">
            {account.accountName.charAt(0)}
          </div>
        )}
        <h2 className="text-lg font-semibold text-[--si-text-primary] leading-tight">{account.accountName}</h2>
      </div>

      {/* Firmographic row */}
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {[account.revenue, account.employees, account.industry, account.location].map((item, i) => (
          <span key={i} className="text-xs text-[--si-text-muted]">
            {item}
          </span>
        ))}
      </div>

      {/* Intent score */}
      <div>
        <IntentScoreBadge score={account.intentScore} label={account.intentLabel} />
      </div>

      {/* Recent Signals */}
      <div>
        <h3 className="text-xs font-semibold text-[--si-text-secondary] uppercase tracking-wide mb-2">
          Recent Signals
        </h3>
        {recentSignals.length === 0 ? (
          <p className="text-xs text-[--si-text-muted]">No signals yet.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {recentSignals.map((signal) => (
              <SignalRow key={signal.id} signal={signal} />
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-[--si-card-border]" />

      {/* Stakeholders */}
      <div>
        <h3 className="text-xs font-semibold text-[--si-text-secondary] uppercase tracking-wide mb-1">
          Stakeholders
        </h3>
        {stakeholders.length === 0 ? (
          <p className="text-xs text-[--si-text-muted]">No stakeholders added.</p>
        ) : (
          <div className="flex flex-col divide-y divide-[--si-card-border]">
            {stakeholders.map((s) => (
              <StakeholderCard key={s.id} stakeholder={s} />
            ))}
          </div>
        )}
      </div>

      {/* Add Stakeholder */}
      <button
        onClick={onAddStakeholder}
        className="w-full text-sm text-[--si-primary] border border-[--si-primary] rounded-[8px] px-3 py-2 hover:bg-[--si-primary] hover:text-white transition-colors"
      >
        + Add Stakeholder
      </button>
    </div>
  );
}
