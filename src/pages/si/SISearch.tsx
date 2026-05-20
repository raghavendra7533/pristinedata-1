import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

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

type Tab = "examples" | "recent" | "saved";
type SearchMode = "people" | "companies";

export default function SISearch() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<SearchMode>("people");
  const [activeTab, setActiveTab] = useState<Tab>("examples");
  const navigate = useNavigate();

  const navigateToResults = (q: string) => {
    if (!q.trim()) return;
    const path = mode === "people"
      ? `/si/search/results/people?q=${encodeURIComponent(q.trim())}`
      : `/si/search/results/companies?q=${encodeURIComponent(q.trim())}`;
    navigate(path);
  };

  const handleSearch = (customQuery?: string) => {
    const q = customQuery ?? query;
    navigateToResults(q);
  };

  const fill = (text: string) => navigateToResults(text);

  return (
    <div className="flex items-center justify-center min-h-full p-8">
    <div className="w-full max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
          Search
        </p>
        <h1 className="text-2xl font-bold text-gray-900">Find accounts & contacts</h1>
        <p className="text-sm text-gray-500 mt-1">
          Describe who you're looking for in plain language.
        </p>
      </div>

      {/* Mode toggle */}
      <div className="inline-flex items-center bg-gray-100 rounded-lg p-0.5 mb-4">
        <button
          onClick={() => setMode("people")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
            mode === "people"
              ? "text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
          style={mode === "people" ? { backgroundColor: "var(--si-card-bg)" } : {}}
        >
          <Icon icon="solar:user-rounded-linear" className="h-3.5 w-3.5" />
          People
        </button>
        <button
          onClick={() => setMode("companies")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
            mode === "companies"
              ? "text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
          style={mode === "companies" ? { backgroundColor: "var(--si-card-bg)" } : {}}
        >
          <Icon icon="solar:buildings-2-linear" className="h-3.5 w-3.5" />
          Companies
        </button>
      </div>

      {/* Search box */}
      <div
        className="rounded-xl border shadow-sm overflow-hidden"
        style={{ backgroundColor: "var(--si-card-bg)", borderColor: "var(--si-card-border)" }}
      >
        <div className="flex items-center gap-3 px-4 py-3.5">
          <Icon
            icon="solar:magnifer-linear"
            className="text-gray-400 shrink-0 h-5 w-5"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder={
              mode === "people"
                ? "e.g., CMOs at B2B SaaS companies in California using HubSpot"
                : "e.g., Series B fintech startups, 50–200 employees, using Snowflake"
            }
            className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none"

          />
          <button
            onClick={() => handleSearch()}
            disabled={!query.trim()}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0"
          >
            Search
            <Icon icon="solar:arrow-right-linear" className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="mt-4 rounded-xl border shadow-sm overflow-hidden"
        style={{ backgroundColor: "var(--si-card-bg)", borderColor: "var(--si-card-border)" }}
      >
        {/* Tab bar */}
        <div className="flex border-b" style={{ borderColor: "var(--si-card-border)" }}>
          {(
            [
              { key: "examples", icon: "solar:lightbulb-linear", label: "Examples" },
              { key: "recent", icon: "solar:clock-circle-linear", label: "Recent" },
              { key: "saved", icon: "solar:bookmark-linear", label: "Saved" },
            ] as { key: Tab; icon: string; label: string }[]
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon icon={tab.icon} className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-4 space-y-1.5">
          {activeTab === "examples" &&
            EXAMPLES.map((ex, i) => (
              <SearchRow
                key={i}
                icon="solar:magnifer-linear"
                iconBg="bg-indigo-50"
                iconColor="text-indigo-500"
                primary={ex}
                onClick={() => fill(ex)}
              />
            ))}

          {activeTab === "recent" &&
            RECENT_SEARCHES.map((s, i) => (
              <SearchRow
                key={i}
                icon="solar:clock-circle-linear"
                iconBg="bg-gray-100"
                iconColor="text-gray-400"
                primary={s.query}
                secondary={`${s.time} · ${s.results.toLocaleString()} results`}
                onClick={() => fill(s.query)}
              />
            ))}

          {activeTab === "saved" &&
            SAVED_SEARCHES.map((s, i) => (
              <SearchRow
                key={i}
                icon="solar:bookmark-bold"
                iconBg="bg-amber-50"
                iconColor="text-amber-500"
                primary={s.query}
                secondary={`${s.date} · ${s.results.toLocaleString()} results`}
                onClick={() => fill(s.query)}
              />
            ))}
        </div>
      </div>
    </div>
    </div>
  );
}

function SearchRow({
  icon,
  iconBg,
  iconColor,
  primary,
  secondary,
  onClick,
}: {
  icon: string;
  iconBg: string;
  iconColor: string;
  primary: string;
  secondary?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-[--si-card-border] transition-all group"
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}
      >
        <Icon icon={icon} className={`${iconColor} h-4 w-4`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[--si-text-secondary] group-hover:text-[--si-text-primary] truncate">
          {primary}
        </p>
        {secondary && (
          <p className="text-xs text-gray-400 mt-0.5">{secondary}</p>
        )}
      </div>
      <Icon
        icon="solar:arrow-right-linear"
        className="text-gray-300 group-hover:text-indigo-500 transition-colors h-4 w-4 shrink-0"
      />
    </button>
  );
}
