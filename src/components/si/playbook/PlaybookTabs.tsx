import { useState, useEffect } from "react";
import type { PlaybookData } from "@/lib/si/types";
import { NextActionChecklist } from "./NextActionChecklist";
import { TimelineItem } from "./TimelineItem";

interface PlaybookTabsProps {
  playbook: PlaybookData;
  accountName?: string;
  onToggleAction: (id: string) => void;
  hasMeetingNotes?: boolean;
  activeTabOverride?: Tab;
}

const TABS = ["Overview", "Discovery Questions", "Talking Points", "Next Actions", "Timeline"] as const;
type Tab = (typeof TABS)[number];

const PRIORITY_STYLES: Record<"High" | "Med" | "Low", { bg: string; text: string }> = {
  High: { bg: "#E0E7FF", text: "#3730A3" },
  Med: { bg: "#FEF3C7", text: "#D97706" },
  Low: { bg: "#F3F4F6", text: "#6B7280" },
};

export function PlaybookTabs({ playbook, onToggleAction, hasMeetingNotes = false, activeTabOverride }: PlaybookTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  useEffect(() => {
    if (activeTabOverride) setActiveTab(activeTabOverride);
  }, [activeTabOverride]);

  return (
    <div>
      {/* Tab bar */}
      <div className="flex border-b border-[--si-card-border] mb-6 overflow-x-auto">
        {TABS.map((tab) => {
          const isLocked = tab === "Next Actions" && !hasMeetingNotes;
          return (
            <button
              key={tab}
              onClick={() => !isLocked && setActiveTab(tab)}
              title={isLocked ? "Next actions are generated after your first meeting. Upload notes to unlock this." : undefined}
              className={`text-sm px-4 py-2 border-b-2 whitespace-nowrap transition-colors ${
                isLocked
                  ? "border-transparent text-[--si-text-secondary] opacity-40 cursor-not-allowed"
                  : activeTab === tab
                  ? "border-[--si-primary] text-[--si-primary] font-semibold cursor-pointer"
                  : "border-transparent text-[--si-text-secondary] hover:text-[--si-text-primary] cursor-pointer"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "Overview" && (
        <div className="flex flex-col gap-6">
          {/* Thesis */}
          <div>
            <h3 className="text-xs font-semibold text-[--si-text-secondary] uppercase tracking-wide mb-2">
              Opportunity Thesis
            </h3>
            <p className="text-sm text-[--si-text-secondary] leading-relaxed">{playbook.thesis}</p>
          </div>

          {/* Fit Hypotheses */}
          <div>
            <h3 className="text-xs font-semibold text-[--si-text-secondary] uppercase tracking-wide mb-2">
              Fit Hypotheses
            </h3>
            <ul className="flex flex-col gap-2">
              {playbook.fitHypotheses.map((h, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span
                    className="inline-block mt-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-[4px] flex-shrink-0"
                    style={{
                      backgroundColor: PRIORITY_STYLES[h.priority].bg,
                      color: PRIORITY_STYLES[h.priority].text,
                    }}
                  >
                    {h.priority}
                  </span>
                  <span className="text-sm text-[--si-text-primary] leading-snug">{h.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Landmines */}
          <div>
            <h3 className="text-xs font-semibold text-[--si-text-secondary] uppercase tracking-wide mb-2">
              Landmines
            </h3>
            <ul className="flex flex-col gap-2">
              {playbook.landmines.map((l, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span
                    className="inline-block mt-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-[4px] flex-shrink-0"
                    style={{ backgroundColor: "#F3F4F6", color: "#6B7280" }}
                  >
                    {l.category}
                  </span>
                  <span className="text-sm text-[--si-text-primary] leading-snug">{l.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === "Discovery Questions" && (
        <div className="flex flex-col gap-3">
          {playbook.discoveryQuestions.map((q, i) => (
            <div
              key={i}
              className="rounded-[12px] border border-[--si-card-border] bg-[--si-card-bg] p-4 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "#E0E7FF", color: "#3730A3" }}
                >
                  {q.actionLabel}
                </span>
                <span
                  className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "#F3F4F6", color: "#6B7280" }}
                >
                  {q.category}
                </span>
              </div>
              <p className="text-sm text-[--si-text-primary] leading-snug">{q.text}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Talking Points" && (
        <ol className="flex flex-col gap-3 list-none">
          {playbook.talkingPoints.map((tp, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[--si-primary] text-white text-xs font-semibold flex items-center justify-center">
                {i + 1}
              </span>
              <p className="text-sm text-[--si-text-primary] leading-snug pt-0.5">{tp.text}</p>
            </li>
          ))}
        </ol>
      )}

      {activeTab === "Next Actions" && (
        hasMeetingNotes ? (
          <NextActionChecklist actions={playbook.nextActions} onToggle={onToggleAction} />
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <div className="w-10 h-10 rounded-full bg-[--si-card-border] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--si-text-secondary)" }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <p className="text-sm font-medium text-[--si-text-primary]">Next actions are generated after your first meeting.</p>
            <p className="text-xs text-[--si-text-secondary]">Upload meeting notes to unlock this tab.</p>
          </div>
        )
      )}

      {activeTab === "Timeline" && (
        <div className="flex flex-col">
          {playbook.timeline.map((item, i) => (
            <TimelineItem key={i} item={item} isLast={i === playbook.timeline.length - 1} />
          ))}
        </div>
      )}

    </div>
  );
}
