# Onboarding Flow + Sales Intelligence Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 5-step onboarding flow (standalone, no AppLayout) and a gated Sales Intelligence Dashboard at /sales-dashboard, both using existing shadcn components and no new packages.

**Architecture:** Onboarding state lives in a React context (OnboardingContext) backed by localStorage key `pristine_onboarding`. The onboarding pages render completely outside AppLayout. SalesDashboard is a new page inside AppLayout, guarded by a localStorage check for `pristine_onboarded`. All data is hardcoded mock data with TODO comments for future API integration.

**Tech Stack:** React 18, TypeScript, Vite, shadcn/ui (card, button, input, label, textarea, select, dialog, badge, carousel, form, radio-group), react-hook-form + zod (already installed), sonner toasts, react-router-dom v6, @iconify/react, Tailwind CSS.

---

## File Map

**Create:**
- `src/context/OnboardingContext.tsx` — context + provider + localStorage persistence
- `src/pages/Onboarding.tsx` — standalone page shell, renders each step
- `src/components/onboarding/StepProgress.tsx` — dot indicator "Step N of 5"
- `src/components/onboarding/StepSignup.tsx` — Step 1: name, email, password
- `src/components/onboarding/StepRole.tsx` — Step 2: role card grid
- `src/components/onboarding/StepCompany.tsx` — Step 3: company name, website, description
- `src/components/onboarding/StepICP.tsx` — Step 4: industry, company size, geographies pills, job titles pills
- `src/components/onboarding/StepWalkthrough.tsx` — Step 5: 3-slide carousel + "Let's go" on last slide
- `src/pages/SalesDashboard.tsx` — main dashboard page, reads name from localStorage
- `src/components/sales-dashboard/SignalFeed.tsx` — urgency-ranked account signal cards
- `src/components/sales-dashboard/OpenPlaybooks.tsx` — table of open playbooks
- `src/components/sales-dashboard/WatchlistSummary.tsx` — compact watchlist stats card
- `src/components/sales-dashboard/SuggestedAccounts.tsx` — 3 ICP-match accounts
- `src/components/sales-dashboard/QuickActions.tsx` — three outline action buttons
- `src/components/sales-dashboard/AddToWatchlistModal.tsx` — dialog with company name, website, reason
- `src/mocks/salesDashboardMocks.ts` — all mock data

**Modify:**
- `src/App.tsx` — add `/onboarding` route (standalone, no AppLayout) + `/sales-dashboard` route (inside AppLayout)
- `src/components/layout/AppLayout.tsx` — add "Sales Dashboard" child under existing "Sales Intelligence" nav item + DEV-only reset button at sidebar bottom

---

### Task 1: OnboardingContext

**Files:**
- Create: `src/context/OnboardingContext.tsx`

- [ ] **Step 1: Create the context file**

```tsx
// src/context/OnboardingContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface OnboardingData {
  name: string;
  email: string;
  password: string;
  role: string;
  companyName: string;
  companyWebsite: string;
  companyDescription: string;
  industry: string;
  companySize: string;
  geographies: string[];
  jobTitles: string[];
}

const defaultData: OnboardingData = {
  name: "",
  email: "",
  password: "",
  role: "",
  companyName: "",
  companyWebsite: "",
  companyDescription: "",
  industry: "",
  companySize: "",
  geographies: [],
  jobTitles: [],
};

interface OnboardingContextValue {
  step: number;
  data: OnboardingData;
  setStep: (step: number) => void;
  updateData: (partial: Partial<OnboardingData>) => void;
  completeOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(() => {
    try {
      const saved = localStorage.getItem("pristine_onboarding");
      return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
    } catch {
      return defaultData;
    }
  });

  useEffect(() => {
    localStorage.setItem("pristine_onboarding", JSON.stringify(data));
  }, [data]);

  const updateData = (partial: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const completeOnboarding = () => {
    localStorage.setItem("pristine_onboarded", "true");
  };

  return (
    <OnboardingContext.Provider value={{ step, data, setStep, updateData, completeOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used inside OnboardingProvider");
  return ctx;
}
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
cd "/Users/radhakrishnannarasimhan/Pristine Platform/pristinedata-1" && npx tsc --noEmit 2>&1 | head -30
```

---

### Task 2: StepProgress component

**Files:**
- Create: `src/components/onboarding/StepProgress.tsx`

- [ ] **Step 1: Create the step progress indicator**

```tsx
// src/components/onboarding/StepProgress.tsx
interface StepProgressProps {
  current: number;
  total: number;
}

export function StepProgress({ current, total }: StepProgressProps) {
  return (
    <div className="flex flex-col items-center gap-3 mb-8">
      <p className="text-sm font-medium text-muted-foreground">
        Step {current} of {total}
      </p>
      <div className="flex items-center gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i + 1 < current
                ? "h-2 w-2 bg-primary"
                : i + 1 === current
                ? "h-2 w-5 bg-primary"
                : "h-2 w-2 bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
```

---

### Task 3: StepSignup — Step 1

**Files:**
- Create: `src/components/onboarding/StepSignup.tsx`

- [ ] **Step 1: Create Step 1 — name, email, password with show/hide, zod validation**

```tsx
// src/components/onboarding/StepSignup.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOnboarding } from "@/context/OnboardingContext";
import { StepProgress } from "./StepProgress";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid work email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof schema>;

export function StepSignup() {
  const { data, updateData, setStep } = useOnboarding();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: data.name,
      email: data.email,
      password: data.password,
    },
  });

  const onSubmit = (values: FormData) => {
    updateData(values);
    setStep(2);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <StepProgress current={1} total={5} />
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
        <p className="text-sm text-muted-foreground mt-1">Get started with Pristine Data AI</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" placeholder="Sarah Connor" {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" placeholder="sarah@company.com" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              {...register("password")}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon icon={showPassword ? "solar:eye-closed-linear" : "solar:eye-linear"} className="h-4 w-4" />
            </button>
          </div>
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full mt-2">
          Continue
        </Button>
      </form>
    </div>
  );
}
```

---

### Task 4: StepRole — Step 2

**Files:**
- Create: `src/components/onboarding/StepRole.tsx`

- [ ] **Step 1: Create Step 2 — role card grid**

```tsx
// src/components/onboarding/StepRole.tsx
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/context/OnboardingContext";
import { StepProgress } from "./StepProgress";
import { cn } from "@/lib/utils";

const ROLES = [
  { id: "ae", label: "AE", description: "Account Executive", icon: "solar:user-hand-up-linear" },
  { id: "sdr", label: "SDR / BDR", description: "Business Development", icon: "solar:phone-calling-linear" },
  { id: "sales_manager", label: "Sales Manager", description: "Team Lead", icon: "solar:users-group-two-rounded-linear" },
  { id: "founder", label: "Founder / CEO", description: "Company Leader", icon: "solar:buildings-2-linear" },
  { id: "demand_gen", label: "Demand Gen", description: "Growth & Marketing", icon: "solar:chart-2-linear" },
  { id: "other", label: "Other", description: "Something else", icon: "solar:widget-linear" },
];

export function StepRole() {
  const { data, updateData, setStep } = useOnboarding();

  const handleSelect = (roleId: string) => {
    updateData({ role: roleId });
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <StepProgress current={2} total={5} />
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">What's your role?</h1>
        <p className="text-sm text-muted-foreground mt-1">We'll tailor the experience for you</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {ROLES.map((role) => (
          <button
            key={role.id}
            onClick={() => handleSelect(role.id)}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-center transition-all duration-150",
              data.role === role.id
                ? "border-primary bg-primary/5 text-primary"
                : "border-border hover:border-primary/40 hover:bg-accent text-foreground"
            )}
          >
            <Icon icon={role.icon} className="h-6 w-6" />
            <span className="text-sm font-semibold leading-tight">{role.label}</span>
            <span className="text-xs text-muted-foreground leading-tight">{role.description}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
          Back
        </Button>
        <Button
          className="flex-1"
          disabled={!data.role}
          onClick={() => setStep(3)}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
```

---

### Task 5: StepCompany — Step 3

**Files:**
- Create: `src/components/onboarding/StepCompany.tsx`

- [ ] **Step 1: Create Step 3 — company name, website, what they do**

```tsx
// src/components/onboarding/StepCompany.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useOnboarding } from "@/context/OnboardingContext";
import { StepProgress } from "./StepProgress";

const schema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyWebsite: z.string().url("Enter a valid URL (include https://)"),
  companyDescription: z.string().min(10, "Please describe what your company does"),
});

type FormData = z.infer<typeof schema>;

export function StepCompany() {
  const { data, updateData, setStep } = useOnboarding();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: data.companyName,
      companyWebsite: data.companyWebsite,
      companyDescription: data.companyDescription,
    },
  });

  const onSubmit = (values: FormData) => {
    updateData(values);
    setStep(4);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <StepProgress current={3} total={5} />
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Tell us about your company</h1>
        <p className="text-sm text-muted-foreground mt-1">This helps us surface the right accounts</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="companyName">Company name</Label>
          <Input id="companyName" placeholder="Acme Corp" {...register("companyName")} />
          {errors.companyName && <p className="text-xs text-destructive">{errors.companyName.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="companyWebsite">Company website</Label>
          <Input id="companyWebsite" placeholder="https://acme.com" {...register("companyWebsite")} />
          {errors.companyWebsite && <p className="text-xs text-destructive">{errors.companyWebsite.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="companyDescription">What does your company do?</Label>
          <Textarea
            id="companyDescription"
            placeholder="We help B2B SaaS companies automate their outbound sales..."
            rows={4}
            {...register("companyDescription")}
          />
          {errors.companyDescription && (
            <p className="text-xs text-destructive">{errors.companyDescription.message}</p>
          )}
        </div>

        <div className="flex gap-3 mt-2">
          <Button variant="outline" className="flex-1" type="button" onClick={() => setStep(2)}>
            Back
          </Button>
          <Button type="submit" className="flex-1">
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
```

---

### Task 6: StepICP — Step 4

**Files:**
- Create: `src/components/onboarding/StepICP.tsx`

- [ ] **Step 1: Create Step 4 — industry, company size, geography pills, job title pills**

```tsx
// src/components/onboarding/StepICP.tsx
import { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Icon } from "@iconify/react";
import { useOnboarding } from "@/context/OnboardingContext";
import { StepProgress } from "./StepProgress";

const INDUSTRY_SUGGESTIONS = [
  "SaaS", "FinTech", "HealthTech", "E-commerce", "EdTech", "MarTech",
  "Cybersecurity", "DevTools", "HR Tech", "LegalTech", "PropTech", "CleanTech",
];

const COMPANY_SIZES = [
  { value: "1-10", label: "1–10 employees" },
  { value: "11-50", label: "11–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "201-500", label: "201–500 employees" },
  { value: "501-1000", label: "501–1,000 employees" },
  { value: "1001+", label: "1,001+ employees" },
];

function PillInput({
  label,
  placeholder,
  values,
  onChange,
}: {
  label: string;
  placeholder: string;
  values: string[];
  onChange: (vals: string[]) => void;
}) {
  const [input, setInput] = useState("");

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setInput("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add();
    }
    if (e.key === "Backspace" && !input && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  };

  const remove = (val: string) => onChange(values.filter((v) => v !== val));

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-1.5 p-2 min-h-[42px] border border-border rounded-lg bg-background focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
        {values.map((v) => (
          <Badge key={v} variant="secondary" className="flex items-center gap-1 pl-2 pr-1 py-0.5 text-xs">
            {v}
            <button type="button" onClick={() => remove(v)} className="hover:text-destructive ml-0.5">
              <Icon icon="solar:close-circle-linear" className="h-3.5 w-3.5" />
            </button>
          </Badge>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={add}
          placeholder={values.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] text-sm bg-transparent outline-none placeholder:text-muted-foreground"
        />
      </div>
      <p className="text-xs text-muted-foreground">Press Enter or comma to add</p>
    </div>
  );
}

export function StepICP() {
  const { data, updateData, setStep } = useOnboarding();
  const [industryInput, setIndustryInput] = useState(data.industry);

  const canContinue = industryInput.trim() && data.companySize;

  const handleContinue = () => {
    updateData({ industry: industryInput.trim() });
    setStep(5);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <StepProgress current={4} total={5} />
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Define your ICP</h1>
        <p className="text-sm text-muted-foreground mt-1">Who are your ideal customers?</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="industry">Industry</Label>
          <Input
            id="industry"
            placeholder="e.g. SaaS, FinTech..."
            value={industryInput}
            onChange={(e) => setIndustryInput(e.target.value)}
          />
          <div className="flex flex-wrap gap-1.5 mt-1">
            {INDUSTRY_SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setIndustryInput(s)}
                className="text-xs px-2 py-1 rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Company size</Label>
          <Select value={data.companySize} onValueChange={(v) => updateData({ companySize: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select company size" />
            </SelectTrigger>
            <SelectContent>
              {COMPANY_SIZES.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <PillInput
          label="Target geographies"
          placeholder="e.g. North America, EMEA..."
          values={data.geographies}
          onChange={(vals) => updateData({ geographies: vals })}
        />

        <PillInput
          label="Target job titles"
          placeholder="e.g. VP of Sales, CRO..."
          values={data.jobTitles}
          onChange={(vals) => updateData({ jobTitles: vals })}
        />

        <div className="flex gap-3 mt-2">
          <Button variant="outline" className="flex-1" onClick={() => setStep(3)}>
            Back
          </Button>
          <Button className="flex-1" disabled={!canContinue} onClick={handleContinue}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
```

---

### Task 7: StepWalkthrough — Step 5

**Files:**
- Create: `src/components/onboarding/StepWalkthrough.tsx`

- [ ] **Step 1: Create Step 5 — 3-slide carousel, "Let's go" on last slide**

```tsx
// src/components/onboarding/StepWalkthrough.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/context/OnboardingContext";
import { StepProgress } from "./StepProgress";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    icon: "solar:radar-linear",
    title: "Spot buying signals instantly",
    description:
      "Pristine monitors 50+ intent signals across your target accounts — job changes, funding rounds, tech installs, and more — so you always know when to reach out.",
  },
  {
    icon: "solar:bolt-linear",
    title: "Run plays, not guesswork",
    description:
      "Every signal triggers a recommended playbook. We tell you who to contact, what to say, and why now is the right moment — backed by your ICP and deal history.",
  },
  {
    icon: "solar:chart-2-linear",
    title: "Your pipeline, always in motion",
    description:
      "Your Sales Intelligence Dashboard surfaces the accounts that need attention today, keeps your watchlist fresh, and shows you exactly what's moving in your pipeline.",
  },
];

export function StepWalkthrough() {
  const { setStep, completeOnboarding } = useOnboarding();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  const isLast = current === SLIDES.length - 1;

  const handleLetsGo = () => {
    completeOnboarding();
    navigate("/sales-dashboard");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <StepProgress current={5} total={5} />
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Here's what you can do</h1>
        <p className="text-sm text-muted-foreground mt-1">A quick look at the platform</p>
      </div>

      {/* Slide */}
      <div className="bg-card border border-border rounded-2xl p-8 mb-6 text-center min-h-[220px] flex flex-col items-center justify-center gap-4">
        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Icon icon={SLIDES[current].icon} className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">{SLIDES[current].title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{SLIDES[current].description}</p>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mb-6">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "rounded-full transition-all duration-200",
              i === current ? "h-2 w-5 bg-primary" : "h-2 w-2 bg-muted hover:bg-muted-foreground"
            )}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => (current === 0 ? setStep(4) : setCurrent((c) => c - 1))}
        >
          {current === 0 ? "Back" : "Previous"}
        </Button>
        {isLast ? (
          <Button className="flex-1" onClick={handleLetsGo}>
            Let's go
          </Button>
        ) : (
          <Button className="flex-1" onClick={() => setCurrent((c) => c + 1)}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
```

---

### Task 8: Onboarding page shell

**Files:**
- Create: `src/pages/Onboarding.tsx`

- [ ] **Step 1: Create the Onboarding page — full-page centered card, renders step components**

```tsx
// src/pages/Onboarding.tsx
import { OnboardingProvider, useOnboarding } from "@/context/OnboardingContext";
import { StepSignup } from "@/components/onboarding/StepSignup";
import { StepRole } from "@/components/onboarding/StepRole";
import { StepCompany } from "@/components/onboarding/StepCompany";
import { StepICP } from "@/components/onboarding/StepICP";
import { StepWalkthrough } from "@/components/onboarding/StepWalkthrough";

function OnboardingInner() {
  const { step } = useOnboarding();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full">
        {step === 1 && <StepSignup />}
        {step === 2 && <StepRole />}
        {step === 3 && <StepCompany />}
        {step === 4 && <StepICP />}
        {step === 5 && <StepWalkthrough />}
      </div>
    </div>
  );
}

export default function Onboarding() {
  return (
    <OnboardingProvider>
      <OnboardingInner />
    </OnboardingProvider>
  );
}
```

---

### Task 9: Register routes in App.tsx

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add imports for Onboarding and SalesDashboard pages**

At the top of `src/App.tsx`, add after existing imports:

```tsx
import Onboarding from "./pages/Onboarding";
import SalesDashboard from "./pages/SalesDashboard";
```

- [ ] **Step 2: Add /onboarding as a standalone route (no AppLayout) and /sales-dashboard inside AppLayout**

Inside `<Routes>`, add `/sales-dashboard` inside the `<Route element={<AppLayout />}>` block (alongside other routes):

```tsx
<Route path="/sales-dashboard" element={<SalesDashboard />} />
```

Outside the AppLayout block, add the standalone onboarding route:

```tsx
<Route path="/onboarding" element={<Onboarding />} />
```

Full diff context — the Routes block should look like this after the change:

```tsx
<Routes>
  <Route element={<AppLayout />}>
    <Route path="/" element={<Dashboard />} />
    {/* ... all existing routes unchanged ... */}
    <Route path="/sales-dashboard" element={<SalesDashboard />} />
  </Route>
  {/* Standalone routes — no AppLayout wrapper */}
  <Route path="/onboarding" element={<Onboarding />} />
  <Route path="/admin/campaign-calendar" element={<AdminCampaignCalendar />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

---

### Task 10: Mock data for Sales Dashboard

**Files:**
- Create: `src/mocks/salesDashboardMocks.ts`

- [ ] **Step 1: Create mock data file**

```ts
// src/mocks/salesDashboardMocks.ts

// TODO: Replace with GET /api/signals when backend is ready
export interface AccountSignal {
  id: string;
  accountName: string;
  signal: string;
  timeAgo: string;
  recommendedAction: string;
  urgency: "high" | "medium" | "low";
}

export const mockSignals: AccountSignal[] = [
  {
    id: "1",
    accountName: "Notion",
    signal: "New VP of Sales hired",
    timeAgo: "2 hours ago",
    recommendedAction: "Reach out to new VP with an intro + case study before their 90-day plan locks in.",
    urgency: "high",
  },
  {
    id: "2",
    accountName: "Linear",
    signal: "Series B funding announced ($35M)",
    timeAgo: "5 hours ago",
    recommendedAction: "Congratulate and propose a growth package — they're likely scaling the team now.",
    urgency: "high",
  },
  {
    id: "3",
    accountName: "Retool",
    signal: "Started using Outreach.io (competitor tech)",
    timeAgo: "1 day ago",
    recommendedAction: "Flag competitive risk. Send a differentiation one-pager and request a 15-min call.",
    urgency: "medium",
  },
  {
    id: "4",
    accountName: "Vercel",
    signal: "3 new engineering director job postings",
    timeAgo: "2 days ago",
    recommendedAction: "Growth signal — check if DevTools expansion aligns with your ICP and open a playbook.",
    urgency: "medium",
  },
  {
    id: "5",
    accountName: "Loom",
    signal: "Website traffic spike (+40%)",
    timeAgo: "3 days ago",
    recommendedAction: "Monitor for 2 more days, then reach out if trend continues.",
    urgency: "low",
  },
];

// TODO: Replace with GET /api/playbooks/open when backend is ready
export interface OpenPlaybook {
  id: string;
  accountName: string;
  contactName: string;
  contactTitle: string;
  lastOpenedAt: string;
  nextBestAction: string;
}

export const mockOpenPlaybooks: OpenPlaybook[] = [
  {
    id: "1",
    accountName: "Figma",
    contactName: "Dylan Field",
    contactTitle: "CEO",
    lastOpenedAt: "Today, 9:14 AM",
    nextBestAction: "Send follow-up",
  },
  {
    id: "2",
    accountName: "Stripe",
    contactName: "Dhruv Malhotra",
    contactTitle: "Head of Revenue",
    lastOpenedAt: "Yesterday, 3:42 PM",
    nextBestAction: "Schedule call",
  },
  {
    id: "3",
    accountName: "Intercom",
    contactName: "Karen Mills",
    contactTitle: "VP Sales",
    lastOpenedAt: "May 12, 11:00 AM",
    nextBestAction: "Share case study",
  },
];

// TODO: Replace with GET /api/watchlist/summary when backend is ready
export interface WatchlistSummary {
  totalWatching: number;
  signalsThisWeek: number;
}

export const mockWatchlistSummary: WatchlistSummary = {
  totalWatching: 24,
  signalsThisWeek: 9,
};

// TODO: Replace with GET /api/accounts/suggested when backend is ready
export interface SuggestedAccount {
  id: string;
  accountName: string;
  reason: string;
  industry: string;
  size: string;
}

export const mockSuggestedAccounts: SuggestedAccount[] = [
  {
    id: "1",
    accountName: "Rippling",
    reason: "Matches your ICP: SaaS, 201–500 employees, recently hired a VP of Sales.",
    industry: "HR Tech",
    size: "201–500",
  },
  {
    id: "2",
    accountName: "Deel",
    reason: "Fast-growing FinTech in your target geo with 3 open SDR roles.",
    industry: "FinTech",
    size: "501–1000",
  },
  {
    id: "3",
    accountName: "Brex",
    reason: "Series C company expanding sales team — strong ICP fit on size and vertical.",
    industry: "FinTech",
    size: "201–500",
  },
];
```

---

### Task 11: SignalFeed component

**Files:**
- Create: `src/components/sales-dashboard/SignalFeed.tsx`

- [ ] **Step 1: Create signal feed with urgency-colored left borders**

```tsx
// src/components/sales-dashboard/SignalFeed.tsx
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { mockSignals, AccountSignal } from "@/mocks/salesDashboardMocks";
import { cn } from "@/lib/utils";

const urgencyStyles: Record<AccountSignal["urgency"], string> = {
  high: "border-l-4 border-l-red-500",
  medium: "border-l-4 border-l-yellow-400",
  low: "border-l-4 border-l-border",
};

const urgencyBadgeStyles: Record<AccountSignal["urgency"], string> = {
  high: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",
  medium: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
  low: "bg-muted text-muted-foreground",
};

export function SignalFeed() {
  // TODO: Replace mockSignals with GET /api/signals API call
  return (
    <div className="space-y-3">
      {mockSignals.map((signal) => (
        <div
          key={signal.id}
          className={cn(
            "bg-card border border-border rounded-xl overflow-hidden",
            urgencyStyles[signal.urgency]
          )}
        >
          <div className="p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <span className="font-semibold text-sm text-foreground">{signal.accountName}</span>
                <span className="mx-2 text-muted-foreground">·</span>
                <span className="text-sm text-foreground">{signal.signal}</span>
              </div>
              <span
                className={cn(
                  "flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full",
                  urgencyBadgeStyles[signal.urgency]
                )}
              >
                {signal.urgency}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-1">{signal.timeAgo}</p>
            <div className="mt-3 bg-primary/5 border border-primary/20 rounded-lg p-3 text-xs text-foreground leading-relaxed">
              <span className="font-semibold text-primary">Recommended: </span>
              {signal.recommendedAction}
            </div>
            <div className="mt-3 flex justify-end">
              <Button size="sm" variant="outline" className="text-xs h-7">
                <Icon icon="solar:bolt-linear" className="h-3.5 w-3.5 mr-1" />
                Open Playbook
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

### Task 12: OpenPlaybooks component

**Files:**
- Create: `src/components/sales-dashboard/OpenPlaybooks.tsx`

- [ ] **Step 1: Create open playbooks table**

```tsx
// src/components/sales-dashboard/OpenPlaybooks.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockOpenPlaybooks } from "@/mocks/salesDashboardMocks";

const actionColors: Record<string, string> = {
  "Send follow-up": "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  "Schedule call": "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400",
  "Share case study": "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
};

export function OpenPlaybooks() {
  // TODO: Replace mockOpenPlaybooks with GET /api/playbooks/open API call
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Open Playbooks</h3>
        <p className="text-xs text-muted-foreground">Accounts you've looked at but not yet actioned</p>
      </div>
      <div className="divide-y divide-border">
        {mockOpenPlaybooks.map((pb) => (
          <div key={pb.id} className="flex items-center gap-3 px-4 py-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-semibold text-foreground truncate">{pb.accountName}</span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                    actionColors[pb.nextBestAction] ?? "bg-muted text-muted-foreground"
                  }`}
                >
                  {pb.nextBestAction}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {pb.contactName} · {pb.contactTitle}
              </p>
              <p className="text-xs text-muted-foreground">{pb.lastOpenedAt}</p>
            </div>
            <Button size="sm" variant="outline" className="text-xs h-7 flex-shrink-0">
              Resume
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### Task 13: WatchlistSummary component

**Files:**
- Create: `src/components/sales-dashboard/WatchlistSummary.tsx`

- [ ] **Step 1: Create compact watchlist stats card**

```tsx
// src/components/sales-dashboard/WatchlistSummary.tsx
import { Icon } from "@iconify/react";
import { mockWatchlistSummary } from "@/mocks/salesDashboardMocks";

export function WatchlistSummary() {
  // TODO: Replace mockWatchlistSummary with GET /api/watchlist/summary API call
  const { totalWatching, signalsThisWeek } = mockWatchlistSummary;

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Watchlist</h3>
        <a href="/account-search" className="text-xs text-primary hover:underline">
          View full watchlist →
        </a>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted/40 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-foreground">{totalWatching}</div>
          <div className="text-xs text-muted-foreground mt-0.5">Accounts watching</div>
        </div>
        <div className="bg-primary/5 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-primary">{signalsThisWeek}</div>
          <div className="text-xs text-muted-foreground mt-0.5">Signals this week</div>
        </div>
      </div>
    </div>
  );
}
```

---

### Task 14: SuggestedAccounts component

**Files:**
- Create: `src/components/sales-dashboard/SuggestedAccounts.tsx`

- [ ] **Step 1: Create suggested accounts with Add to Watchlist toast**

```tsx
// src/components/sales-dashboard/SuggestedAccounts.tsx
import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { mockSuggestedAccounts } from "@/mocks/salesDashboardMocks";

export function SuggestedAccounts() {
  // TODO: Replace mockSuggestedAccounts with GET /api/accounts/suggested API call
  const [added, setAdded] = useState<string[]>([]);

  const handleAdd = (id: string, name: string) => {
    setAdded((prev) => [...prev, id]);
    // TODO: Replace with POST /api/watchlist API call
    toast.success(`${name} added to watchlist`);
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Suggested Accounts</h3>
        <p className="text-xs text-muted-foreground">ICP matches not yet on your watchlist</p>
      </div>
      <div className="divide-y divide-border">
        {mockSuggestedAccounts.map((acct) => (
          <div key={acct.id} className="px-4 py-3 flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{acct.accountName}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{acct.reason}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-7 flex-shrink-0"
              disabled={added.includes(acct.id)}
              onClick={() => handleAdd(acct.id, acct.accountName)}
            >
              {added.includes(acct.id) ? (
                <>
                  <Icon icon="solar:check-circle-linear" className="h-3.5 w-3.5 mr-1" />
                  Added
                </>
              ) : (
                <>
                  <Icon icon="solar:add-circle-linear" className="h-3.5 w-3.5 mr-1" />
                  Add to Watchlist
                </>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### Task 15: QuickActions component

**Files:**
- Create: `src/components/sales-dashboard/QuickActions.tsx`

- [ ] **Step 1: Create three full-width outline action buttons**

```tsx
// src/components/sales-dashboard/QuickActions.tsx
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  onAddToWatchlist: () => void;
}

export function QuickActions({ onAddToWatchlist }: QuickActionsProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start text-sm"
          onClick={() => navigate("/search")}
        >
          <Icon icon="solar:magnifer-linear" className="h-4 w-4 mr-2" />
          Search Contacts
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start text-sm"
          onClick={() => navigate("/opportunities")}
        >
          <Icon icon="solar:bolt-linear" className="h-4 w-4 mr-2" />
          Open a Playbook
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start text-sm"
          onClick={onAddToWatchlist}
        >
          <Icon icon="solar:eye-linear" className="h-4 w-4 mr-2" />
          Add Account to Watchlist
        </Button>
      </div>
    </div>
  );
}
```

---

### Task 16: AddToWatchlistModal component

**Files:**
- Create: `src/components/sales-dashboard/AddToWatchlistModal.tsx`

- [ ] **Step 1: Create the watchlist modal with company name, website, optional reason**

```tsx
// src/components/sales-dashboard/AddToWatchlistModal.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const schema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyWebsite: z.string().url("Enter a valid URL (include https://)"),
  reason: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface AddToWatchlistModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddToWatchlistModal({ open, onClose }: AddToWatchlistModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (values: FormData) => {
    // TODO: Replace with POST /api/watchlist API call
    console.log("Add to watchlist:", values);
    toast.success(`${values.companyName} added to watchlist`);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Account to Watchlist</DialogTitle>
          <DialogDescription>
            Track this company for buying signals and updates.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="watchlist-company">Company name</Label>
            <Input id="watchlist-company" placeholder="Acme Corp" {...register("companyName")} />
            {errors.companyName && (
              <p className="text-xs text-destructive">{errors.companyName.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="watchlist-website">Company website</Label>
            <Input
              id="watchlist-website"
              placeholder="https://acme.com"
              {...register("companyWebsite")}
            />
            {errors.companyWebsite && (
              <p className="text-xs text-destructive">{errors.companyWebsite.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="watchlist-reason">
              Reason for watching <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="watchlist-reason"
              placeholder="e.g. Potential upsell — new CRO hired last month"
              rows={3}
              {...register("reason")}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { reset(); onClose(); }}>
              Cancel
            </Button>
            <Button type="submit">Add to Watchlist</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

---

### Task 17: SalesDashboard page

**Files:**
- Create: `src/pages/SalesDashboard.tsx`

- [ ] **Step 1: Create the full Sales Intelligence Dashboard page**

```tsx
// src/pages/SalesDashboard.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { SignalFeed } from "@/components/sales-dashboard/SignalFeed";
import { OpenPlaybooks } from "@/components/sales-dashboard/OpenPlaybooks";
import { WatchlistSummary } from "@/components/sales-dashboard/WatchlistSummary";
import { SuggestedAccounts } from "@/components/sales-dashboard/SuggestedAccounts";
import { QuickActions } from "@/components/sales-dashboard/QuickActions";
import { AddToWatchlistModal } from "@/components/sales-dashboard/AddToWatchlistModal";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function SalesDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("there");
  const [modalOpen, setModalOpen] = useState(false);

  // Guard: redirect to onboarding if not completed
  useEffect(() => {
    if (localStorage.getItem("pristine_onboarded") !== "true") {
      navigate("/onboarding");
    }
  }, [navigate]);

  // Read name from onboarding data
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pristine_onboarding");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name) setUserName(parsed.name.split(" ")[0]);
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            {getGreeting()}, {userName}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Here's what's happening in your pipeline today.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Icon icon="solar:add-circle-linear" className="h-4 w-4 mr-2" />
          Add Account to Watchlist
        </Button>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Left column */}
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Icon icon="solar:radar-linear" className="h-4 w-4 text-primary" />
              Signal Feed
            </h2>
            <SignalFeed />
          </div>
          <OpenPlaybooks />
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <WatchlistSummary />
          <SuggestedAccounts />
          <QuickActions onAddToWatchlist={() => setModalOpen(true)} />
        </div>
      </div>

      <AddToWatchlistModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
```

---

### Task 18: Update AppLayout — add nav item + DEV reset button

**Files:**
- Modify: `src/components/layout/AppLayout.tsx`

- [ ] **Step 1: Add "Sales Dashboard" as a child of the existing "Sales Intelligence" nav item**

In `src/components/layout/AppLayout.tsx`, find the `sidebarSections` array. Locate the "Sales Intelligence" item under the "INTELLIGENCE" section (currently has children: Opportunity Playbook, Account Intelligence, Buying Signals). Add a new child at the top of its children array:

```ts
{ label: "Sales Dashboard", route: "/sales-dashboard", icon: "solar:chart-square-linear" },
```

So the "Sales Intelligence" item's `children` becomes:

```ts
children: [
  { label: "Sales Dashboard", route: "/sales-dashboard", icon: "solar:chart-square-linear" },
  { label: "Opportunity Playbook", route: "/opportunities", icon: "solar:bolt-linear" },
  { label: "Account Intelligence", route: "/account-search", icon: "solar:graph-up-linear" },
  { label: "Buying Signals", route: "/signals", icon: "solar:radar-linear" },
],
```

- [ ] **Step 2: Add `getPageTitle` entry for /sales-dashboard**

In the `getPageTitle` function, add before the final `return ""`:

```ts
if (location.pathname.startsWith("/sales-dashboard")) return "Sales Intelligence";
```

- [ ] **Step 3: Add DEV-only reset button at bottom of sidebar**

In the sidebar's bottom user section (just after the closing `</div>` of the `border-t border-border p-3` div), add:

```tsx
{import.meta.env.DEV && (
  <div className="px-3 pb-3">
    <button
      onClick={() => {
        localStorage.removeItem("pristine_onboarding");
        localStorage.removeItem("pristine_onboarded");
        navigate("/onboarding");
      }}
      className="w-full text-xs text-muted-foreground hover:text-destructive transition-colors py-1.5 px-2 rounded border border-border hover:border-destructive/50 text-center"
    >
      Reset onboarding
    </button>
  </div>
)}
```

---

### Task 19: Final verification

- [ ] **Step 1: Run TypeScript check**

```bash
cd "/Users/radhakrishnannarasimhan/Pristine Platform/pristinedata-1" && npx tsc --noEmit 2>&1
```

Expected: no errors

- [ ] **Step 2: Run lint**

```bash
cd "/Users/radhakrishnannarasimhan/Pristine Platform/pristinedata-1" && npm run lint 2>&1
```

Expected: no errors (warnings acceptable)

- [ ] **Step 3: Run dev server and manually verify**

```bash
cd "/Users/radhakrishnannarasimhan/Pristine Platform/pristinedata-1" && npm run dev
```

Manual checklist:
- Navigate to `http://localhost:8080/onboarding` — should show Step 1 (no sidebar/topbar)
- Complete all 5 steps, verify progress dots update, localStorage key `pristine_onboarding` populates
- "Let's go" on Step 5 sets `pristine_onboarded=true` and redirects to `/sales-dashboard`
- `/sales-dashboard` shows "Good morning/afternoon/evening, [first name]" from localStorage
- Signal cards show red/yellow/grey left borders by urgency
- "Add to Watchlist" button in header and Quick Actions open the modal; submit fires a toast
- Suggested Accounts "Add to Watchlist" fires a toast and disables the button
- Sidebar shows "Sales Dashboard" under "Sales Intelligence" section
- In dev mode, "Reset onboarding" button appears at bottom of sidebar, clears keys, redirects
- Navigating to `/sales-dashboard` without `pristine_onboarded=true` redirects to `/onboarding`

- [ ] **Step 4: Commit**

```bash
cd "/Users/radhakrishnannarasimhan/Pristine Platform/pristinedata-1" && git add -A && git commit -m "feat: add 5-step onboarding flow and Sales Intelligence Dashboard

- OnboardingContext with localStorage persistence (pristine_onboarding)
- 5-step onboarding at /onboarding (standalone, no AppLayout)
- SalesDashboard at /sales-dashboard (guarded by pristine_onboarded)
- Signal feed with urgency borders, open playbooks table, watchlist summary
- Suggested accounts with toast, quick actions, add-to-watchlist modal
- Sales Dashboard nav item under Sales Intelligence sidebar section
- DEV-only reset onboarding button in sidebar"
```
