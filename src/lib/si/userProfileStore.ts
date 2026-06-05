import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WatchlistAccount, ICPConfig, SignalType } from "./types";

interface UserProfile {
  name: string;
  email: string;
  company: string;
  industry: string;
  icp: ICPConfig | null;
  signalPreferences: SignalType[];
  signalDelivery: "platform" | "daily_email" | "weekly_email";
  role: string;
  linkedin?: string;
}

type PlanId = "free" | "starter" | "pro";

interface Credits {
  plan: PlanId;
  used: number;
  total: number;
}

interface UserProfileState {
  onboardingCompleted: boolean;
  profile: UserProfile | null;
  watchedAccounts: WatchlistAccount[];
  credits: Credits;
  setOnboardingCompleted: (value: boolean) => void;
  setProfile: (profile: Partial<UserProfile> & { onboardingCompleted?: boolean }) => void;
  addWatchedAccount: (account: WatchlistAccount) => void;
  clearWatchedAccounts: () => void;
  useCredits: (amount: number) => void;
  setPlan: (plan: PlanId) => void;
}

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set) => ({
      onboardingCompleted: false,
      profile: null,
      watchedAccounts: [],
      credits: { plan: "free", used: 23, total: 50 },
      setOnboardingCompleted: (value) => set({ onboardingCompleted: value }),
      setProfile: ({ onboardingCompleted: oc, ...profile }) =>
        set((s) => ({
          profile: { ...s.profile, ...profile } as UserProfile,
          ...(oc !== undefined ? { onboardingCompleted: oc } : {}),
        })),
      addWatchedAccount: (account) =>
        set((s) => ({ watchedAccounts: [...s.watchedAccounts, account] })),
      clearWatchedAccounts: () => set({ watchedAccounts: [] }),
      useCredits: (amount) =>
        set((s) => ({ credits: { ...s.credits, used: Math.min(s.credits.used + amount, s.credits.total) } })),
      setPlan: (plan) =>
        set((s) => ({
          credits: {
            plan,
            used: 0,
            total: plan === "free" ? 50 : plan === "starter" ? 1500 : 3500,
          },
        })),
    }),
    { name: "si-user-profile" }
  )
);
