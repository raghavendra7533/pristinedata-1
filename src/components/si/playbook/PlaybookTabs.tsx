import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import type { PlaybookData, PlaybookPlay, PlaybookVersion } from "@/lib/si/types";
import { NextActionChecklist } from "./NextActionChecklist";
import { TimelineItem } from "./TimelineItem";

interface PlaybookTabsProps {
  playbook: PlaybookData;
  accountName?: string;
  onToggleAction: (id: string) => void;
  hasMeetingNotes?: boolean;
  activeTabOverride?: Tab;
  versions?: PlaybookVersion[];
}

const TABS = ["Overview", "Strategy", "Call Prep", "Next Actions", "Timeline", "Versions"] as const;
type Tab = (typeof TABS)[number];

const PRIORITY_STYLES: Record<"High" | "Med" | "Low", { bg: string; text: string }> = {
  High: { bg: "#E0E7FF", text: "#3730A3" },
  Med: { bg: "#FEF3C7", text: "#D97706" },
  Low: { bg: "#F3F4F6", text: "#6B7280" },
};

const TIME_HORIZONS: PlaybookPlay["timeHorizon"][] = ["This week", "This month", "Before close"];

const HORIZON_ICONS: Record<PlaybookPlay["timeHorizon"], string> = {
  "This week": "solar:calendar-minimalistic-linear",
  "This month": "solar:calendar-linear",
  "Before close": "solar:flag-linear",
};

export function PlaybookTabs({ playbook, onToggleAction, hasMeetingNotes = false, activeTabOverride, versions }: PlaybookTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  useEffect(() => {
    if (activeTabOverride) setActiveTab(activeTabOverride);
  }, [activeTabOverride]);

  const groupedPlays = playbook.plays
    ? TIME_HORIZONS.reduce<Record<string, PlaybookPlay[]>>((acc, h) => {
        acc[h] = playbook.plays!.filter((p) => p.timeHorizon === h);
        return acc;
      }, {} as Record<string, PlaybookPlay[]>)
    : {};

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

      {/* Overview */}
      {activeTab === "Overview" && (
        <div className="flex flex-col gap-6">

          {/* Summary */}
          {playbook.summary && playbook.summary.length > 0 && (
            <div
              className="rounded-[14px] overflow-hidden"
              style={{ border: "1px solid var(--si-card-border)", backgroundColor: "var(--si-card-bg)" }}
            >
              <div
                className="px-5 py-3.5 flex items-center justify-between"
                style={{ borderBottom: "1px solid var(--si-card-border)" }}
              >
                <div className="flex items-center gap-2">
                  <Icon icon="solar:document-text-linear" className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-sm font-semibold text-[--si-text-primary]">Summary</h3>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                  1-min read
                </span>
              </div>
              <ul className="px-5 py-4 flex flex-col gap-3">
                {playbook.summary.map((point, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                    <p className="text-sm text-[--si-text-secondary] leading-relaxed">{point}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Success Criteria */}
          {playbook.successCriteria && playbook.successCriteria.length > 0 && (
            <div
              className="rounded-[14px] overflow-hidden"
              style={{ border: "1px solid var(--si-card-border)", backgroundColor: "var(--si-card-bg)" }}
            >
              <div
                className="px-5 py-3.5"
                style={{ borderBottom: "1px solid var(--si-card-border)" }}
              >
                <div className="flex items-center gap-2">
                  <Icon icon="solar:target-linear" className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-sm font-semibold text-[--si-text-primary]">Outcome / success criteria</h3>
                </div>
              </div>
              <ul className="px-5 py-4 flex flex-col gap-3">
                {playbook.successCriteria.map((criterion, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Icon icon="solar:check-circle-linear" className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[--si-text-secondary] leading-relaxed">{criterion}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Plays by time horizon */}
          {playbook.plays && playbook.plays.length > 0 && TIME_HORIZONS.map((horizon) => {
            const plays = groupedPlays[horizon];
            if (!plays || plays.length === 0) return null;
            return (
              <div key={horizon}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon icon={HORIZON_ICONS[horizon]} className="w-4 h-4 text-[--si-text-muted]" />
                    <h3 className="text-sm font-semibold text-[--si-text-primary]">{horizon}</h3>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[--si-card-bg] border border-[--si-card-border] text-[--si-text-muted]">
                    {plays.length} {plays.length === 1 ? "play" : "plays"}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {plays.map((play) => (
                    <div
                      key={play.id}
                      className="rounded-[12px] px-4 py-3.5 flex items-center justify-between gap-4"
                      style={{ border: "1px solid var(--si-card-border)", backgroundColor: "var(--si-card-bg)" }}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[--si-text-primary] leading-snug">{play.title}</p>
                        <p className="text-xs text-[--si-text-muted] mt-0.5 leading-snug">{play.subtitle}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                        {play.assignee && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                            {play.assignee}
                          </span>
                        )}
                        {play.actionLabels.map((label) => (
                          <span
                            key={label}
                            className="text-[11px] font-medium px-2.5 py-1 rounded-full border border-[--si-card-border] text-[--si-text-secondary] hover:text-[--si-primary] hover:border-[--si-primary] cursor-pointer transition-colors"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Fallback if no new-format content */}
          {!playbook.summary && !playbook.plays && (
            <div>
              <h3 className="text-xs font-semibold text-[--si-text-secondary] uppercase tracking-wide mb-2">
                Opportunity Thesis
              </h3>
              <p className="text-sm text-[--si-text-secondary] leading-relaxed">{playbook.thesis}</p>
            </div>
          )}
        </div>
      )}

      {/* Strategy */}
      {activeTab === "Strategy" && (
        <div className="flex flex-col gap-6">

          {/* Opportunity thesis */}
          <div
            className="rounded-[14px] overflow-hidden"
            style={{ border: "1px solid var(--si-card-border)", backgroundColor: "var(--si-card-bg)" }}
          >
            <div className="px-5 py-3.5 flex items-center gap-2" style={{ borderBottom: "1px solid var(--si-card-border)" }}>
              <Icon icon="solar:lightbulb-linear" className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-semibold text-[--si-text-primary]">Opportunity thesis</h3>
            </div>
            <div className="px-5 py-4 flex flex-col gap-3">
              {playbook.thesis.split("\n\n").map((paragraph, i) => (
                <p key={i} className="text-sm text-[--si-text-secondary] leading-relaxed">{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Deal objective */}
          {playbook.dealObjective && playbook.dealObjective.length > 0 && (
            <div
              className="rounded-[14px] overflow-hidden"
              style={{ border: "1px solid var(--si-card-border)", backgroundColor: "var(--si-card-bg)" }}
            >
              <div className="px-5 py-3.5 flex items-center gap-2" style={{ borderBottom: "1px solid var(--si-card-border)" }}>
                <Icon icon="solar:target-linear" className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-semibold text-[--si-text-primary]">Deal objective</h3>
              </div>
              <ul className="px-5 py-4 flex flex-col gap-3">
                {playbook.dealObjective.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                    <p className="text-sm text-[--si-text-secondary] leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Top value hypotheses */}
          <div
            className="rounded-[14px] overflow-hidden"
            style={{ border: "1px solid var(--si-card-border)", backgroundColor: "var(--si-card-bg)" }}
          >
            <div
              className="px-5 py-3.5 flex items-center justify-between"
              style={{ borderBottom: "1px solid var(--si-card-border)" }}
            >
              <div className="flex items-center gap-2">
                <Icon icon="solar:graph-up-linear" className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-semibold text-[--si-text-primary]">Top value hypotheses</h3>
              </div>
              {playbook.overallRisk && (
                <span className="flex items-center gap-1.5 text-xs text-[--si-text-muted]">
                  Overall risk:
                  <span
                    className="font-semibold"
                    style={{ color: playbook.overallRisk === "High" ? "#DC2626" : playbook.overallRisk === "Medium" ? "#D97706" : "#6B7280" }}
                  >
                    {playbook.overallRisk}
                  </span>
                </span>
              )}
            </div>
            <ul className="px-5 py-4 flex flex-col gap-3">
              {playbook.fitHypotheses.map((h, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span
                    className="mt-0.5 inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-[4px] flex-shrink-0"
                    style={{
                      backgroundColor: PRIORITY_STYLES[h.priority].bg,
                      color: PRIORITY_STYLES[h.priority].text,
                    }}
                  >
                    {h.priority}
                  </span>
                  <span className="text-sm text-[--si-text-secondary] leading-snug">{h.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Deal risks & landmines */}
          {playbook.dealRisks && playbook.dealRisks.length > 0 && (
            <div
              className="rounded-[14px] overflow-hidden"
              style={{ border: "1px solid var(--si-card-border)", backgroundColor: "var(--si-card-bg)" }}
            >
              <div
                className="px-5 py-3.5 flex items-center justify-between"
                style={{ borderBottom: "1px solid var(--si-card-border)" }}
              >
                <div className="flex items-center gap-2">
                  <Icon icon="solar:danger-triangle-linear" className="w-4 h-4 text-rose-500" />
                  <h3 className="text-sm font-semibold text-[--si-text-primary]">Deal risks &amp; landmines</h3>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[--si-card-border] text-[--si-text-muted]">
                  {playbook.dealRisks.length} tracked
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--si-card-border)" }}>
                      {["CATEGORY", "RISK", "IMPACT", "PROBABILITY", "OWNER", "MITIGATION"].map((col) => (
                        <th
                          key={col}
                          className="px-4 py-2.5 text-left font-semibold tracking-wide text-[--si-text-muted] whitespace-nowrap"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {playbook.dealRisks.map((risk, i) => (
                      <tr
                        key={i}
                        style={i < playbook.dealRisks!.length - 1 ? { borderBottom: "1px solid var(--si-card-border)" } : {}}
                      >
                        <td className="px-4 py-3.5 align-top">
                          <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-medium bg-[--si-card-border] text-[--si-text-secondary]">
                            {risk.category}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 align-top text-[--si-text-primary] leading-relaxed max-w-[220px]">
                          {risk.risk}
                        </td>
                        <td className="px-4 py-3.5 align-top whitespace-nowrap">
                          <span
                            className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold"
                            style={
                              risk.impact === "High"
                                ? { backgroundColor: "#DCFCE7", color: "#15803D" }
                                : risk.impact === "Medium"
                                ? { backgroundColor: "#FEF3C7", color: "#D97706" }
                                : { backgroundColor: "#F3F4F6", color: "#6B7280" }
                            }
                          >
                            {risk.impact}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 align-top whitespace-nowrap">
                          <span
                            className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold"
                            style={
                              risk.probability === "High"
                                ? { backgroundColor: "#DCFCE7", color: "#15803D" }
                                : risk.probability === "Medium"
                                ? { backgroundColor: "#FEF3C7", color: "#D97706" }
                                : { backgroundColor: "#F3F4F6", color: "#6B7280" }
                            }
                          >
                            {risk.probability}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 align-top text-[--si-text-secondary] whitespace-nowrap">
                          {risk.owner}
                        </td>
                        <td className="px-4 py-3.5 align-top text-[--si-text-secondary] leading-relaxed max-w-[240px]">
                          {risk.mitigation}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Fallback: show old landmines if no dealRisks */}
          {!playbook.dealRisks && playbook.landmines.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-[--si-text-secondary] uppercase tracking-wide mb-2">Landmines</h3>
              <ul className="flex flex-col gap-2">
                {playbook.landmines.map((l, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="inline-block mt-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-[4px] flex-shrink-0" style={{ backgroundColor: "#F3F4F6", color: "#6B7280" }}>
                      {l.category}
                    </span>
                    <span className="text-sm text-[--si-text-primary] leading-snug">{l.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}

      {/* Call Prep */}
      {activeTab === "Call Prep" && (
        <div className="flex gap-8 items-start">

          {/* Left: Discovery questions */}
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-[--si-text-primary] mb-4">Discovery questions</h2>
            {(() => {
              const grouped = playbook.discoveryQuestions.reduce<Record<string, typeof playbook.discoveryQuestions>>((acc, q) => {
                if (!acc[q.category]) acc[q.category] = [];
                acc[q.category].push(q);
                return acc;
              }, {});
              return Object.entries(grouped).map(([category, questions]) => (
                <div key={category} className="mb-5">
                  <p className="text-[10px] font-semibold tracking-widest text-[--si-text-muted] uppercase mb-2">
                    {category}
                  </p>
                  <ul className="flex flex-col gap-2">
                    {questions.map((q, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[--si-text-muted] flex-shrink-0" />
                        <p className="text-sm text-[--si-text-secondary] leading-relaxed">{q.text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ));
            })()}
          </div>

          {/* Right: Talking points + Objection handling */}
          <div className="w-[360px] flex-shrink-0 flex flex-col gap-6">

            {/* Talking points */}
            <div>
              <h2 className="text-sm font-semibold text-[--si-text-primary] mb-4">Talking points</h2>
              <ul className="flex flex-col gap-3">
                {playbook.talkingPoints.map((tp, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[--si-text-muted] flex-shrink-0" />
                    <p className="text-sm text-[--si-text-secondary] leading-relaxed">{tp.text}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Objection handling */}
            {playbook.objections && playbook.objections.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-[--si-text-primary] mb-4">Objection handling</h2>
                <div className="flex flex-col gap-4">
                  {playbook.objections.map((obj, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <span
                        className="self-start px-3 py-1 rounded-full text-[11px] font-semibold border"
                        style={{ borderColor: "#D97706", color: "#D97706", backgroundColor: "transparent" }}
                      >
                        {obj.tag}
                      </span>
                      <p className="text-sm text-[--si-text-secondary] leading-relaxed">{obj.text}</p>
                      {obj.documentLabel && (
                        <div className="flex items-center gap-1.5 text-xs text-[--si-text-muted]">
                          <Icon icon="solar:document-linear" className="w-3.5 h-3.5" />
                          <span>{obj.documentLabel}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Next Actions */}
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

      {/* Timeline */}
      {activeTab === "Timeline" && (
        <div className="flex flex-col">
          {playbook.timeline.map((item, i) => (
            <TimelineItem key={i} item={item} isLast={i === playbook.timeline.length - 1} />
          ))}
        </div>
      )}

      {/* Versions */}
      {activeTab === "Versions" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-[--si-text-muted]">
              Each time you regenerate the playbook, a new version is saved here.
            </p>
          </div>
          {(versions ?? playbook.versions ?? []).length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <Icon icon="solar:layers-minimalistic-linear" className="w-8 h-8 text-[--si-text-muted]" />
              <p className="text-sm text-[--si-text-secondary]">No versions yet. Generate the playbook to create one.</p>
            </div>
          ) : (
            <div
              className="rounded-[14px] overflow-hidden"
              style={{ border: "1px solid var(--si-card-border)", backgroundColor: "var(--si-card-bg)" }}
            >
              {(versions ?? playbook.versions ?? []).slice().reverse().map((v, i, arr) => {
                const isCurrent = v.version === playbook.version || i === 0;
                return (
                  <div
                    key={v.version}
                    className="px-5 py-3.5 flex items-center justify-between gap-4"
                    style={i < arr.length - 1 ? { borderBottom: "1px solid var(--si-card-border)" } : {}}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <Icon icon="solar:layers-minimalistic-linear" className="w-4 h-4 text-[--si-text-muted]" />
                        <span className="text-sm font-semibold text-[--si-text-primary]">v{v.version}</span>
                      </div>
                      {isCurrent && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                          Current
                        </span>
                      )}
                      {v.sourceMeeting && (
                        <span className="flex items-center gap-1 text-xs text-[--si-text-muted]">
                          <Icon icon="solar:calendar-linear" className="w-3 h-3" />
                          {v.sourceMeeting}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[--si-text-muted] flex-shrink-0">
                      {new Date(v.generatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
