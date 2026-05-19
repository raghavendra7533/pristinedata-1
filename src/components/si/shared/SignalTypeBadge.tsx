import { SIGNAL_TYPES } from "@/lib/si/constants";
import type { SignalType } from "@/lib/si/types";

interface Props {
  type: SignalType;
  size?: "sm" | "md";
}

export function SignalTypeBadge({ type, size = "md" }: Props) {
  const config = SIGNAL_TYPES[type];
  return (
    <span
      className={`inline-flex items-center font-medium rounded-[6px] ${size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1"}`}
      style={{
        backgroundColor: config.color + "1a",
        color: config.color,
      }}
    >
      {config.label}
    </span>
  );
}
