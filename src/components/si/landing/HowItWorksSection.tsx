import { Icon } from "@iconify/react";

const steps = [
  { number: 1, label: "Tell us who you sell to" },
  { number: 2, label: "We watch your accounts for signals" },
  { number: 3, label: "Your reps get a playbook when the moment hits" },
];

export function HowItWorksSection() {
  return (
    <section className="bg-[#F8F8FA] py-20 px-6">
      <h2 className="text-2xl font-semibold text-[#0F0F0F] text-center">How it works</h2>
      <div className="flex gap-8 max-w-4xl mx-auto mt-12 justify-center items-center">
        {steps.map((step, index) => (
          <>
            <div key={step.number} className="flex flex-col items-center text-center max-w-[180px]">
              <div className="w-10 h-10 rounded-full bg-[#6366F1] flex items-center justify-center text-white text-sm font-bold">
                {step.number}
              </div>
              <p className="text-sm text-[#6B7280] mt-3 leading-relaxed">{step.label}</p>
            </div>
            {index < steps.length - 1 && (
              <Icon
                key={`arrow-${index}`}
                icon="solar:arrow-right-linear"
                className="text-[#D1D5DB] flex-shrink-0"
                width={24}
                height={24}
              />
            )}
          </>
        ))}
      </div>
    </section>
  );
}
