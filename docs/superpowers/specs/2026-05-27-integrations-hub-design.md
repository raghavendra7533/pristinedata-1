# Integrations Hub — Design Spec
**Date:** 2026-05-27  
**Route:** `/integrations`  
**Replaces:** existing tab-based Integrations page

---

## Overview

A top-tier SaaS integrations hub at `/integrations`. Serves two personas: new users setting up for the first time, and existing users managing connected tools. Fully replaces the current tab-based Integrations page. All connect/disconnect interactions are UI-only (no real OAuth).

---

## Layout

Two-column layout with `max-w-7xl` container. Desktop: `grid-cols-[1fr_2fr]`. Mobile: single column.

### Left Column (sticky, `1/3` width)
- Page title: **"Integrations"** (bold, 24px)
- Subtitle: *"Connect Pristine to your existing stack. The more context we have, the sharper your signals."* (muted, 14px)
- Vertical category filter list: `All`, `CRM`, `Email`, `Calendar`, `Messaging`
  - Active state: indigo text + `bg-primary/10` pill
  - Inactive: muted text, hover foreground
- Bottom: "Request an integration" link with `solar:add-circle-linear` icon

### Right Column (`2/3` width)
- Contextual banner (see Banner Logic)
- 2-column card grid (`grid-cols-2`, single on mobile)
- "Coming soon" section below

---

## Integration Cards

**Card anatomy:**
- White background, `border border-slate-200`, `rounded-xl`, `p-6`
- Hover: `shadow-md` increase + slight `translateY(-1px)`, `200ms ease`
- Connected state: `border-l-4 border-l-emerald-500` + very subtle `bg-emerald-50/30` tint

**Card contents (top to bottom):**
1. Logo container: `w-12 h-12 rounded-xl` with brand-colored subtle bg tint + icon
2. Integration name (bold, 16px) + status badge inline
3. One-line description (muted, 14px)
4. Primary action button: **"Connect"** (indigo, full-width) or **"Disconnect"** (ghost, red text)
5. CRM card only: Salesforce/HubSpot toggle (`<select>` or segmented control) above Connect button

**Status badges:**
- `Connected`: green pill (`bg-emerald-500/10 text-emerald-700 border-emerald-500/20`)
- `Not connected`: slate pill (`bg-slate-100 text-slate-500 border-slate-200`)
- `Recommended`: indigo pill (`bg-primary/10 text-primary border-primary/20`)

---

## The 5 Integrations

| ID | Name | Category | Description | Badge | Brand color tint |
|----|------|----------|-------------|-------|-----------------|
| `gmail` | Gmail | Email | Sync email threads and auto-enrich contact activity from your inbox. | Recommended | `bg-red-50` |
| `crm` | CRM | CRM | Bi-directional sync of accounts, contacts, and opportunities. | Recommended | `bg-blue-50` (SF) / `bg-orange-50` (HubSpot) |
| `gcal` | Google Calendar | Calendar | Pull meeting context into playbooks and track engagement cadence. | — | `bg-blue-50` |
| `slack` | Slack | Messaging | Receive signal alerts and share playbooks directly in Slack channels. | — | `bg-purple-50` |
| `whatsapp` | WhatsApp | Messaging | Send follow-up messages and receive reply signals from WhatsApp Business. | — | `bg-green-50` |

---

## State Management (local `useState`)

```ts
connectedIds: Set<string>          // which integrations are connected
activeCategory: string             // 'All' | 'CRM' | 'Email' | 'Calendar' | 'Messaging'
bannerDismissed: boolean
crmSelection: 'salesforce' | 'hubspot'
disconnectConfirm: string | null   // id of integration awaiting disconnect confirm
notifiedIds: Set<string>           // coming soon integrations user clicked "Notify me"
```

---

## Connect / Disconnect Flow

**Connect:**
1. Button changes to "Connected" with `solar:check-circle-bold` icon, green
2. Status badge updates to "Connected" (green)
3. Card gets `border-l-4 border-l-emerald-500`
4. Sonner toast appears bottom-right: `"[Name] connected successfully."`
5. Banner re-evaluates

**Disconnect:**
- Connected cards show a ghost/destructive "Disconnect" button below the Connect button
- Clicking shows inline confirmation inside the card: *"Disconnect [name]? This will stop syncing data."* + Cancel / Disconnect buttons
- On confirm: card returns to unconnected state, toast: `"[Name] disconnected."`

---

## Banner Logic

Mounted at top of right column. Transitions: `200ms ease`.

| Condition | Banner |
|-----------|--------|
| 0 integrations connected | Indigo-tinted: *"Connect at least Gmail or your CRM to unlock the full Pristine experience."* + Dismiss button |
| 1–2 connected, CRM not connected | Blue-tinted: *"Good start. Connect your CRM to get bi-directional sync."* + Dismiss button |
| All Recommended connected (Gmail + CRM) | Banner hidden |
| Banner dismissed | Hidden (until page remount) |

---

## Coming Soon Section

Heading: "Coming soon" with a `solar:clock-circle-linear` icon.  
3 cards in the same grid, greyed out (`opacity-60`), no hover lift.  
- Outreach
- HubSpot Sequences
- LinkedIn Sales Navigator

Each has:
- "Coming soon" badge (slate)
- "Notify me" button (outline) — toggles to "You'll be notified" (with check icon) on click

---

## Category Filter Behavior

Clicking a category filters the right column to show only cards in that category. "Coming soon" section always shows regardless of filter (unless "All" is the only filter that shows it — always visible).

---

## Files Changed

| Action | File |
|--------|------|
| Replace | `src/pages/Integrations.tsx` |
| No change needed | `src/App.tsx` (route already registered) |
| No change needed | `src/components/layout/AppLayout.tsx` (sidebar link already exists) |

The existing `src/components/integrations/` folder and its files (`IntegrationCard.tsx`, `ActiveIntegrationRow.tsx`, `ManageIntegrationSheet.tsx`) are no longer used by the new page. They are left in place (not deleted) to avoid breaking anything.
