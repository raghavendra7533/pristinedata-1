import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import AccountResultsTable from "@/components/si/icp/AccountResultsTable";
import { MOCK_ICP_RESULTS } from "@/lib/si/mockData";
import type { ICPAccount } from "@/lib/si/types";

/* ─── Types ─── */

type SearchMode = "freeform" | "lookalike" | "website" | "winloss";

interface ActiveFilter {
  id: string;
  label: string;
  field: keyof ICPAccount | "icpScoreMin";
  value: string | number;
}

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  filters?: ActiveFilter[];
}

/* ─── Mode meta ─── */

const MODE_META: Record<SearchMode, { icon: string; label: string }> = {
  freeform:  { icon: "solar:magnifier-bold",   label: "Free-form search" },
  lookalike: { icon: "solar:buildings-2-bold",  label: "Company lookalike" },
  website:   { icon: "solar:global-bold",       label: "Website scan" },
  winloss:   { icon: "solar:file-text-bold",    label: "Win-loss report" },
};

const LOADING_LINES = [
  "Analyzing your input...",
  "Identifying ICP signals...",
  "Querying account database...",
  "Scoring and ranking matches...",
];

const MOCK_SUMMARY =
  "Scanned pristinedata.ai. Identified 4 ICP signals: B2B SaaS, 50–500 employees, RevOps buyer, outbound-heavy motion.";

/* ─── Derive initial filters from route state answers ─── */

function answersToFilters(answers: Record<string, string[]>): ActiveFilter[] {
  const filters: ActiveFilter[] = [];
  let seq = 0;

  const add = (label: string, field: keyof ICPAccount | "icpScoreMin", value: string | number) =>
    filters.push({ id: `init-${seq++}`, label, field, value });

  // seniority / size / geo / signals from freeform
  if (answers.size) {
    answers.size.forEach((s) => {
      if (s !== "Any") add(`Size: ${s}`, "employees", s);
    });
  }
  if (answers.geo) {
    answers.geo.filter((g) => g !== "Global").forEach((g) => add(`Geo: ${g}`, "location", g));
  }
  if (answers.segment) {
    answers.segment.forEach((s) => add(`Segment: ${s}`, "industry", s));
  }
  if (answers.buyer) {
    answers.buyer.forEach((b) => add(`Buyer: ${b}`, "industry", b));
  }

  return filters;
}

/* ─── Mock copilot response logic ─── */

function buildCopilotReply(userMsg: string): { text: string; filters: ActiveFilter[] } {
  const msg = userMsg.toLowerCase();
  const filters: ActiveFilter[] = [];
  const notes: string[] = [];
  let seq = Date.now();

  if (msg.includes("saas") || msg.includes("software")) {
    filters.push({ id: `cop-${seq++}`, label: "Industry: SaaS", field: "industry", value: "SaaS" });
    notes.push("filtered to SaaS companies");
  }
  if (msg.includes("fintech") || msg.includes("finance")) {
    filters.push({ id: `cop-${seq++}`, label: "Industry: FinTech", field: "industry", value: "FinTech" });
    notes.push("added FinTech filter");
  }
  if (msg.includes("san francisco") || msg.includes("sf")) {
    filters.push({ id: `cop-${seq++}`, label: "Location: San Francisco", field: "location", value: "San Francisco" });
    notes.push("narrowed to San Francisco");
  }
  if (msg.includes("score") || msg.includes("high icp") || msg.includes("best match")) {
    filters.push({ id: `cop-${seq++}`, label: "ICP Score ≥ 85", field: "icpScoreMin", value: 85 });
    notes.push("showing only high ICP scores (≥ 85)");
  }
  if (msg.includes("500") || msg.includes("small") || msg.includes("startup")) {
    filters.push({ id: `cop-${seq++}`, label: "Employees < 500", field: "employees", value: "500" });
    notes.push("limited to companies under 500 employees");
  }
  if (msg.includes("seattle")) {
    filters.push({ id: `cop-${seq++}`, label: "Location: Seattle", field: "location", value: "Seattle" });
    notes.push("narrowed to Seattle");
  }
  if (msg.includes("hr") || msg.includes("hr tech")) {
    filters.push({ id: `cop-${seq++}`, label: "Industry: HR Tech", field: "industry", value: "HR Tech" });
    notes.push("added HR Tech filter");
  }

  if (filters.length === 0) {
    return {
      text: "I didn't catch a specific filter from that. Try something like \"show only SaaS companies\", \"narrow to San Francisco\", or \"high ICP scores only\".",
      filters: [],
    };
  }

  const actionText = notes.join(" and ");
  return {
    text: `Got it — I've ${actionText}. ${MOCK_ICP_RESULTS.length} total accounts narrowed down. Remove any chip above to broaden results.`,
    filters,
  };
}

/* ─── Filter accounts ─── */

function applyFilters(accounts: ICPAccount[], filters: ActiveFilter[]): ICPAccount[] {
  return accounts.filter((acc) => {
    for (const f of filters) {
      if (f.field === "industry") {
        if (!acc.industry.toLowerCase().includes(String(f.value).toLowerCase())) return false;
      } else if (f.field === "location") {
        if (!acc.location.toLowerCase().includes(String(f.value).toLowerCase())) return false;
      } else if (f.field === "icpScoreMin") {
        if (acc.icpScore < Number(f.value)) return false;
      } else if (f.field === "employees" && f.label.includes("<")) {
        if (acc.employees >= Number(f.value)) return false;
      }
    }
    return true;
  });
}

/* ─── Loading banner ─── */

function LoadingBanner() {
  const [visibleCount, setVisibleCount] = useState(0);
  useEffect(() => {
    if (visibleCount >= LOADING_LINES.length) return;
    const t = setTimeout(() => setVisibleCount((n) => n + 1), 800);
    return () => clearTimeout(t);
  }, [visibleCount]);

  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 shrink-0">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500" />
        </span>
      </div>
      <div className="space-y-2">
        {LOADING_LINES.slice(0, visibleCount).map((line, i) => (
          <p key={i} className="text-sm text-indigo-700 animate-in fade-in duration-500">{line}</p>
        ))}
      </div>
    </div>
  );
}

/* ─── Loaded banner ─── */

function LoadedBanner({
  mode, totalCount, filteredCount, onRefine, onCopilot, copilotOpen,
}: {
  mode: SearchMode;
  totalCount: number;
  filteredCount: number;
  onRefine: () => void;
  onCopilot: () => void;
  copilotOpen: boolean;
}) {
  const meta = MODE_META[mode];
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="shrink-0 w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center mt-0.5">
          <Icon icon={meta.icon} className="h-5 w-5 text-indigo-600" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-500 mb-0.5">{meta.label}</p>
          <p className="text-sm text-[--si-text-primary] leading-snug">{MOCK_SUMMARY}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <StatPill label="accounts" value={String(filteredCount)} />
        <StatPill label="avg ICP score" value="78%" />
        <StatPill label="in-ICP match" value="47" accent />
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onRefine}
          className="flex items-center gap-1.5 rounded-lg border border-indigo-300 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-500/10 transition-colors"
        >
          <Icon icon="solar:tuning-2-linear" className="h-3.5 w-3.5" />
          Refine search
        </button>
        <button
          onClick={onCopilot}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors border",
            copilotOpen
              ? "bg-indigo-600 text-white border-indigo-600"
              : "border-indigo-300 text-indigo-600 hover:bg-indigo-500/10"
          )}
        >
          <Icon icon="solar:magic-stick-3-bold" className="h-3.5 w-3.5" />
          Copilot
        </button>
      </div>
    </div>
  );
}

function StatPill({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={cn(
      "flex flex-col items-center rounded-lg px-3 py-1.5 text-center",
      accent ? "bg-indigo-500/20 border border-indigo-400/30" : "bg-indigo-500/10 border border-indigo-200/50"
    )}>
      <span className={cn("text-base font-bold leading-none", accent ? "text-indigo-700" : "text-[--si-text-primary]")}>{value}</span>
      <span className="text-[10px] text-[--si-text-muted] mt-0.5 whitespace-nowrap">{label}</span>
    </div>
  );
}

/* ─── Copilot sidebar ─── */

function CopilotSidebar({
  messages,
  onSend,
  onClose,
}: {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  onClose: () => void;
}) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const t = input.trim();
    if (!t) return;
    onSend(t);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full border-l border-[--si-card-border]" style={{ backgroundColor: "var(--si-card-bg)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[--si-card-border]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <Icon icon="solar:magic-stick-3-bold" className="h-4 w-4 text-indigo-600" />
          </div>
          <span className="text-sm font-semibold" style={{ color: "var(--si-text-primary)" }}>Search Copilot</span>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-black/5 transition-colors">
          <Icon icon="solar:close-circle-linear" className="h-4 w-4" style={{ color: "var(--si-text-muted)" }} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex gap-2.5", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
            {msg.role === "assistant" && (
              <div className="shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center mt-0.5">
                <Icon icon="solar:magic-stick-3-bold" className="h-3.5 w-3.5 text-indigo-600" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-tr-sm"
                  : "rounded-tl-sm"
              )}
              style={msg.role === "assistant" ? {
                backgroundColor: "var(--si-muted-bg, rgba(0,0,0,0.04))",
                color: "var(--si-text-primary)",
                border: "1px solid var(--si-card-border)",
              } : {}}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-[--si-card-border]">
        <div
          className="flex items-center gap-2 rounded-xl border px-3 py-2"
          style={{ borderColor: "var(--si-card-border)" }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="e.g. show only SaaS in San Francisco"
            className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-gray-400"
            style={{ color: "var(--si-text-primary)" }}
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Icon icon="solar:arrow-up-linear" className="h-4 w-4 text-white" />
          </button>
        </div>
        <p className="text-[10px] text-center mt-2" style={{ color: "var(--si-text-muted)" }}>
          Ask to refine, narrow, or explain results
        </p>
      </div>
    </div>
  );
}

/* ─── Main page ─── */

export default function SISearchResults() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as {
    mode?: SearchMode;
    answers?: Record<string, string[]>;
  } | null;

  const mode: SearchMode = state?.mode ?? "freeform";

  const [loaded, setLoaded] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>(() =>
    answersToFilters(state?.answers ?? {})
  );
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hi! I can help you refine these results. Try asking me to narrow by industry, location, company size, or ICP score.",
    },
  ]);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 3500);
    return () => clearTimeout(t);
  }, []);

  const filteredAccounts = useMemo(
    () => applyFilters(MOCK_ICP_RESULTS, activeFilters),
    [activeFilters]
  );

  const removeFilter = (id: string) => setActiveFilters((prev) => prev.filter((f) => f.id !== id));

  const handleCopilotSend = (text: string) => {
    const userMsg: ChatMessage = { role: "user", text };
    const reply = buildCopilotReply(text);
    const assistantMsg: ChatMessage = { role: "assistant", text: reply.text, filters: reply.filters };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    if (reply.filters.length > 0) {
      setActiveFilters((prev) => {
        const existingLabels = new Set(prev.map((f) => f.label));
        const newFilters = reply.filters.filter((f) => !existingLabels.has(f.label));
        return [...prev, ...newFilters];
      });
    }
  };

  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      {/* ── Main content ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-y-auto">
        {/* Sticky banner */}
        <div
          className="sticky top-0 z-10 px-6 pt-5 pb-4 backdrop-blur-sm border-b border-[--si-card-border]"
          style={{ backgroundColor: "var(--si-bg, white)" }}
        >
          <div className="rounded-xl border px-5 py-4 bg-indigo-50/80 border-indigo-200 transition-all duration-500">
            {loaded
              ? <LoadedBanner
                  mode={mode}
                  totalCount={MOCK_ICP_RESULTS.length}
                  filteredCount={filteredAccounts.length}
                  onRefine={() => navigate("/si/search")}
                  onCopilot={() => setCopilotOpen((o) => !o)}
                  copilotOpen={copilotOpen}
                />
              : <LoadingBanner />
            }
          </div>

          {/* Active filter chips */}
          {loaded && activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {activeFilters.map((f) => (
                <span
                  key={f.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700"
                >
                  {f.label}
                  <button
                    onClick={() => removeFilter(f.id)}
                    className="hover:text-indigo-900 transition-colors"
                  >
                    <Icon icon="solar:close-circle-bold" className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
              {activeFilters.length > 1 && (
                <button
                  onClick={() => setActiveFilters([])}
                  className="text-xs text-indigo-500 hover:text-indigo-700 px-1 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
          )}
        </div>

        {/* Table */}
        <div className={cn("px-6 py-6 transition-opacity duration-500", loaded ? "opacity-100" : "opacity-0 pointer-events-none")}>
          <AccountResultsTable
            accounts={filteredAccounts}
            onAddToWatchlist={() => {}}
          />
        </div>
      </div>

      {/* ── Copilot sidebar ── */}
      <div
        className={cn(
          "shrink-0 flex flex-col transition-all duration-300 overflow-hidden",
          copilotOpen ? "w-80" : "w-0"
        )}
      >
        {copilotOpen && (
          <CopilotSidebar
            messages={messages}
            onSend={handleCopilotSend}
            onClose={() => setCopilotOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
