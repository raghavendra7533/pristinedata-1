import { useState } from "react";
import type { PlaybookData } from "@/lib/si/types";
import { NextActionChecklist } from "./NextActionChecklist";
import { TimelineItem } from "./TimelineItem";

interface PlaybookTabsProps {
  playbook: PlaybookData;
  accountName?: string;
  onToggleAction: (id: string) => void;
}

const TABS = ["Overview", "Discovery", "Talking Points", "Next Actions", "Timeline", "Recent News"] as const;
type Tab = (typeof TABS)[number];

interface NewsArticle {
  title: string;
  source: string;
  date: string;
  summary: string;
  url?: string;
}

const ACCOUNT_NEWS: Record<string, NewsArticle[]> = {
  Gong: [
    { title: "Gong raises $10M to expand its revenue intelligence platform", source: "TechCrunch", date: "May 14, 2026", summary: "Gong announced a new funding round aimed at deepening AI-powered call analytics and expanding into EMEA markets." },
    { title: "Gong opens 34 new GTM and engineering roles ahead of Celebrate 2026", source: "LinkedIn News", date: "May 15, 2026", summary: "The hiring surge signals aggressive headcount growth as Gong prepares for its annual customer conference in June." },
    { title: "Gong launches mid-market product tier to compete with Chorus and Salesloft", source: "The Information", date: "May 9, 2026", summary: "A new SKU priced below their enterprise offering targets teams of 10–50 reps, opening a segment previously left to competitors." },
  ],
  Lattice: [
    { title: "Lattice closes $50M Series D led by Andreessen Horowitz", source: "Crunchbase News", date: "May 16, 2026", summary: "The round values Lattice at $1.2B and will fund product expansion into compensation benchmarking and AI-driven performance reviews." },
    { title: "Lattice hires new VP of Sales Engineering from Snowflake", source: "LinkedIn", date: "May 14, 2026", summary: "Marcus Chen joins with a track record of modernizing pre-sales tech stacks — a signal the company is investing in its enterprise motion." },
    { title: "Lattice named a Leader in the 2026 Gartner Magic Quadrant for HCM", source: "Gartner", date: "May 2, 2026", summary: "The recognition strengthens Lattice's positioning against Workday and Culture Amp in the mid-market HR tech space." },
  ],
  Outreach: [
    { title: "Outreach reports heavy internal research on revenue intelligence tools", source: "Bombora", date: "May 14, 2026", summary: "Intent data shows Outreach's buying committee researching 14+ properties around conversation analytics over the past 7 days." },
    { title: "Outreach replaces Drift with Qualified for conversational sales", source: "BuiltWith", date: "May 7, 2026", summary: "The tech swap indicates an active vendor consolidation cycle and openness to evaluating adjacent tooling across their stack." },
    { title: "Outreach migrates data warehouse to Snowflake, completing a multi-quarter project", source: "Outreach Blog", date: "May 12, 2026", summary: "The migration opens a window for integrations roadmap conversations, especially around RevOps analytics tooling." },
  ],
  Qualified: [
    { title: "Qualified secures $95M growth equity to expand Pipeline Cloud", source: "Crunchbase", date: "May 8, 2026", summary: "The round confirms a multi-year investment horizon and signals budget availability for complementary sales tools." },
    { title: "Qualified hires new CRO from Salesforce to lead enterprise expansion", source: "LinkedIn", date: "May 13, 2026", summary: "New revenue leaders typically audit the full sales stack within 90 days — a prime window for outreach." },
  ],
  Clari: [
    { title: "Clari raises $225M Series F at $1.6B valuation", source: "TechCrunch", date: "May 17, 2026", summary: "The raise signals platform expansion and aggressive partner ecosystem investment over the next 18 months." },
    { title: "Clari posts 22 RevOps and data roles this week", source: "LinkedIn Jobs", date: "May 15, 2026", summary: "Heavy analytics infrastructure hiring is a strong indicator of tooling investment cycles opening across their revenue org." },
  ],
};

const DEFAULT_NEWS: NewsArticle[] = [
  { title: "Company announces expansion into new markets", source: "Business Wire", date: "May 10, 2026", summary: "Recent geographic expansion signals increased budget availability and potential for new vendor relationships." },
  { title: "Leadership team bolstered with two senior hires from Big Tech", source: "LinkedIn", date: "May 6, 2026", summary: "New executives typically audit the existing vendor stack within the first 90 days of joining." },
  { title: "Q1 2026 revenue up 40% YoY, company eyes IPO in 2027", source: "Reuters", date: "Apr 28, 2026", summary: "Strong growth trajectory suggests increasing willingness to invest in tooling that supports scale." },
];

const PRIORITY_STYLES: Record<"High" | "Med" | "Low", { bg: string; text: string }> = {
  High: { bg: "#E0E7FF", text: "#3730A3" },
  Med: { bg: "#FEF3C7", text: "#D97706" },
  Low: { bg: "#F3F4F6", text: "#6B7280" },
};

export function PlaybookTabs({ playbook, accountName, onToggleAction }: PlaybookTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const news = ACCOUNT_NEWS[accountName ?? ""] ?? DEFAULT_NEWS;

  return (
    <div>
      {/* Tab bar */}
      <div className="flex border-b border-[--si-card-border] mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm px-4 py-2 border-b-2 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === tab
                ? "border-[--si-primary] text-[--si-primary] font-semibold"
                : "border-transparent text-[--si-text-secondary] hover:text-[--si-text-primary]"
            }`}
          >
            {tab}
          </button>
        ))}
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

      {activeTab === "Discovery" && (
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
        <NextActionChecklist actions={playbook.nextActions} onToggle={onToggleAction} />
      )}

      {activeTab === "Timeline" && (
        <div className="flex flex-col">
          {playbook.timeline.map((item, i) => (
            <TimelineItem key={i} item={item} isLast={i === playbook.timeline.length - 1} />
          ))}
        </div>
      )}

      {activeTab === "Recent News" && (
        <div className="flex flex-col gap-3">
          {news.map((article, i) => (
            <div
              key={i}
              className="rounded-[12px] border border-[--si-card-border] bg-white p-4 flex flex-col gap-1.5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wide">
                  {article.source}
                </span>
                <span className="text-[11px] text-gray-400">· {article.date}</span>
              </div>
              <p className="text-[14px] font-semibold text-gray-900 leading-snug">
                {article.title}
              </p>
              <p className="text-[13px] text-gray-500 leading-snug">
                {article.summary}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
