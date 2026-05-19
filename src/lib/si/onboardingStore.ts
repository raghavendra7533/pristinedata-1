import { create } from "zustand";
import type { OnboardingData, SignalType, ICPConfig } from "./types";

const DEFAULT_ICP: ICPConfig = {
  industries: [],
  employeeMin: 50,
  employeeMax: 5000,
  revenueMin: 1,
  revenueMax: 100,
  geographies: ["North America"],
  jobTitles: [],
  seniorityLevels: [],
};

const DEFAULT_STATE: OnboardingData = {
  step: 1,
  company: {
    website: "",
    industry: "",
    teamSize: "",
    revenue: "",
    currentTools: [],
  },
  icp: DEFAULT_ICP,
  watchedDomains: [],
  signalPreferences: ["new_funding", "hiring_surge", "intent_surge", "tech_change", "leadership_change", "expansion"] as SignalType[],
  signalDelivery: "platform",
  role: {
    primaryRole: "",
    salesMotion: "",
    dealSize: "",
    salesCycle: "",
  },
  completed: false,
};

interface OnboardingStore extends OnboardingData {
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setCompany: (company: Partial<OnboardingData["company"]>) => void;
  setICP: (icp: Partial<ICPConfig>) => void;
  setWatchedDomains: (domains: string[]) => void;
  setSignalPreferences: (prefs: SignalType[]) => void;
  setSignalDelivery: (delivery: OnboardingData["signalDelivery"]) => void;
  setRole: (role: Partial<OnboardingData["role"]>) => void;
  completeOnboarding: () => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  ...DEFAULT_STATE,
  setStep: (step) => set({ step }),
  nextStep: () => set((s) => ({ step: Math.min(s.step + 1, 5) })),
  prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),
  setCompany: (company) => set((s) => ({ company: { ...s.company, ...company } })),
  setICP: (icp) => set((s) => ({ icp: { ...s.icp, ...icp } })),
  setWatchedDomains: (watchedDomains) => set({ watchedDomains }),
  setSignalPreferences: (signalPreferences) => set({ signalPreferences }),
  setSignalDelivery: (signalDelivery) => set({ signalDelivery }),
  setRole: (role) => set((s) => ({ role: { ...s.role, ...role } })),
  completeOnboarding: () => set({ completed: true }),
  reset: () => set(DEFAULT_STATE),
}));
