import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import { MOCK_WATCHLIST_ACCOUNTS, MOCK_PLAYBOOKS } from "@/lib/si/mockData";
import { SIGNAL_TYPES } from "@/lib/si/constants";
import { IntentScoreBadge } from "@/components/si/shared/IntentScoreBadge";
import { StakeholderCard } from "@/components/si/playbook/StakeholderCard";
import type { Stakeholder } from "@/lib/si/types";

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

export default function SIAccountView() {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const account = MOCK_WATCHLIST_ACCOUNTS.find((a) => a.id === accountId);
  const playbook = accountId ? MOCK_PLAYBOOKS[accountId] : undefined;
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>(
    playbook?.stakeholders ?? []
  );

  if (!account) {
    return (
      <div data-theme="si" className="p-6">
        <p className="text-sm text-[--si-text-secondary]">Account not found.</p>
      </div>
    );
  }

  const recentSignals = [...account.signals]
    .sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime())
    .slice(0, 10);

  const firmographics = [
    { icon: "solar:buildings-2-linear", label: "Industry", value: account.industry },
    { icon: "solar:users-group-rounded-linear", label: "Employees", value: account.employees },
    { icon: "solar:dollar-minimalistic-linear", label: "Revenue", value: account.revenue },
    { icon: "solar:map-point-linear", label: "Location", value: account.location },
  ];

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
    <div className="flex h-screen" data-theme="si">

      {/* ── Sidebar: identity + firmographics + stakeholders ── */}
      <div
        className="w-[280px] flex-shrink-0 border-r border-[--si-card-border] overflow-y-auto flex flex-col"
        style={{ backgroundColor: "var(--si-card-bg)" }}
      >
        {/* Account identity */}
        <div className="p-5 border-b border-[--si-card-border]">
          <div className="flex items-center gap-3 mb-3">
            {!imgError ? (
              <img
                src={`https://www.google.com/s2/favicons?sz=48&domain=${account.domain}`}
                alt={account.accountName}
                className="w-10 h-10 rounded-xl object-contain flex-shrink-0 bg-gray-50 p-0.5 border border-[--si-card-border]"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-base font-bold text-white bg-indigo-500">
                {account.accountName.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-base font-semibold text-[--si-text-primary] leading-tight truncate">{account.accountName}</p>
              <p className="text-xs text-[--si-text-muted] mt-0.5">{account.domain}</p>
            </div>
          </div>
          <IntentScoreBadge score={account.intentScore} label={account.intentLabel} />
        </div>

        {/* About */}
        {account.description && (
          <div className="px-5 py-4 border-b border-[--si-card-border]">
            <p className="text-[10px] font-semibold text-[--si-text-muted] uppercase tracking-widest mb-2">About</p>
            <p className="text-xs text-[--si-text-secondary] leading-relaxed">{account.description}</p>
          </div>
        )}

        {/* Firmographics */}
        <div className="p-5 border-b border-[--si-card-border] flex flex-col gap-3">
          <p className="text-[10px] font-semibold text-[--si-text-muted] uppercase tracking-widest">Company Info</p>
          {firmographics.map((f) => (
            <div key={f.label} className="flex items-center gap-2.5">
              <Icon icon={f.icon} className="w-4 h-4 text-[--si-text-muted] shrink-0" />
              <div>
                <p className="text-[10px] text-[--si-text-muted] uppercase tracking-wide">{f.label}</p>
                <p className="text-sm font-medium text-[--si-text-primary]">{f.value}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ── Main content ── */}
      <div className="flex-1 overflow-y-auto">

        {/* Top bar */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-3.5 border-b border-[--si-card-border]"
          style={{ backgroundColor: "var(--si-bg)" }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-xs text-[--si-text-muted] hover:text-[--si-text-secondary] transition-colors"
            >
              <Icon icon="solar:alt-arrow-left-linear" className="w-3.5 h-3.5" />
              Watchlist
            </button>
            <span className="text-[--si-text-muted] text-xs">/</span>
            <span className="text-sm font-semibold text-[--si-text-primary]">{account.accountName}</span>
          </div>
          <button
            onClick={() => navigate(`/si/playbook/${account.id}`)}
            className="inline-flex items-center gap-2 rounded-full bg-[--si-primary] text-white px-4 py-2 text-sm font-medium hover:bg-[--si-primary-hover] transition-colors"
          >
            <Icon icon={playbook ? "solar:notebook-bookmark-linear" : "solar:bolt-linear"} className="w-4 h-4" />
            {playbook ? "View Playbook" : "Start Playbook"}
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Signal Timeline */}
          <div
            className="rounded-[14px] overflow-hidden"
            style={{ border: "1px solid var(--si-card-border)", backgroundColor: "var(--si-card-bg)" }}
          >
            <div
              className="px-5 py-3.5 flex items-center justify-between"
              style={{ borderBottom: "1px solid var(--si-card-border)" }}
            >
              <div className="flex items-center gap-2">
                <Icon icon="solar:graph-up-linear" className="w-4 h-4 text-indigo-500" />
                <h2 className="text-sm font-semibold text-[--si-text-primary]">Recent Signals</h2>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                  {recentSignals.length}
                </span>
              </div>
              <span className="text-[11px] text-[--si-text-muted]">Last 30 days</span>
            </div>

            {recentSignals.length === 0 ? (
              <div className="px-5 py-10 text-sm text-center text-[--si-text-muted]">
                No signals detected yet.
              </div>
            ) : (
              <div className="px-5 py-4 flex flex-col">
                {recentSignals.map((signal, i) => {
                  const config = SIGNAL_TYPES[signal.type];
                  const isLast = i === recentSignals.length - 1;
                  return (
                    <div key={signal.id} className="flex gap-3">
                      <div className="flex flex-col items-center shrink-0 pt-[3px]">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: config.color, boxShadow: `0 0 0 3px ${config.color}18` }}
                        />
                        {!isLast && <div className="w-px flex-1 mt-1.5 mb-1 bg-[--si-card-border]" />}
                      </div>
                      <div className="flex-1 min-w-0" style={{ paddingBottom: isLast ? 0 : 16 }}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: config.color }}>
                            {config.label}
                          </span>
                          <span className="text-[10px] text-[--si-text-muted]">
                            · {formatRelativeTime(signal.detectedAt)}
                          </span>
                        </div>
                        <p className="text-[13px] font-medium leading-snug text-[--si-text-primary]">
                          {signal.headline ?? signal.summary}
                        </p>
                        {signal.headline && (
                          <p className="text-xs mt-0.5 leading-snug text-[--si-text-secondary]">
                            {signal.summary}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Stakeholders */}
          <div
            className="rounded-[14px] overflow-hidden"
            style={{ border: "1px solid var(--si-card-border)", backgroundColor: "var(--si-card-bg)" }}
          >
            <div
              className="px-5 py-3.5 flex items-center justify-between"
              style={{ borderBottom: "1px solid var(--si-card-border)" }}
            >
              <div className="flex items-center gap-2">
                <Icon icon="solar:users-group-rounded-linear" className="w-4 h-4 text-indigo-500" />
                <h2 className="text-sm font-semibold text-[--si-text-primary]">Stakeholders</h2>
                {stakeholders.length > 0 && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                    {stakeholders.length}
                  </span>
                )}
              </div>
              <button
                onClick={handleAddStakeholder}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-[--si-primary] text-[--si-primary] hover:bg-[--si-primary] hover:text-white transition-colors"
              >
                <Icon icon="solar:add-circle-linear" className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
            {stakeholders.length === 0 ? (
              <div className="px-5 py-8 flex flex-col items-center gap-2 text-center">
                <Icon icon="solar:user-plus-rounded-linear" className="w-8 h-8 text-[--si-text-muted]" />
                <p className="text-sm text-[--si-text-muted]">No stakeholders added yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-[--si-card-border]">
                {stakeholders.map((s) => (
                  <div key={s.id} className="px-5">
                    <StakeholderCard stakeholder={s} />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
