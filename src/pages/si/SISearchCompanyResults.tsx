import { useState, useRef, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

const MOCK_COMPANIES = [
  { id: "acc-gong", name: "Gong", domain: "gong.io", industry: "SaaS", revenue: "$100M+ ARR", employees: "1,001–5,000", location: "San Francisco, CA", intentScore: 92, intentDelta: 6 },
  { id: "acc-lattice", name: "Lattice", domain: "lattice.com", industry: "SaaS", revenue: "$50M–$100M ARR", employees: "501–1,000", location: "San Francisco, CA", intentScore: 87, intentDelta: 11 },
  { id: "acc-outreach", name: "Outreach", domain: "outreach.io", industry: "SaaS", revenue: "$100M+ ARR", employees: "1,001–5,000", location: "Seattle, WA", intentScore: 81, intentDelta: 4 },
  { id: "acc-qualified", name: "Qualified", domain: "qualified.com", industry: "SaaS", revenue: "$10M–$50M ARR", employees: "101–500", location: "San Francisco, CA", intentScore: 91, intentDelta: 8 },
  { id: "acc-clari", name: "Clari", domain: "clari.com", industry: "SaaS", revenue: "$100M+ ARR", employees: "501–1,000", location: "Sunnyvale, CA", intentScore: 83, intentDelta: 9 },
  { id: "acc-6sense", name: "6sense", domain: "6sense.com", industry: "SaaS", revenue: "$100M+ ARR", employees: "1,001–5,000", location: "San Francisco, CA", intentScore: 78, intentDelta: -2 },
  { id: "acc-salesloft", name: "Salesloft", domain: "salesloft.com", industry: "SaaS", revenue: "$50M–$100M ARR", employees: "501–1,000", location: "Atlanta, GA", intentScore: 85, intentDelta: 7 },
  { id: "acc-apollo", name: "Apollo.io", domain: "apollo.io", industry: "SaaS", revenue: "$50M–$100M ARR", employees: "501–1,000", location: "Phoenix, AZ", intentScore: 89, intentDelta: 13 },
  { id: "acc-zoominfo", name: "ZoomInfo", domain: "zoominfo.com", industry: "SaaS", revenue: "$100M+ ARR", employees: "5,001–10,000", location: "Vancouver, WA", intentScore: 76, intentDelta: -5 },
  { id: "acc-hubspot", name: "HubSpot", domain: "hubspot.com", industry: "SaaS", revenue: "$100M+ ARR", employees: "5,001–10,000", location: "Boston, MA", intentScore: 74, intentDelta: 2 },
  { id: "acc-drift", name: "Drift", domain: "drift.com", industry: "SaaS", revenue: "$50M–$100M ARR", employees: "501–1,000", location: "Boston, MA", intentScore: 88, intentDelta: 10 },
  { id: "acc-demandbase", name: "Demandbase", domain: "demandbase.com", industry: "SaaS", revenue: "$50M–$100M ARR", employees: "501–1,000", location: "San Francisco, CA", intentScore: 82, intentDelta: 6 },
  { id: "acc-chorus", name: "Chorus.ai", domain: "chorus.ai", industry: "SaaS", revenue: "$10M–$50M ARR", employees: "101–500", location: "Salt Lake City, UT", intentScore: 79, intentDelta: 3 },
  { id: "acc-seismic", name: "Seismic", domain: "seismic.com", industry: "SaaS", revenue: "$100M+ ARR", employees: "1,001–5,000", location: "San Diego, CA", intentScore: 90, intentDelta: 14 },
  { id: "acc-highspot", name: "Highspot", domain: "highspot.com", industry: "SaaS", revenue: "$50M–$100M ARR", employees: "501–1,000", location: "Seattle, WA", intentScore: 84, intentDelta: 5 },
  { id: "acc-mindtickle", name: "Mindtickle", domain: "mindtickle.com", industry: "SaaS", revenue: "$10M–$50M ARR", employees: "101–500", location: "San Francisco, CA", intentScore: 71, intentDelta: -3 },
  { id: "acc-intercom", name: "Intercom", domain: "intercom.com", industry: "SaaS", revenue: "$100M+ ARR", employees: "1,001–5,000", location: "Chicago, IL", intentScore: 86, intentDelta: 8 },
  { id: "acc-segment", name: "Segment", domain: "segment.com", industry: "SaaS", revenue: "$100M+ ARR", employees: "501–1,000", location: "San Francisco, CA", intentScore: 77, intentDelta: 1 },
  { id: "acc-twilio", name: "Twilio", domain: "twilio.com", industry: "SaaS", revenue: "$100M+ ARR", employees: "5,001–10,000", location: "San Francisco, CA", intentScore: 93, intentDelta: 15 },
  { id: "acc-snowflake", name: "Snowflake", domain: "snowflake.com", industry: "SaaS", revenue: "$100M+ ARR", employees: "5,001–10,000", location: "Bozeman, MT", intentScore: 80, intentDelta: -1 },
  { id: "acc-brex", name: "Brex", domain: "brex.com", industry: "FinTech", revenue: "$50M–$100M ARR", employees: "501–1,000", location: "San Francisco, CA", intentScore: 88, intentDelta: 9 },
  { id: "acc-rippling", name: "Rippling", domain: "rippling.com", industry: "HR Tech", revenue: "$100M+ ARR", employees: "1,001–5,000", location: "San Francisco, CA", intentScore: 94, intentDelta: 17 },
  { id: "acc-figma", name: "Figma", domain: "figma.com", industry: "SaaS", revenue: "$100M+ ARR", employees: "501–1,000", location: "San Francisco, CA", intentScore: 73, intentDelta: -4 },
  { id: "acc-notion", name: "Notion", domain: "notion.so", industry: "SaaS", revenue: "$50M–$100M ARR", employees: "101–500", location: "San Francisco, CA", intentScore: 69, intentDelta: -6 },
  { id: "acc-marketo", name: "Marketo", domain: "marketo.com", industry: "SaaS", revenue: "$100M+ ARR", employees: "1,001–5,000", location: "San Mateo, CA", intentScore: 75, intentDelta: 3 },
  { id: "acc-zendesk", name: "Zendesk", domain: "zendesk.com", industry: "SaaS", revenue: "$100M+ ARR", employees: "5,001–10,000", location: "San Francisco, CA", intentScore: 82, intentDelta: 7 },
  { id: "acc-gainsight", name: "Gainsight", domain: "gainsight.com", industry: "SaaS", revenue: "$50M–$100M ARR", employees: "501–1,000", location: "San Francisco, CA", intentScore: 79, intentDelta: 4 },
  { id: "acc-bombora", name: "Bombora", domain: "bombora.com", industry: "SaaS", revenue: "$10M–$50M ARR", employees: "101–500", location: "New York, NY", intentScore: 85, intentDelta: 11 },
  { id: "acc-clearbit", name: "Clearbit", domain: "clearbit.com", industry: "SaaS", revenue: "$10M–$50M ARR", employees: "101–500", location: "San Francisco, CA", intentScore: 70, intentDelta: -2 },
  { id: "acc-mixpanel", name: "Mixpanel", domain: "mixpanel.com", industry: "SaaS", revenue: "$50M–$100M ARR", employees: "201–500", location: "San Francisco, CA", intentScore: 76, intentDelta: 5 },
];

const FILTER_GROUPS = [
  {
    key: "industry",
    label: "Industry",
    icon: "solar:buildings-2-linear",
    type: "search",
    options: ["SaaS", "FinTech", "HR Tech", "MarTech", "HealthTech", "DevTools", "Data & Analytics"],
  },
  {
    key: "revenue",
    label: "Revenue",
    icon: "solar:chart-linear",
    type: "numeric",
    options: ["$10M–$50M ARR", "$50M–$100M ARR", "$100M+ ARR"],
    placeholder: { min: "e.g. 10000000", max: "e.g. 100000000" },
  },
  {
    key: "employees",
    label: "Employees",
    icon: "solar:users-group-rounded-linear",
    type: "numeric",
    options: ["101–500", "201–500", "501–1,000", "1,001–5,000", "5,001–10,000"],
    placeholder: { min: "e.g. 100", max: "e.g. 5000" },
  },
  {
    key: "location",
    label: "Location",
    icon: "solar:map-point-linear",
    type: "search",
    options: ["San Francisco, CA", "Seattle, WA", "Boston, MA", "New York, NY", "Chicago, IL", "Atlanta, GA"],
  },
] as const;

type FilterKey = typeof FILTER_GROUPS[number]["key"];

const PAGE_SIZE = 10;

export default function SISearchCompanyResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Record<FilterKey, string[]>>({
    industry: [], revenue: [], employees: [], location: [],
  });
  const [customRanges, setCustomRanges] = useState<Record<FilterKey, { min: string; max: string }>>({
    industry: { min: "", max: "" },
    revenue: { min: "", max: "" },
    employees: { min: "", max: "" },
    location: { min: "", max: "" },
  });
  const [subSearch, setSubSearch] = useState<Record<FilterKey, string>>({
    industry: "", revenue: "", employees: "", location: "",
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<FilterKey | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setActiveGroup(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function toggleFilter(key: FilterKey, value: string) {
    setFilters((prev) => {
      const cur = prev[key];
      return { ...prev, [key]: cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value] };
    });
    setPage(1);
  }

  function clearAll() {
    setFilters({ industry: [], revenue: [], employees: [], location: [] });
    setCustomRanges({ industry: { min: "", max: "" }, revenue: { min: "", max: "" }, employees: { min: "", max: "" }, location: { min: "", max: "" } });
    setSubSearch({ industry: "", revenue: "", employees: "", location: "" });
    setPage(1);
  }

  function applyCustomRange(key: FilterKey, min: string, max: string) {
    const label = `${min || "any"}–${max || "any"}`;
    setFilters((prev) => {
      const filtered = prev[key].filter((v) => !v.startsWith("custom:"));
      return { ...prev, [key]: [...filtered, `custom:${label}`] };
    });
    setPage(1);
  }

  const activeCount = Object.values(filters).flat().length;

  const filtered = MOCK_COMPANIES.filter((c) => {
    if (filters.industry.length && !filters.industry.includes(c.industry)) return false;
    if (filters.revenue.length && !filters.revenue.includes(c.revenue)) return false;
    if (filters.employees.length && !filters.employees.includes(c.employees)) return false;
    if (filters.location.length && !filters.location.includes(c.location)) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: "var(--si-card-bg)" }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-200">
        <button
          onClick={() => navigate("/si/search")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-2"
        >
          <Icon icon="solar:arrow-left-linear" className="h-4 w-4" />
          Company Results
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <h1 className="text-xl font-bold text-gray-900">Results for &ldquo;{query}&rdquo;</h1>
            <span className="text-sm text-gray-400">{filtered.length} companies</span>
          </div>

          {/* Filters button + dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => { setDropdownOpen((v) => !v); setActiveGroup(null); }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors"
              style={{
                borderColor: activeCount > 0 ? "#6366F1" : "var(--si-card-border)",
                color: activeCount > 0 ? "#6366F1" : "var(--si-text-secondary)",
                backgroundColor: activeCount > 0 ? "#EEF2FF" : "var(--si-card-bg)",
              }}
            >
              <Icon icon="solar:tuning-2-linear" className="h-4 w-4" />
              Filters
              {activeCount > 0 && (
                <span className="ml-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {activeCount}
                </span>
              )}
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 top-full mt-1.5 z-50 rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden"
                style={{ width: 280 }}
              >
                {/* Filter group list */}
                {activeGroup === null ? (
                  <div className="py-1">
                    {activeCount > 0 && (
                      <button
                        onClick={clearAll}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors border-b border-gray-100"
                      >
                        <Icon icon="solar:restart-linear" className="h-3.5 w-3.5" />
                        Clear all filters
                      </button>
                    )}
                    {FILTER_GROUPS.map((group) => {
                      const count = filters[group.key].length;
                      return (
                        <button
                          key={group.key}
                          onClick={() => setActiveGroup(group.key)}
                          className="w-full flex items-center justify-between gap-2 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon icon={group.icon} className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">{group.label}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {count > 0 && (
                              <span className="bg-indigo-600 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                                {count}
                              </span>
                            )}
                            <Icon icon="solar:arrow-right-linear" className="h-3.5 w-3.5 text-gray-300" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  /* Sub-options panel */
                  (() => {
                    const group = FILTER_GROUPS.find((g) => g.key === activeGroup)!;
                    const searchVal = subSearch[activeGroup!];
                    const visibleOptions = group.options;
                    const range = customRanges[activeGroup!];
                    return (
                      <div className="flex flex-col">
                        {/* Back header */}
                        <button
                          onClick={() => setActiveGroup(null)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 border-b border-gray-100 transition-colors"
                        >
                          <Icon icon="solar:arrow-left-linear" className="h-3.5 w-3.5" />
                          {group.label}
                        </button>

                        {/* Type-to-add input */}
                        <div className="px-3 pt-2 pb-1">
                          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-gray-50 focus-within:border-indigo-400">
                            <input
                              autoFocus
                              type="text"
                              value={searchVal}
                              onChange={(e) => setSubSearch((prev) => ({ ...prev, [activeGroup!]: e.target.value }))}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && searchVal.trim()) {
                                  toggleFilter(activeGroup!, searchVal.trim());
                                  setSubSearch((prev) => ({ ...prev, [activeGroup!]: "" }));
                                }
                              }}
                              placeholder={`Type and press Enter to add...`}
                              className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
                            />
                            {searchVal.trim() && (
                              <button
                                onClick={() => {
                                  toggleFilter(activeGroup!, searchVal.trim());
                                  setSubSearch((prev) => ({ ...prev, [activeGroup!]: "" }));
                                }}
                                className="shrink-0 text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded transition-colors"
                              >
                                Add
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Numeric range inputs */}
                        {group.type === "numeric" && (
                          <div className="px-3 pb-2 border-b border-gray-100">
                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Custom Range</p>
                            <div className="flex gap-2">
                              <input
                                type="number"
                                value={range.min}
                                onChange={(e) => setCustomRanges((prev) => ({ ...prev, [activeGroup!]: { ...prev[activeGroup!], min: e.target.value } }))}
                                placeholder={(group as any).placeholder?.min}
                                className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:border-indigo-400 text-gray-700 placeholder:text-gray-400"
                              />
                              <input
                                type="number"
                                value={range.max}
                                onChange={(e) => setCustomRanges((prev) => ({ ...prev, [activeGroup!]: { ...prev[activeGroup!], max: e.target.value } }))}
                                placeholder={(group as any).placeholder?.max}
                                className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:border-indigo-400 text-gray-700 placeholder:text-gray-400"
                              />
                            </div>
                            {(range.min || range.max) && (
                              <button
                                onClick={() => applyCustomRange(activeGroup!, range.min, range.max)}
                                className="mt-1.5 w-full text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg py-1.5 transition-colors"
                              >
                                Apply Range
                              </button>
                            )}
                          </div>
                        )}

                        {/* Preset options */}
                        <div className="py-1 max-h-48 overflow-y-auto">
                          {visibleOptions.map((opt) => {
                              const selected = filters[activeGroup!].includes(opt);
                              return (
                                <button
                                  key={opt}
                                  onClick={() => toggleFilter(activeGroup!, opt)}
                                  className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors"
                                >
                                  <span className="text-sm text-gray-700">{opt}</span>
                                  {selected && <Icon icon="solar:check-circle-bold" className="h-4 w-4 text-indigo-600" />}
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>
            )}
          </div>
        </div>

        {/* Active filter chips */}
        {activeCount > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {FILTER_GROUPS.flatMap((group) =>
              filters[group.key].map((val) => (
                <span
                  key={`${group.key}-${val}`}
                  className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100"
                >
                  {val.startsWith("custom:") ? `${group.label}: ${val.slice(7)}` : val}
                  <button onClick={() => toggleFilter(group.key, val)} className="hover:text-indigo-900 ml-0.5">
                    <Icon icon="solar:close-circle-bold" className="h-3 w-3" />
                  </button>
                </span>
              ))
            )}
          </div>
        )}
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[2fr_1fr_1.2fr_1fr_1.2fr_100px_140px] border-b border-gray-200 bg-gray-50 px-6 py-2">
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Company</span>
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Industry</span>
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Revenue</span>
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Employees</span>
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Location</span>
        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Intent</span>
        <span />
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto">
        {paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <Icon icon="solar:filter-linear" className="h-8 w-8 mb-2 opacity-40" />
            <p className="text-sm">No companies match the selected filters</p>
            <button onClick={clearAll} className="mt-2 text-xs text-indigo-600 hover:underline">Clear filters</button>
          </div>
        ) : (
          paginated.map((company, idx) => (
            <button
              key={company.id}
              onClick={() => navigate(`/si/playbook/${company.id}`)}
              className={`w-full text-left grid grid-cols-[2fr_1fr_1.2fr_1fr_1.2fr_100px_140px] items-center px-6 py-3.5 hover:bg-indigo-50/40 transition-colors group ${idx !== paginated.length - 1 ? "border-b border-gray-100" : ""}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img src={`https://www.google.com/s2/favicons?sz=20&domain=${company.domain}`} alt="" className="w-4 h-4 shrink-0" />
                <div className="min-w-0">
                  <span className="text-sm font-semibold text-gray-900">{company.name}</span>
                  <span className="text-xs text-gray-400 ml-2">{company.domain}</span>
                </div>
              </div>
              <span className="text-sm text-gray-600">{company.industry}</span>
              <span className="text-sm text-gray-600">{company.revenue}</span>
              <span className="text-sm text-gray-600">{company.employees}</span>
              <span className="text-sm text-gray-500 truncate">{company.location}</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-gray-900">{company.intentScore}</span>
                <span className={`text-[11px] font-semibold ${company.intentDelta >= 0 ? "text-green-600" : "text-red-500"}`}>
                  {company.intentDelta >= 0 ? "▲" : "▼"}{Math.abs(company.intentDelta)}
                </span>
              </div>
              <div className="flex justify-end">
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#6366F1] text-white group-hover:bg-[#4F46E5] transition-colors whitespace-nowrap">
                  View Playbook
                  <Icon icon="solar:arrow-right-linear" className="h-3.5 w-3.5" />
                </span>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="border-t border-gray-200 px-6 py-3 flex items-center justify-between bg-gray-50">
        <span className="text-xs text-gray-400">
          Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
        </span>
        <div className="flex items-center gap-1">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            <Icon icon="solar:arrow-left-linear" className="h-4 w-4 text-gray-600" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`min-w-[28px] h-7 rounded text-xs font-medium transition-colors ${p === page ? "bg-indigo-600 text-white" : "text-gray-500 hover:bg-gray-200"}`}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0} className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            <Icon icon="solar:arrow-right-linear" className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
