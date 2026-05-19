import { Icon } from "@iconify/react";

interface SummaryCardProps {
  label: string;
  value: string | number;
  delta?: number;
  deltaLabel?: string;
  icon: string;
  iconColor?: string;
}

export function SummaryCard({ label, value, delta, deltaLabel, icon, iconColor = "#6366F1" }: SummaryCardProps) {
  const positive = delta !== undefined ? delta >= 0 : true;

  return (
    <div
      className="rounded-lg border bg-white p-4 flex items-start justify-between"
      style={{ borderColor: "var(--si-card-border)", boxShadow: "var(--si-card-shadow)" }}
    >
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-2xl font-bold text-gray-900 leading-none">{value}</span>
          {delta !== undefined && (
            <span
              className="text-xs font-semibold"
              style={{ color: positive ? "#10B981" : "#EF4444" }}
            >
              {positive ? "▲" : "▼"}{Math.abs(delta)}
            </span>
          )}
        </div>
        {deltaLabel && (
          <span className="text-[11px] text-gray-400 mt-0.5">{deltaLabel}</span>
        )}
      </div>
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: iconColor + "18" }}
      >
        <Icon icon={icon} width={18} style={{ color: iconColor }} />
      </div>
    </div>
  );
}
