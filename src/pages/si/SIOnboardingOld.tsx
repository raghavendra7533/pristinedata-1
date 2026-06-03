import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useUserProfileStore } from "@/lib/si/userProfileStore";

// ─── Types ────────────────────────────────────────────────────────────────────

type WizardStep = 3 | 4 | 5 | 6 | "loading" | "confirmation" | "finalLoading";

type RoleOption =
  | "Account Executive"
  | "SDR / BDR"
  | "Sales Leader"
  | "Founder / CEO"
  | "RevOps / Sales Ops"
  | "Other";

type PlanId = "free" | "basic" | "pro";

interface ICPState {
  industry: string;
  companySize: string;
  geography: string[];
  jobTitles: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRoleCategory(role: string): "sdr" | "ae" {
  const lower = role.toLowerCase();
  if (
    lower.includes("sdr") ||
    lower.includes("bdr") ||
    lower.includes("business development") ||
    lower.includes("development rep") ||
    lower.includes("outbound")
  ) {
    return "sdr";
  }
  return "ae";
}

function getDefaultTitlesForRole(role: RoleOption): string[] {
  switch (role) {
    case "Account Executive":
    case "Sales Leader":
      return ["VP of Sales", "Head of Revenue", "CRO", "Sales Director"];
    case "SDR / BDR":
      return ["VP of Sales", "Sales Manager", "Head of Growth"];
    case "Founder / CEO":
      return ["CEO", "Co-Founder", "VP of Engineering", "CTO"];
    case "RevOps / Sales Ops":
      return ["VP of Sales", "Head of RevOps", "Sales Operations Manager"];
    default:
      return ["VP of Sales", "Head of Sales"];
  }
}

// ─── Step 3 — Role Selection ───────────────────────────────────────────────

const ROLE_OPTIONS: { label: RoleOption; icon: string }[] = [
  { label: "Account Executive", icon: "solar:user-bold" },
  { label: "SDR / BDR", icon: "solar:phone-calling-bold" },
  { label: "Sales Leader", icon: "solar:chart-2-bold" },
  { label: "Founder / CEO", icon: "solar:star-bold" },
  { label: "RevOps / Sales Ops", icon: "solar:settings-bold" },
  { label: "Other", icon: "solar:users-group-two-rounded-bold" },
];

function StepRoleSelection({
  selected,
  onSelect,
  onContinue,
}: {
  selected: RoleOption | null;
  onSelect: (role: RoleOption) => void;
  onContinue: () => void;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans px-4 py-12">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-10">
        {[3, 4, 5].map((n) => (
          <div
            key={n}
            className={`h-1.5 rounded-full transition-all ${
              n === 3 ? "w-8 bg-[#6366F1]" : "w-4 bg-[#E5E7EB]"
            }`}
          />
        ))}
      </div>

      <div className="max-w-lg w-full flex flex-col gap-8">
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl font-semibold text-[#0F0F0F]">
            What best describes your role?
          </h2>
          <p className="text-sm text-[#6B7280]">
            We'll personalise your setup based on how you sell.
          </p>
        </div>

        {/* 2×3 grid */}
        <div className="grid grid-cols-2 gap-3">
          {ROLE_OPTIONS.map(({ label, icon }) => {
            const isSelected = selected === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => onSelect(label)}
                className={`flex items-center gap-3 rounded-xl border px-4 py-4 text-left transition-all ${
                  isSelected
                    ? "border-[#6366F1] bg-[#EEF2FF]"
                    : "border-[#E5E7EB] bg-white hover:border-[#A5B4FC] hover:bg-[#F5F6FF]"
                }`}
              >
                <span
                  className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
                    isSelected ? "bg-[#6366F1]" : "bg-[#F3F4F6]"
                  }`}
                >
                  <Icon
                    icon={icon}
                    className={`w-5 h-5 ${isSelected ? "text-white" : "text-[#6B7280]"}`}
                  />
                </span>
                <span
                  className={`text-sm font-medium leading-snug ${
                    isSelected ? "text-[#4338CA]" : "text-[#374151]"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={!selected}
          onClick={onContinue}
          className="rounded-full bg-[#6366F1] text-white px-6 py-3 text-sm font-semibold hover:bg-[#4F46E5] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// ─── Step 4 — Plan Selection ───────────────────────────────────────────────

interface PlanDef {
  id: PlanId;
  name: string;
  price: string;
  priceNote?: string;
  badge?: string;
  features: string[];
  cta: string;
  showNoCCNote: boolean;
}

const PLANS: PlanDef[] = [
  {
    id: "free",
    name: "Free",
    price: "$0/month",
    features: [
      "1 Watchlist (up to 10 accounts)",
      "5 Opportunity Playbooks",
      "Signal feed (last 7 days)",
      "Community support",
    ],
    cta: "Start free",
    showNoCCNote: false,
  },
  {
    id: "basic",
    name: "Basic",
    price: "$29/month",
    priceNote: "billed monthly",
    badge: "Most popular",
    features: [
      "3 Watchlists (up to 50 accounts each)",
      "50 Opportunity Playbooks",
      "Signal feed (real-time)",
      "Email support",
      "500 enrichment credits/month",
    ],
    cta: "Start Basic",
    showNoCCNote: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$79/month",
    priceNote: "billed monthly",
    features: [
      "Unlimited Watchlists",
      "Unlimited Playbooks",
      "Signal feed (real-time + priority signals)",
      "CRM integration (HubSpot, Salesforce)",
      "2,000 enrichment credits/month",
      "Priority support",
    ],
    cta: "Start Pro",
    showNoCCNote: true,
  },
];

function StepPlanSelection({
  selected,
  onSelect,
  onContinue,
}: {
  selected: PlanId | null;
  onSelect: (plan: PlanId) => void;
  onContinue: (plan: PlanId) => void;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans px-4 py-12">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-10">
        {[3, 4, 5].map((n) => (
          <div
            key={n}
            className={`h-1.5 rounded-full transition-all ${
              n === 4 ? "w-8 bg-[#6366F1]" : "w-4 bg-[#E5E7EB]"
            }`}
          />
        ))}
      </div>

      <div className="max-w-3xl w-full flex flex-col gap-8">
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl font-semibold text-[#0F0F0F]">
            Choose your plan
          </h2>
          <p className="text-sm text-[#6B7280]">
            Start free, upgrade anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map((plan) => {
            const isSelected = selected === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => onSelect(plan.id)}
                className={`relative flex flex-col rounded-2xl border-2 p-6 cursor-pointer transition-all ${
                  isSelected
                    ? "border-[#6366F1] bg-[#EEF2FF]"
                    : "border-[#E5E7EB] bg-white hover:border-[#A5B4FC]"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#6366F1] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {plan.badge}
                  </span>
                )}

                <div className="mb-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF] mb-1">
                    {plan.name}
                  </p>
                  <p className="text-2xl font-bold text-[#0F0F0F]">
                    {plan.price}
                  </p>
                  {plan.priceNote && (
                    <p className="text-xs text-[#9CA3AF]">{plan.priceNote}</p>
                  )}
                </div>

                <ul className="flex flex-col gap-2 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[#374151]">
                      <Icon
                        icon="solar:check-circle-bold"
                        className="w-4 h-4 text-[#6366F1] flex-shrink-0 mt-0.5"
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(plan.id);
                      onContinue(plan.id);
                    }}
                    className="rounded-full bg-[#6366F1] text-white px-4 py-2.5 text-sm font-semibold hover:bg-[#4F46E5] transition-colors"
                  >
                    {plan.cta}
                  </button>
                  {plan.showNoCCNote && (
                    <p className="text-xs text-center text-[#9CA3AF]">
                      No credit card required during beta.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Step 5 — ICP Defaults ────────────────────────────────────────────────

const INDUSTRY_OPTIONS = [
  "Software / SaaS",
  "Financial Services",
  "Healthcare",
  "Manufacturing",
  "Professional Services",
  "Other",
];

const COMPANY_SIZE_OPTIONS = [
  "1–10",
  "11–50",
  "51–200",
  "201–500",
  "501–1,000",
  "1,000+",
];

const GEO_OPTIONS = [
  "United States",
  "Canada",
  "United Kingdom",
  "Europe",
  "APAC",
  "Global",
];

function StepICPDefaults({
  icp,
  onChange,
  onContinue,
}: {
  icp: ICPState;
  onChange: (next: ICPState) => void;
  onContinue: () => void;
}) {
  const [addingTitle, setAddingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const addInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (addingTitle) addInputRef.current?.focus();
  }, [addingTitle]);

  function toggleGeo(geo: string) {
    const next = icp.geography.includes(geo)
      ? icp.geography.filter((g) => g !== geo)
      : [...icp.geography, geo];
    onChange({ ...icp, geography: next });
  }

  function removeTitle(title: string) {
    onChange({ ...icp, jobTitles: icp.jobTitles.filter((t) => t !== title) });
  }

  function commitNewTitle() {
    const t = newTitle.trim();
    if (t && !icp.jobTitles.includes(t)) {
      onChange({ ...icp, jobTitles: [...icp.jobTitles, t] });
    }
    setNewTitle("");
    setAddingTitle(false);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans px-4 py-12">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-10">
        {[3, 4, 5].map((n) => (
          <div
            key={n}
            className={`h-1.5 rounded-full transition-all ${
              n === 5 ? "w-8 bg-[#6366F1]" : "w-4 bg-[#E5E7EB]"
            }`}
          />
        ))}
      </div>

      <div className="max-w-lg w-full flex flex-col gap-8">
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl font-semibold text-[#0F0F0F]">
            Here's what we know about your ideal customer.
          </h2>
          <p className="text-sm text-[#6B7280]">
            We pre-filled this from your company's website. Adjust anything that's off.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {/* Industry */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#374151]">Industry</label>
            <select
              value={icp.industry}
              onChange={(e) => onChange({ ...icp, industry: e.target.value })}
              className="border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#111827] w-full focus:outline-none focus:border-[#6366F1] transition-colors bg-white"
            >
              {INDUSTRY_OPTIONS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>

          {/* Company size */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#374151]">Company size</label>
            <select
              value={icp.companySize}
              onChange={(e) => onChange({ ...icp, companySize: e.target.value })}
              className="border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#111827] w-full focus:outline-none focus:border-[#6366F1] transition-colors bg-white"
            >
              {COMPANY_SIZE_OPTIONS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>

          {/* Geography */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#374151]">Geography</label>
            <div className="flex flex-wrap gap-2">
              {GEO_OPTIONS.map((geo) => {
                const active = icp.geography.includes(geo);
                return (
                  <button
                    key={geo}
                    type="button"
                    onClick={() => toggleGeo(geo)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      active
                        ? "bg-[#EEF2FF] border-[#6366F1] text-[#4338CA]"
                        : "bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#A5B4FC]"
                    }`}
                  >
                    {geo}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Job titles */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#374151]">Job titles to target</label>
            <div className="flex flex-wrap gap-2 items-center">
              {icp.jobTitles.map((title) => (
                <span
                  key={title}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#EEF2FF] border border-[#6366F1] text-[#4338CA]"
                >
                  {title}
                  <button
                    type="button"
                    onClick={() => removeTitle(title)}
                    aria-label={`Remove ${title}`}
                    className="text-[#6366F1] hover:text-[#4338CA] transition-colors"
                  >
                    <Icon icon="solar:close-circle-bold" className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}

              {addingTitle ? (
                <span className="flex items-center gap-1">
                  <input
                    ref={addInputRef}
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitNewTitle();
                      if (e.key === "Escape") { setAddingTitle(false); setNewTitle(""); }
                    }}
                    onBlur={commitNewTitle}
                    placeholder="e.g. Head of Demand Gen"
                    className="border border-[#6366F1] rounded-full px-3 py-1.5 text-xs text-[#111827] focus:outline-none w-44 placeholder:text-[#9CA3AF]"
                  />
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setAddingTitle(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-dashed border-[#D1D5DB] text-xs text-[#6B7280] hover:border-[#6366F1] hover:text-[#6366F1] transition-colors"
                >
                  <Icon icon="solar:add-circle-linear" className="w-3.5 h-3.5" />
                  Add title
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onContinue}
            className="rounded-full bg-[#6366F1] text-white px-6 py-3 text-sm font-semibold hover:bg-[#4F46E5] transition-colors"
          >
            Continue
          </button>
          <p className="text-xs text-center text-[#9CA3AF]">
            You can update your ICP anytime from Settings.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Skip Setup Link ──────────────────────────────────────────────────────────

function SkipSetupLink({ onSkip }: { onSkip: () => void }) {
  return (
    <button
      type="button"
      onClick={onSkip}
      className="text-xs text-[#9CA3AF] hover:text-[#6B7280] underline-offset-2 hover:underline transition-colors"
    >
      Skip setup
    </button>
  );
}

// ─── Step 6 — Watchlist Population ───────────────────────────────────────────

type WatchlistMethod = "recommendations" | "upload" | "crm";

function StepWatchlist({
  selectedPlan,
  onComplete,
  onSkip,
}: {
  selectedPlan: PlanId | null;
  onComplete: () => void;
  onSkip: () => void;
}) {
  const [showUpload, setShowUpload] = useState(false);
  const [showCrmModal, setShowCrmModal] = useState(false);
  const [_chosen, setChosen] = useState<WatchlistMethod | null>(null);

  function choose(method: WatchlistMethod) {
    setChosen(method);
    if (method === "upload") {
      setShowUpload(true);
    } else if (method === "crm") {
      setShowCrmModal(true);
    } else {
      onComplete();
    }
  }

  const isFreePlan = selectedPlan === "free" || selectedPlan === "basic" || selectedPlan === null;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans px-4 py-12">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-10">
        {[3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className={`h-1.5 rounded-full transition-all ${
              n === 6 ? "w-8 bg-[#6366F1]" : "w-4 bg-[#E5E7EB]"
            }`}
          />
        ))}
      </div>

      <div className="max-w-lg w-full flex flex-col gap-8">
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl font-semibold text-[#0F0F0F]">
            How do you want to start your Watchlist?
          </h2>
          <p className="text-sm text-[#6B7280]">
            We'll track signals and intent for these accounts automatically.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {/* Card 1 — Recommendations */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 flex flex-col gap-4 hover:border-[#A5B4FC] transition-colors">
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center">
                <Icon icon="solar:magic-stick-3-bold" className="w-5 h-5 text-[#6366F1]" />
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-[#111827]">Use Pristine's recommendations</p>
                  <span className="text-[10px] font-semibold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-2 py-0.5 rounded-full">
                    Fastest setup — 30 seconds
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  We've already identified <span className="font-semibold text-[#374151]">12 accounts</span> that match your ICP. We'll start tracking them now.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => choose("recommendations")}
              className="rounded-full bg-[#6366F1] text-white px-4 py-2.5 text-sm font-semibold hover:bg-[#4F46E5] transition-colors self-start"
            >
              Start with recommendations
            </button>
          </div>

          {/* Card 2 — Upload */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 flex flex-col gap-4 hover:border-[#A5B4FC] transition-colors">
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center">
                <Icon icon="solar:upload-bold" className="w-5 h-5 text-[#6B7280]" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#111827] mb-1">Upload my account list</p>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  Have a CSV or Excel file? Upload your list of target accounts and we'll start tracking them.
                </p>
              </div>
            </div>
            {showUpload ? (
              <div className="rounded-xl border-2 border-dashed border-[#D1D5DB] bg-[#F9FAFB] p-6 flex flex-col items-center gap-3 text-center">
                <Icon icon="solar:document-bold" className="w-8 h-8 text-[#9CA3AF]" />
                <p className="text-sm text-[#374151] font-medium">Drop your file here</p>
                <p className="text-xs text-[#9CA3AF]">Accepts .csv and .xlsx</p>
                <label className="rounded-full border border-[#D1D5DB] bg-white text-[#374151] px-4 py-2 text-xs font-medium cursor-pointer hover:bg-[#F3F4F6] transition-colors">
                  Browse file
                  <input type="file" accept=".csv,.xlsx" className="hidden" onChange={() => onComplete()} />
                </label>
                <button
                  type="button"
                  onClick={onComplete}
                  className="text-xs text-[#6366F1] hover:underline"
                >
                  Continue anyway →
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => choose("upload")}
                className="rounded-full border border-[#D1D5DB] text-[#374151] bg-white px-4 py-2.5 text-sm font-semibold hover:bg-[#F3F4F6] hover:border-[#A5B4FC] transition-colors self-start"
              >
                Upload a file
              </button>
            )}
          </div>

          {/* Card 3 — CRM */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 flex flex-col gap-4 hover:border-[#A5B4FC] transition-colors">
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center">
                <Icon icon="solar:plug-circle-bold" className="w-5 h-5 text-[#6B7280]" />
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-[#111827]">Connect my CRM</p>
                  {isFreePlan && (
                    <span className="text-[10px] font-semibold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] px-2 py-0.5 rounded-full">
                      Pro plan only
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  Link HubSpot or Salesforce and we'll pull your book of business automatically. We'll even create separate watchlists per rep.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => choose("crm")}
              className="rounded-full border border-[#D1D5DB] text-[#374151] bg-white px-4 py-2.5 text-sm font-semibold hover:bg-[#F3F4F6] hover:border-[#A5B4FC] transition-colors self-start"
            >
              Connect CRM
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <SkipSetupLink onSkip={onSkip} />
        </div>
      </div>

      {/* CRM stub modal */}
      {showCrmModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full flex flex-col items-center gap-4 text-center shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] flex items-center justify-center">
              <Icon icon="solar:plug-circle-bold" className="w-6 h-6 text-[#6366F1]" />
            </div>
            <p className="text-base font-semibold text-[#0F0F0F]">CRM integration coming up</p>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              CRM integration setup will complete after your account is created.
            </p>
            <button
              type="button"
              onClick={() => { setShowCrmModal(false); onComplete(); }}
              className="rounded-full bg-[#6366F1] text-white px-6 py-2.5 text-sm font-semibold hover:bg-[#4F46E5] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Final Loading Screen ─────────────────────────────────────────────────────

const FINAL_MESSAGES = [
  "Building your Watchlist...",
  "Setting up your signal feed...",
  "Your workspace is ready.",
];

function FinalLoadingScreen({ onDone }: { onDone: () => void }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setMsgIndex(1), 800));
    timers.push(setTimeout(() => setMsgIndex(2), 1700));
    timers.push(setTimeout(() => setShowButton(true), 2500));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-[#0D0D1A] flex flex-col items-center justify-center font-sans px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#1E1B4B] flex items-center justify-center">
          {showButton ? (
            <Icon icon="solar:check-circle-bold" className="w-8 h-8 text-[#6366F1]" />
          ) : (
            <Icon icon="solar:magic-stick-3-bold" className="w-8 h-8 text-[#6366F1] animate-pulse" />
          )}
        </div>

        <div className="space-y-2">
          {FINAL_MESSAGES.map((msg, i) => (
            <p
              key={msg}
              className={`text-base font-medium transition-all duration-500 ${
                i === msgIndex
                  ? "text-white opacity-100"
                  : i < msgIndex
                  ? "text-[#4B5563] opacity-60"
                  : "opacity-0"
              }`}
            >
              {msg}
            </p>
          ))}
        </div>

        {showButton && (
          <button
            type="button"
            onClick={onDone}
            className="mt-4 rounded-full bg-[#6366F1] text-white px-8 py-3 text-sm font-semibold hover:bg-[#4F46E5] transition-colors animate-in fade-in duration-500"
          >
            Go to your dashboard
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────

export default function SIOnboarding() {
  const navigate = useNavigate();
  const profile = useUserProfileStore((s) => s.profile);
  const setProfile = useUserProfileStore((s) => s.setProfile);

  const [step, setStep] = useState<WizardStep>(3);
  const [selectedRole, setSelectedRole] = useState<RoleOption | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [icp, setIcp] = useState<ICPState>({
    industry: "Software / SaaS",
    companySize: "51–200",
    geography: ["United States"],
    jobTitles: getDefaultTitlesForRole("Account Executive"),
  });

  const firstName = profile?.name?.split(" ")[0] ?? "";
  const roleTitle = profile?.role ?? "";

  // Update ICP job titles when role is selected
  function handleRoleSelect(role: RoleOption) {
    setSelectedRole(role);
    setIcp((prev) => ({ ...prev, jobTitles: getDefaultTitlesForRole(role) }));
  }

  function skipToFinalLoading() {
    setStep("finalLoading");
  }

  // ── Loading screen (after step 5) ───────────────────────────────────────
  useEffect(() => {
    if (step !== "loading") return;
    const timer = setTimeout(() => setStep("confirmation"), 2200);
    return () => clearTimeout(timer);
  }, [step]);

  if (step === "loading") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] flex items-center justify-center">
            <Icon
              icon="solar:settings-bold"
              className="w-7 h-7 text-[#6366F1] animate-spin"
            />
          </div>
          <p className="text-base font-semibold text-[#0F0F0F]">
            Setting up your workspace...
          </p>
          <p className="text-sm text-[#6B7280]">
            Analysing your website and building your ICP
          </p>
        </div>
      </div>
    );
  }

  if (step === "confirmation") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans px-4">
        <div className="max-w-md w-full flex flex-col items-center gap-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#ECFDF5] flex items-center justify-center">
            <Icon
              icon="solar:check-circle-bold"
              className="w-8 h-8 text-[#10B981]"
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-[#0F0F0F]">
              You're all set{firstName ? `, ${firstName}` : ""}
            </h2>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              {getRoleCategory(roleTitle) === "sdr"
                ? "Your ICP has been generated from your website. Let's find your first batch of target accounts."
                : "Your ICP has been generated from your website. Review and edit it anytime in settings."}
            </p>
          </div>
          <button
            onClick={() => {
              setProfile({ onboardingCompleted: true });
              navigate(getRoleCategory(roleTitle) === "sdr" ? "/si/icp" : "/si/watchlist");
            }}
            className="w-full rounded-full bg-[#6366F1] text-white px-6 py-3 text-sm font-medium hover:bg-[#4F46E5] transition-colors"
          >
            {getRoleCategory(roleTitle) === "sdr"
              ? "Discover your target accounts"
              : "Start building your watchlist"}
          </button>
        </div>
      </div>
    );
  }

  if (step === "finalLoading") {
    return (
      <FinalLoadingScreen
        onDone={() => {
          setProfile({ onboardingCompleted: true });
          navigate("/si/dashboard");
        }}
      />
    );
  }

  if (step === 3) {
    return (
      <div className="relative">
        <StepRoleSelection
          selected={selectedRole}
          onSelect={handleRoleSelect}
          onContinue={() => setStep(4)}
        />
        <div className="fixed bottom-6 left-0 right-0 flex justify-center">
          <SkipSetupLink onSkip={skipToFinalLoading} />
        </div>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="relative">
        <StepPlanSelection
          selected={selectedPlan}
          onSelect={setSelectedPlan}
          onContinue={(plan) => {
            setSelectedPlan(plan);
            setStep(5);
          }}
        />
        <div className="fixed bottom-6 left-0 right-0 flex justify-center">
          <SkipSetupLink onSkip={skipToFinalLoading} />
        </div>
      </div>
    );
  }

  if (step === 5) {
    return (
      <div className="relative">
        <StepICPDefaults
          icp={icp}
          onChange={setIcp}
          onContinue={() => setStep(6)}
        />
        <div className="fixed bottom-6 left-0 right-0 flex justify-center">
          <SkipSetupLink onSkip={skipToFinalLoading} />
        </div>
      </div>
    );
  }

  return (
    <StepWatchlist
      selectedPlan={selectedPlan}
      onComplete={() => setStep("finalLoading")}
      onSkip={skipToFinalLoading}
    />
  );
}
