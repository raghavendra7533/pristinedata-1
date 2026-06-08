import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useUserProfileStore } from "@/lib/si/userProfileStore";
import type { ICPConfig } from "@/lib/si/types";
import logoLight from "@/assets/Pristine Data AI Logo.svg";

// ─── Role category helper ────────────────────────────────────────────────────

function getRoleCategory(role: string): "sdr" | "ae" | "founder" {
  const lower = role.toLowerCase();
  if (lower.includes("sdr") || lower.includes("bdr") || lower.includes("high-volume") || lower.includes("outbound")) {
    return "sdr";
  }
  if (lower.includes("founder") || lower.includes("0 to 1") || lower.includes("0-to-1")) {
    return "founder";
  }
  return "ae";
}

// ─── ICP silent detection ────────────────────────────────────────────────────

function deriveICPFromCompany(industry: string, role: string): ICPConfig {
  const roleCategory = getRoleCategory(role);

  const industryMap: Record<string, Partial<ICPConfig>> = {
    "SaaS": {
      industries: ["SaaS", "Software"],
      employeeMin: 50,
      employeeMax: 1000,
      revenueMin: 5,
      revenueMax: 100,
      geographies: ["North America"],
      jobTitles: ["VP of Sales", "Head of Revenue", "CRO"],
      seniorityLevels: ["VP", "C-Suite", "Director"],
    },
    "Fintech": {
      industries: ["Fintech", "Financial Services"],
      employeeMin: 100,
      employeeMax: 2000,
      revenueMin: 10,
      revenueMax: 200,
      geographies: ["North America", "EMEA"],
      jobTitles: ["CFO", "Head of Finance", "VP Operations"],
      seniorityLevels: ["VP", "C-Suite"],
    },
    "Agency": {
      industries: ["Marketing", "Agency", "Professional Services"],
      employeeMin: 10,
      employeeMax: 500,
      revenueMin: 1,
      revenueMax: 50,
      geographies: ["North America"],
      jobTitles: ["CMO", "Head of Marketing", "Marketing Director"],
      seniorityLevels: ["VP", "Director", "C-Suite"],
    },
    "HealthTech": {
      industries: ["HealthTech", "Healthcare"],
      employeeMin: 50,
      employeeMax: 1000,
      revenueMin: 5,
      revenueMax: 100,
      geographies: ["North America"],
      jobTitles: ["CTO", "VP of Product", "Head of Clinical Operations"],
      seniorityLevels: ["VP", "C-Suite", "Director"],
    },
  };

  const base = industryMap[industry] ?? {
    industries: [industry].filter(Boolean),
    employeeMin: 50,
    employeeMax: 1000,
    revenueMin: 5,
    revenueMax: 100,
    geographies: ["North America"],
    jobTitles: ["VP of Sales", "Head of Revenue"],
    seniorityLevels: ["VP", "Director"],
  };

  if (roleCategory === "sdr") {
    return {
      ...base,
      employeeMin: 20,
      employeeMax: 500,
      seniorityLevels: ["Manager", "Director", "VP"],
    } as ICPConfig;
  }

  return base as ICPConfig;
}

// ─── Mock Enrichment ──────────────────────────────────────────────────────────

interface EnrichedCompany {
  companyName: string;
  industry: string;
  teamSize: string;
  location: string;
}

function mockEnrichDomain(domain: string): EnrichedCompany {
  const root = domain.split(".")[0] ?? domain;
  const companyName = root.charAt(0).toUpperCase() + root.slice(1);
  return {
    companyName,
    industry: "SaaS",
    teamSize: "51-200",
    location: "San Francisco, CA",
  };
}

// ─── Step Dots ────────────────────────────────────────────────────────────────

function OnboardingDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all ${
            i + 1 === step
              ? "w-8 h-1.5 bg-[#6366F1]"
              : "w-4 h-1.5 bg-[#E5E7EB]"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Split Layout ─────────────────────────────────────────────────────────────
// Left = white content panel. Right = dark indigo brand panel.

const DOT_GRID: React.CSSProperties = {
  backgroundImage: "radial-gradient(circle, rgba(165,180,252,0.13) 1px, transparent 1px)",
  backgroundSize: "28px 28px",
};

interface SplitLayoutProps {
  children: React.ReactNode;          // left — form / content
  panel: React.ReactNode;             // right — brand hero
  panelTagline?: string;
  mobileTop?: React.ReactNode;        // shown above content on < md
}

function SplitLayout({ children, panel, panelTagline = "Your pipeline, before you ask.", mobileTop }: SplitLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* Mobile brand strip */}
      {mobileTop && (
        <div className="flex md:hidden" style={{ background: "#1E1B4B" }}>
          {mobileTop}
        </div>
      )}

      {/* Left — content */}
      <div className="flex-1 bg-white flex items-center justify-center px-6 py-10 md:py-0 order-first md:order-first">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Right — brand panel */}
      <div
        className="hidden md:flex md:w-[46%] flex-col justify-between px-12 py-10 relative overflow-hidden"
        style={{ background: "#1E1B4B" }}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0" style={DOT_GRID} />

        {/* Hero content + logo stacked together, centered */}
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-8 w-full">
            <img src={logoLight} alt="Pristine" className="h-8 w-auto" />
            {panel}
          </div>
        </div>

        {/* Tagline */}
        <p className="relative z-10 text-xs text-indigo-400 text-center">
          {panelTagline}
        </p>
      </div>

    </div>
  );
}

// ─── Step 1 — Email Capture ───────────────────────────────────────────────────

interface Step1Data {
  email: string;
  name: string;
  password: string;
  linkedin: string;
}

interface Step1Props {
  onSubmit: (data: Step1Data) => void;
}

const PERSONAL_DOMAINS = new Set([
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com",
  "aol.com", "protonmail.com", "me.com", "live.com", "msn.com",
  "ymail.com", "googlemail.com", "mac.com",
]);

function isPersonalEmail(e: string): boolean {
  const domain = e.split("@")[1]?.toLowerCase() ?? "";
  return PERSONAL_DOMAINS.has(domain);
}

// ─── Panel Animation Components ───────────────────────────────────────────────

// Step 1 — Floating live signal cards

const LIVE_SIGNALS = [
  { domain: "salesforce.com", initials: "SF", color: "#0EA5E9", bg: "#EFF6FF", name: "Salesforce",  signal: "Hiring 12 SDRs",       icon: "solar:users-group-rounded-bold" },
  { domain: "hubspot.com",    initials: "HS", color: "#F97316", bg: "#FFF7ED", name: "HubSpot",     signal: "Series B · $120M",      icon: "solar:dollar-minimalistic-bold" },
  { domain: "linear.app",     initials: "LN", color: "#6366F1", bg: "#EEF2FF", name: "Linear",      signal: "New VP Sales hired",    icon: "solar:user-plus-rounded-bold" },
  { domain: "vercel.com",     initials: "VR", color: "#10B981", bg: "#ECFDF5", name: "Vercel",      signal: "Tech stack change",     icon: "solar:code-square-bold" },
  { domain: "figma.com",      initials: "FG", color: "#F43F5E", bg: "#FFF1F2", name: "Figma",       signal: "Headcount growing 40%", icon: "solar:graph-up-bold" },
  { domain: "notion.so",      initials: "NT", color: "#8B5CF6", bg: "#F5F3FF", name: "Notion",      signal: "Job posting surge",     icon: "solar:bolt-bold" },
];

const CARD_H  = 64;   // px — fixed card height
const CARD_GAP = 10;  // px — gap between cards
const SLOT     = CARD_H + CARD_GAP; // total vertical space per card
const VISIBLE_CARDS = 5;

function FloatingSignalFeed() {
  // Double the list so the loop is seamless
  const doubled = [...LIVE_SIGNALS, ...LIVE_SIGNALS];
  const loopDistance = LIVE_SIGNALS.length * SLOT; // translate distance for one full cycle
  const duration = LIVE_SIGNALS.length * 2.4;      // seconds — one card every 2.4s

  return (
    <div
      className="w-full overflow-hidden relative"
      style={{ height: VISIBLE_CARDS * SLOT - CARD_GAP }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-4 z-10"
        style={{ background: "linear-gradient(to bottom, rgba(30,27,75,0.5), transparent)" }} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-4 z-10"
        style={{ background: "linear-gradient(to top, rgba(30,27,75,0.5), transparent)" }} />
      <style>{`
        @keyframes ticker {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-${loopDistance}px); }
        }
      `}</style>

      <div
        className="flex flex-col"
        style={{
          gap: CARD_GAP,
          animation: `ticker ${duration}s linear infinite`,
        }}
      >
        {doubled.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-white/10 border border-white/15 rounded-xl px-3 shrink-0"
            style={{ height: CARD_H }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden bg-white"
              style={{ color: s.color }}
            >
              <img
                src={`https://logo.clearbit.com/${s.domain}`}
                alt={s.name}
                className="w-full h-full object-contain p-1"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  if (e.currentTarget.parentElement) {
                    e.currentTarget.parentElement.style.background = s.bg;
                    e.currentTarget.parentElement.textContent = s.initials;
                  }
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{s.name}</p>
              <p className="text-[11px] text-indigo-300 truncate">{s.signal}</p>
            </div>
            <Icon icon={s.icon} className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Step 2 — Radar sonar rings behind the counters

function RadarRings() {
  return (
    <>
      <style>{`
        @keyframes radar-ring {
          0%   { transform: scale(0.4); opacity: 0.5; }
          100% { transform: scale(2.6); opacity: 0; }
        }
      `}</style>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute rounded-full border border-indigo-500/35"
          style={{
            width: 120, height: 120,
            top: "50%", left: "50%",
            marginTop: -60, marginLeft: -60,
            animation: `radar-ring 2.6s ease-out ${i * 0.87}s infinite`,
          }}
        />
      ))}
    </>
  );
}



function Step1Email({ onSubmit }: Step1Props) {
  const [email, setEmail]         = useState("");
  const [name, setName]           = useState("");
  const [password, setPassword]   = useState("");
  const [linkedin, setLinkedin]   = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const emailValid   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const nameValid    = name.trim().length > 0;
  const passwordValid = password.length >= 8;
  const canSubmit    = emailValid && nameValid && passwordValid;

  const emailError    = submitted && !emailValid    ? "Enter a valid work email." : submitted && isPersonalEmail(email) ? "Use your work email." : "";
  const nameError     = submitted && !nameValid     ? "Name is required." : "";
  const passwordError = submitted && !passwordValid ? "At least 8 characters." : "";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (!canSubmit) return;
    if (isPersonalEmail(email)) return;
    onSubmit({ email, name: name.trim(), password, linkedin: linkedin.trim() });
  }

  const panel = (
    <div className="flex flex-col items-center gap-6 w-full max-w-[280px]">
      <div className="flex flex-col gap-1.5 text-center">
        <h2 className="text-[2rem] font-bold text-white leading-tight">
          Live signals.<br />Right now.
        </h2>
        <p className="text-xs text-indigo-400">Accounts matching your ICP — already moving</p>
      </div>
      <FloatingSignalFeed />
    </div>
  );

  const mobileTop = (
    <div className="w-full flex items-center justify-between px-6 py-4">
      <img src={logoLight} alt="Pristine" className="h-6 w-auto" />
      <OnboardingDots step={1} total={4} />
    </div>
  );

  return (
    <SplitLayout panel={panel} mobileTop={mobileTop}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <OnboardingDots step={1} total={4} />
          <h1 className="text-2xl font-semibold text-[#0F0F0F] mt-3">Create your account</h1>
          <p className="text-sm text-[#6B7280]">Start finding pipeline in under 2 minutes</p>
        </div>

        {/* Work email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-[#374151]">Work email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setSubmitted(false); }}
            placeholder="you@company.com"
            autoFocus
            className={`border rounded-lg px-3 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none transition-colors ${
              emailError ? "border-red-400 focus:border-red-400" : "border-[#E5E7EB] focus:border-[#6366F1]"
            }`}
          />
          {emailError && <p className="text-xs text-red-500">{emailError}</p>}
        </div>

        {/* Full name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-[#374151]">Full name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Smith"
            className={`border rounded-lg px-3 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none transition-colors ${
              nameError ? "border-red-400 focus:border-red-400" : "border-[#E5E7EB] focus:border-[#6366F1]"
            }`}
          />
          {nameError && <p className="text-xs text-red-500">{nameError}</p>}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-[#374151]">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className={`w-full border rounded-lg px-3 py-2.5 pr-10 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none transition-colors ${
                passwordError ? "border-red-400 focus:border-red-400" : "border-[#E5E7EB] focus:border-[#6366F1]"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
            >
              <Icon icon={showPw ? "solar:eye-closed-linear" : "solar:eye-linear"} className="w-4 h-4" />
            </button>
          </div>
          {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
        </div>

        {/* LinkedIn — optional */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="linkedin" className="text-sm font-medium text-[#374151]">LinkedIn profile</label>
            <span className="text-xs text-[#9CA3AF]">Optional · helps personalise your workspace</span>
          </div>
          <div className="relative">
            <Icon icon="solar:linkedin-bold" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input
              id="linkedin"
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="linkedin.com/in/yourname"
              className="w-full border border-[#E5E7EB] rounded-lg pl-9 pr-3 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#6366F1] transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-1">
          <button
            type="submit"
            className="w-full rounded-full bg-[#6366F1] text-white px-6 py-3 text-sm font-semibold hover:bg-[#4F46E5] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Create account
          </button>
          <p className="text-center text-xs text-[#6B7280]">
            Already have an account?{" "}
            <a href="/sign-in" className="text-[#6366F1] font-medium hover:underline">Sign in</a>
          </p>
        </div>
      </form>
    </SplitLayout>
  );
}

// ─── Role types (shared by Step 2 and wizard) ────────────────────────────────

type RoleId = "ae" | "sdr" | "founder";

interface RoleOption {
  id: RoleId;
  icon: string;
  label: string;
  sublabel: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: "ae",
    icon: "solar:user-check-rounded-linear",
    label: "Named accounts",
    sublabel: "Senior AE / AM",
  },
  {
    id: "sdr",
    icon: "solar:users-group-rounded-linear",
    label: "High-volume outbound",
    sublabel: "SDR, BDR, Demand Gen",
  },
  {
    id: "founder",
    icon: "solar:rocket-linear",
    label: "Founder doing sales",
    sublabel: "0 to 1, all hats",
  },
];

// ─── Step 2 — Company Discovery Confirmation (split-screen) ──────────────────

function ICPChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EEF2FF] text-[#4338CA]">
      {label}
    </span>
  );
}

// Animates a number from 0 to `target` over `duration` ms
function useCountUp(target: number, duration = 1400, decimals = 0): string {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    let raf: number;
    function step(ts: number) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * target);
      if (progress < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value.toFixed(decimals);
}

interface StatProps { value: number; label: string; suffix?: string; decimals?: number }

function AnimatedStat({ value, label, suffix = "", decimals = 0 }: StatProps) {
  const displayed = useCountUp(value, 1400, decimals);
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-4xl font-bold text-white tabular-nums tracking-tight">
        {displayed}{suffix}
      </span>
      <span className="text-xs text-indigo-300 text-center leading-snug">{label}</span>
    </div>
  );
}

function PulseDots() {
  return (
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-indigo-400"
          style={{
            animation: `pulse 1.4s ease-in-out ${i * 0.22}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}

interface Step2DiscoveryProps {
  email: string;
  enriched: EnrichedCompany;
  icp: ICPConfig;
  onContinue: (role: RoleId) => void;
}

function Step2Discovery({ email, enriched, icp, onContinue }: Step2DiscoveryProps) {
  const [selectedRole, setSelectedRole] = useState<RoleId | null>(null);
  // TODO: Replace mock stats with real enrichment API response
  const domain = email.split("@")[1] ?? "";
  const companySummary = [
    enriched.companyName,
    enriched.industry,
    `${enriched.teamSize} employees`,
    enriched.location,
  ].join(", ");

  const panel = (
    <div className="flex flex-col items-center gap-8 text-center w-full">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-[2rem] font-bold text-white leading-tight">
          We did your<br />homework.
        </h2>
        <p className="text-xs text-indigo-400">Before you clicked anything.</p>
      </div>

      {/* Radar + counters */}
      <div className="relative flex items-center justify-center w-full" style={{ height: 220 }}>
        <RadarRings />
        <div className="relative z-10 flex gap-12">
          <AnimatedStat value={847} label="Accounts scanned" />
          <AnimatedStat value={23}  label="Live signals" />
          <AnimatedStat value={7.4} label="Content IQ" decimals={1} />
        </div>
      </div>

      <PulseDots />
    </div>
  );

  const mobileTop = (
    <div className="w-full flex items-center justify-around px-6 py-4">
      <AnimatedStat value={847} label="Accounts" />
      <AnimatedStat value={23}  label="Signals" />
      <AnimatedStat value={7.4} label="Content IQ" decimals={1} />
    </div>
  );

  return (
    <SplitLayout
      panel={panel}
      mobileTop={mobileTop}
      panelTagline="We started working before you signed up."
    >
      <div className="flex flex-col gap-5">
        <OnboardingDots step={2} total={3} />

        {/* Status pill */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] text-xs font-medium text-[#166534] self-start">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
          Pristine found your company
        </span>

        <h1 className="text-2xl font-semibold text-[#0F0F0F] -mt-1">
          Here's what we found.
        </h1>

        {/* Company summary */}
        <div className="flex items-center gap-1.5 flex-wrap -mt-2">
          <p className="text-sm text-[#6B7280]">{companySummary}</p>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-xs text-[#6366F1] hover:underline shrink-0"
            onClick={() => {/* TODO: inline edit */}}
          >
            <Icon icon="solar:pen-2-linear" className="w-3 h-3" />
            Edit
          </button>
        </div>

        {/* ICP container */}
        <div className="rounded-xl border border-[#E5E7EB] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF]">Your ICP</span>
            <button type="button" className="text-xs text-[#6366F1] hover:underline" onClick={() => {/* TODO */}}>
              Edit
            </button>
          </div>
          <div className="grid grid-cols-2 gap-y-3 gap-x-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] text-[#9CA3AF]">Industry</span>
              <div className="flex flex-wrap gap-1">
                {(icp.industries ?? []).slice(0, 2).map((v) => <ICPChip key={v} label={v} />)}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] text-[#9CA3AF]">Company size</span>
              <div className="flex flex-wrap gap-1">
                <ICPChip label={`${icp.employeeMin ?? 50}–${icp.employeeMax ?? 1000}`} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] text-[#9CA3AF]">Geography</span>
              <div className="flex flex-wrap gap-1">
                {(icp.geographies ?? []).slice(0, 1).map((v) => <ICPChip key={v} label={v} />)}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] text-[#9CA3AF]">Job titles</span>
              <div className="flex flex-wrap gap-1">
                {(icp.jobTitles ?? []).slice(0, 2).map((v) => <ICPChip key={v} label={v} />)}
              </div>
            </div>
          </div>
        </div>

        {/* Content for personalization */}
        <div className="rounded-xl border border-[#E5E7EB] p-4 flex flex-col gap-2.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF]">
            Content for personalization
          </span>
          <p className="text-sm text-[#6B7280]">
            Pristine read your website and prepared content your reps can use to personalize outreach.
          </p>
          <div className="flex items-center justify-between mt-0.5">
            <div className="flex items-center gap-1.5">
              <Icon icon="solar:check-circle-bold" className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
              <span className="text-xs text-[#6366F1]">{domain}</span>
            </div>
            <button type="button" className="text-xs text-[#9CA3AF] hover:text-[#374151] hover:underline shrink-0" onClick={() => {/* TODO */}}>
              Add more sources
            </button>
          </div>
        </div>

        {/* Role selection */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF]">How do you sell?</span>
          <div className="grid grid-cols-3 gap-2">
            {ROLE_OPTIONS.map((opt) => {
              const isSelected = selectedRole === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedRole(opt.id)}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 px-2 py-3 text-center transition-all ${
                    isSelected ? "border-[#6366F1] bg-indigo-50" : "border-[#E5E7EB] bg-white hover:border-[#A5B4FC]"
                  }`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? "bg-[#EEF2FF]" : "bg-[#F3F4F6]"}`}>
                    <Icon icon={opt.icon} className={`w-4 h-4 ${isSelected ? "text-[#6366F1]" : "text-[#6B7280]"}`} />
                  </span>
                  <div>
                    <p className={`text-xs font-semibold leading-tight ${isSelected ? "text-[#4338CA]" : "text-[#111827]"}`}>
                      {opt.label}
                    </p>
                    <p className="text-[10px] text-[#9CA3AF] mt-0.5 leading-tight">{opt.sublabel}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            type="button"
            onClick={() => selectedRole && onContinue(selectedRole)}
            disabled={!selectedRole}
            className="w-full rounded-full bg-[#6366F1] text-white px-6 py-3 text-sm font-semibold hover:bg-[#4F46E5] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Looks right, let's continue
          </button>
          <p className="text-center text-xs text-[#9CA3AF]">
            You can edit all of this later in your settings.
          </p>
        </div>
      </div>
    </SplitLayout>
  );
}

// ─── Step 3 — Loading Screen ──────────────────────────────────────────────────

const FINAL_MESSAGES = [
  "Reading your website...",
  "Building your ICP...",
  "Finding accounts with active signals...",
  "Preparing your first playbook...",
  "Your workspace is ready.",
];

interface Step4Props {
  role: RoleId;
  onDone: () => void;
}

// ─── Confetti ─────────────────────────────────────────────────────────────────

const CONFETTI_COLORS = ["#6366F1", "#818CF8", "#A5B4FC", "#10B981", "#34D399", "#FCD34D"];
const CONFETTI_COUNT = 56;

function ConfettiBurst({ show }: { show: boolean }) {
  if (!show) return null;
  const particles = Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
    id: i,
    x: 10 + Math.random() * 80,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    w: 4 + Math.random() * 5,
    h: Math.random() > 0.5 ? 3 + Math.random() * 3 : 5 + Math.random() * 5,
    round: Math.random() > 0.6,
    delay: Math.random() * 0.5,
    dur: 1.4 + Math.random() * 1.2,
    rot: Math.random() * 800 - 400,
    drift: (Math.random() - 0.5) * 80,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 50 }}>
      <style>{`
        @keyframes cf {
          0%   { transform: translate(0, -20px) rotate(0deg) scale(1); opacity: 1; }
          70%  { opacity: 1; }
          100% { transform: translate(var(--dx), 110vh) rotate(var(--rot)) scale(0.6); opacity: 0; }
        }
      `}</style>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: "-20px",
            width: p.w,
            height: p.h,
            borderRadius: p.round ? "50%" : 2,
            backgroundColor: p.color,
            "--rot": `${p.rot}deg`,
            "--dx": `${p.drift}px`,
            animation: `cf ${p.dur}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${p.delay}s forwards`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// ─── Step 4 Loading ───────────────────────────────────────────────────────────

function Step4Loading({ role, onDone }: Step4Props) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const [complete, setComplete] = useState(false);
  const [showButton, setShowButton] = useState(false);

  void role;

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Each transition: fade out → swap → fade in
    const transitions = [700, 1500, 2300, 3000];
    transitions.forEach((t, i) => {
      timers.push(setTimeout(() => {
        setTextVisible(false);
        timers.push(setTimeout(() => {
          setMsgIndex(i + 1);
          setTextVisible(true);
        }, 220));
      }, t));
    });

    timers.push(setTimeout(() => setComplete(true), 3400));
    timers.push(setTimeout(() => setShowButton(true), 3900));
    return () => timers.forEach(clearTimeout);
  }, []);

  const isReady = msgIndex === FINAL_MESSAGES.length - 1 && complete;

  return (
    <>
      <ConfettiBurst show={showButton} />

      <div className="min-h-screen bg-[#F8F8FA] flex flex-col items-center justify-center px-6">
        <div className="flex flex-col items-center gap-10 w-full max-w-sm text-center">

          {/* Icon — hero, no box, glow via shadow */}
          <div
            className={`transition-all duration-700 ${isReady ? "scale-110" : "scale-100"}`}
            style={{
              filter: isReady
                ? "drop-shadow(0 0 24px rgba(99,102,241,0.45))"
                : "drop-shadow(0 0 8px rgba(99,102,241,0.2))",
            }}
          >
            <Icon
              icon={isReady ? "solar:verified-check-bold" : "solar:magic-stick-3-bold"}
              className={`w-16 h-16 transition-all duration-500 ${
                isReady ? "text-[#6366F1]" : "text-[#6366F1] animate-pulse"
              }`}
            />
          </div>

          {/* Single cycling message */}
          <div className="flex flex-col gap-2 min-h-[64px] items-center justify-center">
            <p
              className={`transition-all duration-300 ${
                textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
              } ${
                isReady
                  ? "text-2xl font-semibold text-[#0F0F0F] tracking-tight"
                  : "text-base text-[#4B5563]"
              }`}
              style={{ transitionProperty: "opacity, transform" }}
            >
              {FINAL_MESSAGES[msgIndex]}
            </p>
            {isReady && (
              <p className="text-sm text-[#6B7280] transition-all duration-500 opacity-100">
                Everything is set up and ready for you.
              </p>
            )}
          </div>

          {/* Thin progress track */}
          {!isReady && (
            <div className="w-full max-w-[200px] h-0.5 bg-[#E5E7EB] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#6366F1] rounded-full transition-all duration-700 ease-out"
                style={{ width: `${((msgIndex + 1) / FINAL_MESSAGES.length) * 100}%` }}
              />
            </div>
          )}

          {/* CTA */}
          <div className={`w-full transition-all duration-500 ${showButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
            {showButton && (
              <button
                type="button"
                onClick={onDone}
                className="w-full rounded-full bg-[#6366F1] text-white px-6 py-3.5 text-sm font-semibold hover:bg-[#4F46E5] transition-colors duration-200 shadow-lg shadow-indigo-200"
              >
                Enter your workspace
              </button>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────

type WizardStep = 1 | 2 | 3;

export default function SIOnboarding() {
  const navigate = useNavigate();
  const setProfile = useUserProfileStore((s) => s.setProfile);

  const [step, setStep] = useState<WizardStep>(1);
  const [email, setEmail] = useState("");
  const [enriched, setEnriched] = useState<EnrichedCompany>({
    companyName: "Your Company",
    industry: "B2B SaaS",
    teamSize: "11-50",
    location: "San Francisco, CA",
  });
  const [role, setRole] = useState<RoleId>("ae");

  // ICP silent detection — fires once when loading screen mounts
  useEffect(() => {
    if (step !== 3) return;
    const profile = useUserProfileStore.getState().profile;
    if (!profile) return;
    const detectedICP = deriveICPFromCompany(
      profile.industry ?? "",
      profile.role ?? ""
    );
    useUserProfileStore.getState().setProfile({ icp: detectedICP });
  }, [step]);

  // ICP derived from enriched company for the discovery screen (no role yet)
  const discoveryICP = deriveICPFromCompany(enriched.industry, "");

  function handleStep1(data: Step1Data) {
    const domain = data.email.split("@")[1] ?? "";
    setEmail(data.email);
    // TODO: Replace with real enrichment API call using domain
    const result = mockEnrichDomain(domain);
    setEnriched(result);
    setProfile({
      email: data.email,
      name: data.name,
      ...(data.linkedin ? { linkedin: data.linkedin } : {}),
    });
    setStep(2);
  }

  function handleStep2Continue(selectedRole: RoleId) {
    setRole(selectedRole);
    setProfile({
      company: enriched.companyName,
      industry: enriched.industry,
      role: selectedRole,
    });
    setStep(3);
  }

  function handleDone() {
    setProfile({ onboardingCompleted: true });
    const category = getRoleCategory(role);
    if (category === "sdr") {
      navigate("/si/icp");
    } else {
      navigate("/si/watchlist");
    }
  }

  if (step === 1) return <Step1Email onSubmit={handleStep1} />;
  if (step === 2)
    return (
      <Step2Discovery
        email={email}
        enriched={enriched}
        icp={discoveryICP}
        onContinue={handleStep2Continue}
      />
    );
  return <Step4Loading role={role} onDone={handleDone} />;
}
