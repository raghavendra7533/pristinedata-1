import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import { MOCK_WATCHLIST_ACCOUNTS, MOCK_PLAYBOOKS } from "@/lib/si/mockData";
import { SIGNAL_TYPES } from "@/lib/si/constants";
import { IntentScoreBadge } from "@/components/si/shared/IntentScoreBadge";
import { StakeholderCard } from "@/components/si/playbook/StakeholderCard";
import { AccountIntelligenceSection } from "@/components/si/account/AccountIntelligenceSection";
import type { Stakeholder } from "@/lib/si/types";

export default function SIAccountView() {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const account = MOCK_WATCHLIST_ACCOUNTS.find((a) => a.id === accountId);
  const playbook = accountId ? MOCK_PLAYBOOKS[accountId] : undefined;
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>(playbook?.stakeholders ?? []);

  if (!account) {
    return (
      <div data-theme="si" className="p-6">
        <p className="text-sm text-[--si-text-secondary]">Account not found.</p>
      </div>
    );
  }

  const recentSignals = [...account.signals]
    .sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime())
    .slice(0, 5);

  function handleAddStakeholder() {
    const newStakeholder: Stakeholder = {
      id: `sh-new-${Date.now()}`,
      name: "New Stakeholder",
      title: "Title TBD",
      role: "Influencer",
      sentiment: "unknown",
      lastActiveDaysAgo: 0,
    };
    setStakeholders((prev) => [...prev, newStakeholder]);
  }

  return (
    <div data-theme="si" className="p-6 max-w-3xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {!imgError ? (
            <img
              src={`https://www.google.com/s2/favicons?sz=64&domain=${account.domain}`}
              alt={account.accountName}
              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-lg font-semibold text-white bg-indigo-500">
              {account.accountName.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-xl font-semibold text-[--si-text-primary]">{account.accountName}</h1>
            <p className="text-xs text-[--si-text-muted]">{account.domain}</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/si/playbook/${account.id}`)}
          className="inline-flex items-center gap-2 rounded-full bg-[--si-primary] text-white px-4 py-2 text-sm font-medium hover:bg-[--si-primary-hover] transition-colors whitespace-nowrap"
        >
          <Icon icon={playbook ? "solar:notebook-bookmark-linear" : "solar:bolt-linear"} className="w-4 h-4" />
          {playbook ? "View Playbook" : "Start Playbook"}
        </button>
      </div>

      {/* Firmographics */}
      <div className="rounded-[12px] border border-[--si-card-border] bg-[--si-card-bg] p-4 flex flex-col gap-3">
        <h2 className="text-xs font-semibold text-[--si-text-secondary] uppercase tracking-wide">
          Firmographics
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <p className="text-[11px] text-[--si-text-muted]">Revenue</p>
            <p className="text-sm font-medium text-[--si-text-primary]">{account.revenue}</p>
          </div>
          <div>
            <p className="text-[11px] text-[--si-text-muted]">Employees</p>
            <p className="text-sm font-medium text-[--si-text-primary]">{account.employees}</p>
          </div>
          <div>
            <p className="text-[11px] text-[--si-text-muted]">Industry</p>
            <p className="text-sm font-medium text-[--si-text-primary]">{account.industry}</p>
          </div>
          <div>
            <p className="text-[11px] text-[--si-text-muted]">Location</p>
            <p className="text-sm font-medium text-[--si-text-primary]">{account.location}</p>
          </div>
        </div>
        <div>
          <IntentScoreBadge score={account.intentScore} label={account.intentLabel} />
        </div>
      </div>

      {/* Recent Signals */}
      <div className="rounded-[12px] border border-[--si-card-border] bg-[--si-card-bg] p-4 flex flex-col gap-3">
        <h2 className="text-xs font-semibold text-[--si-text-secondary] uppercase tracking-wide">
          Recent Signals
        </h2>
        {recentSignals.length === 0 ? (
          <p className="text-sm text-[--si-text-muted]">No signals yet.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {recentSignals.map((signal) => {
              const config = SIGNAL_TYPES[signal.type];
              return (
                <div
                  key={signal.id}
                  className="flex flex-col gap-1 rounded-lg px-3 py-2.5"
                  style={{ border: `1px solid ${config.color}30`, backgroundColor: config.color + "0a" }}
                >
                  <span className="text-xs font-bold" style={{ color: config.color }}>
                    {config.label}
                  </span>
                  <p className="text-sm text-[--si-text-secondary] leading-relaxed">
                    {signal.headline ?? signal.summary}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Account Intelligence */}
      <AccountIntelligenceSection />

      {/* Stakeholders */}
      <div className="rounded-[12px] border border-[--si-card-border] bg-[--si-card-bg] p-4 flex flex-col gap-3">
        <h2 className="text-xs font-semibold text-[--si-text-secondary] uppercase tracking-wide">
          Stakeholders
        </h2>
        {stakeholders.length === 0 ? (
          <p className="text-sm text-[--si-text-muted]">No stakeholders added.</p>
        ) : (
          <div className="flex flex-col divide-y divide-[--si-card-border]">
            {stakeholders.map((s) => (
              <StakeholderCard key={s.id} stakeholder={s} />
            ))}
          </div>
        )}
        <button
          onClick={handleAddStakeholder}
          className="self-start text-sm text-[--si-primary] border border-[--si-primary] rounded-[8px] px-3 py-2 hover:bg-[--si-primary] hover:text-white transition-colors"
        >
          + Add Stakeholder
        </button>
      </div>
    </div>
  );
}
