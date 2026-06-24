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
  description?: string;
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

export interface PlaybookPlay {
  id: string;
  timeHorizon: "This week" | "This month" | "Before close";
  title: string;
  subtitle: string;
  assignee?: string;
  actionLabels: string[];
}

export interface DealRisk {
  category: string;
  risk: string;
  impact: "High" | "Medium" | "Low";
  probability: "High" | "Medium" | "Low";
  owner: string;
  mitigation: string;
}

export interface Objection {
  tag: string;
  text: string;
  documentLabel?: string;
}

export interface PlaybookVersion {
  version: number;
  generatedAt: string;
  sourceMeeting?: string;
}

export type PlaybookStatus = "Active" | "Acting Now" | "Going Cold" | "Closing";

export interface PlaybookData {
  accountId: string;
  accountName: string;
  status?: PlaybookStatus;
  thesis: string;
  summary?: string[];
  successCriteria?: string[];
  plays?: PlaybookPlay[];
  dealObjective?: string[];
  dealRisks?: DealRisk[];
  overallRisk?: "High" | "Medium" | "Low";
  objections?: Objection[];
  versions?: PlaybookVersion[];
  dealValue?: string;
  dealStage?: string;
  version?: number;
  sourceMeeting?: string;
  fitHypotheses: Array<{ text: string; priority: "High" | "Med" | "Low" }>;
  landmines: Array<{ text: string; category: string }>;
  talkingPoints: Array<{ text: string }>;
  discoveryQuestions: Array<{ text: string; actionLabel: string; category: string }>;
  nextActions: Array<{ id: string; text: string; due: string; done: boolean }>;
  timeline: Array<{ date: string; event: string; type: "meeting" | "email" | "system" }>;
  stakeholders: Stakeholder[];
  generatedAt: string;
  recentNews?: Array<{ tag: string; text: string; date?: string }>;
  competitorActivity?: Array<{ tag: string; text: string }>;
}

export interface AccountMeeting {
  id: string;
  date: string;
  durationMin: number;
  meetingType: string;
  title: string;
  attendees: string;
  tags: Array<{ label: string; color: "indigo" | "green" | "amber" | "rose" | "gray" }>;
  summary: string;
}

export interface DealSnapshot {
  health: "On track" | "At risk" | "Blocked";
  amount: string;
  stageProbability: string;
  nextMilestone: string;
  meetingsLogged: number;
  meetingsPeriod: string;
  team: string;
  pathLabel?: string;
}

export interface MutualActionItem {
  id: string;
  text: string;
  assignee: string;
  status: "done" | "due" | "target";
  dateLabel: string;
}

export interface AccountDetails {
  accountId: string;
  dealStage?: string;
  dealValue?: string;
  targetCloseDate?: string;
  champion?: string;
  playbookVersion?: number;
  updatedLabel?: string;
  accountSummaryWithMeetings?: string;
  accountSummaryWithoutMeetings?: string;
  meetings: AccountMeeting[];
  dealSnapshot?: DealSnapshot;
  mutualActionPlan?: MutualActionItem[];
  companyOverview?: string;
  productOffering?: string;
  icpSummary?: string;
  strategicObjectives?: string[];
  icpPersonas?: string[];
  messagingThemes?: string[];
  priorityTopics?: string[];
  engagementHooks?: string[];
  dataQualityNote?: string;
  competitorOverview?: string;
  competitors?: Array<{ name: string; description: string }>;
  marketPosition?: string;
}

export interface PlaybookListItem {
  id: string;
  accountId: string;
  accountName: string;
  status: "Active" | "Paused";
  lastUpdated: string;
  nextAction: string;
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
  notificationChannel?: "platform" | "email" | "slack" | "whatsapp";
  role: {
    primaryRole: string;
    salesMotion: string;
    dealSize: string;
    salesCycle: string;
  };
  completed: boolean;
}
