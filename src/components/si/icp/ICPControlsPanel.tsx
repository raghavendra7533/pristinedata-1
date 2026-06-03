import { useState } from "react";
import { Icon } from "@iconify/react";
import type { ICPConfig } from "@/lib/si/types";
import { INDUSTRIES, GEOGRAPHIES } from "@/lib/si/constants";
import { useUserProfileStore } from "@/lib/si/userProfileStore";

export interface ICPControlsPanelProps {
  initialIcp: ICPConfig;
  onUpdate: (icp: ICPConfig) => void;
}

function ChipSelector({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const toggle = (opt: string) => {
    onChange(
      selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]
    );
  };
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium border transition-colors ${
              active
                ? "bg-[--si-primary] text-white border-[--si-primary]"
                : "bg-transparent text-[--si-text-secondary] border-[--si-card-border] hover:border-[--si-primary] hover:text-[--si-primary]"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export default function ICPControlsPanel({ initialIcp, onUpdate }: ICPControlsPanelProps) {
  const [local, setLocal] = useState<ICPConfig>({ ...initialIcp });
  const profile = useUserProfileStore((s) => s.profile);

  const handleSubmit = () => {
    onUpdate(local);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* ICP detected status */}
      {profile?.icp && (
        <div className="flex items-start gap-2 rounded-xl border border-[#D1FAE5] bg-[#ECFDF5] px-4 py-3">
          <Icon icon="solar:check-circle-bold" className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-[#065F46]">ICP detected from your website</p>
            <p className="text-xs text-[#047857] mt-0.5">Edit the filters below to refine your target profile.</p>
          </div>
        </div>
      )}

      {/* Heading */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-[--si-text-primary]">Account Filters</h2>
          <p className="text-[11px] text-[--si-text-muted] mt-0.5">Filter by company attributes</p>
        </div>
        <span className="rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-0.5">
          78% Match
        </span>
      </div>

      {/* Industries */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-[--si-text-secondary] uppercase tracking-wide">
          Target Industries
        </label>
        <ChipSelector
          options={INDUSTRIES}
          selected={local.industries}
          onChange={(v) => setLocal((p) => ({ ...p, industries: v }))}
        />
      </div>

      {/* Company size */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-[--si-text-secondary] uppercase tracking-wide">
          Company Size (Employees)
        </label>
        <div className="flex gap-2">
          <div className="flex-1 flex flex-col gap-1">
            <span className="text-xs text-[--si-text-muted]">Min</span>
            <input
              type="number"
              min={0}
              value={local.employeeMin}
              onChange={(e) => setLocal((p) => ({ ...p, employeeMin: Number(e.target.value) }))}
              placeholder="0"
              className="w-full rounded-lg border border-[--si-card-border] bg-transparent px-3 py-1.5 text-sm text-[--si-text-primary] focus:outline-none focus:border-[--si-primary]"
            />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <span className="text-xs text-[--si-text-muted]">Max</span>
            <input
              type="number"
              min={0}
              value={local.employeeMax}
              onChange={(e) => setLocal((p) => ({ ...p, employeeMax: Number(e.target.value) }))}
              placeholder="10000"
              className="w-full rounded-lg border border-[--si-card-border] bg-transparent px-3 py-1.5 text-sm text-[--si-text-primary] focus:outline-none focus:border-[--si-primary]"
            />
          </div>
        </div>
      </div>

      {/* Revenue range */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-[--si-text-secondary] uppercase tracking-wide">
          Revenue Range ($M)
        </label>
        <div className="flex gap-2">
          <div className="flex-1 flex flex-col gap-1">
            <span className="text-xs text-[--si-text-muted]">Min ($M)</span>
            <input
              type="number"
              min={0}
              value={local.revenueMin}
              onChange={(e) => setLocal((p) => ({ ...p, revenueMin: Number(e.target.value) }))}
              placeholder="0"
              className="w-full rounded-lg border border-[--si-card-border] bg-transparent px-3 py-1.5 text-sm text-[--si-text-primary] focus:outline-none focus:border-[--si-primary]"
            />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <span className="text-xs text-[--si-text-muted]">Max ($M)</span>
            <input
              type="number"
              min={0}
              value={local.revenueMax}
              onChange={(e) => setLocal((p) => ({ ...p, revenueMax: Number(e.target.value) }))}
              placeholder="500"
              className="w-full rounded-lg border border-[--si-card-border] bg-transparent px-3 py-1.5 text-sm text-[--si-text-primary] focus:outline-none focus:border-[--si-primary]"
            />
          </div>
        </div>
      </div>

      {/* Geographies */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-[--si-text-secondary] uppercase tracking-wide">
          Geographies
        </label>
        <ChipSelector
          options={GEOGRAPHIES}
          selected={local.geographies}
          onChange={(v) => setLocal((p) => ({ ...p, geographies: v }))}
        />
      </div>

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        className="w-full rounded-full bg-[--si-primary] text-white px-4 py-2 text-sm font-medium hover:bg-[--si-primary-hover] transition-colors mt-2"
      >
        Update ICP
      </button>
    </div>
  );
}
