import { Icon } from "@iconify/react";
import { SIGNAL_OPTIONS } from "@/lib/si/constants";
import type { SignalType } from "@/lib/si/types";

interface WatchlistFilterBarProps {
  activeSignalFilter: string;
  onSignalFilterChange: (filter: string) => void;
  activeTimeRange: "24h" | "7d" | "30d";
  onTimeRangeChange: (range: "24h" | "7d" | "30d") => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const SIGNAL_CHIPS: Array<{ key: string; label: string }> = [
  { key: "all", label: "All" },
  ...SIGNAL_OPTIONS.map((s) => ({ key: s.key as SignalType, label: s.label })),
];

const TIME_RANGES: Array<{ key: "24h" | "7d" | "30d"; label: string }> = [
  { key: "24h", label: "24h" },
  { key: "7d", label: "7d" },
  { key: "30d", label: "30d" },
];

export function WatchlistFilterBar({
  activeSignalFilter,
  onSignalFilterChange,
  activeTimeRange,
  onTimeRangeChange,
  searchQuery,
  onSearchChange,
}: WatchlistFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 py-4">
      {/* Signal type chips */}
      <div className="flex flex-wrap items-center gap-2">
        {SIGNAL_CHIPS.map((chip) => (
          <button
            key={chip.key}
            onClick={() => onSignalFilterChange(chip.key)}
            className={
              activeSignalFilter === chip.key
                ? "bg-[--si-primary] text-white rounded-full px-3 py-1 text-sm font-medium transition-colors"
                : "border border-[--si-card-border] rounded-full px-3 py-1 text-sm text-[--si-text-secondary] hover:bg-gray-50 transition-colors"
            }
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Time range selector */}
      <div className="flex items-center rounded-full border border-[--si-card-border] overflow-hidden">
        {TIME_RANGES.map((range) => (
          <button
            key={range.key}
            onClick={() => onTimeRangeChange(range.key)}
            className={
              activeTimeRange === range.key
                ? "bg-[--si-primary] text-white px-3 py-1 text-sm font-medium transition-colors"
                : "px-3 py-1 text-sm text-[--si-text-secondary] hover:bg-gray-50 transition-colors"
            }
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Search input */}
      <div className="relative ml-auto">
        <Icon
          icon="solar:magnifier-linear"
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[--si-text-muted] w-4 h-4"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search accounts…"
          className="border border-[--si-card-border] rounded-lg pl-8 pr-3 py-1.5 text-sm text-[--si-text-primary] placeholder:text-[--si-text-muted] focus:outline-none focus:ring-1 focus:ring-[--si-primary] w-52"
        />
      </div>
    </div>
  );
}
