# CLAUDE.md — Pristine Data SI Frontend

This file is the source of truth for Claude Code when building the Sales Intelligence frontend. Read every section before writing a single line.

---

## Project Overview

You are building the **Sales Intelligence (SI)** product frontend for Pristine Data AI. This is a self-serve PLG product. You are building **frontend only** — no new backend APIs, no database schema changes.

The SI product lives in the **same Next.js repository** as the existing demand gen product (`pristine-next`). It does not live in a new repo. Do not scaffold a new project.

---

## What You Are Building

Four features + one onboarding wizard + one landing page + auth pages:

1. Landing page (`/`) — public marketing page
2. Sign-up (`/sign-up`) and sign-in (`/sign-in`) — auth forms
3. Onboarding wizard (`/si/onboarding`) — 5-step data collection, runs once
4. Dashboard (`/si/dashboard`) — signal feed + summary cards
5. ICP Discovery (`/si/icp`) — account search powered by ICP config
6. Watchlist (`/si/watchlist`) — monitored accounts + signal cards
7. Opportunity Playbook (`/si/playbook/[accountId]`) — per-account brief
8. MCP Integration (`/si/mcp`) — settings + API key + tool reference

---

## Repository Structure — Where to Create Files

All new files go under these paths. Do not touch anything outside these paths unless explicitly told.

```
src/
  app/
    (si)/                        ← New route group for SI product
      si/
        dashboard/
          page.tsx
        icp/
          page.tsx
        watchlist/
          page.tsx
        playbook/
          [accountId]/
            page.tsx
        mcp/
          page.tsx
        onboarding/
          page.tsx
      layout.tsx                 ← SI app shell with sidebar
    (marketing)/                 ← New route group for public pages
      page.tsx                   ← Landing page (root)
      sign-up/
        page.tsx
      sign-in/
        page.tsx
      layout.tsx                 ← Minimal layout, no sidebar
  components/
    si/                          ← All SI-specific components go here
      dashboard/
        SignalFeedCard.tsx
        SummaryCard.tsx
        ICPSummaryPanel.tsx
        TopAccountsPanel.tsx
      watchlist/
        AccountWatchCard.tsx
        SignalBadge.tsx
        AddAccountModal.tsx
        WatchlistFilterBar.tsx
      icp/
        ICPControlsPanel.tsx
        AccountResultsTable.tsx
      playbook/
        AccountContextPanel.tsx
        PlaybookTabs.tsx
        StakeholderCard.tsx
        NextActionChecklist.tsx
        TimelineItem.tsx
      mcp/
        MCPToolsTable.tsx
        APIKeyCard.tsx
        UsageLogTable.tsx
      onboarding/
        OnboardingShell.tsx
        steps/
          Step1Company.tsx
          Step2ICP.tsx
          Step3Accounts.tsx
          Step4Signals.tsx
          Step5Role.tsx
      landing/
        HeroSection.tsx
        PainSection.tsx
        HowItWorksSection.tsx
        FeatureTiles.tsx
        CTAFooter.tsx
      shared/
        SISidebar.tsx
        SignalTypeBadge.tsx
        IntentScoreBadge.tsx
    ui/                          ← Reuse existing shadcn/ui components already in project
  lib/
    si/
      types.ts                   ← All TypeScript types for SI
      mockData.ts                ← All mock data (signals, accounts, playbooks)
      constants.ts               ← Signal types, ICP options, onboarding steps
      onboardingStore.ts         ← Zustand store for onboarding state
      userProfileStore.ts        ← Zustand store for persisted user ICP + account config
```

---

## Design System — Read This Carefully

### Color Tokens

Do NOT hardcode hex values in components. Define CSS variables in `src/app/globals.css` under a `[data-theme="si"]` selector and use them throughout.

```css
[data-theme="si"] {
  --si-sidebar-bg: #0F0F0F;
  --si-sidebar-text: #A1A1AA;
  --si-sidebar-active-text: #FFFFFF;
  --si-sidebar-active-accent: #6366F1;

  --si-bg: #F8F8FA;
  --si-card-bg: #FFFFFF;
  --si-card-border: #E5E7EB;
  --si-card-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

  --si-primary: #6366F1;
  --si-primary-hover: #4F46E5;
  --si-primary-text: #FFFFFF;

  --si-text-primary: #0F0F0F;
  --si-text-secondary: #6B7280;
  --si-text-muted: #9CA3AF;

  --si-signal-funding: #F59E0B;
  --si-signal-hiring: #3B82F6;
  --si-signal-intent: #8B5CF6;
  --si-signal-tech: #10B981;
  --si-signal-leadership: #EC4899;
  --si-signal-expansion: #F97316;

  --si-radius-card: 12px;
  --si-radius-button: 9999px;
  --si-radius-badge: 6px;
}
```

### Typography

Use **Inter** (already loaded in the project). Size scale:
- Page headings: `text-2xl font-semibold`
- Section headings: `text-lg font-semibold`
- Card titles: `text-sm font-semibold`
- Body: `text-sm`
- Muted / metadata: `text-xs text-[--si-text-muted]`

### Component Patterns

**Cards:**
```tsx
<div className="rounded-[12px] border border-[--si-card-border] bg-[--si-card-bg] shadow-[--si-card-shadow] p-4">
```

**Primary button:**
```tsx
<button className="rounded-full bg-[--si-primary] text-[--si-primary-text] px-4 py-2 text-sm font-medium hover:bg-[--si-primary-hover] transition-colors">
```

**Signal badge:** Use `SignalTypeBadge` component with type prop. Each type gets its own background color (10% opacity of the signal color) and text color (full signal color).

**Sidebar active state:** Left border `3px solid var(--si-sidebar-active-accent)` + text white.

### Icons

Use `@iconify/react` with the `solar:` icon set — already used throughout the existing codebase. Do not introduce Heroicons or Lucide unless an icon is missing from Solar.

---

## Sidebar Layout (SI Shell)

The `(si)/layout.tsx` renders the sidebar + main content area. The sidebar is always visible (no collapse toggle at MVP).

Sidebar structure:
```
Logo + "Pristine SI" label
---
Dashboard icon + "Dashboard"
Target icon + "ICP Discovery"
Bell icon + "Watchlist"
Book icon + "Playbook"
---
(spacer, pushes bottom items down)
---
Gear icon + "MCP Setup"
Avatar + user name
```

Active route: detected with `usePathname()`. Apply active styles to matching item.

The main content area gets `data-theme="si"` on the root element so CSS variables apply.

---

## State Management

Use **Zustand** for:

1. `onboardingStore` — tracks current step (0–4), all form values across steps, completion flag
2. `userProfileStore` — persisted ICP config, watched accounts, signal preferences, role context

Use `persist` middleware from Zustand with `localStorage` for `userProfileStore`. Onboarding store does not need persistence.

Do not use React Context for these — the existing codebase uses Zustand, follow the same pattern.

---

## Mock Data Requirements

All data at MVP is mocked. Build mock data that is realistic and specific — no "Company ABC" or "Example Inc." Use plausible company names, real-sounding signal summaries, and specific numbers.

`src/lib/si/mockData.ts` must export:

- `MOCK_SIGNALS: SignalEvent[]` — at least 15 signals across 6 signal types and 8 companies
- `MOCK_WATCHLIST_ACCOUNTS: WatchlistAccount[]` — at least 8 accounts with varied signal history
- `MOCK_ICP_RESULTS: ICPAccount[]` — at least 25 accounts for the ICP results table
- `MOCK_PLAYBOOKS: Record<string, PlaybookData>` — at least 3 complete playbooks
- `DEMO_ACCOUNTS: WatchlistAccount[]` — 5 accounts shown when user adds 0 accounts in onboarding

---

## TypeScript Types

All types go in `src/lib/si/types.ts`. Core types:

```typescript
type SignalType = 
  | "new_funding" 
  | "hiring_surge" 
  | "intent_surge" 
  | "tech_change" 
  | "leadership_change" 
  | "expansion";

interface SignalEvent {
  id: string;
  type: SignalType;
  summary: string;
  detectedAt: string; // ISO string
  source: string;
  seenAt: string | null;
  accountId: string;
}

interface WatchlistAccount {
  id: string;
  accountName: string;
  domain: string;
  industry: string;
  revenue: string;
  employees: string;
  location: string;
  addedAt: string;
  monitoredSignals: SignalType[];
  signals: SignalEvent[];
  intentScore: number; // 0-100
  intentLabel: "Hot" | "Warm" | "Cold";
}

interface ICPConfig {
  industries: string[];
  employeeMin: number;
  employeeMax: number;
  revenueMin: number; // in $M
  revenueMax: number;
  geographies: string[];
  jobTitles: string[];
  seniorityLevels: string[];
}

interface ICPAccount {
  id: string;
  companyName: string;
  domain: string;
  industry: string;
  revenue: string;
  employees: number;
  location: string;
  icpScore: number; // 0-100
  isWatched: boolean;
}

interface Stakeholder {
  id: string;
  name: string;
  title: string;
  role: "Champion" | "Influencer" | "Economic Buyer" | "Blocker" | "Ops";
  sentiment: "positive" | "neutral" | "negative" | "unknown";
  lastActiveDaysAgo: number;
}

interface PlaybookData {
  accountId: string;
  accountName: string;
  thesis: string;
  fitHypotheses: Array<{ text: string; priority: "High" | "Med" | "Low" }>;
  landmines: Array<{ text: string; category: string }>;
  talkingPoints: Array<{ text: string }>;
  discoveryQuestions: Array<{ text: string; actionLabel: string; category: string }>;
  nextActions: Array<{ id: string; text: string; due: string; done: boolean }>;
  timeline: Array<{ date: string; event: string; type: "meeting" | "email" | "system" }>;
  stakeholders: Stakeholder[];
  generatedAt: string;
}

interface OnboardingData {
  step: number;
  company: {
    website: string;
    industry: string;
    teamSize: string;
    revenue: string;
    currentTools: string[];
  };
  icp: ICPConfig;
  watchedDomains: string[];
  signalPreferences: SignalType[];
  signalDelivery: "platform" | "daily_email" | "weekly_email";
  role: {
    primaryRole: string;
    salesMotion: string;
    dealSize: string;
    salesCycle: string;
  };
  completed: boolean;
}
```

---

## Onboarding Wizard Implementation

The wizard renders inside `OnboardingShell.tsx` which manages:
- Step progress bar (top, full width, 5 segments)
- Back button (disabled on step 1)
- Next button (validates current step before advancing)
- Step content area (renders the current step component)

Validation rules:
- Step 1: website + industry + team size required
- Step 2: at least 1 target industry required
- Step 3: no minimum (0 domains allowed)
- Step 4: at least 1 signal type required
- Step 5: primary role required

On step 5 completion, dispatch `completeOnboarding()` action in `onboardingStore`, save data to `userProfileStore`, then `router.push("/si/dashboard")` with a 2-second "Setting up your workspace..." loading screen (full-page, centered spinner + text).

---

## Landing Page Implementation Notes

The landing page is a single `page.tsx` in the `(marketing)` route group. It imports section components from `src/components/si/landing/`.

No external animation libraries. CSS transitions only (`transition-all duration-200`).

The root `layout.tsx` for the marketing group has no sidebar. Just:
- Top nav: logo left, "Sign in" link right
- `{children}`
- No footer at MVP

---

## Routing Guards

The SI routes are guarded. If the user is not authenticated, redirect to `/sign-in`. If the user is authenticated but has not completed onboarding (`userProfileStore.onboardingCompleted === false`), redirect to `/si/onboarding`.

Implement this as a `SIRouteGuard` client component that wraps `(si)/layout.tsx` children.

Do not use Next.js middleware for this at MVP — keep it simple, client-side guard only.

---

## What You Must Not Do

- Do not modify any existing pages outside the `(si)` and `(marketing)` route groups
- Do not change `globals.css` except to add new CSS variables under a `[data-theme="si"]` selector
- Do not install new npm packages without listing them first and confirming they are not already in `package.json`
- Do not build campaign builder, email sequencing, or CRM sync — these are out of scope
- Do not build mobile layouts — desktop only at MVP (min-width 1024px assumed)
- Do not build a dark mode toggle — the sidebar is always dark, the content area is always light
- Do not add billing or subscription UI
- Do not call any external APIs in the frontend — all data is mocked in `src/lib/si/mockData.ts`

---

## Packages Already in the Project (Do Not Re-Install)

- `next` (App Router)
- `react`, `react-dom`
- `typescript`
- `tailwindcss`
- `@iconify/react` (use `solar:` icon set)
- `zustand`
- `shadcn/ui` components (Button, Card, Badge, Dialog, Tabs, Checkbox, Input, Select)
- `react-router-dom` (only if already present — prefer Next.js routing)

---

## Build Order

Build in this exact order. Do not skip ahead.

1. `src/lib/si/types.ts` — all types first
2. `src/lib/si/constants.ts` — signal types, ICP options, onboarding step metadata
3. `src/lib/si/mockData.ts` — full mock data set
4. `src/lib/si/onboardingStore.ts` + `userProfileStore.ts`
5. `src/components/si/shared/SISidebar.tsx`
6. `src/(si)/layout.tsx` — shell with sidebar + route guard
7. Onboarding wizard (shell + all 5 steps)
8. Dashboard page + components
9. ICP Discovery page + components
10. Watchlist page + components
11. Playbook page + components
12. MCP page + components
13. Landing page sections
14. Sign-up + sign-in pages

---

## Definition of Done

Each page is done when:
- It renders without TypeScript errors
- It matches the design spec in SI_PRD.md
- All interactive elements (buttons, tabs, checkboxes, modals) work as described
- Empty states are implemented
- Mock data populates all data-driven surfaces
- The route guard works correctly for that route

---

## Key References

- PRD: `SI_PRD.md` (in project docs)
- Apollo UI reference: `Screenshot_2026-05-17_at_10_41_14_AM.png`
- Existing component patterns: `src/pages/AccountPlaybook.tsx`, `src/components/watchlist/watchlistData.ts`
- Existing signal types: `src/components/watchlist/SignalFilterBar.tsx`

When in doubt about a design decision not covered here, match the Apollo screenshot's layout density and button style, and ask before inventing.
