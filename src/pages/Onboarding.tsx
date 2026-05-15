import { OnboardingProvider, useOnboarding } from "@/context/OnboardingContext";
import { StepSignup } from "@/components/onboarding/StepSignup";
import { StepRole } from "@/components/onboarding/StepRole";
import { StepCompany } from "@/components/onboarding/StepCompany";
import { StepICP } from "@/components/onboarding/StepICP";
import { StepWalkthrough } from "@/components/onboarding/StepWalkthrough";

function OnboardingInner() {
  const { step } = useOnboarding();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full">
        {step === 1 && <StepSignup />}
        {step === 2 && <StepRole />}
        {step === 3 && <StepCompany />}
        {step === 4 && <StepICP />}
        {step === 5 && <StepWalkthrough />}
      </div>
    </div>
  );
}

export default function Onboarding() {
  return (
    <OnboardingProvider>
      <OnboardingInner />
    </OnboardingProvider>
  );
}
