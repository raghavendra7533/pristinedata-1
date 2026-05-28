import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { INDUSTRIES, GEOGRAPHIES } from "@/lib/si/constants";

/* ─── Types ─── */

type SearchMode = "freeform" | "lookalike" | "website" | "winloss";
type Stage = 1 | 2 | 3;
type Tab = "examples" | "recent" | "saved";

/* ─── Mode config ─── */

const MODES: { id: SearchMode; icon: string; label: string; description: string }[] = [
  { id: "freeform",  icon: "solar:magnifier-bold",   label: "Free-form search",    description: "Describe who you're looking for in plain language" },
  { id: "lookalike", icon: "solar:buildings-2-bold",  label: "Company lookalike",   description: "Give me 3–5 companies and I'll find accounts like them" },
  { id: "website",   icon: "solar:global-bold",       label: "Website scan",        description: "Enter your URL and I'll figure out your ICP" },
  { id: "winloss",   icon: "solar:file-text-bold",    label: "Win-loss report",     description: "Upload last year's report and I'll extract your ICP" },
];

/* ─── Clarifying questions per mode ─── */

type QuestionType = "single" | "multi";

interface Question {
  id: string;
  label: string;
  type: QuestionType;
  options: string[];
}

const QUESTIONS: Record<SearchMode, Question[]> = {
  freeform: [
    { id: "seniority", label: "What seniority level are you targeting?",   type: "single", options: ["C-Suite", "VP", "Director", "Manager", "IC"] },
    { id: "size",      label: "Company size?",                             type: "single", options: ["1–50", "51–200", "201–1000", "1000+", "Any"] },
    { id: "geo",       label: "Geography?",                                type: "multi",  options: ["North America", "Europe", "APAC", "Latin America", "Global"] },
    { id: "signals",   label: "Buying signals to prioritize?",             type: "multi",  options: ["Recent funding", "Hiring surge", "New leadership", "Technology change", "Any"] },
  ],
  lookalike: [
    { id: "similarity", label: "What makes these companies similar to your best customers?", type: "multi",  options: ["Industry", "Size", "Tech stack", "Growth stage", "Geography"] },
    { id: "count",      label: "How many results do you want?",                              type: "single", options: ["Top 25", "Top 50", "Top 100", "All matches"] },
  ],
  website: [
    { id: "buyer",     label: "Who is your primary buyer?",  type: "single", options: ["Founder/CEO", "Sales leader", "Marketing leader", "RevOps", "Other"] },
    { id: "dealsize",  label: "What's your deal size?",      type: "single", options: ["SMB under $10k", "Mid-market $10k–$100k", "Enterprise $100k+"] },
  ],
  winloss: [
    { id: "segment",  label: "Which segment drove most of your wins?", type: "single", options: ["SMB", "Mid-market", "Enterprise", "Mixed"] },
    { id: "focus",    label: "Focus on wins, losses, or both?",        type: "single", options: ["Wins only", "Losses only", "Both"] },
    { id: "period",   label: "Time period to prioritize?",             type: "single", options: ["Last 6 months", "Last 12 months", "All time"] },
  ],
};

/* ─── Static tab data ─── */

const EXAMPLES = [
  "Find CFOs at Series B SaaS companies using Salesforce with 200–500 employees",
  "VP Sales at fintech companies in New York that recently raised funding",
  "Head of RevOps at companies using HubSpot and Snowflake, 50–200 employees",
  "CROs at enterprise SaaS companies in San Francisco with $50M+ ARR",
];

const RECENT_SEARCHES = [
  { query: "VP Engineering at Series A startups in healthcare", time: "2 hours ago", results: 342 },
  { query: "CMOs at B2B SaaS companies in California using HubSpot", time: "Yesterday", results: 1247 },
  { query: "Series B fintech startups, 50–200 employees", time: "3 days ago", results: 89 },
  { query: "VP Sales at companies in Canada using Salesforce", time: "Last week", results: 567 },
];

const SAVED_SEARCHES = [
  { query: "Enterprise SaaS Decision Makers", date: "Saved Jan 15", results: 2341 },
  { query: "Healthcare Tech Founders", date: "Saved Dec 28", results: 456 },
];

/* ─── Main component ─── */

export default function SISearch() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stage, setStage] = useState<Stage>(1);
  const [mode, setMode] = useState<SearchMode | null>(null);

  // Stage 2 inputs
  const [freeformQuery, setFreeformQuery] = useState("");
  const [lookalikeCompanies, setLookalikeCompanies] = useState<string[]>([]);
  const [lookalikeInput, setLookalikeInput] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("examples");

  // Advanced filters
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [employeeMin, setEmployeeMin] = useState("");
  const [employeeMax, setEmployeeMax] = useState("");
  const [revenueMin, setRevenueMin] = useState("");
  const [revenueMax, setRevenueMax] = useState("");
  const [selectedGeographies, setSelectedGeographies] = useState<string[]>([]);

  // Stage 3 answers: { questionId: string[] }
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  /* ── Helpers ── */

  const toggleChip = (list: string[], setList: (v: string[]) => void, value: string) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const addLookalike = () => {
    const t = lookalikeInput.trim();
    if (t && lookalikeCompanies.length < 5 && !lookalikeCompanies.includes(t)) {
      setLookalikeCompanies([...lookalikeCompanies, t]);
      setLookalikeInput("");
    }
  };

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if ([".csv", ".xlsx", ".pdf"].includes(ext)) setUploadedFile(file);
  };

  const canAdvanceStage2 = () => {
    if (!mode) return false;
    if (mode === "freeform") return freeformQuery.trim().length > 0;
    if (mode === "lookalike") return lookalikeCompanies.length >= 1;
    if (mode === "website") return websiteUrl.trim().length > 0;
    if (mode === "winloss") return uploadedFile !== null;
    return false;
  };

  const canSubmit = () => {
    if (!mode) return false;
    const qs = QUESTIONS[mode];
    return qs.every((q) => (answers[q.id]?.length ?? 0) > 0);
  };

  const toggleAnswer = (questionId: string, type: QuestionType, option: string) => {
    setAnswers((prev) => {
      const current = prev[questionId] ?? [];
      if (type === "single") {
        return { ...prev, [questionId]: current.includes(option) ? [] : [option] };
      }
      return {
        ...prev,
        [questionId]: current.includes(option)
          ? current.filter((o) => o !== option)
          : [...current, option],
      };
    });
  };

  const handleModeSelect = (m: SearchMode) => {
    setMode(m);
    setAnswers({});
    setStage(2);
  };

  const handleStage2Continue = () => setStage(3);

  const handleSubmit = () => {
    navigate("/si/search/results", {
      state: {
        mode,
        query: freeformQuery,
        companies: lookalikeCompanies,
        url: websiteUrl,
        fileName: uploadedFile?.name,
        answers,
      },
    });
  };

  /* ── Shared card style ── */
  const card = (active?: boolean) =>
    cn(
      "rounded-xl border p-4 text-left transition-all",
      active
        ? "border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500/30"
        : "hover:border-indigo-400/50"
    );

  const inputStyle =
    "w-full rounded-lg border px-3 py-1.5 text-sm bg-transparent focus:outline-none focus:border-indigo-500";

  const chip = (active: boolean) =>
    cn(
      "rounded-full px-3 py-1 text-xs font-medium border transition-colors cursor-pointer",
      active
        ? "bg-indigo-600 text-white border-indigo-600"
        : "bg-transparent hover:border-indigo-500 hover:text-indigo-600"
    );

  /* ── Stage wrappers ── */

  return (
    <div className="flex items-start justify-center min-h-full p-8">
      <div className="w-full max-w-2xl">

        {/* ══ STAGE 1 ══ */}
        {stage === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
            {/* Header */}
            <div>
              <p className="text-[10px] font-semibold tracking-widest uppercase mb-2"
                style={{ color: "var(--si-text-muted)" }}>
                Search
              </p>
              <h1 className="text-2xl font-bold mb-1.5" style={{ color: "var(--si-text-primary)" }}>
                Find your next accounts
              </h1>
              <p className="text-sm" style={{ color: "var(--si-text-secondary)" }}>
                Choose how you want to find them.
              </p>
            </div>

            {/* Mode cards */}
            <div className="grid grid-cols-2 gap-3">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleModeSelect(m.id)}
                  className={card()}
                  style={{ backgroundColor: "var(--si-card-bg)", borderColor: "var(--si-card-border)" }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                    style={{ backgroundColor: "var(--si-muted-bg, rgba(0,0,0,0.05))" }}
                  >
                    <Icon icon={m.icon} className="h-5 w-5" style={{ color: "var(--si-text-muted)" }} />
                  </div>
                  <p className="text-sm font-semibold mb-1" style={{ color: "var(--si-text-primary)" }}>
                    {m.label}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--si-text-secondary)" }}>
                    {m.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══ STAGE 2 ══ */}
        {stage === 2 && mode && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300">
            {/* Back + mode label */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStage(1)}
                className="flex items-center gap-1 text-xs transition-colors hover:text-indigo-600"
                style={{ color: "var(--si-text-muted)" }}
              >
                <Icon icon="solar:alt-arrow-left-linear" className="h-3.5 w-3.5" />
                Back
              </button>
              <span className="text-xs font-medium" style={{ color: "var(--si-text-secondary)" }}>
                {MODES.find((m) => m.id === mode)?.label}
              </span>
            </div>

            {/* ── Free-form ── */}
            {mode === "freeform" && (
              <div
                className="flex items-center gap-3 rounded-xl border px-4 py-3 shadow-sm"
                style={{ backgroundColor: "var(--si-card-bg)", borderColor: "var(--si-card-border)" }}
              >
                <Icon icon="solar:magnifer-linear" className="shrink-0 h-5 w-5" style={{ color: "var(--si-text-muted)" }} />
                <input
                  type="text"
                  autoFocus
                  value={freeformQuery}
                  onChange={(e) => setFreeformQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && canAdvanceStage2() && handleStage2Continue()}
                  placeholder="e.g. CMOs at B2B SaaS companies in California using HubSpot"
                  className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-gray-400"
                  style={{ color: "var(--si-text-primary)" }}
                />
                <button
                  onClick={handleStage2Continue}
                  disabled={!canAdvanceStage2()}
                  className="shrink-0 flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Continue
                  <Icon icon="solar:arrow-right-linear" className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* ── Company lookalike ── */}
            {mode === "lookalike" && (
              <div
                className="rounded-xl border shadow-sm overflow-hidden"
                style={{ backgroundColor: "var(--si-card-bg)", borderColor: "var(--si-card-border)" }}
              >
                <div className="p-4">
                  <div className="flex flex-wrap gap-2 mb-3 min-h-[28px]">
                    {lookalikeCompanies.map((c) => (
                      <span key={c} className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 rounded-full px-3 py-0.5 text-xs font-medium">
                        {c}
                        <button onClick={() => setLookalikeCompanies(lookalikeCompanies.filter((x) => x !== c))}>
                          <Icon icon="solar:close-circle-bold" className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon icon="solar:buildings-2-linear" className="shrink-0 h-5 w-5" style={{ color: "var(--si-text-muted)" }} />
                    <input
                      autoFocus
                      type="text"
                      value={lookalikeInput}
                      onChange={(e) => setLookalikeInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addLookalike()}
                      placeholder={lookalikeCompanies.length >= 5 ? "Maximum 5 companies" : "Type a company name or domain and press Enter"}
                      disabled={lookalikeCompanies.length >= 5}
                      className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-gray-400 disabled:opacity-40"
                      style={{ color: "var(--si-text-primary)" }}
                    />
                    <span className="text-xs shrink-0" style={{ color: "var(--si-text-muted)" }}>
                      {lookalikeCompanies.length}/5
                    </span>
                  </div>
                </div>
                <div className="px-4 py-3 border-t flex justify-end" style={{ borderColor: "var(--si-card-border)" }}>
                  <button
                    onClick={handleStage2Continue}
                    disabled={!canAdvanceStage2()}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    Continue <Icon icon="solar:arrow-right-linear" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── Website scan ── */}
            {mode === "website" && (
              <div
                className="flex items-center gap-3 rounded-xl border px-4 py-3 shadow-sm"
                style={{ backgroundColor: "var(--si-card-bg)", borderColor: "var(--si-card-border)" }}
              >
                <Icon icon="solar:global-linear" className="shrink-0 h-5 w-5" style={{ color: "var(--si-text-muted)" }} />
                <input
                  autoFocus
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && canAdvanceStage2() && handleStage2Continue()}
                  placeholder="https://yourwebsite.com"
                  className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-gray-400"
                  style={{ color: "var(--si-text-primary)" }}
                />
                <button
                  onClick={handleStage2Continue}
                  disabled={!canAdvanceStage2()}
                  className="shrink-0 flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Scan my website <Icon icon="solar:arrow-right-linear" className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* ── Win-loss report ── */}
            {mode === "winloss" && (
              <div className="space-y-3">
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileChange(e.dataTransfer.files[0] ?? null); }}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-all",
                    isDragging || uploadedFile ? "border-indigo-500/40 bg-indigo-500/5" : "hover:border-indigo-400/50"
                  )}
                  style={isDragging || uploadedFile ? {} : { borderColor: "var(--si-card-border)", backgroundColor: "var(--si-card-bg)" }}
                >
                  <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.pdf" className="hidden" onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)} />
                  {uploadedFile ? (
                    <>
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                        <Icon icon="solar:file-text-bold" className="h-5 w-5 text-indigo-500" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium" style={{ color: "var(--si-text-primary)" }}>{uploadedFile.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--si-text-muted)" }}>{(uploadedFile.size / 1024).toFixed(0)} KB · Click to replace</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--si-muted-bg, rgba(0,0,0,0.05))" }}>
                        <Icon icon="solar:upload-linear" className="h-5 w-5" style={{ color: "var(--si-text-muted)" }} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium" style={{ color: "var(--si-text-primary)" }}>Drop your file here</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--si-text-muted)" }}>CSV, XLSX, or PDF · up to 20 MB</p>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleStage2Continue}
                    disabled={!canAdvanceStage2()}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    Analyze report <Icon icon="solar:arrow-right-linear" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── Advanced filters toggle ── */}
            <div>
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="flex items-center gap-1.5 text-xs transition-colors hover:text-indigo-600"
                style={{ color: "var(--si-text-muted)" }}
              >
                <Icon icon={filtersOpen ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"} className="h-3.5 w-3.5" />
                Advanced filters
              </button>

              {filtersOpen && (
                <div
                  className="mt-3 rounded-xl border shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150"
                  style={{ backgroundColor: "var(--si-card-bg)", borderColor: "var(--si-card-border)" }}
                >
                  <div className="px-5 py-3 border-b flex items-center gap-2" style={{ borderColor: "var(--si-card-border)" }}>
                    <Icon icon="solar:tuning-2-linear" className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm font-semibold" style={{ color: "var(--si-text-primary)" }}>Account Filters</span>
                  </div>
                  <div className="p-5 space-y-5">
                    <FilterBlock label="Industry">
                      <div className="flex flex-wrap gap-1.5">
                        {INDUSTRIES.map((ind) => (
                          <button key={ind} onClick={() => toggleChip(selectedIndustries, setSelectedIndustries, ind)} className={chip(selectedIndustries.includes(ind))}
                            style={selectedIndustries.includes(ind) ? {} : { color: "var(--si-text-secondary)", borderColor: "var(--si-card-border)" }}>
                            {ind}
                          </button>
                        ))}
                      </div>
                    </FilterBlock>
                    <FilterBlock label="Company Size (Employees)">
                      <div className="flex gap-2">
                        <NumInput label="Min" value={employeeMin} onChange={setEmployeeMin} placeholder="0" />
                        <NumInput label="Max" value={employeeMax} onChange={setEmployeeMax} placeholder="10000" />
                      </div>
                    </FilterBlock>
                    <FilterBlock label="Revenue Range ($M)">
                      <div className="flex gap-2">
                        <NumInput label="Min ($M)" value={revenueMin} onChange={setRevenueMin} placeholder="0" />
                        <NumInput label="Max ($M)" value={revenueMax} onChange={setRevenueMax} placeholder="500" />
                      </div>
                    </FilterBlock>
                    <FilterBlock label="Geography">
                      <div className="flex flex-wrap gap-1.5">
                        {GEOGRAPHIES.map((geo) => (
                          <button key={geo} onClick={() => toggleChip(selectedGeographies, setSelectedGeographies, geo)} className={chip(selectedGeographies.includes(geo))}
                            style={selectedGeographies.includes(geo) ? {} : { color: "var(--si-text-secondary)", borderColor: "var(--si-card-border)" }}>
                            {geo}
                          </button>
                        ))}
                      </div>
                    </FilterBlock>
                  </div>
                </div>
              )}
            </div>

            {/* ── Examples / Recent / Saved (free-form only) ── */}
            {mode === "freeform" && (
              <div
                className="rounded-xl border shadow-sm overflow-hidden"
                style={{ backgroundColor: "var(--si-card-bg)", borderColor: "var(--si-card-border)" }}
              >
                <div className="flex border-b" style={{ borderColor: "var(--si-card-border)" }}>
                  {(
                    [
                      { key: "examples", icon: "solar:lightbulb-linear",   label: "Examples" },
                      { key: "recent",   icon: "solar:clock-circle-linear", label: "Recent" },
                      { key: "saved",    icon: "solar:bookmark-linear",     label: "Saved" },
                    ] as { key: Tab; icon: string; label: string }[]
                  ).map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setActiveTab(t.key)}
                      className={cn(
                        "flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors",
                        activeTab === t.key ? "border-indigo-600 text-indigo-600" : "border-transparent hover:text-indigo-500"
                      )}
                      style={activeTab === t.key ? {} : { color: "var(--si-text-secondary)" }}
                    >
                      <Icon icon={t.icon} className="h-4 w-4" />
                      {t.label}
                    </button>
                  ))}
                </div>
                <div className="p-4 space-y-1.5">
                  {activeTab === "examples" && EXAMPLES.map((ex, i) => (
                    <SearchRow key={i} icon="solar:magnifer-linear" iconBg="bg-indigo-50" iconColor="text-indigo-500" primary={ex} onClick={() => setFreeformQuery(ex)} />
                  ))}
                  {activeTab === "recent" && RECENT_SEARCHES.map((s, i) => (
                    <SearchRow key={i} icon="solar:clock-circle-linear" iconBg="bg-gray-100" iconColor="text-gray-400" primary={s.query} secondary={`${s.time} · ${s.results.toLocaleString()} results`} onClick={() => setFreeformQuery(s.query)} />
                  ))}
                  {activeTab === "saved" && SAVED_SEARCHES.map((s, i) => (
                    <SearchRow key={i} icon="solar:bookmark-bold" iconBg="bg-amber-50" iconColor="text-amber-500" primary={s.query} secondary={`${s.date} · ${s.results.toLocaleString()} results`} onClick={() => setFreeformQuery(s.query)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ STAGE 3 ══ */}
        {stage === 3 && mode && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            {/* Header */}
            <div>
              <p className="text-[10px] font-semibold tracking-widest uppercase mb-2"
                style={{ color: "var(--si-text-muted)" }}>
                {MODES.find((m) => m.id === mode)?.label}
              </p>
              <h1 className="text-xl font-bold" style={{ color: "var(--si-text-primary)" }}>
                A few quick questions
              </h1>
            </div>

            {/* Question groups */}
            <div
              className="rounded-2xl p-6 space-y-7"
              style={{ backgroundColor: "var(--si-muted-bg, #f8f7f4)", border: "1px solid var(--si-card-border)" }}
            >
              {QUESTIONS[mode].map((q) => (
                <div key={q.id}>
                  <p className="text-sm font-semibold mb-3" style={{ color: "var(--si-text-primary)" }}>
                    {q.label}
                    {q.type === "multi" && (
                      <span className="ml-2 text-[10px] font-normal" style={{ color: "var(--si-text-muted)" }}>
                        select all that apply
                      </span>
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {q.options.map((opt) => {
                      const selected = answers[q.id]?.includes(opt);
                      return (
                        <button
                          key={opt}
                          onClick={() => toggleAnswer(q.id, q.type, opt)}
                          className={cn(
                            "rounded-full px-4 py-1.5 text-sm font-medium border transition-all",
                            selected
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                              : "bg-white hover:border-indigo-400 hover:text-indigo-600"
                          )}
                          style={selected ? {} : { color: "var(--si-text-secondary)", borderColor: "var(--si-card-border)" }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setStage(2)}
                className="flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:border-indigo-400 hover:text-indigo-600"
                style={{ borderColor: "var(--si-card-border)", color: "var(--si-text-secondary)" }}
              >
                <Icon icon="solar:alt-arrow-left-linear" className="h-4 w-4" />
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit()}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Find accounts
                <Icon icon="solar:arrow-right-linear" className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function FilterBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--si-text-muted)" }}>
        {label}
      </p>
      {children}
    </div>
  );
}

function NumInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="flex-1 flex flex-col gap-1">
      <span className="text-xs" style={{ color: "var(--si-text-muted)" }}>{label}</span>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border px-3 py-1.5 text-sm bg-transparent focus:outline-none focus:border-indigo-500"
        style={{ borderColor: "var(--si-card-border)", color: "var(--si-text-primary)" }}
      />
    </div>
  );
}

function SearchRow({ icon, iconBg, iconColor, primary, secondary, onClick }: {
  icon: string; iconBg: string; iconColor: string; primary: string; secondary?: string; onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-[--si-card-border] transition-all group">
      <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>
        <Icon icon={icon} className={`${iconColor} h-4 w-4`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[--si-text-secondary] group-hover:text-[--si-text-primary] truncate">{primary}</p>
        {secondary && <p className="text-xs text-gray-400 mt-0.5">{secondary}</p>}
      </div>
      <Icon icon="solar:arrow-right-linear" className="text-gray-300 group-hover:text-indigo-500 transition-colors h-4 w-4 shrink-0" />
    </button>
  );
}
