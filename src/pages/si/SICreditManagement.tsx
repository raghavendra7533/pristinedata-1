import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useUserProfileStore } from "@/lib/si/userProfileStore";

// ─── Mock usage data ───────────────────────────────────────────────────────────

const MOCK_PLAN = {
  companyName: "Acme Corp",
  billingCycle: "monthly" as const,
  cycleStart: "2025-01-17",
  cycleEnd: "2025-02-16",
  daysLeft: 12,
};

const CREDIT_CATEGORIES = [
  {
    icon: "solar:buildings-2-bold-duotone",
    iconColor: "#6366F1",
    iconBg: "#EEF2FF",
    label: "Account Intelligence",
    creditsPerUnit: 2,
    breakdowns: [
      { label: "Full Account Profiles", count: 340, color: "#6366F1" },
      { label: "Buying Intent Scans", count: 110, color: "#8B5CF6" },
    ],
  },
  {
    icon: "solar:letter-bold-duotone",
    iconColor: "#0EA5E9",
    iconBg: "#E0F2FE",
    label: "Contact Email Enrichment",
    creditsPerUnit: 6,
    breakdowns: [
      { label: "Verified Emails", count: 285, color: "#0EA5E9" },
    ],
  },
  {
    icon: "solar:phone-bold-duotone",
    iconColor: "#10B981",
    iconBg: "#D1FAE5",
    label: "Contact Mobile Enrichment",
    creditsPerUnit: 12,
    breakdowns: [
      { label: "Mobile Numbers", count: 42, color: "#10B981" },
    ],
  },
  {
    icon: "solar:notebook-bold-duotone",
    iconColor: "#F59E0B",
    iconBg: "#FEF3C7",
    label: "Account Playbooks",
    creditsPerUnit: 10,
    breakdowns: [
      { label: "AI-Written Playbooks", count: 38, color: "#F59E0B" },
    ],
  },
  {
    icon: "solar:chat-round-like-bold-duotone",
    iconColor: "#EC4899",
    iconBg: "#FCE7F3",
    label: "Message Personalization",
    creditsPerUnit: 1,
    breakdowns: [
      { label: "Personalized Messages", count: 890, color: "#EC4899" },
    ],
  },
];

// Compute total credits for each category
const withTotals = CREDIT_CATEGORIES.map((cat) => ({
  ...cat,
  totalCredits: cat.breakdowns.reduce((sum, b) => sum + b.count * cat.creditsPerUnit, 0),
}));

// Daily usage for bar chart (last 15 days)
const DAILY = [
  48, 72, 120, 95, 140, 110, 165, 55, 130, 200, 45, 30, 88, 175, 210,
];

const PLAN_NAMES: Record<string, string> = {
  free: "Free",
  starter: "Starter",
  pro: "Pro",
};

// ─── Sub-components ────────────────────────────────────────────────────────────

function UsageBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(0,0,0,0.06)" }}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }}
      />
    </div>
  );
}

function CategoryCard({ cat }: { cat: typeof withTotals[0] }) {
  return (
    <div
      className="rounded-xl border p-4 flex flex-col gap-3"
      style={{
        backgroundColor: "var(--si-card-bg)",
        borderColor: "var(--si-card-border)",
        boxShadow: "var(--si-card-shadow)",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: cat.iconBg }}>
            <Icon icon={cat.icon} width={18} style={{ color: cat.iconColor }} />
          </div>
          <div>
            <div className="text-[13px] font-semibold" style={{ color: "var(--si-text-primary)" }}>
              {cat.label}
            </div>
            <div className="text-[11px]" style={{ color: "var(--si-text-muted)" }}>
              {cat.creditsPerUnit} credit{cat.creditsPerUnit > 1 ? "s" : ""} each
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold" style={{ color: "var(--si-text-primary)" }}>
            {cat.totalCredits.toLocaleString()}
          </div>
          <div className="text-[11px]" style={{ color: "var(--si-text-muted)" }}>credits used</div>
        </div>
      </div>

      {/* Breakdowns */}
      <div className="border-t pt-3 space-y-2" style={{ borderColor: "var(--si-card-border)" }}>
        {cat.breakdowns.map((b) => {
          const credits = b.count * cat.creditsPerUnit;
          return (
            <div key={b.label} className="flex items-center justify-between text-[12px]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: b.color }} />
                <span style={{ color: "var(--si-text-secondary)" }}>{b.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold" style={{ color: "var(--si-text-primary)" }}>
                  {b.count.toLocaleString()}
                </span>
                <span style={{ color: "var(--si-text-muted)" }}>
                  ({credits.toLocaleString()} cr)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

type Period = "daily" | "weekly" | "monthly";

export default function SICreditManagement({ embedded = false }: { embedded?: boolean }) {
  const navigate = useNavigate();
  const { credits } = useUserProfileStore();
  const [period, setPeriod] = useState<Period>("daily");

  const planName = PLAN_NAMES[credits.plan] ?? "Free";
  const totalCredits = credits.total;
  const usedCredits = credits.used;
  const remainingCredits = Math.max(totalCredits - usedCredits, 0);
  const usedPct = Math.min((usedCredits / totalCredits) * 100, 100);
  const isLow = usedPct >= 80;

  const maxBar = Math.max(...DAILY);

  const dayLabels = Array.from({ length: 15 }, (_, i) => {
    const d = new Date(2025, 5, 1 + i);
    return `Jun ${d.getDate()}`;
  });

  return (
    <div className={embedded ? "" : "min-h-screen"} style={embedded ? undefined : { backgroundColor: "var(--si-bg)", fontFamily: "var(--si-font)" }}>
      {/* ── Header band ── */}
      {!embedded && (
        <div
          className="px-6 py-5 border-b"
          style={{ backgroundColor: "var(--si-card-bg)", borderColor: "var(--si-card-border)" }}
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div>
              <div
                className="text-[10px] font-extrabold tracking-widest uppercase mb-1"
                style={{ color: "var(--si-primary)", letterSpacing: "var(--si-text-eyebrow-spacing)" }}
              >
                Credit Management
              </div>
              <h1 className="text-[22px] font-bold" style={{ color: "var(--si-text-primary)" }}>
                Usage & Subscription
              </h1>
              <p className="text-[13px] mt-0.5" style={{ color: "var(--si-text-secondary)" }}>
                Track credit consumption and manage your plan
              </p>
            </div>
            <button
              onClick={() => navigate("/si/pricing")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold text-white transition-all"
              style={{ backgroundColor: "var(--si-primary)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--si-primary-hover)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--si-primary)")}
            >
              <Icon icon="solar:crown-bold" width={15} />
              Upgrade Plan
            </button>
          </div>
        </div>
      )}

      <div className={embedded ? "space-y-6" : "max-w-6xl mx-auto px-6 py-6 space-y-6"}>
        {/* ── Plan summary card ── */}
        <div
          className="rounded-xl border p-5"
          style={{
            backgroundColor: "var(--si-card-bg)",
            borderColor: "var(--si-card-border)",
            boxShadow: "var(--si-card-shadow)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Company + plan */}
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--si-text-muted)" }}>
                Company
              </div>
              <div className="text-[15px] font-semibold" style={{ color: "var(--si-text-primary)" }}>
                {MOCK_PLAN.companyName}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[13px] font-semibold" style={{ color: "var(--si-text-primary)" }}>
                  {planName} Plan
                </span>
                <span
                  className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "rgba(99,102,241,0.1)", color: "#6366F1" }}
                >
                  <Icon icon="solar:crown-bold" width={10} />
                  Active
                </span>
              </div>
              <div className="text-[12px] mt-1" style={{ color: "var(--si-text-muted)" }}>
                Billing: <span style={{ color: "var(--si-text-secondary)", fontWeight: 500 }}>Monthly</span>
              </div>
            </div>

            {/* Credit balance */}
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--si-text-muted)" }}>
                Credit Balance
              </div>
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-[28px] font-bold" style={{ color: isLow ? "#EF4444" : "var(--si-text-primary)" }}>
                  {remainingCredits.toLocaleString()}
                </span>
                <span className="text-[12px]" style={{ color: "var(--si-text-muted)" }}>
                  / {totalCredits.toLocaleString()} remaining
                </span>
              </div>
              <UsageBar pct={usedPct} color={isLow ? "#EF4444" : "#6366F1"} />
              <div className="flex justify-between text-[11px] mt-1">
                <span style={{ color: "var(--si-text-muted)" }}>{usedCredits.toLocaleString()} used</span>
                <span style={{ color: "var(--si-text-muted)" }}>{Math.round(usedPct)}%</span>
              </div>
            </div>

            {/* Billing cycle */}
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest mb-1 flex items-center gap-1" style={{ color: "var(--si-text-muted)" }}>
                <Icon icon="solar:calendar-bold" width={11} />
                Billing Cycle
              </div>
              <div className="text-[22px] font-bold" style={{ color: "var(--si-text-primary)" }}>
                {MOCK_PLAN.daysLeft} days left
              </div>
              <div className="text-[12px] mt-0.5" style={{ color: "var(--si-text-muted)" }}>
                {MOCK_PLAN.cycleStart} → {MOCK_PLAN.cycleEnd}
              </div>
              <button
                onClick={() => navigate("/si/pricing")}
                className="mt-3 flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg border transition-all"
                style={{ borderColor: "#6366F1", color: "#6366F1" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(99,102,241,0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                }}
              >
                <Icon icon="solar:add-circle-bold" width={14} />
                Add Credits or Upgrade
              </button>
            </div>
          </div>
        </div>

        {/* ── Usage chart ── */}
        <div
          className="rounded-xl border p-5"
          style={{
            backgroundColor: "var(--si-card-bg)",
            borderColor: "var(--si-card-border)",
            boxShadow: "var(--si-card-shadow)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[13px] font-semibold" style={{ color: "var(--si-text-primary)" }}>
                Usage to Date
              </div>
              <div className="text-[26px] font-bold mt-0.5" style={{ color: "var(--si-text-primary)" }}>
                {usedCredits.toLocaleString()}
                <span className="text-[13px] font-normal ml-1.5" style={{ color: "var(--si-text-muted)" }}>
                  total credits used
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: "var(--si-bg)" }}>
              {(["daily", "weekly", "monthly"] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className="px-3 py-1.5 rounded-md text-[12px] font-semibold capitalize transition-all"
                  style={{
                    backgroundColor: period === p ? "#6366F1" : "transparent",
                    color: period === p ? "#fff" : "var(--si-text-muted)",
                  }}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Bar chart */}
          <div className="flex items-end gap-1.5 h-36">
            {DAILY.map((val, i) => {
              const heightPct = (val / maxBar) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end" style={{ height: "112px" }}>
                    <div
                      className="w-full rounded-t-sm transition-all duration-300"
                      style={{
                        height: `${heightPct}%`,
                        backgroundColor: "#6366F1",
                        opacity: 0.85,
                      }}
                    />
                  </div>
                  <span className="text-[9px] whitespace-nowrap" style={{ color: "var(--si-text-muted)" }}>
                    {dayLabels[i]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Category breakdown ── */}
        <div>
          <h2 className="text-[15px] font-semibold mb-3" style={{ color: "var(--si-text-primary)" }}>
            Breakdown by Feature
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {withTotals.map((cat) => (
              <CategoryCard key={cat.label} cat={cat} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
