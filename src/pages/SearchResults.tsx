import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import AccountResultsTable from "@/components/si/icp/AccountResultsTable";
import { MOCK_ICP_RESULTS } from "@/lib/si/mockData";

/* ─── Mode config ─── */

type SearchMode = "freeform" | "lookalike" | "website" | "winloss";

const MODE_META: Record<SearchMode, { icon: string; label: string; summary: string }> = {
  freeform: {
    icon: "solar:magnifier-bold",
    label: "Free-form search",
    summary: "Found 247 accounts matching your natural language query.\nTop industries: SaaS, Fintech, and Healthcare tech.",
  },
  lookalike: {
    icon: "solar:buildings-2-bold",
    label: "Company lookalike",
    summary: "Identified 247 accounts with similar firmographics to your seed companies.\nStrong overlap in growth stage and tech stack.",
  },
  website: {
    icon: "solar:global-bold",
    label: "Website scan",
    summary: "Scanned your website and extracted ICP signals from 12 pages.\nReturned 247 accounts matching your positioning.",
  },
  winloss: {
    icon: "solar:file-text-bold",
    label: "Win-loss report",
    summary: "Analyzed your win-loss report and identified 8 ICP patterns.\nReturned 247 accounts that fit your winning profile.",
  },
};

const LOADING_LINES = [
  "Analyzing your input...",
  "Identifying ICP signals...",
  "Querying account database...",
  "Scoring and ranking matches...",
];

const MOCK_STATS = {
  total: 247,
  avgScore: 74,
  inIcp: 183,
};

/* ─── Loading banner ─── */

function LoadingBanner() {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount >= LOADING_LINES.length) return;
    const timer = setTimeout(() => setVisibleCount((n) => n + 1), 800);
    return () => clearTimeout(timer);
  }, [visibleCount]);

  return (
    <div className="flex items-start gap-4">
      {/* Pulsing dot */}
      <div className="mt-1 shrink-0">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500" />
        </span>
      </div>

      <div className="space-y-2">
        {LOADING_LINES.slice(0, visibleCount).map((line, i) => (
          <p
            key={i}
            className="text-sm text-indigo-800 dark:text-indigo-200 animate-in fade-in duration-500"
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

/* ─── Loaded banner ─── */

function LoadedBanner({ mode, onRefine }: { mode: SearchMode; onRefine: () => void }) {
  const meta = MODE_META[mode];
  const [line1, line2] = meta.summary.split("\n");

  return (
    <div className="flex items-center gap-6 flex-wrap">
      {/* Left: mode + summary */}
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="shrink-0 w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center mt-0.5">
          <Icon icon={meta.icon} className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-500 mb-0.5">
            {meta.label}
          </p>
          <p className="text-sm font-medium text-foreground leading-snug">{line1}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{line2}</p>
        </div>
      </div>

      {/* Center: stat pills */}
      <div className="flex items-center gap-2 shrink-0">
        <StatPill label="Accounts found" value={MOCK_STATS.total.toLocaleString()} />
        <StatPill label="Avg ICP score" value={String(MOCK_STATS.avgScore)} />
        <StatPill label="In-ICP matches" value={MOCK_STATS.inIcp.toLocaleString()} accent />
      </div>

      {/* Right: refine button */}
      <button
        onClick={onRefine}
        className="shrink-0 flex items-center gap-1.5 rounded-lg border border-indigo-300 dark:border-indigo-700 px-3 py-1.5 text-xs font-medium text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/10 transition-colors"
      >
        <Icon icon="solar:tuning-2-linear" className="h-3.5 w-3.5" />
        Refine search
      </button>
    </div>
  );
}

function StatPill({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-lg px-3 py-1.5 text-center",
        accent
          ? "bg-indigo-500/20 border border-indigo-400/30"
          : "bg-white/60 dark:bg-white/10 border border-indigo-200/50 dark:border-indigo-700/40"
      )}
    >
      <span
        className={cn(
          "text-base font-bold leading-none",
          accent ? "text-indigo-700 dark:text-indigo-300" : "text-foreground"
        )}
      >
        {value}
      </span>
      <span className="text-[10px] text-muted-foreground mt-0.5 whitespace-nowrap">{label}</span>
    </div>
  );
}

/* ─── Main page ─── */

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();

  const mode: SearchMode = (location.state as { mode?: SearchMode })?.mode ?? "freeform";

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  const handleAddToWatchlist = () => {
    // no-op for mock
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* ── Agent summary banner (sticky) ── */}
      <div className="sticky top-0 z-10 px-6 pt-6 pb-4 bg-background/80 backdrop-blur-sm border-b border-border">
        <div
          className={cn(
            "rounded-xl border px-5 py-4 transition-all duration-500",
            "bg-indigo-50 border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-800/50"
          )}
        >
          {loaded ? (
            <LoadedBanner mode={mode} onRefine={() => navigate("/search")} />
          ) : (
            <LoadingBanner />
          )}
        </div>
      </div>

      {/* ── Results table ── */}
      <div
        className={cn(
          "px-6 py-6 transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <AccountResultsTable
          accounts={MOCK_ICP_RESULTS}
          onAddToWatchlist={handleAddToWatchlist}
        />
      </div>
    </div>
  );
}
