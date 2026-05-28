import { Icon } from "@iconify/react";

const MOCK_TRENDS = [
  {
    id: "1",
    category: "Industry Signal",
    headline: "SaaS consolidation accelerating in mid-market",
    summary: "M&A activity in your target segment is up 34% QoQ. Three of your tracked accounts have been acquired in the last 60 days.",
    detectedAt: "2026-05-25T10:00:00Z",
    impact: "high" as const,
    icon: "solar:graph-up-linear",
  },
  {
    id: "2",
    category: "Competitor Move",
    headline: "Outreach.io raised Series E — $200M at $4B valuation",
    summary: "Expect increased pricing pressure and product velocity. Watch for displacement deals in accounts currently evaluating outreach platforms.",
    detectedAt: "2026-05-24T14:00:00Z",
    impact: "high" as const,
    icon: "solar:dollar-minimalistic-linear",
  },
  {
    id: "3",
    category: "Buying Trend",
    headline: "AI SDR tools seeing 3x evaluation velocity",
    summary: "Decision cycles for AI-assisted outreach are compressing from 90 days to 30 days. Buyers are moving faster.",
    detectedAt: "2026-05-23T09:00:00Z",
    impact: "medium" as const,
    icon: "solar:bolt-linear",
  },
  {
    id: "4",
    category: "Regulation",
    headline: "EU AI Act enforcement begins Q3 2026",
    summary: "Compliance requirements will affect AI-generated outreach in EU markets. 12 of your watched accounts are EU-headquartered.",
    detectedAt: "2026-05-22T08:00:00Z",
    impact: "medium" as const,
    icon: "solar:shield-warning-linear",
  },
  {
    id: "5",
    category: "Talent Signal",
    headline: "VP Sales hiring surge in Series B SaaS",
    summary: "New sales leadership typically triggers re-evaluation of existing tooling within 90 days. 5 accounts in your pipeline have posted VP Sales roles.",
    detectedAt: "2026-05-21T11:00:00Z",
    impact: "low" as const,
    icon: "solar:user-plus-rounded-linear",
  },
];

const IMPACT_CONFIG = {
  high: { label: "High Impact", color: "text-red-600 bg-red-50 border-red-200" },
  medium: { label: "Medium Impact", color: "text-amber-600 bg-amber-50 border-amber-200" },
  low: { label: "Low Impact", color: "text-blue-600 bg-blue-50 border-blue-200" },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

export default function SIMarketIntelligence() {
  return (
    <div data-theme="si" className="p-6 flex flex-col gap-6">
      {/* Header */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
          Market Intelligence
        </p>
        <h1 className="text-2xl font-bold text-gray-900">What's happening in your market</h1>
        <p className="text-sm text-gray-400 mt-1">
          Signals and trends affecting your ICP, competitive landscape, and pipeline.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Active Signals", value: "5", icon: "solar:radar-linear", color: "text-indigo-600" },
          { label: "High Impact", value: "2", icon: "solar:danger-triangle-linear", color: "text-red-500" },
          { label: "Accounts Affected", value: "17", icon: "solar:buildings-2-linear", color: "text-amber-500" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[--si-card-border] bg-[--si-card-bg] p-4 flex items-center gap-3"
          >
            <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
              <Icon icon={stat.icon} className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Signal feed */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Latest signals</p>
        {MOCK_TRENDS.map((trend) => {
          const impact = IMPACT_CONFIG[trend.impact];
          return (
            <div
              key={trend.id}
              className="rounded-xl border border-[--si-card-border] bg-[--si-card-bg] p-4 flex gap-4 hover:border-[--si-primary]/30 transition-colors cursor-pointer"
            >
              <div className="p-2.5 rounded-lg bg-gray-50 text-gray-500 self-start flex-shrink-0">
                <Icon icon={trend.icon} className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                    {trend.category}
                  </span>
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold border ${impact.color}`}
                  >
                    {impact.label}
                  </span>
                  <span className="ml-auto text-[11px] text-gray-400 flex-shrink-0">{timeAgo(trend.detectedAt)}</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1">{trend.headline}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{trend.summary}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
