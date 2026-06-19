import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { MOCK_PLAYBOOK_LIST, MOCK_WATCHLIST_ACCOUNTS } from "@/lib/si/mockData";
import { SIGNAL_TYPES } from "@/lib/si/constants";

type SignalChip = "all" | "funding" | "hiring" | "intent" | "leadership";

const SIGNAL_CHIPS: Array<{ key: SignalChip; label: string }> = [
  { key: "all", label: "All" },
  { key: "funding", label: "Funding" },
  { key: "hiring", label: "Hiring" },
  { key: "intent", label: "Intent" },
  { key: "leadership", label: "Leadership" },
];

const accountMap = new Map(MOCK_WATCHLIST_ACCOUNTS.map((a) => [a.id, a]));

function formatRelative(iso: string): string {
  const now = new Date("2026-05-17T00:00:00.000Z");
  const date = new Date(iso);
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
}

function intentColor(score: number): string {
  if (score >= 80) return "#10B981";
  if (score >= 60) return "#F59E0B";
  if (score >= 40) return "#6366F1";
  return "#94A3B8";
}

export default function SIPlaybookList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [signalFilter, setSignalFilter] = useState<SignalChip>("all");

  const filtered = useMemo(() => {
    return MOCK_PLAYBOOK_LIST.filter((pb) => {
      if (search && !pb.accountName.toLowerCase().includes(search.toLowerCase())) return false;
      if (signalFilter !== "all") {
        const acc = accountMap.get(pb.accountId);
        if (!acc?.signals.some((s) => s.type.includes(signalFilter))) return false;
      }
      return true;
    });
  }, [search, signalFilter]);

  const activeCount = MOCK_PLAYBOOK_LIST.filter((p) => p.status === "Active").length;

  return (
    <div data-theme="si" className="p-6 flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[--si-text-muted] mb-1">Playbooks</p>
          <div className="flex items-baseline gap-2">
            <h1 className="text-2xl font-bold text-[--si-text-primary]">Active Playbooks</h1>
            <span className="text-sm text-[--si-text-muted] font-normal">· {activeCount} active</span>
          </div>
        </div>
        <div className="relative w-56 mt-1">
          <Icon icon="solar:magnifier-linear" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[--si-text-muted] w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search playbooks…"
            className="border border-[--si-card-border] rounded-lg pl-8 pr-3 py-1.5 text-sm text-[--si-text-primary] placeholder:text-[--si-text-muted] focus:outline-none focus:ring-1 focus:ring-[--si-primary] w-full bg-[--si-card-bg]"
          />
        </div>
      </div>

      {/* Signal filter chips */}
      <div className="flex items-center gap-2">
        {SIGNAL_CHIPS.map((chip) => (
          <button
            key={chip.key}
            onClick={() => setSignalFilter(chip.key)}
            className={
              signalFilter === chip.key
                ? "bg-[--si-primary] text-white rounded-full px-3 py-1 text-sm font-medium transition-colors"
                : "border border-[--si-card-border] rounded-full px-3 py-1 text-sm text-[--si-text-secondary] hover:bg-gray-50 transition-colors"
            }
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="rounded-[12px] border border-[--si-card-border] bg-[--si-card-bg] p-12 flex flex-col items-center gap-3 text-center">
          <Icon icon="solar:notebook-bookmark-linear" className="w-10 h-10 text-[--si-text-muted]" />
          <p className="text-sm text-[--si-text-secondary] max-w-sm">
            {search || signalFilter !== "all"
              ? "No playbooks match your filters."
              : "No active playbooks yet. Open an account from your watchlist and click Start Playbook."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((pb) => {
            const account = accountMap.get(pb.accountId);
            const topSignals = account?.signals
              .slice()
              .sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime())
              .slice(0, 3) ?? [];
            const accentColor = topSignals[0] ? SIGNAL_TYPES[topSignals[0].type]?.color : "#6366F1";
            const score = account?.intentScore ?? 0;

            return (
              <div
                key={pb.id}
                className="rounded-[12px] flex flex-col"
                style={{
                  border: "1px solid var(--si-card-border)",
                  borderLeft: `3px solid ${accentColor}`,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  backgroundColor: "var(--si-card-bg)",
                }}
              >
                {/* Main row */}
                <div className="flex items-center gap-5 px-5 py-4">

                  {/* Favicon + name */}
                  <div className="flex items-center gap-3 w-52 shrink-0">
                    <img
                      src={`https://www.google.com/s2/favicons?sz=32&domain=${account?.domain}`}
                      alt={pb.accountName}
                      className="w-8 h-8 rounded-lg object-contain flex-shrink-0 bg-gray-50 p-0.5 border border-[--si-card-border]"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[15px] font-semibold text-[--si-text-primary]">{pb.accountName}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            pb.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {pb.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-[--si-text-muted] mt-0.5">{formatRelative(pb.lastUpdated)}</p>
                    </div>
                  </div>

                  {/* Intent score */}
                  <div className="flex flex-col items-center shrink-0 w-14">
                    <span className="text-2xl font-black leading-none" style={{ color: intentColor(score) }}>
                      {score}
                    </span>
                    <span className="text-[10px] text-[--si-text-muted] mt-0.5">Intent</span>
                  </div>

                  {/* Signal badges */}
                  <div className="flex items-center gap-1.5 flex-wrap w-52 shrink-0">
                    {topSignals.map((s) => {
                      const cfg = SIGNAL_TYPES[s.type];
                      return (
                        <span
                          key={s.id}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: cfg.color + "18", color: cfg.color, border: `1px solid ${cfg.color}30` }}
                        >
                          {cfg.label}
                        </span>
                      );
                    })}
                  </div>

                  {/* Next action */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-[--si-text-muted] uppercase tracking-wide mb-1">Next Action</p>
                    <p className="text-[13px] text-[--si-text-primary] leading-snug line-clamp-2">{pb.nextAction}</p>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => navigate(`/si/playbook/${pb.accountId}`)}
                    className="flex items-center gap-2 bg-[--si-primary] hover:bg-[--si-primary-hover] text-white text-sm font-medium px-4 py-2 rounded-full whitespace-nowrap transition-colors flex-shrink-0"
                  >
                    <Icon icon="solar:notebook-bookmark-linear" className="w-4 h-4" />
                    Open Playbook
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
