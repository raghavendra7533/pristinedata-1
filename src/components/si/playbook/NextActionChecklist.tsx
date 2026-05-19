import type { PlaybookData } from "@/lib/si/types";

interface NextActionChecklistProps {
  actions: PlaybookData["nextActions"];
  onToggle: (id: string) => void;
}

function getDueLabel(due: string): { label: string; bg: string; text: string } | null {
  const dueDate = new Date(due);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  const diffDays = Math.round((dueDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return { label: "Today", bg: "#FEE2E2", text: "#DC2626" };
  if (diffDays === 1) return { label: "Tomorrow", bg: "#FEF3C7", text: "#D97706" };
  if (diffDays <= 7) return { label: "This week", bg: "#D1FAE5", text: "#065F46" };
  return { label: `In ${diffDays}d`, bg: "#F3F4F6", text: "#6B7280" };
}

export function NextActionChecklist({ actions, onToggle }: NextActionChecklistProps) {
  return (
    <div className="flex flex-col gap-3">
      {actions.map((action) => {
        const dueInfo = getDueLabel(action.due);
        return (
          <div key={action.id} className="flex items-start gap-3">
            {/* Checkbox */}
            <button
              onClick={() => onToggle(action.id)}
              className={`flex-shrink-0 mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                action.done
                  ? "bg-[--si-primary] border-[--si-primary]"
                  : "bg-transparent border-[--si-card-border] hover:border-[--si-primary]"
              }`}
              aria-label={action.done ? "Mark undone" : "Mark done"}
            >
              {action.done && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>

            {/* Text + due */}
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm leading-snug ${
                  action.done ? "line-through text-[--si-text-muted]" : "text-[--si-text-primary]"
                }`}
              >
                {action.text}
              </p>
              {dueInfo && (
                <span
                  className="inline-block mt-1 text-[10px] font-medium px-1.5 py-0.5 rounded-[4px]"
                  style={{ backgroundColor: dueInfo.bg, color: dueInfo.text }}
                >
                  {dueInfo.label}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
