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
