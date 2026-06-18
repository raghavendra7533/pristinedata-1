import { useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useUserProfileStore } from "@/lib/si/userProfileStore";

const MARKET_TRENDS = [
  {
    tag: "Hiring",
    text: "Increased hiring for RevOps roles in SaaS — past 30 days.",
  },
  {
    tag: "Funding",
    text: "Category-wide Series C+ funding up 22% quarter-over-quarter.",
  },
  {
    tag: "Tech Stack",
    text: "Shift toward consolidated GTM tooling among mid-market accounts.",
  },
];

const COMPETITOR_ACTIVITY = [
  {
    tag: "Pricing",
    text: "Competitor X launched a new pricing tier targeting mid-market teams.",
  },
  {
    tag: "Product",
    text: "Competitor Y shipped a native intent-data integration.",
  },
  {
    tag: "Funding",
    text: "Competitor Z raised a Series D to expand its partner ecosystem.",
  },
];

function IntelCard({ tag, text }: { tag: string; text: string }) {
  return (
    <div
      className="flex flex-col gap-1.5 rounded-lg px-3 py-2.5"
      style={{ border: "1px solid #6366F130", backgroundColor: "#6366F10a" }}
    >
      <span className="text-xs font-bold" style={{ color: "#6366F1" }}>
        {tag}
      </span>
      <p className="text-xs text-[--si-text-secondary] leading-relaxed">{text}</p>
    </div>
  );
}

export function AccountIntelligenceSection() {
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();
  const plan = useUserProfileStore((s) => s.credits.plan);
  const isPro = plan === "pro";

  return (
    <div className="rounded-[12px] border border-[--si-card-border] bg-[--si-card-bg] p-4">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex flex-col items-start gap-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[--si-text-primary]">Account Intelligence</h3>
            {!isPro && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                <Icon icon="solar:crown-line-linear" className="w-3 h-3" />
                Pro
              </span>
            )}
          </div>
          <p className="text-[11px] text-[--si-text-muted]">
            Account-level intelligence — visible to all users tracking this account
          </p>
        </div>
        <Icon
          icon={expanded ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"}
          className="w-4 h-4 text-[--si-text-secondary] flex-shrink-0"
        />
      </button>

      {expanded && !isPro && (
        <div className="mt-4 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/40 p-5 flex flex-col items-center text-center gap-2">
          <Icon icon="solar:lock-keyhole-minimalistic-linear" className="w-6 h-6 text-indigo-500" />
          <p className="text-sm font-semibold text-[--si-text-primary]">Market & competitor intelligence is a Pro feature</p>
          <p className="text-xs text-[--si-text-secondary] max-w-sm">
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
        <div className="flex flex-col gap-6 mt-4">
          <div>
            <h4 className="text-xs font-semibold text-[--si-text-secondary] uppercase tracking-wide mb-2">
              Market Trends
            </h4>
            <div className="flex flex-col gap-2.5">
              {MARKET_TRENDS.map((item, i) => (
                <IntelCard key={i} {...item} />
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[--si-text-secondary] uppercase tracking-wide mb-2">
              Competitor Activity
            </h4>
            <div className="flex flex-col gap-2.5">
              {COMPETITOR_ACTIVITY.map((item, i) => (
                <IntelCard key={i} {...item} />
              ))}
            </div>
          </div>

          <button
            onClick={() =>
              toast("Deep Dive report is generating... you'll be notified when it's ready.")
            }
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[--si-card-border] text-[--si-text-primary] bg-transparent px-4 py-2 text-sm font-medium hover:bg-[--si-card-bg] transition-colors self-start"
          >
            <Icon icon="solar:document-text-linear" className="w-4 h-4" />
            Deep Dive
          </button>
        </div>
      )}
    </div>
  );
}
