interface Props {
  score: number;
  label: "Hot" | "Warm" | "Cold";
}

const INTENT_COLORS = {
  Hot: { bg: "#FEF3C7", text: "#D97706", dot: "#F59E0B" },
  Warm: { bg: "#EFF6FF", text: "#2563EB", dot: "#3B82F6" },
  Cold: { bg: "#F3F4F6", text: "#6B7280", dot: "#9CA3AF" },
};

export function IntentScoreBadge({ score, label }: Props) {
  const colors = INTENT_COLORS[label];
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.dot }} />
      {label} · {score}
    </span>
  );
}
