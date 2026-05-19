export type SignalType =
  | "job_posting"
  | "funding"
  | "leadership_change"
  | "technology_adoption"
  | "expansion"
  | "partnership"
  | "new_funding"
  | "hiring_surge"
  | "intent_surge"
  | "tech_change";

export interface SignalEvent {
  id: string;
  type: SignalType;
  headline?: string;
  summary: string;
  detectedAt: string;
  source: string;
  seenAt: string | null;
  accountId: string;
}

export interface WatchlistAccount {
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
  intentScore: number;
  intentDelta?: number;
  intentLabel: "Hot" | "Warm" | "Cold";
}

export interface ICPConfig {
  industries: string[];
  employeeMin: number;
  employeeMax: number;
  revenueMin: number;
  revenueMax: number;
  geographies: string[];
  jobTitles: string[];
  seniorityLevels: string[];
}

export interface ICPAccount {
  id: string;
  companyName: string;
  domain: string;
  industry: string;
  revenue: string;
  employees: number;
  location: string;
  icpScore: number;
  isWatched: boolean;
}

export interface Stakeholder {
  id: string;
  name: string;
  title: string;
  role: "Champion" | "Influencer" | "Economic Buyer" | "Blocker" | "Ops";
  sentiment: "positive" | "neutral" | "negative" | "unknown";
  lastActiveDaysAgo: number;
}

export interface PlaybookData {
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

export interface OnboardingData {
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
