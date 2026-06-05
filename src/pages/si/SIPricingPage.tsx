import React, { useState } from "react";
import { Icon } from "@iconify/react";

// ─── Types ────────────────────────────────────────────────────────────────────

type BillingCycle = "monthly" | "annual";

// ─── Credit usage data ────────────────────────────────────────────────────────

const CREDIT_USES = [
  {
    icon: "solar:buildings-2-bold-duotone",
    color: "#6366F1",
    bg: "#EEF2FF",
    action: "Account Intelligence",
    credits: 2,
    description: "Full company profile with signals, news, and buying intent",
  },
  {
    icon: "solar:letter-bold-duotone",
    color: "#0EA5E9",
    bg: "#E0F2FE",
    action: "Contact Email Enrichment",
    credits: 6,
    description: "Verified work email with confidence score",
  },
  {
    icon: "solar:phone-bold-duotone",
    color: "#10B981",
    bg: "#D1FAE5",
    action: "Contact Mobile Enrichment",
    credits: 12,
    description: "Direct mobile number, verified and formatted",
  },
  {
    icon: "solar:notebook-bold-duotone",
    color: "#F59E0B",
    bg: "#FEF3C7",
    action: "Account Playbook",
    credits: 10,
    description: "AI-written outreach strategy for the account",
  },
  {
    icon: "solar:chat-round-like-bold-duotone",
    color: "#EC4899",
    bg: "#FCE7F3",
    action: "Message Personalization",
    credits: 1,
    description: "Hyper-personalized message per prospect",
  },
];

const FREE_USES = [
  { icon: "solar:target-bold-duotone", label: "ICP Discovery" },
  { icon: "solar:heart-pulse-bold-duotone", label: "Contact Health Score" },
];

const CREDIT_PACKS = [
  { label: "Starter Pack", price: 13, credits: "1,000" },
  { label: "Growth Pack", price: 30, credits: "2,500" },
  { label: "Scale Pack", price: 60, credits: "5,000" },
  { label: "Enterprise Pack", price: 110, credits: "10,000" },
];

// ─── Plan definitions ─────────────────────────────────────────────────────────

interface Plan {
  id: "free" | "starter" | "pro";
  name: string;
  monthly: number;
  annual: number;
  credits: string;
  costPerCredit?: string;
  badge?: string;
  badgeColor?: string;
  iconBg: string;
  iconColor: string;
  icon: string;
  cta: string;
  ctaStyle: "ghost" | "dark" | "indigo";
  note: string;
  tagline: string;
  features: string[];
  gates: string[];
  rollover: boolean;
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    monthly: 0,
    annual: 0,
    credits: "50",
    iconBg: "#F3F4F6",
    iconColor: "#6B7280",
    icon: "solar:star-outline",
    cta: "Start for free",
    ctaStyle: "ghost",
    note: "No credit card needed",
    tagline: "Explore the platform at your own pace.",
    features: [
      "ICP Discovery",
      "Account + Contact Enrichment",
      "Contact Health Score",
      "Account Playbook",
      "Message Personalization",
    ],
    gates: ["Watchlist & Alerts", "Integrations", "Chrome Extension", "Credit Rollover"],
    rollover: false,
  },
  {
    id: "starter",
    name: "Starter",
    monthly: 19.99,
    annual: 15.99,
    credits: "1,500",
    costPerCredit: "~$0.013 / credit",
    iconBg: "#DBEAFE",
    iconColor: "#3B82F6",
    icon: "solar:rocket-bold",
    cta: "Start Starter",
    ctaStyle: "dark",
    note: "7-day free trial, no credit card needed",
    tagline: "Everything in Free, plus the tools that close deals.",
    features: [
      "Everything in Free",
      "Watchlist & Alerts",
      "Gmail, Outlook, Slack integrations",
      "CRM sync (HubSpot, Salesforce)",
      "Chrome Extension",
      "WhatsApp & Meeting tool integrations",
    ],
    gates: ["Credit Rollover"],
    rollover: false,
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 39.99,
    annual: 31.99,
    credits: "3,500",
    costPerCredit: "~$0.011 / credit",
    badge: "Most popular",
    badgeColor: "#6366F1",
    iconBg: "#EDE9FE",
    iconColor: "#6366F1",
    icon: "solar:crown-bold",
    cta: "Start Pro",
    ctaStyle: "indigo",
    note: "7-day free trial, no credit card needed",
    tagline: "Everything in Starter, plus credits that carry forward.",
    features: [
      "Everything in Starter",
      "3,500 credits / month",
      "Unused credits roll over month-to-month",
      "Priority support",
    ],
    gates: [],
    rollover: true,
  },
];

// ─── Plan icon ────────────────────────────────────────────────────────────────

function PlanIcon({ plan }: { plan: Plan }) {
  return (
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
      style={{ background: plan.iconBg }}
    >
      <Icon icon={plan.icon} width={22} style={{ color: plan.iconColor }} />
    </div>
  );
}

// ─── CTA button ───────────────────────────────────────────────────────────────

function CTAButton({ plan }: { plan: Plan }) {
  const base = "w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer";
  const styles = {
    ghost: `${base} border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50`,
    dark: `${base} bg-gray-900 text-white hover:bg-gray-800`,
    indigo: `${base} bg-[#6366F1] text-white hover:bg-indigo-700 shadow-md shadow-indigo-200`,
  };
  return <button className={styles[plan.ctaStyle]}>{plan.cta}</button>;
}

// ─── Plan card ────────────────────────────────────────────────────────────────

function PlanCard({ plan, billing }: { plan: Plan; billing: BillingCycle }) {
  const isPro = plan.id === "pro";
  const price = billing === "annual" ? plan.annual : plan.monthly;

  return (
    <div
      className={[
        "relative flex flex-col rounded-2xl p-6 bg-white",
        isPro
          ? "ring-2 ring-[#6366F1] shadow-xl shadow-indigo-100/60"
          : "ring-1 ring-gray-200 shadow-sm",
      ].join(" ")}
    >
      {isPro && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6366F1] px-3.5 py-1 text-xs font-semibold text-white">
            <Icon icon="solar:crown-bold" width={11} />
            Most popular
          </span>
        </div>
      )}

      <PlanIcon plan={plan} />

      <p className="text-base font-bold text-gray-900 mb-0.5">{plan.name}</p>

      {/* Price */}
      <div className="flex items-end gap-1 mt-1 mb-1">
        <span className="text-3xl font-extrabold tracking-tight text-gray-900">
          {price === 0 ? "Free" : `$${price.toFixed(2)}`}
        </span>
        {price > 0 && <span className="text-sm text-gray-400 pb-1">/mo</span>}
      </div>
      {billing === "annual" && price > 0 && (
        <p className="text-xs text-gray-400 mb-1">Billed annually</p>
      )}

      {/* Credits bar */}
      <div className="mt-3 mb-5 p-3 rounded-xl bg-gray-50 border border-gray-100">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-500">Monthly credits</span>
          <span className="text-xs font-bold text-gray-900">{plan.credits}</span>
        </div>
        <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: plan.id === "free" ? "2%" : plan.id === "starter" ? "43%" : "100%",
              background: plan.id === "pro" ? "#6366F1" : plan.id === "starter" ? "#3B82F6" : "#9CA3AF",
            }}
          />
        </div>
        {plan.costPerCredit && (
          <p className="text-xs text-gray-400 mt-1.5">{plan.costPerCredit}</p>
        )}
        {plan.rollover && (
          <p className="text-xs text-indigo-500 font-medium mt-1 flex items-center gap-1">
            <Icon icon="solar:refresh-circle-bold" width={12} />
            Unused credits roll over
          </p>
        )}
      </div>

      <CTAButton plan={plan} />
      <p className="text-center text-xs text-gray-400 mt-2 leading-relaxed">{plan.note}</p>

      <div className="mt-5 pt-5 border-t border-gray-100 flex-1">
        <p className="text-xs text-gray-500 mb-3 leading-relaxed">{plan.tagline}</p>
        <ul className="space-y-2">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
              <Icon
                icon="solar:check-circle-bold"
                className="text-emerald-500 mt-0.5 flex-shrink-0"
                width={16}
              />
              {f}
            </li>
          ))}
          {plan.gates.map((g) => (
            <li key={g} className="flex items-start gap-2 text-sm text-gray-400">
              <Icon
                icon="solar:minus-circle-bold"
                className="text-gray-300 mt-0.5 flex-shrink-0"
                width={16}
              />
              {g}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Credits explainer ────────────────────────────────────────────────────────

function CreditsSection() {
  const [packsOpen, setPacksOpen] = useState(false);

  return (
    <section className="mt-24">
      <div className="text-center mb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-2">Credits</p>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          What are{" "}
          <span className="relative inline-block">
            <span className="relative z-10">credits?</span>
            <span className="absolute bottom-1 left-0 right-0 h-2.5 bg-indigo-100 -z-10 rounded" />
          </span>
        </h2>
        <p className="mt-3 text-gray-500 max-w-md mx-auto">
          Credits are the currency of Pristine. You spend them when you enrich data or generate content — not for browsing or discovery.
        </p>
      </div>

      {/* Free actions */}
      <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-4 flex items-center gap-4 max-w-2xl mx-auto">
        <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <Icon icon="solar:star-shine-bold" className="text-emerald-600" width={18} />
        </div>
        <div>
          <p className="text-sm font-semibold text-emerald-800">Always free — no credits needed</p>
          <p className="text-xs text-emerald-600 mt-0.5">ICP Discovery and Contact Health Score are always free on every plan.</p>
        </div>
      </div>

      {/* Credit cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {CREDIT_USES.map((item) => (
          <div
            key={item.action}
            className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: item.bg }}
            >
              <Icon icon={item.icon} width={20} style={{ color: item.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-gray-900 leading-snug">{item.action}</p>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                  style={{ background: item.bg, color: item.color }}
                >
                  {item.credits} cr
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 mb-10">
        Extra credits: $13 per 1,000 &nbsp;·&nbsp; Credits never expire
      </p>

      {/* Need more credits — collapsible */}
      <div className="max-w-2xl mx-auto rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <button
          onClick={() => setPacksOpen((o) => !o)}
          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
        >
          <span className="font-semibold text-gray-800 text-sm">Need more credits?</span>
          <Icon
            icon={packsOpen ? "solar:alt-arrow-up-bold" : "solar:alt-arrow-down-bold"}
            className="text-gray-400"
            width={16}
          />
        </button>
        {packsOpen && (
          <div className="border-t border-gray-100 px-6 py-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
              {CREDIT_PACKS.map((pack) => (
                <div
                  key={pack.label}
                  className="rounded-xl border border-gray-200 p-4 text-center hover:border-indigo-300 hover:bg-indigo-50/40 transition-all cursor-pointer"
                >
                  <p className="text-xl font-extrabold text-gray-900">${pack.price}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{pack.credits} credits</p>
                  <p className="text-xs text-gray-400 mt-1">{pack.label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400">
              Extra credits are used only after your monthly plan credits run out.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "What happens when I run out of credits?",
    a: "You can continue browsing, running ICP Discovery, and viewing health scores — those are always free. You'll need to top up or upgrade to enrich contacts or generate playbooks.",
  },
  {
    q: "Can I roll over unused credits?",
    a: "Yes — on the Pro plan, unused credits carry forward month to month indefinitely. Free and Starter credits reset each billing cycle.",
  },
  {
    q: "Do I need a credit card to start?",
    a: "No. The Free plan requires no credit card. Starter and Pro both include a 7-day free trial — no card needed until you decide to continue.",
  },
  {
    q: "Can I switch plans anytime?",
    a: "Yes. Upgrade or downgrade at any time. When upgrading, you get immediate access. Downgrades take effect at the next billing cycle.",
  },
  {
    q: "What's included in the Chrome Extension?",
    a: "The Pristine Chrome Extension lets you enrich contacts and accounts directly from LinkedIn and other prospecting tools, without leaving your browser. Available on Starter and Pro.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="mt-20 max-w-2xl mx-auto">
      <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-8">Frequently asked questions</h2>
      <div className="space-y-2">
        {FAQS.map((faq, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span className="text-sm font-semibold text-gray-800">{faq.q}</span>
              <Icon
                icon={open === i ? "solar:alt-arrow-up-bold" : "solar:alt-arrow-down-bold"}
                className="text-gray-400 flex-shrink-0 ml-4"
                width={16}
              />
            </button>
            {open === i && (
              <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                <p className="pt-3">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SIPricingPage() {
  const [billing, setBilling] = useState<BillingCycle>("annual");

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-[Manrope,sans-serif]">
      <main className="max-w-5xl mx-auto px-6 pb-28 pt-10">
        {/* Hero */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-3">Pricing</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-gray-500">
            Start free. Upgrade when you need more.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <button
            onClick={() => setBilling("monthly")}
            className={`text-sm font-semibold transition-colors ${
              billing === "monthly" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Monthly
          </button>

          <button
            onClick={() => setBilling(b => (b === "monthly" ? "annual" : "monthly"))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              billing === "annual" ? "bg-[#6366F1]" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                billing === "annual" ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>

          <button
            onClick={() => setBilling("annual")}
            className={`text-sm font-semibold transition-colors ${
              billing === "annual" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Annual
          </button>

          <span className="ml-1 inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
            Save 20%
          </span>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} billing={billing} />
          ))}
        </div>

        {/* Credits section */}
        <CreditsSection />

        {/* FAQ */}
        <FAQ />

        {/* Bottom CTA */}
        <div className="mt-20 rounded-3xl bg-gradient-to-br from-[#6366F1] to-[#818CF8] p-10 text-center">
          <h2 className="text-2xl font-extrabold text-white mb-2">Questions? We're here to help.</h2>
          <p className="text-indigo-200 mb-6">Talk to us about the right plan for your team.</p>
          <button className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-900/20">
            Talk to sales
            <Icon icon="solar:arrow-right-bold" width={16} />
          </button>
        </div>
      </main>
    </div>
  );
}
