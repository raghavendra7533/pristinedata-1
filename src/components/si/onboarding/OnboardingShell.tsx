import { Icon } from "@iconify/react";

interface OnboardingShellProps {
  currentStep: number;
  totalSteps: number;
  stepLabel: string;
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
  isLastStep: boolean;
  children: React.ReactNode;
}

export default function OnboardingShell({
  currentStep,
  totalSteps,
  stepLabel,
  onNext,
  onBack,
  canProceed,
  isLastStep,
  children,
}: OnboardingShellProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col font-[Manrope]">
      {/* Progress bar */}
      <div className="w-full flex">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 transition-colors duration-300"
            style={{
              backgroundColor: i < currentStep ? "#6366F1" : "#E5E7EB",
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-[#F3F4F6]">
        <span className="text-lg font-bold text-[#0F0F0F] tracking-tight">
          Pristine <span style={{ color: "#6366F1" }}>SI</span>
        </span>
        <span className="text-sm text-[#6B7280]">
          Step {currentStep} of {totalSteps} — {stepLabel}
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto px-4 py-10">
        <div className="max-w-2xl mx-auto">{children}</div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#F3F4F6] px-8 py-4 flex items-center justify-between bg-white">
        <button
          onClick={onBack}
          disabled={currentStep === 1}
          className="flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#374151] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Icon icon="solar:arrow-left-linear" className="w-4 h-4" />
          Back
        </button>

        <button
          onClick={onNext}
          disabled={!canProceed}
          className="rounded-full bg-[#6366F1] text-white px-6 py-2.5 text-sm font-medium hover:bg-[#4F46E5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLastStep ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}
