import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface OnboardingData {
  name: string;
  email: string;
  password: string;
  role: string;
  companyName: string;
  companyWebsite: string;
  companyDescription: string;
  industry: string;
  companySize: string;
  geographies: string[];
  jobTitles: string[];
}

const defaultData: OnboardingData = {
  name: "",
  email: "",
  password: "",
  role: "",
  companyName: "",
  companyWebsite: "",
  companyDescription: "",
  industry: "",
  companySize: "",
  geographies: [],
  jobTitles: [],
};

interface OnboardingContextValue {
  step: number;
  data: OnboardingData;
  setStep: (step: number) => void;
  updateData: (partial: Partial<OnboardingData>) => void;
  completeOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(() => {
    try {
      const saved = localStorage.getItem("pristine_onboarding");
      return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
    } catch {
      return defaultData;
    }
  });

  useEffect(() => {
    localStorage.setItem("pristine_onboarding", JSON.stringify(data));
  }, [data]);

  const updateData = (partial: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const completeOnboarding = () => {
    localStorage.setItem("pristine_onboarded", "true");
  };

  return (
    <OnboardingContext.Provider value={{ step, data, setStep, updateData, completeOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used inside OnboardingProvider");
  return ctx;
}
