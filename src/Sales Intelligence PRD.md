# Product Requirements Document
# Pristine Data AI — Sales Intelligence Platform (Self-Serve Frontend)

**Version:** 1.0  
**Date:** May 17, 2026  
**Owner:** Founder's Office  
**Scope:** Frontend only. No new backend APIs are being built in this sprint. All data is either mocked, sourced from existing Pristine APIs, or from the MCP/Explorium layer already in production.

---

## 1. Context and Objective

The existing Pristine Data platform (demand gen product) lives in the current Next.js repo (`pristine-next`). The Sales Intelligence (SI) product is being built in the **same directory** as a new route group: `/si/*`. This avoids repo fragmentation and lets us share the design system, auth state, and component library already in place.

The SI product is **self-serve and PLG-first**. A user signs up from a dedicated landing page, goes through a structured onboarding, and lands on a dashboard that immediately shows them value. No sales call. No white-glove setup.

The four features shipping in this MVP:

1. ICP Discovery
2. Watchlist (Signals and Intent)
3. Opportunity Playbook
4. MCP Integration (settings page + copy-paste config)

---

## 2. Commercial Framing (for design decisions)

**Primary persona:** Sudhir — a senior AE or account consultant doing named-account outbound. High win rate when account quality is right. Values signal timing and context over volume.

**Secondary persona:** Jayshree — demand gen or SDR lead running outbound at volume. Needs ICP validation and a feed that tells her team where to focus.

**The aha moment:** The first time a user sees a signal fire on an account they care about — a funding round, a hiring surge, a tech stack change — and can click straight into a playbook for that account. Everything in onboarding is designed to reach that moment as fast as possible.

---

## 3. Route Architecture

All SI routes live under `/si`. They are completely separate from the existing demand gen routes (`/search`, `/campaigns`, `/opportunities`, etc.). A persistent top nav distinguishes which product the user is in.

```
/si                          → redirects to /si/dashboard
/si/dashboard                → main dashboard with signal feed + summary cards
/si/icp                      → ICP Discovery page
/si/watchlist                → Watchlist with signal feed per account
/si/playbook/[accountId]     → Opportunity Playbook for a specific account
/si/mcp                      → MCP Integration settings
/si/onboarding               → multi-step onboarding wizard (gated, shown once)

/ (root)                     → Landing page (public, unauthenticated)
/sign-up                     → Sign-up page
/sign-in                     → Sign-in page
```

---

## 4. Landing Page (`/`)

### Purpose
Convert cold visitors into sign-ups. The landing page is the only public-facing surface. It must communicate value in under 6 seconds, handle the implicit objection ("I already use Apollo / Clay / ZoomInfo"), and drive to a single CTA.

### Design Principles
- One column, scroll-driven narrative
- No nav links except logo + "Sign in" (top right)
- Single CTA throughout: "Get started free" (anchors to sign-up)
- No pricing section on the landing page at MVP
- No feature carousels or tabbed demos — static, confident

### Sections (in order)

**Hero**
- Headline: "Your reps shouldn't be guessing which accounts to call."
- Sub-headline: "Pristine watches your target accounts, fires signals when the moment is right, and hands your AEs a playbook before the first call."
- CTA button: "Get started free" (pastel indigo, pill shape, Apollo-style)
- Background: clean off-white (`#F8F8FA`), no illustration, no animation

**Pain Section (3 columns, icon + short copy)**
- "You're stitching together 4–6 tools to get one usable list."
- "Your reps are calling accounts that haven't shown any intent."
- "By the time your team knows to reach out, someone else already did."

Reasoning: These map directly to the Clay/Apollo/ZoomInfo stack the ICP is running. We do not name them. We describe their pain point precisely.

**How It Works (3 steps, horizontal)**
1. Tell us who you sell to
2. We watch your accounts for signals
3. Your reps get a playbook when the moment hits

**Feature Tiles (2x2 grid)**
- ICP Discovery
- Signal Watchlist
- Opportunity Playbook
- MCP Integration

Each tile: icon, name, one sentence.

**CTA Footer**
- Repeat headline + "Get started free" button

### Color palette (landing page)
- Background: `#F8F8FA`
- Text primary: `#0F0F0F`
- Text secondary: `#6B7280`
- CTA button: `#6366F1` (indigo pastel) with white text
- Tile backgrounds: white with `1px solid #E5E7EB`
- Accent for signal/intent: soft amber `#F59E0B`

---

## 5. Sign-up Flow (`/sign-up`)

### Form Fields
- Work email (required)
- Full name (required)
- Password (required, min 8 chars)
- Company name (required)

Single page. No OAuth at MVP. Submit triggers account creation and redirects to `/si/onboarding`.

Reasoning: We ask for company name here so onboarding can pre-fill and feel faster. Work email gates out personal accounts without us having to enforce it manually.

### Design
- Centered card on `#F8F8FA` background
- Logo top-left of card
- Pastel indigo submit button matching landing page CTA
- "Already have an account? Sign in" below the button

---

## 6. Onboarding Wizard (`/si/onboarding`)

### Purpose
This is the most important surface in the product. The data we collect here is what powers ICP Discovery, the Watchlist, and the Playbook. Weak onboarding = weak first session.

This wizard runs **once**. After completion, the user never sees it again. It is not skippable. We make this okay by keeping it short: 5 steps, under 3 minutes.

A persistent progress bar at the top shows step X of 5.

### Step 1 — About Your Company

**Heading:** "Let's start with your company"

Fields:
- Company website (required) — we use this to auto-enrich firmographic data
- Industry (single select): SaaS, Fintech, HealthTech, eCommerce, Agency, Professional Services, Other
- Team size (single select): 1–10, 11–50, 51–200, 201–1000, 1000+
- Annual revenue (single select): Under $1M, $1M–$5M, $5M–$30M, $30M–$100M, Over $100M
- Current outbound tools (multi-select chips): Apollo, Clay, ZoomInfo, Sales Navigator, Outreach, Salesloft, Instantly, None, Other

Reasoning: The outbound tools question tells us exactly what stack they're coming from. This is competitive intelligence we can use for positioning AND for personalizing their dashboard ("We noticed you're using Apollo — here's what you can consolidate.").

### Step 2 — Your ICP

**Heading:** "Who do you sell to?"

Fields:
- Target industries (multi-select chips with search): same taxonomy as industry list, multi-pick
- Company size range (dual-handle range slider): Employees min/max (1 to 10,000+)
- Revenue range (dual-handle range slider): $1M to $500M+
- Geographies (multi-select): North America, EMEA, APAC, LATAM, Global
- Target job titles (free-text tags input): e.g. "VP Sales", "Head of RevOps", "CTO"
- Seniority levels (multi-select chips): C-Suite, VP, Director, Manager, IC

Reasoning: This is the raw material for ICP Discovery. The more specific, the faster the first session delivers value. We are not asking this for CRM purposes — it goes directly into the signal filter logic.

### Step 3 — Your Target Accounts

**Heading:** "Any accounts you're already tracking?"

- Domain input (free-text, multi-value): paste or type domains one by one, hit Enter to add
- CSV upload option: "Upload a list of domains (CSV)"
- Helper text: "We'll start watching these accounts for signals immediately."

Minimum: 0 required. Maximum shown in input: 20 for MVP. If they add 0, we prefill with 5 demo accounts visible in the watchlist.

Reasoning: This is how we deliver day-one value. A user who adds even 3 domains will see signals in the watchlist. A user who adds 0 sees mock data but with a persistent nudge to add real accounts.

### Step 4 — Signal Preferences

**Heading:** "What signals matter to you?"

Multi-select chips with brief explanations:
- New funding round — "Accounts that just raised money have budget"
- Hiring surge — "Teams expanding usually need new tooling"
- Tech stack change — "A platform swap is a buying window"
- Intent data spike — "Accounts researching topics you solve"
- Leadership change — "New leaders rebuild their stack"
- Expansion / new office — "Growth means new problems"

Default: all selected. User can deselect.

Delivery preference (single select):
- In-platform only
- Email digest (daily)
- Email digest (weekly)

Reasoning: Letting users own signal types reduces noise and increases trust. If they get signals they don't care about, they churn. This step is fast and gives them a sense of control.

### Step 5 — Role Context

**Heading:** "One last thing — how do you sell?"

This step personalizes the dashboard layout and playbook defaults.

- Primary role (single select): AE / Account Executive, SDR / BDR, Founder doing sales, Sales Manager, RevOps, Other
- Sales motion (single select): Named accounts (high-touch), High volume outbound, Inbound + outbound mix, ABM
- Average deal size (single select): Under $5K, $5K–$25K, $25K–$100K, Over $100K
- Average sales cycle (single select): Under 2 weeks, 2–8 weeks, 2–6 months, Over 6 months

On completion: show a brief "Setting up your workspace..." loading state (2 seconds), then redirect to `/si/dashboard`.

---

## 7. Dashboard (`/si/dashboard`)

### Layout
Left sidebar (fixed, 220px) + main content area. Mirrors Apollo's layout but is not a copy of it.

**Sidebar items:**
- Logo + "Pristine SI" label (top)
- Dashboard (home icon)
- ICP Discovery
- Watchlist
- Playbook
- MCP (settings gear icon, bottom of sidebar)
- User avatar + name (bottom)

### Main Content — Dashboard

**Top bar:** "Good morning, [Name]" + date

**Summary cards (4 in a row):**
1. Accounts Watched — count
2. Signals This Week — count with delta vs last week
3. Active Playbooks — count
4. ICP Match Score — percentage (how well their watchlist matches their stated ICP)

**Signal Feed (main panel)**

Heading: "Latest Signals"

Each signal card contains:
- Account name + domain favicon
- Signal type badge (color-coded: amber for funding, blue for hiring, purple for intent, etc.)
- Signal summary (1–2 sentences, e.g. "Acme Corp raised a $12M Series A. Signals strong GTM expansion.")
- Detected timestamp ("6 hours ago")
- Two action buttons: "View Playbook" and "Add to Watchlist" (if not already added)

Empty state (no signals yet): soft illustration + "Your signals will appear here once we start monitoring your accounts. Add accounts to your watchlist to get started."

**Right panel (condensed, 280px):**
- "Your ICP" summary card (3–4 lines, edit button)
- "Top accounts by intent" (ranked list, 5 accounts)

### Color palette (app)
- Sidebar background: `#0F0F0F` (near-black, matches Apollo's dark sidebar)
- Sidebar text: `#A1A1AA`
- Sidebar active item: white text + `#6366F1` left border
- Main content background: `#F8F8FA`
- Card background: white
- Card border: `1px solid #E5E7EB`
- Card shadow: `0 1px 3px rgba(0,0,0,0.06)`
- Primary button: `#6366F1` pill shape, white text
- Signal badges:
  - Funding: `#F59E0B` (amber)
  - Hiring: `#3B82F6` (blue)
  - Intent: `#8B5CF6` (violet)
  - Tech change: `#10B981` (emerald)
  - Leadership: `#EC4899` (pink)
- Typography: Inter (already in project)
- Radius on cards: `12px`
- Radius on buttons: `9999px` (pill)

---

## 8. ICP Discovery (`/si/icp`)

**Purpose:** Let users refine their ICP and see a live preview of matching accounts.

### Layout
Split view: ICP controls (left 380px) + results table (right)

**ICP Controls Panel**
- Editable version of Step 2 onboarding data
- "Update ICP" button triggers re-query
- "ICP Match Score" indicator at top (updates live)

**Results Table**
Columns: Company, Industry, Revenue, Employees, Location, ICP Score (0–100), Actions (Add to Watchlist)

Pagination: 25 per page.

Search bar above table: "Filter by company name or domain"

Export button (top right): "Export CSV" — downloads current filtered results.

Empty state if ICP is too narrow: "No accounts match this ICP. Try broadening your filters."

---

## 9. Watchlist (`/si/watchlist`)

**Purpose:** See all monitored accounts and their latest signals in one place.

### Layout
Top filter bar + account card list

**Filter Bar**
- Signal type filter (chips: All, Funding, Hiring, Intent, Tech Change, Leadership)
- Time range (Last 24h, Last 7 days, Last 30 days)
- Search by account name

**Account Cards**

Each card:
- Left: Account name, domain, industry tag, revenue range, employee count, location
- Center: Signal timeline (up to 3 most recent signals, each with type badge + 1-line summary + timestamp)
- Right: "View Playbook" button (primary) + "Remove" (ghost)

"Add Account" button (top right of page): opens a modal with domain input + signal preference multi-select for that account.

---

## 10. Opportunity Playbook (`/si/playbook/[accountId]`)

**Purpose:** Give the AE a structured, AI-generated brief before engaging a specific account.

### Layout
Two-column: account context (left 300px, sticky) + playbook content (right, tabbed)

**Left Panel — Account Context**
- Account name, logo (via Clearbit/favicon fallback)
- Firmographic summary: revenue, employees, industry, location
- Intent score badge (Hot / Warm / Cold)
- Monitored signals list (pinned, last 5)
- Stakeholders section (if added by user): name, title, role tag (Champion / Influencer / Economic Buyer / Blocker)
- "Add Stakeholder" button

**Right Panel — Playbook Tabs**

Tab 1: Overview
- Thesis: 2–3 sentences on why this account is a fit
- Fit Hypotheses: bulleted list with priority tags (High / Med / Low)
- Landmines: risks and blockers to watch

Tab 2: Discovery Questions
- Categorized questions: open-ended, pain-focused, qualification
- Each question has a one-word action label (e.g. "Confirm pain", "Quantify gap")

Tab 3: Talking Points
- Pre-call talking points tied to known signals
- Each point references the signal that generated it

Tab 4: Next Actions
- Checklist of suggested next steps with due dates (Today / Tomorrow / This week)
- Checkbox to mark done

Tab 5: Timeline
- Activity log: signals detected, stakeholders added, playbook viewed, notes

**"Generate Playbook" button (top right):** Calls the existing `generate_opportunity_playbook` MCP function with `company_domain`. Shows a loading state ("Building your playbook..."). Surfaces the result into the tab content.

---

## 11. MCP Integration (`/si/mcp`)

**Purpose:** Allow technical users (or power users with Claude Code) to call Pristine's intelligence functions via MCP.

### Layout
Settings-style page. No sidebar collapse.

**Sections:**

1. **Your MCP Endpoint**
   - Read-only code block with the MCP server URL
   - "Copy" button

2. **API Key**
   - Masked key display
   - "Regenerate" button (with confirmation modal)
   - "Copy" button

3. **Available Tools**
   Table with columns: Tool Name, Description, Parameters, Status
   - `generate_opportunity_playbook` — "Generates a full playbook for a given company domain" — `company_domain: string` — Active
   - `get_watchlist_signals` — "Returns latest signals for all watched accounts" — `limit?: number` — Active
   - `search_icp_accounts` — "Returns accounts matching your ICP" — `filters?: object` — Active

4. **Claude Code Quickstart**
   Collapsible section with a copy-paste code snippet showing how to configure the MCP server in `claude_code_config.json`.

5. **Usage Log**
   Table: Timestamp, Tool Called, Domain (if applicable), Status (Success / Error), Latency

---

## 12. Onboarding Completion State + First Session UX

After onboarding, the first dashboard load should feel like the product already knows them:

- The summary card "Accounts Watched" shows the accounts they added in Step 3 (or 5 demo accounts with a banner: "These are demo accounts. Add your real accounts to get live signals.")
- If they added real accounts, show a "Checking for signals..." skeleton state that resolves in 3–5 seconds to real or recent signal data
- The ICP card in the right panel reflects exactly what they configured
- A single persistent nudge card (dismissible after first week): "Add more accounts to your watchlist to improve signal coverage."

---

## 13. What This MVP Does NOT Include

The following are explicitly out of scope for this build. Do not design for them. Do not leave placeholders.

- Campaign builder or sequence execution (that lives in the demand gen product)
- CRM sync (Salesforce / HubSpot)
- Team collaboration or shared workspaces
- Billing / subscription management UI (handled externally)
- Mobile responsive layout (desktop-only for MVP)
- Dark mode toggle (sidebar is dark; app body is light — that is the design, not a mode)

---

## 14. Open Questions for Ashok Before Build

1. **Auth:** Are we reusing the existing Pristine auth layer, or do SI users get a separate login?
2. **ICP Discovery data source:** What API does the ICP results table call? Is this Explorium, Apollo free tier, or mocked?
3. **Playbook generation:** The existing MCP calls `generate_opportunity_playbook` with `company_domain`. Is this live in production or still needs to be wired to the new SI route?
4. **Signal data freshness:** Are signals coming from Explorium real-time or batch? This affects what we show in the watchlist empty state.
5. **Onboarding data persistence:** Where does onboarding data get written? User profile table? Separate ICP config table?

---

## 15. Success Metrics for MVP

- Time to first signal seen: under 5 minutes from sign-up
- Onboarding completion rate: target 80%+
- Accounts added in onboarding: target median of 5+
- Playbook views per user per week: target 3+
- D7 retention: target 40%+
