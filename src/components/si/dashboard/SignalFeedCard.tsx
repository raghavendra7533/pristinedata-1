import { Icon } from "@iconify/react";
import type { SignalEvent } from "@/lib/si/types";
import { SignalTypeBadge } from "@/components/si/shared/SignalTypeBadge";

interface SignalFeedCardProps {
  signal: SignalEvent;
  accountName: string;
  accountDomain: string;
  onViewPlaybook: () => void;
  onAddToWatchlist?: () => void;
  isWatched?: boolean;
}

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// Color hash for account avatars
const AVATAR_COLORS = ["#6366F1","#8B5CF6","#EC4899","#F59E0B","#10B981","#3B82F6","#EF4444","#14B8A6"];
function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[h];
}

export function SignalFeedCard({
  signal,
  accountName,
  accountDomain,
  onViewPlaybook,
  onAddToWatchlist,
  isWatched = false,
}: SignalFeedCardProps) {
  const initial = accountName.charAt(0).toUpperCase();
  const bgColor = avatarColor(accountName);

  return (
    <div
      className="rounded-lg border bg-white px-4 py-3.5 flex items-center gap-4 hover:shadow-sm transition-shadow"
      style={{ borderColor: "var(--si-card-border)" }}
    >
      {/* Avatar */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold"
        style={{ backgroundColor: bgColor }}
      >
        {initial}
      </div>

      {/* Account + signal info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-900">{accountName}</span>
          <span className="text-xs text-gray-400">{accountDomain}</span>
          <SignalTypeBadge type={signal.type} size="sm" />
          <span className="text-xs text-gray-400 ml-auto flex-shrink-0">{timeAgo(signal.detectedAt)}</span>
        </div>
        <p className="text-sm text-gray-500 mt-1 line-clamp-1">{signal.summary}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {!isWatched && onAddToWatchlist && (
          <button
            onClick={onAddToWatchlist}
            className="text-xs font-medium text-gray-500 hover:text-gray-800 border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
          >
            <Icon icon="solar:bookmark-linear" width={13} />
            Watch
          </button>
        )}
        <button
          onClick={onViewPlaybook}
          className="text-xs font-semibold text-white rounded-md px-3 py-1.5 transition-colors flex items-center gap-1.5"
          style={{ backgroundColor: "var(--si-primary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--si-primary-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--si-primary)")}
        >
          View Playbook
          <Icon icon="solar:arrow-right-linear" width={12} />
        </button>
      </div>
    </div>
  );
}
