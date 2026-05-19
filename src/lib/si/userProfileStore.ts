import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WatchlistAccount, ICPConfig, SignalType } from "./types";

interface UserProfile {
  name: string;
  email: string;
  company: string;
  icp: ICPConfig | null;
  signalPreferences: SignalType[];
  signalDelivery: "platform" | "daily_email" | "weekly_email";
  role: string;
}

interface UserProfileState {
  onboardingCompleted: boolean;
  profile: UserProfile | null;
  watchedAccounts: WatchlistAccount[];
  setOnboardingCompleted: (value: boolean) => void;
  setProfile: (profile: Partial<UserProfile> & { onboardingCompleted?: boolean }) => void;
  addWatchedAccount: (account: WatchlistAccount) => void;
  clearWatchedAccounts: () => void;
}

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set) => ({
      onboardingCompleted: false,
      profile: null,
      watchedAccounts: [],
      setOnboardingCompleted: (value) => set({ onboardingCompleted: value }),
      setProfile: ({ onboardingCompleted: oc, ...profile }) =>
        set((s) => ({
          profile: { ...s.profile, ...profile } as UserProfile,
          ...(oc !== undefined ? { onboardingCompleted: oc } : {}),
        })),
      addWatchedAccount: (account) =>
        set((s) => ({ watchedAccounts: [...s.watchedAccounts, account] })),
      clearWatchedAccounts: () => set({ watchedAccounts: [] }),
    }),
    { name: "si-user-profile" }
  )
);
