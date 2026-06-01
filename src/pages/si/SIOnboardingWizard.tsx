import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import logo from "@/assets/pristine-data-logo.svg";

// ─── Types ────────────────────────────────────────────────────────────────────

type RoleId = "ae" | "sdr" | "sales-leader" | "founder" | "revops" | "other";
type WizardStep = 1 | 2 | 3 | 4;

interface RoleOption {
  id: RoleId;
  label: string;
  icon: string;
  description: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STEP_LABELS = ["Your Role", "Your ICP", "Your Accounts", "Get Access"];

const ROLES: RoleOption[] = [
  {
    id: "ae",
    label: "Account Executive",
    icon: "solar:user-check-linear",
    description: "Named accounts, deep research, multi-stakeholder deals",
  },
  {
    id: "sdr",
    label: "SDR / BDR",
    icon: "solar:outgoing-call-linear",
    description: "High-volume prospecting, sequence-driven outreach",
  },
  {
    id: "sales-leader",
    label: "Sales Leader",
    icon: "solar:chart-square-linear",
    description: "Team performance, pipeline visibility, account coverage",
  },
  {
    id: "founder",
    label: "Founder / CEO",
    icon: "solar:rocket-linear",
    description: "Wearing multiple hats, need signal fast",
  },
  {
    id: "revops",
    label: "RevOps",
    icon: "solar:settings-linear",
    description: "Stack optimization, data quality, process design",
  },
  {
    id: "other",
    label: "Other",
    icon: "solar:user-linear",
    description: "Something else entirely",
  },
];

const INDUSTRY_OPTIONS = [
  "Software / SaaS",
  "Financial Services",
  "Healthcare",
  "Manufacturing",
  "Professional Services",
  "E-commerce",
  "Other",
];

const COMPANY_SIZE_OPTIONS = [
  "1–10 employees",
  "11–50 employees",
  "51–200 employees",
  "201–500 employees",
  "501–1,000 employees",
  "1,000+ employees",
];

const ALL_REGIONS = [
  "United States",
  "Canada",
  "United Kingdom",
  "Europe",
  "APAC",
  "Global",
  "Middle East",
];

const TITLES_BY_ROLE: Record<RoleId, string[]> = {
  ae: ["VP of Sales", "CRO", "Head of Revenue", "Sales Director"],
  sdr: ["VP of Sales", "Sales Manager", "Head of Growth", "Director of Sales"],
  "sales-leader": ["CRO", "VP of Sales", "CEO", "Head of RevOps"],
  founder: ["CEO", "Co-Founder", "VP of Engineering", "CTO"],
  revops: ["VP of Sales", "Head of RevOps", "Sales Ops Manager", "VP of Marketing"],
  other: ["VP of Sales", "Head of Sales"],
};

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ currentStep }: { currentStep: WizardStep }) {
  return (
    <div className="w-full border-b border-[hsl(var(--border))] bg-white">
      <div className="max-w-2xl mx-auto px-6 py-4">
        <div className="flex items-center">
          {STEP_LABELS.map((label, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isActive = stepNum === currentStep;
            const isLast = idx === STEP_LABELS.length - 1;

            return (
              <div key={label} className="flex items-center flex-1 min-w-0">
                {/* Step dot + label */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                      isCompleted || isActive
                        ? "bg-[hsl(var(--primary))] text-white"
                        : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
                    )}
                  >
                    {isCompleted ? (
                      <Icon icon="solar:check-circle-bold" className="w-3.5 h-3.5" />
                    ) : (
                      stepNum
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium whitespace-nowrap",
                      isActive || isCompleted
                        ? "text-[hsl(var(--primary))]"
                        : "text-[hsl(var(--muted-foreground))]"
                    )}
                  >
                    {label}
                  </span>
                </div>

                {/* Connector line */}
                {!isLast && (
                  <div
                    className={cn(
                      "flex-1 h-px mx-3 transition-colors",
                      isCompleted
                        ? "bg-[hsl(var(--primary))]"
                        : "bg-[hsl(var(--border))]"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Step 1: Role Selection ───────────────────────────────────────────────────

function StepRole({
  selectedRole,
  onSelect,
  onContinue,
}: {
  selectedRole: RoleId | null;
  onSelect: (id: RoleId) => void;
  onContinue: () => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
          What best describes how you sell?
        </h1>
        <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
          We'll tailor your account intelligence to match your motion.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {ROLES.map((role) => {
          const isSelected = selectedRole === role.id;
          return (
            <button
              key={role.id}
              onClick={() => onSelect(role.id)}
              className={cn(
                "flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-150",
                isSelected
                  ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.06)]"
                  : "border-[hsl(var(--border))] bg-white hover:border-[hsl(var(--primary)/0.35)] hover:bg-[hsl(var(--muted))]"
              )}
            >
              <div
                className={cn(
                  "mt-0.5 flex-shrink-0 transition-colors",
                  isSelected
                    ? "text-[hsl(var(--primary))]"
                    : "text-[hsl(var(--muted-foreground))]"
                )}
              >
                <Icon icon={role.icon} className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p
                  className={cn(
                    "text-sm font-semibold leading-tight transition-colors",
                    isSelected
                      ? "text-[hsl(var(--primary))]"
                      : "text-[hsl(var(--foreground))]"
                  )}
                >
                  {role.label}
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5 leading-snug">
                  {role.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <Button
        onClick={onContinue}
        disabled={!selectedRole}
        className="w-full h-11 text-sm font-semibold"
      >
        Continue
        <Icon icon="solar:arrow-right-linear" className="w-4 h-4 ml-1.5" />
      </Button>
    </div>
  );
}

// ─── Chip ─────────────────────────────────────────────────────────────────────

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] text-xs font-medium">
      {label}
      <button
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="ml-0.5 text-[hsl(var(--primary)/0.5)] hover:text-[hsl(var(--primary))] transition-colors"
      >
        <Icon icon="solar:close-circle-linear" className="w-3.5 h-3.5" />
      </button>
    </span>
  );
}

// ─── Step 2: ICP Defaults ─────────────────────────────────────────────────────

function StepICP({ role, onContinue }: { role: RoleId; onContinue: () => void }) {
  const [industry, setIndustry] = useState("Software / SaaS");
  const [companySize, setCompanySize] = useState("51–200 employees");
  const [regions, setRegions] = useState<string[]>(["United States"]);
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const [titles, setTitles] = useState<string[]>(() => [...TITLES_BY_ROLE[role]]);
  const [showTitleInput, setShowTitleInput] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const availableRegions = ALL_REGIONS.filter((r) => !regions.includes(r));

  const addRegion = (region: string) => {
    setRegions((prev) => [...prev, region]);
    setShowRegionPicker(false);
  };

  const addTitle = () => {
    const trimmed = newTitle.trim();
    if (trimmed && !titles.includes(trimmed)) {
      setTitles((prev) => [...prev, trimmed]);
    }
    setNewTitle("");
    setShowTitleInput(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
          Who are you trying to reach?
        </h1>
        <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
          We've made some guesses. Correct anything that's off.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {/* Industry */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[hsl(var(--foreground))]">
            Industry
          </label>
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRY_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Company Size */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[hsl(var(--foreground))]">
            Company size
          </label>
          <Select value={companySize} onValueChange={setCompanySize}>
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COMPANY_SIZE_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Geography */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[hsl(var(--foreground))]">
            Geography
          </label>
          <div className="relative flex flex-wrap gap-2 p-3 rounded-lg border border-[hsl(var(--border))] bg-white min-h-[44px] items-center">
            {regions.map((region) => (
              <Chip
                key={region}
                label={region}
                onRemove={() => setRegions((prev) => prev.filter((r) => r !== region))}
              />
            ))}
            {availableRegions.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowRegionPicker((v) => !v)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-dashed border-[hsl(var(--border))] text-xs text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))] transition-colors"
                >
                  <Icon icon="solar:add-circle-linear" className="w-3.5 h-3.5" />
                  Add region
                </button>
                {showRegionPicker && (
                  <div className="absolute top-8 left-0 z-10 bg-white border border-[hsl(var(--border))] rounded-lg shadow-md py-1 min-w-[160px]">
                    {availableRegions.map((region) => (
                      <button
                        key={region}
                        onClick={() => addRegion(region)}
                        className="w-full text-left px-3 py-1.5 text-sm hover:bg-[hsl(var(--muted))] transition-colors"
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Job Titles */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[hsl(var(--foreground))]">
            Job titles to target
          </label>
          <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-[hsl(var(--border))] bg-white min-h-[44px] items-center">
            {titles.map((title) => (
              <Chip
                key={title}
                label={title}
                onRemove={() => setTitles((prev) => prev.filter((t) => t !== title))}
              />
            ))}
            {showTitleInput ? (
              <input
                autoFocus
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addTitle();
                  if (e.key === "Escape") {
                    setNewTitle("");
                    setShowTitleInput(false);
                  }
                }}
                onBlur={() => {
                  if (newTitle.trim()) addTitle();
                  else setShowTitleInput(false);
                }}
                placeholder="Type title, press Enter"
                className="text-xs border border-[hsl(var(--primary))] rounded-full px-3 py-1 outline-none w-40"
              />
            ) : (
              <button
                onClick={() => setShowTitleInput(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-dashed border-[hsl(var(--border))] text-xs text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))] transition-colors"
              >
                <Icon icon="solar:add-circle-linear" className="w-3.5 h-3.5" />
                Add title
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button onClick={onContinue} className="w-full h-11 text-sm font-semibold">
          Continue
          <Icon icon="solar:arrow-right-linear" className="w-4 h-4 ml-1.5" />
        </Button>
        <p className="text-center text-xs text-[hsl(var(--muted-foreground))]">
          You can update your ICP anytime after signup.
        </p>
      </div>
    </div>
  );
}

// ─── Step 3: Your Accounts ────────────────────────────────────────────────────

type AccountMethod = "pristine" | "upload" | "crm";

function StepAccounts({ onContinue }: { onContinue: () => void }) {
  const [selected, setSelected] = useState<AccountMethod>("pristine");
  const [dragOver, setDragOver] = useState(false);

  const cards: {
    id: AccountMethod;
    icon: string;
    title: string;
    body: string;
    badge?: string;
    subnote?: string;
  }[] = [
    {
      id: "pristine",
      icon: "solar:magic-stick-3-linear",
      title: "Let Pristine build it for you",
      body: "Based on your ICP, we've already identified accounts worth watching. We'll show you what we found.",
      badge: "Recommended",
    },
    {
      id: "upload",
      icon: "solar:upload-linear",
      title: "Upload my own list",
      body: "Have a CSV or spreadsheet of target accounts? Drop it in and we'll start tracking them.",
    },
    {
      id: "crm",
      icon: "solar:database-linear",
      title: "Connect my CRM",
      body: "Pull your existing book of business from HubSpot or Salesforce. We'll create watchlists per rep automatically.",
      subnote: "Available after account setup.",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
          How should we populate your watchlist?
        </h1>
        <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
          You can always change this later.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {cards.map((card) => {
          const isSelected = selected === card.id;
          return (
            <div key={card.id} className="flex flex-col">
              <button
                onClick={() => setSelected(card.id)}
                className={cn(
                  "relative flex items-start gap-4 p-4 rounded-xl border text-left transition-all duration-150",
                  isSelected
                    ? "border-indigo-500 border-l-[4px] bg-indigo-50"
                    : "border-[hsl(var(--border))] bg-white hover:bg-[hsl(var(--muted))]"
                )}
              >
                {card.badge && (
                  <span className="absolute top-3 right-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-600 text-white">
                    {card.badge}
                  </span>
                )}
                <div
                  className={cn(
                    "mt-0.5 flex-shrink-0 transition-colors",
                    isSelected
                      ? "text-indigo-600"
                      : "text-[hsl(var(--muted-foreground))]"
                  )}
                >
                  <Icon icon={card.icon} className="w-5 h-5" />
                </div>
                <div className="min-w-0 pr-16">
                  <p
                    className={cn(
                      "text-sm font-semibold leading-tight",
                      isSelected ? "text-indigo-700" : "text-[hsl(var(--foreground))]"
                    )}
                  >
                    {card.title}
                  </p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 leading-snug">
                    {card.body}
                  </p>
                  {card.subnote && (
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 italic">
                      {card.subnote}
                    </p>
                  )}
                </div>
              </button>

              {/* Inline file drop zone for upload card */}
              {card.id === "upload" && isSelected && (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
                  className={cn(
                    "mt-2 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors cursor-pointer",
                    dragOver
                      ? "border-indigo-400 bg-indigo-50"
                      : "border-[hsl(var(--border))] bg-slate-50"
                  )}
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = ".csv,.xlsx";
                    input.click();
                  }}
                >
                  <Icon
                    icon="solar:upload-linear"
                    className="w-6 h-6 text-[hsl(var(--muted-foreground))]"
                  />
                  <p className="text-xs text-center text-[hsl(var(--muted-foreground))]">
                    Drop your CSV or Excel file here or{" "}
                    <span className="text-indigo-600 font-medium">click to browse</span>
                  </p>
                  <p className="text-[10px] text-[hsl(var(--muted-foreground))]">
                    .csv and .xlsx supported
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Button onClick={onContinue} className="w-full h-11 text-sm font-semibold">
        Continue
        <Icon icon="solar:arrow-right-linear" className="w-4 h-4 ml-1.5" />
      </Button>
    </div>
  );
}

// ─── Step 4 helpers ───────────────────────────────────────────────────────────

const PERSONAL_EMAIL_DOMAINS = ["gmail", "yahoo", "hotmail", "outlook", "icloud", "me"];

function BlurredDashboard() {
  const companies = [
    { name: "Stripe", domain: "stripe.com", badge: "Hiring" },
    { name: "Notion", domain: "notion.so", badge: "Intent" },
    { name: "Rippling", domain: "rippling.com", badge: "Funding" },
    { name: "Figma", domain: "figma.com", badge: "Hiring" },
    { name: "Webflow", domain: "webflow.com", badge: "Intent" },
    { name: "Intercom", domain: "intercom.com", badge: "Leadership" },
    { name: "Loom", domain: "loom.com", badge: "Hiring" },
    { name: "Lattice", domain: "lattice.com", badge: "Funding" },
    { name: "Verkada", domain: "verkada.com", badge: "Intent" },
    { name: "Brex", domain: "brex.com", badge: "Leadership" },
  ];

  const signals = [
    { badge: "Hiring", summary: "Posted 12 new engineering roles in the last 30 days, signaling infrastructure expansion." },
    { badge: "Funding", summary: "Closed $45M Series B led by Sequoia. Growth investment likely driving tool consolidation." },
    { badge: "Intent", summary: "Research activity spiked on CRM evaluation pages over the past 2 weeks." },
    { badge: "Leadership Change", summary: "New VP of Sales joined from Salesforce. Evaluating stack in first 90 days." },
    { badge: "Hiring", summary: "RevOps Manager role posted with Salesforce and HubSpot as required experience." },
  ];

  const badgeColor: Record<string, string> = {
    Hiring: "bg-emerald-100 text-emerald-700",
    Funding: "bg-violet-100 text-violet-700",
    Intent: "bg-blue-100 text-blue-700",
    Leadership: "bg-amber-100 text-amber-700",
    "Leadership Change": "bg-amber-100 text-amber-700",
  };

  return (
    <div
      className="fixed inset-0 flex bg-slate-100 overflow-hidden"
      style={{ filter: "blur(5px)", userSelect: "none", pointerEvents: "none" }}
      aria-hidden
    >
      {/* Left — Watchlist */}
      <div className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
        <div className="px-4 py-3 border-b border-slate-200">
          <p className="text-sm font-bold text-slate-800">Watchlist</p>
        </div>
        <div className="flex-1 overflow-hidden">
          {companies.map((c) => (
            <div key={c.name} className="flex items-center gap-2.5 px-4 py-2.5 border-b border-slate-100">
              <div className="w-7 h-7 rounded-full bg-slate-200 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-800 truncate">{c.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{c.domain}</p>
              </div>
              <span className={cn("text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0", badgeColor[c.badge] ?? "bg-slate-100 text-slate-600")}>
                {c.badge}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Center — Signal Feed */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-slate-200">
        <div className="px-5 py-3 border-b border-slate-200 bg-white">
          <p className="text-sm font-bold text-slate-800">Signal Feed</p>
        </div>
        <div className="flex-1 overflow-hidden p-4 flex flex-col gap-3">
          {signals.map((s, i) => (
            <div key={i} className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
              <span className={cn("text-[9px] font-semibold px-1.5 py-0.5 rounded-full", badgeColor[s.badge] ?? "bg-slate-100 text-slate-600")}>
                {s.badge}
              </span>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">{s.summary}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Opportunity Playbook */}
      <div className="w-72 flex-shrink-0 bg-white flex flex-col">
        <div className="px-4 py-3 border-b border-slate-200">
          <p className="text-sm font-bold text-slate-800">Opportunity Playbook</p>
        </div>
        <div className="flex gap-0 border-b border-slate-200">
          {["Brief", "Questions", "Stakeholders", "History"].map((tab) => (
            <button key={tab} className={cn("flex-1 py-2 text-[10px] font-medium", tab === "Brief" ? "border-b-2 border-indigo-500 text-indigo-600" : "text-slate-400")}>
              {tab}
            </button>
          ))}
        </div>
        <div className="flex-1 p-4 flex flex-col gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={cn("rounded bg-slate-200 h-3", i % 3 === 2 ? "w-2/3" : "w-full")} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Step 4: Get Access ───────────────────────────────────────────────────────

function StepGetAccess({ onComplete }: { onComplete: () => void }) {
  const accountCount = useState(() => Math.floor(Math.random() * 6) + 10)[0];

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [nameError, setNameError] = useState("");

  const validateEmail = (val: string) => {
    const domain = val.split("@")[1]?.split(".")[0]?.toLowerCase() ?? "";
    if (PERSONAL_EMAIL_DOMAINS.includes(domain)) {
      setEmailError("Please use your work email.");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (val: string) => {
    setPasswordError(val.length > 0 && val.length < 8 ? "Min. 8 characters required." : "");
  };

  const handleSubmit = () => {
    let ok = true;
    if (!fullName.trim()) { setNameError("Full name is required."); ok = false; } else setNameError("");
    const domain = email.split("@")[1]?.split(".")[0]?.toLowerCase() ?? "";
    if (!email.trim()) { setEmailError("Work email is required."); ok = false; }
    else if (PERSONAL_EMAIL_DOMAINS.includes(domain)) { setEmailError("Please use your work email."); ok = false; }
    else setEmailError("");
    if (password.length < 8) { setPasswordError("Min. 8 characters required."); ok = false; } else setPasswordError("");
    if (ok) onComplete();
  };

  return (
    <>
      <BlurredDashboard />

      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-[440px] rounded-2xl shadow-2xl overflow-hidden bg-white">
          {/* Top gradient section */}
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-500 px-6 py-6 flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Icon icon="solar:stars-bold" className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white leading-tight">
              Your accounts are ready.
            </h2>
            <p className="text-sm text-indigo-100">
              We found <span className="font-semibold text-white">{accountCount} accounts</span> matching your ICP.
              Create a free account to unlock them.
            </p>
          </div>

          {/* Bottom white section */}
          <div className="px-6 py-6 flex flex-col gap-4">
            {/* Full name */}
            <div className="flex flex-col gap-1">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onBlur={() => { if (!fullName.trim()) setNameError("Full name is required."); else setNameError(""); }}
                placeholder="Jane Smith"
                className={cn(
                  "h-10 w-full rounded-lg border px-3 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500",
                  nameError ? "border-red-400" : "border-[hsl(var(--border))]"
                )}
              />
              {nameError && <p className="text-xs text-red-500">{nameError}</p>}
            </div>

            {/* Work email */}
            <div className="flex flex-col gap-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => validateEmail(email)}
                placeholder="you@company.com"
                className={cn(
                  "h-10 w-full rounded-lg border px-3 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500",
                  emailError ? "border-red-400" : "border-[hsl(var(--border))]"
                )}
              />
              {emailError && <p className="text-xs text-red-500">{emailError}</p>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => validatePassword(password)}
                  placeholder="Min. 8 characters"
                  className={cn(
                    "h-10 w-full rounded-lg border px-3 pr-10 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500",
                    passwordError ? "border-red-400" : "border-[hsl(var(--border))]"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                >
                  <Icon icon={showPassword ? "solar:eye-closed-linear" : "solar:eye-linear"} className="w-4 h-4" />
                </button>
              </div>
              {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
            </div>

            {/* Primary CTA */}
            <Button
              onClick={handleSubmit}
              className="w-full h-11 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Unlock my accounts
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[hsl(var(--border))]" />
              <span className="text-xs text-[hsl(var(--muted-foreground))]">or</span>
              <div className="flex-1 h-px bg-[hsl(var(--border))]" />
            </div>

            {/* Google SSO */}
            <button
              onClick={onComplete}
              className="w-full h-11 flex items-center justify-center gap-2 rounded-lg border border-[hsl(var(--border))] bg-white text-sm font-medium text-[hsl(var(--foreground))] hover:bg-slate-50 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <p className="text-center text-xs text-[hsl(var(--muted-foreground))]">
              Free forever. No credit card required.
            </p>

            <p className="text-center text-xs text-[hsl(var(--muted-foreground))]">
              Already have an account?{" "}
              <a href="/sign-in" className="text-indigo-600 hover:underline font-medium">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Root Wizard ──────────────────────────────────────────────────────────────

export default function SIOnboardingWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState<WizardStep>(1);
  const [selectedRole, setSelectedRole] = useState<RoleId | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-[hsl(var(--border))]">
        <img src={logo} alt="Pristine Data AI" className="h-7 w-auto" />
        <a
          href="/sign-in"
          className="text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
        >
          Sign in
        </a>
      </header>

      {/* Progress Bar */}
      <ProgressBar currentStep={step} />

      {/* Step 4 renders full-screen (blurred dashboard + modal) */}
      {step === 4 && <StepGetAccess onComplete={() => navigate("/si/dashboard")} />}

      {/* Steps 1–3: Card layout */}
      {step !== 4 && (
        <main className="flex-1 flex items-start justify-center px-4 py-10">
          <div className="w-full max-w-[560px] bg-white rounded-xl shadow-[var(--shadow-card)] p-8">
            {step === 1 && (
              <StepRole
                selectedRole={selectedRole}
                onSelect={setSelectedRole}
                onContinue={() => {
                  if (selectedRole) setStep(2);
                }}
              />
            )}
            {step === 2 && selectedRole && (
              <StepICP
                role={selectedRole}
                onContinue={() => setStep(3)}
              />
            )}
            {step === 3 && (
              <StepAccounts onContinue={() => setStep(4)} />
            )}
          </div>
        </main>
      )}
    </div>
  );
}
