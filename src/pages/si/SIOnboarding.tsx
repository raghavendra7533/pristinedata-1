import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

import OnboardingShell from "@/components/si/onboarding/OnboardingShell";
import Step1Company from "@/components/si/onboarding/steps/Step1Company";
import Step2ICP from "@/components/si/onboarding/steps/Step2ICP";
import Step3Accounts from "@/components/si/onboarding/steps/Step3Accounts";
import Step4Signals from "@/components/si/onboarding/steps/Step4Signals";
import Step5Role from "@/components/si/onboarding/steps/Step5Role";

import { useOnboardingStore } from "@/lib/si/onboardingStore";
import { useUserProfileStore } from "@/lib/si/userProfileStore";
import { STEP_LABELS } from "@/lib/si/constants";
import { DEMO_ACCOUNTS } from "@/lib/si/mockData";

const TOTAL_STEPS = 5;

export default function SIOnboarding() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const store = useOnboardingStore();
  const { setProfile, addWatchedAccount, clearWatchedAccounts } = useUserProfileStore();

  const currentStep = store.step;

  const canProceed = (() => {
    switch (currentStep) {
      case 1:
        return (
          store.company.website.trim() !== "" &&
          store.company.industry !== "" &&
          store.company.teamSize !== ""
        );
      case 2:
        return store.icp.industries.length > 0;
      case 3:
        return true;
      case 4:
        return store.signalPreferences.length > 0;
      case 5:
        return store.role.primaryRole !== "";
      default:
        return false;
    }
  })();

  const isLastStep = currentStep === TOTAL_STEPS;

  const handleNext = () => {
    if (!canProceed) return;

    if (isLastStep) {
      // Derive company name from website domain
      const domain = store.company.website
        .replace(/^https?:\/\//, "")
        .replace(/\/.*$/, "")
        .trim();

      // Complete onboarding
      store.completeOnboarding();

      setProfile({
        name: "",
        email: "",
        company: domain,
        icp: store.icp,
        signalPreferences: store.signalPreferences,
        signalDelivery: store.signalDelivery,
        role: store.role.primaryRole,
        onboardingCompleted: true,
      });

      // Populate watched accounts
      clearWatchedAccounts();
      const accountsToAdd =
        store.watchedDomains.length > 0
          ? DEMO_ACCOUNTS.slice(0, store.watchedDomains.length)
          : DEMO_ACCOUNTS;
      accountsToAdd.forEach((acc) => addWatchedAccount(acc));

      // Show loading overlay then navigate
      setLoading(true);
      setTimeout(() => {
        navigate("/si/dashboard");
      }, 2000);
    } else {
      store.nextStep();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      store.prevStep();
    }
  };

  const stepLabel = STEP_LABELS[currentStep - 1] ?? "";

  const stepContent = (() => {
    switch (currentStep) {
      case 1:
        return <Step1Company />;
      case 2:
        return <Step2ICP />;
      case 3:
        return <Step3Accounts />;
      case 4:
        return <Step4Signals />;
      case 5:
        return <Step5Role />;
      default:
        return null;
    }
  })();

  return (
    <>
      <OnboardingShell
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        stepLabel={stepLabel}
        onNext={handleNext}
        onBack={handleBack}
        canProceed={canProceed}
        isLastStep={isLastStep}
      >
        {stepContent}
      </OnboardingShell>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl px-10 py-8 flex flex-col items-center gap-4 shadow-2xl">
            <Icon
              icon="solar:refresh-bold"
              className="w-10 h-10 text-[#6366F1] animate-spin"
            />
            <p className="text-base font-medium text-[#0F0F0F]">
              Setting up your workspace...
            </p>
          </div>
        </div>
      )}
    </>
  );
}
