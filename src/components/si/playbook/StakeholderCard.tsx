import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import type { Stakeholder } from "@/lib/si/types";

interface StakeholderCardProps {
  stakeholder: Stakeholder;
}

const ROLE_STYLES: Record<Stakeholder["role"], { bg: string; text: string }> = {
  Champion: { bg: "#D1FAE5", text: "#065F46" },
  Influencer: { bg: "#DBEAFE", text: "#1E40AF" },
  "Economic Buyer": { bg: "#E0E7FF", text: "#3730A3" },
  Blocker: { bg: "#FEE2E2", text: "#991B1B" },
  Ops: { bg: "#F3F4F6", text: "#374151" },
};

const SENTIMENT_COLORS: Record<Stakeholder["sentiment"], string> = {
  positive: "#10B981",
  neutral: "#9CA3AF",
  negative: "#EF4444",
  unknown: "#D1D5DB",
};

export function StakeholderCard({ stakeholder }: StakeholderCardProps) {
  const navigate = useNavigate();
  const { name, title, role, sentiment, lastActiveDaysAgo } = stakeholder;
  const roleStyle = ROLE_STYLES[role];
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-3 py-2">
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-semibold text-white"
        style={{ backgroundColor: "#6366F1" }}
      >
        {initial}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-sm font-medium text-[--si-text-primary] truncate">{name}</span>
          {/* Sentiment dot */}
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: SENTIMENT_COLORS[sentiment] }}
            title={`Sentiment: ${sentiment}`}
          />
        </div>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          <span className="text-xs text-[--si-text-muted] truncate">{title}</span>
          <span
            className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-[4px]"
            style={{ backgroundColor: roleStyle.bg, color: roleStyle.text }}
          >
            {role}
          </span>
        </div>
        <p className="text-[10px] text-[--si-text-muted] mt-0.5">
          last active {lastActiveDaysAgo === 0 ? "today" : `${lastActiveDaysAgo}d ago`}
        </p>
        <button
          onClick={() => navigate(`/si/playbook/person/${stakeholder.id}`)}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-700 mt-1 transition-colors"
        >
          Generate Opp Playbook
          <Icon icon="solar:arrow-right-linear" className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
