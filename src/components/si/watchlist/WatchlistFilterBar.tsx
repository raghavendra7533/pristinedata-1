import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";

// ── Types ─────────────────────────────────────────────────────────────────────

type FilterProperty = "signal" | "playbook" | "time_range";

interface ActiveFilter {
  id: string;
  property: FilterProperty;
  value: string;
}

export interface ComputedFilters {
  signalFilter: string;
  playbookFilter: "all" | "has_playbook" | "no_playbook";
  timeRange: "24h" | "7d" | "30d";
}

export interface WatchlistFilterBarProps {
  onFiltersChange: (filters: ComputedFilters) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

// ── Static config ─────────────────────────────────────────────────────────────

const PROPERTIES: Array<{ key: FilterProperty; label: string; icon: string }> = [
  { key: "signal",     label: "Signal Type", icon: "solar:bell-bing-linear" },
  { key: "playbook",   label: "Playbook",    icon: "solar:notebook-bookmark-linear" },
  { key: "time_range", label: "Time Range",  icon: "solar:clock-circle-linear" },
];

const VALUES: Record<FilterProperty, Array<{ key: string; label: string }>> = {
  signal: [
    { key: "funding",    label: "New Funding" },
    { key: "hiring",     label: "Hiring Surge" },
    { key: "intent",     label: "Intent Surge" },
    { key: "leadership", label: "Leadership Change" },
    { key: "expansion",  label: "Expansion" },
  ],
  playbook: [
    { key: "has_playbook", label: "Has Playbook" },
    { key: "no_playbook",  label: "No Playbook" },
  ],
  time_range: [
    { key: "24h", label: "Last 24 hours" },
    { key: "7d",  label: "Last 7 days" },
    { key: "30d", label: "Last 30 days" },
  ],
};

const PROP_LABEL: Record<FilterProperty, string> = {
  signal:     "Signal",
  playbook:   "Playbook",
  time_range: "Time",
};

// ── Compute filters from active pill state ────────────────────────────────────

function compute(filters: ActiveFilter[]): ComputedFilters {
  const signal     = filters.find((f) => f.property === "signal");
  const playbook   = filters.find((f) => f.property === "playbook");
  const time_range = filters.find((f) => f.property === "time_range");
  return {
    signalFilter:   signal     ? signal.value     : "all",
    playbookFilter: playbook   ? (playbook.value as ComputedFilters["playbookFilter"]) : "all",
    timeRange:      time_range ? (time_range.value as ComputedFilters["timeRange"])    : "7d",
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

type DropdownState =
  | { step: "property" }
  | { step: "value"; property: FilterProperty; editingId?: string };

export function WatchlistFilterBar({ onFiltersChange, searchQuery, onSearchChange }: WatchlistFilterBarProps) {
  const [filters, setFilters] = useState<ActiveFilter[]>([
    { id: "default-time", property: "time_range", value: "7d" },
  ]);
  const [dropdown, setDropdown] = useState<DropdownState | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Notify parent whenever filters change
  useEffect(() => {
    onFiltersChange(compute(filters));
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdown) return;
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdown(null);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdown]);

  function openAddFilter() {
    setDropdown({ step: "property" });
  }

  function openEditFilter(filter: ActiveFilter) {
    setDropdown({ step: "value", property: filter.property, editingId: filter.id });
  }

  function selectProperty(property: FilterProperty) {
    setDropdown({ step: "value", property });
  }

  function selectValue(value: string) {
    if (!dropdown || dropdown.step !== "value") return;
    const { property, editingId } = dropdown;

    setFilters((prev) => {
      // If editing an existing pill, update it
      if (editingId) {
        return prev.map((f) => (f.id === editingId ? { ...f, value } : f));
      }
      // Otherwise remove any existing filter for this property and add a new one
      const without = prev.filter((f) => f.property !== property);
      return [...without, { id: `${property}-${Date.now()}`, property, value }];
    });
    setDropdown(null);
  }

  function removeFilter(id: string) {
    setFilters((prev) => prev.filter((f) => f.id !== id));
  }

  // Properties not yet active (for the property picker — can't add duplicates)
  const activeProps = new Set(filters.map((f) => f.property));
  const availableProps = PROPERTIES.filter((p) => !activeProps.has(p.key));

  const valueLabelFor = (f: ActiveFilter) =>
    VALUES[f.property].find((v) => v.key === f.value)?.label ?? f.value;

  return (
    <div ref={containerRef} className="flex items-center gap-2 py-3 flex-wrap relative">

      {/* ── Active filter pills ── */}
      {filters.map((f) => (
        <button
          key={f.id}
          onClick={() => openEditFilter(f)}
          className="inline-flex items-center gap-1.5 h-7 pl-2.5 pr-1.5 rounded-md text-xs font-medium transition-colors group"
          style={{
            backgroundColor: "var(--si-card-bg)",
            border: "1px solid var(--si-card-border)",
            color: "var(--si-text-primary)",
          }}
        >
          <span style={{ color: "var(--si-text-muted)" }}>{PROP_LABEL[f.property]}</span>
          <span className="font-semibold">{valueLabelFor(f)}</span>
          <span
            onClick={(e) => { e.stopPropagation(); removeFilter(f.id); }}
            className="ml-0.5 w-4 h-4 rounded flex items-center justify-center hover:bg-gray-200 transition-colors"
            style={{ color: "var(--si-text-muted)" }}
          >
            <Icon icon="solar:close-circle-linear" className="w-3 h-3" />
          </span>
        </button>
      ))}

      {/* ── Add filter button ── */}
      {availableProps.length > 0 && (
        <button
          onClick={openAddFilter}
          className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md text-xs font-medium transition-colors"
          style={{
            color: "var(--si-text-secondary)",
            border: "1px dashed var(--si-card-border)",
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--si-card-bg)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <Icon icon="solar:add-circle-linear" className="w-3.5 h-3.5" />
          Add filter
        </button>
      )}

      {/* ── Dropdown ── */}
      {dropdown && (
        <div
          className="absolute top-full left-0 mt-1 z-50 rounded-xl overflow-hidden shadow-xl"
          style={{
            backgroundColor: "var(--si-card-bg)",
            border: "1px solid var(--si-card-border)",
            minWidth: 200,
          }}
        >
          {dropdown.step === "property" && (
            <>
              <div className="px-3 pt-2.5 pb-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--si-text-muted)" }}>
                  Filter by
                </p>
              </div>
              {availableProps.map((prop) => (
                <button
                  key={prop.key}
                  onClick={() => selectProperty(prop.key)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors"
                  style={{ color: "var(--si-text-primary)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--si-bg)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <Icon icon={prop.icon} className="w-4 h-4 text-indigo-400 shrink-0" />
                  {prop.label}
                </button>
              ))}
            </>
          )}

          {dropdown.step === "value" && (
            <>
              <div
                className="px-3 pt-2.5 pb-1.5 flex items-center gap-1.5 border-b"
                style={{ borderColor: "var(--si-card-border)" }}
              >
                {!dropdown.editingId && (
                  <button
                    onClick={() => setDropdown({ step: "property" })}
                    className="text-[--si-text-muted] hover:text-[--si-text-primary] transition-colors"
                  >
                    <Icon icon="solar:alt-arrow-left-linear" className="w-3.5 h-3.5" />
                  </button>
                )}
                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--si-text-muted)" }}>
                  {PROPERTIES.find((p) => p.key === dropdown.property)?.label}
                </p>
              </div>
              {VALUES[dropdown.property].map((val) => {
                const activeFilter = filters.find((f) => f.property === dropdown.property);
                const isActive = activeFilter?.value === val.key;
                return (
                  <button
                    key={val.key}
                    onClick={() => selectValue(val.key)}
                    className="w-full flex items-center justify-between gap-2.5 px-3 py-2 text-sm text-left transition-colors"
                    style={{
                      color: isActive ? "var(--si-primary)" : "var(--si-text-primary)",
                      backgroundColor: isActive ? "rgba(99,102,241,0.06)" : "transparent",
                    }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "var(--si-bg)"; }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}
                  >
                    {val.label}
                    {isActive && <Icon icon="solar:check-circle-linear" className="w-4 h-4 shrink-0" />}
                  </button>
                );
              })}
            </>
          )}
        </div>
      )}

      {/* ── Search ── */}
      <div className="relative ml-auto">
        <Icon icon="solar:magnifier-linear" className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "var(--si-text-muted)" }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search accounts…"
          className="h-7 rounded-md pl-8 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-[--si-primary] w-48"
          style={{
            border: "1px solid var(--si-card-border)",
            backgroundColor: "var(--si-card-bg)",
            color: "var(--si-text-primary)",
          }}
        />
      </div>
    </div>
  );
}
