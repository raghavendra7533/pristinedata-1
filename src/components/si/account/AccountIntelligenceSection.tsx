import { useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useUserProfileStore } from "@/lib/si/userProfileStore";
import type { PlaybookData } from "@/lib/si/types";

const MARKET_TRENDS = [
  { tag: "Hiring", text: "Increased hiring for RevOps roles in SaaS — past 30 days." },
  { tag: "Funding", text: "Category-wide Series C+ funding up 22% quarter-over-quarter." },
  { tag: "Tech Stack", text: "Shift toward consolidated GTM tooling among mid-market accounts." },
];

const COMPETITOR_ACTIVITY = [
  { tag: "Pricing", text: "Competitor X launched a new pricing tier targeting mid-market teams." },
  { tag: "Product", text: "Competitor Y shipped a native intent-data integration." },
  { tag: "Funding", text: "Competitor Z raised a Series D to expand its partner ecosystem." },
];

const PRIORITY_COLOR: Record<string, string> = {
  High: "#10B981",
  Med: "#F59E0B",
  Low: "#94A3B8",
};

const LANDMINE_COLOR: Record<string, string> = {
  Contractual: "#EF4444",
  Timing: "#F59E0B",
  Technical: "#6366F1",
  Relationship: "#EC4899",
  Commercial: "#EF4444",
  Process: "#F59E0B",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-[10px] font-bold uppercase tracking-widest mb-2.5" style={{ color: "var(--si-text-muted)" }}>
      {children}
    </h4>
  );
}

interface Props {
  playbook?: PlaybookData;
}

export function AccountIntelligenceSection({ playbook }: Props) {
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();
  const plan = useUserProfileStore((s) => s.credits.plan);
  const isPro = plan === "pro";

  return (
    <div
      className="rounded-[14px] overflow-hidden"
      style={{ border: "1px solid var(--si-card-border)", backgroundColor: "var(--si-card-bg)" }}
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5"
        style={{ borderBottom: expanded ? "1px solid var(--si-card-border)" : "none" }}
      >
        <div className="flex items-center gap-2">
          <Icon icon="solar:telescope-linear" className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-semibold" style={{ color: "var(--si-text-primary)" }}>
            Account Intelligence
          </span>
          {!isPro && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
              <Icon icon="solar:crown-line-linear" className="w-3 h-3" />
              Pro
            </span>
          )}
        </div>
        <Icon
          icon={expanded ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"}
          className="w-4 h-4 flex-shrink-0"
          style={{ color: "var(--si-text-secondary)" }}
        />
      </button>

      {expanded && !isPro && (
        <div className="mx-5 my-4 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/40 p-5 flex flex-col items-center text-center gap-2">
          <Icon icon="solar:lock-keyhole-minimalistic-linear" className="w-6 h-6 text-indigo-500" />
          <p className="text-sm font-semibold" style={{ color: "var(--si-text-primary)" }}>
            Market &amp; competitor intelligence is a Pro feature
          </p>
          <p className="text-xs max-w-sm" style={{ color: "var(--si-text-secondary)" }}>
            Upgrade to Pro to unlock market trends, competitor activity, and customizable deep dives for every account you track.
          </p>
          <button
            onClick={() => navigate("/si/pricing")}
            className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-[--si-primary] text-white px-4 py-2 text-sm font-medium hover:bg-[--si-primary-hover] transition-colors"
          >
            Upgrade to Pro
          </button>
        </div>
      )}

      {expanded && isPro && (
        <div className="px-5 py-4 flex flex-col gap-6">

          {/* ── Playbook-sourced intel (account-level, non-contextual) ── */}
          {playbook && (
            <>
              {/* Thesis */}
              <div>
                <SectionLabel>Why This Account</SectionLabel>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--si-text-secondary)" }}>
                  {playbook.thesis}
                </p>
              </div>

              {/* Fit Hypotheses */}
              {playbook.fitHypotheses.length > 0 && (
                <div>
                  <SectionLabel>Fit Signals</SectionLabel>
                  <div className="flex flex-col gap-2">
                    {playbook.fitHypotheses.map((h, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span
                          className="mt-[3px] shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded"
                          style={{
                            backgroundColor: PRIORITY_COLOR[h.priority] + "18",
                            color: PRIORITY_COLOR[h.priority],
                          }}
                        >
                          {h.priority}
                        </span>
                        <p className="text-[13px] leading-snug" style={{ color: "var(--si-text-secondary)" }}>
                          {h.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Talking Points */}
              {playbook.talkingPoints.length > 0 && (
                <div>
                  <SectionLabel>Messaging Angles</SectionLabel>
                  <div className="flex flex-col gap-2">
                    {playbook.talkingPoints.map((tp, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <Icon icon="solar:chat-round-dots-linear" className="w-3.5 h-3.5 mt-[2px] shrink-0 text-indigo-400" />
                        <p className="text-[13px] leading-snug" style={{ color: "var(--si-text-secondary)" }}>
                          {tp.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Landmines */}
              {playbook.landmines.length > 0 && (
                <div>
                  <SectionLabel>Watch Out For</SectionLabel>
                  <div className="flex flex-col gap-2">
                    {playbook.landmines.map((lm, i) => {
                      const color = LANDMINE_COLOR[lm.category] ?? "#94A3B8";
                      return (
                        <div key={i} className="flex items-start gap-2.5">
                          <span
                            className="mt-[3px] shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: color + "18", color }}
                          >
                            {lm.category}
                          </span>
                          <p className="text-[13px] leading-snug" style={{ color: "var(--si-text-secondary)" }}>
                            {lm.text}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="border-t" style={{ borderColor: "var(--si-card-border)" }} />
            </>
          )}

          {/* ── Market / category intel (always shown for Pro) ── */}
          <div>
            <SectionLabel>Market Trends</SectionLabel>
            <div className="flex flex-col gap-2">
              {MARKET_TRENDS.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="mt-[3px] shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600">
                    {item.tag}
                  </span>
                  <p className="text-[13px] leading-snug" style={{ color: "var(--si-text-secondary)" }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel>Competitor Activity</SectionLabel>
            <div className="flex flex-col gap-2">
              {COMPETITOR_ACTIVITY.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="mt-[3px] shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-600">
                    {item.tag}
                  </span>
                  <p className="text-[13px] leading-snug" style={{ color: "var(--si-text-secondary)" }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => toast("Deep Dive report is generating... you'll be notified when it's ready.")}
            className="self-start inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
            style={{ borderColor: "var(--si-card-border)", color: "var(--si-text-primary)" }}
          >
            <Icon icon="solar:document-text-linear" className="w-4 h-4" />
            Deep Dive
          </button>
        </div>
      )}
    </div>
  );
}
