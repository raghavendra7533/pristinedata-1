import type { SignalType } from "./types";

export const SIGNAL_TYPES: Record<SignalType, { label: string; color: string }> = {
  job_posting: { label: "Job Posting", color: "#6366F1" },
  funding: { label: "Funding", color: "#10B981" },
  leadership_change: { label: "Leadership Change", color: "#F59E0B" },
  technology_adoption: { label: "Tech Adoption", color: "#3B82F6" },
  expansion: { label: "Expansion", color: "#8B5CF6" },
  partnership: { label: "Partnership", color: "#EC4899" },
  new_funding: { label: "New Funding", color: "#10B981" },
  hiring_surge: { label: "Hiring Surge", color: "#6366F1" },
  intent_surge: { label: "Intent Surge", color: "#3B82F6" },
  tech_change: { label: "Tech Change", color: "#8B5CF6" },
};

export const INDUSTRIES = [
  "SaaS",
  "FinTech",
  "HealthTech",
  "E-Commerce",
  "EdTech",
  "MarTech",
  "HR Tech",
  "Cybersecurity",
  "DevTools",
  "Data & Analytics",
  "Manufacturing",
  "Retail",
  "Financial Services",
  "Healthcare",
  "Professional Services",
  "Media & Entertainment",
  "Real Estate",
  "Logistics & Supply Chain",
  "Other",
];

export const TEAM_SIZES = [
  "1–10",
  "11–50",
  "51–200",
  "201–500",
  "501–1000",
  "1001–5000",
  "5000+",
];

export const REVENUE_RANGES = [
  "Under $1M",
  "$1M–$10M",
  "$10M–$50M",
  "$50M–$100M",
  "$100M–$500M",
  "$500M+",
];

export const OUTBOUND_TOOLS = [
  "Outreach",
  "Salesloft",
  "Apollo",
  "HubSpot",
  "Salesforce",
  "ZoomInfo",
  "LinkedIn Sales Nav",
  "Gong",
  "Clari",
  "Groove",
  "Lemlist",
  "Instantly",
  "Other",
];

export const GEOGRAPHIES = [
  "North America",
  "Europe",
  "APAC",
  "Latin America",
  "Middle East & Africa",
  "UK & Ireland",
  "DACH",
  "Nordics",
  "ANZ",
];

export const SENIORITY_LEVELS = [
  "C-Suite",
  "VP",
  "Director",
  "Manager",
  "Individual Contributor",
];

export const PRIMARY_ROLES = [
  "Account Executive",
  "SDR / BDR",
  "Sales Manager",
  "VP of Sales",
  "CRO",
  "Revenue Operations",
  "Sales Engineer",
  "Founder",
  "Other",
];

export const SALES_MOTIONS = [
  "Inbound",
  "Outbound",
  "Product-Led",
  "Channel / Partner",
  "Mixed",
];

export const DEAL_SIZES = [
  "Under $5K",
  "$5K–$25K",
  "$25K–$100K",
  "$100K–$500K",
  "$500K+",
];

export const SALES_CYCLES = [
  "Under 1 week",
  "1–4 weeks",
  "1–3 months",
  "3–6 months",
  "6–12 months",
  "Over 12 months",
];

export const SIGNAL_OPTIONS: Array<{
  key: SignalType;
  label: string;
  description: string;
}> = [
  { key: "new_funding", label: "New Funding", description: "Funding rounds, valuations, investor activity" },
  { key: "hiring_surge", label: "Hiring Surge", description: "Rapid headcount expansion in key departments" },
  { key: "intent_surge", label: "Intent Surge", description: "Buying intent spikes detected via Bombora" },
  { key: "tech_change", label: "Tech Change", description: "Technology stack additions or replacements" },
  { key: "leadership_change", label: "Leadership Change", description: "C-suite and VP-level hires or departures" },
  { key: "expansion", label: "Expansion", description: "New offices, products, or market segments" },
];

export const STEP_LABELS = [
  "Your Company",
  "Ideal Customer Profile",
  "Watch Accounts",
  "Signal Preferences",
  "Your Role",
];

export const MCP_TOOLS: Array<{
  name: string;
  description: string;
  parameters: string;
}> = [
  {
    name: "generate_opportunity_playbook",
    description: "Generate a tailored sales playbook for a target account based on ICP fit and signals",
    parameters: "domain, context?",
  },
  {
    name: "get_watchlist_signals",
    description: "Retrieve the latest buying signals for all accounts on your watchlist",
    parameters: "limit?, since?",
  },
  {
    name: "search_icp_accounts",
    description: "Search for accounts matching your Ideal Customer Profile criteria",
    parameters: "filters?, limit?",
  },
];
