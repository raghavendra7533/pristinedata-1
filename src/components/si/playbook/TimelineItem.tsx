import type { PlaybookData } from "@/lib/si/types";

interface TimelineItemProps {
  item: PlaybookData["timeline"][0];
  isLast: boolean;
}

const TYPE_STYLES: Record<"meeting" | "email" | "system", { bg: string; color: string }> = {
  meeting: { bg: "#E0E7FF", color: "#4F46E5" },
  email: { bg: "#DBEAFE", color: "#2563EB" },
  system: { bg: "#F3F4F6", color: "#6B7280" },
};

const TYPE_ICONS: Record<"meeting" | "email" | "system", string> = {
  meeting: "M",
  email: "E",
  system: "S",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function TimelineItem({ item, isLast }: TimelineItemProps) {
  const style = TYPE_STYLES[item.type];
  return (
    <div className="flex gap-3">
      {/* Icon + connector */}
      <div className="flex flex-col items-center">
        <div
          className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
          style={{ backgroundColor: style.bg, color: style.color }}
        >
          {TYPE_ICONS[item.type]}
        </div>
        {!isLast && <div className="w-px flex-1 mt-1" style={{ backgroundColor: "var(--si-card-border, #E5E7EB)" }} />}
      </div>

      {/* Content */}
      <div className={`pb-4 ${isLast ? "pb-0" : ""}`}>
        <p className="text-xs text-[--si-text-muted] mb-0.5">{formatDate(item.date)}</p>
        <p className="text-sm text-[--si-text-primary] leading-snug">{item.event}</p>
      </div>
    </div>
  );
}
