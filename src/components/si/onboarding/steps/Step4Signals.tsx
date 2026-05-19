import { Icon } from "@iconify/react";
import { useOnboardingStore } from "@/lib/si/onboardingStore";
import { SIGNAL_OPTIONS } from "@/lib/si/constants";
import type { SignalType } from "@/lib/si/types";

const DELIVERY_OPTIONS: Array<{
  value: "platform" | "daily_email" | "weekly_email";
  label: string;
  description: string;
}> = [
  { value: "platform", label: "In-platform only", description: "View signals inside Pristine SI" },
  { value: "daily_email", label: "Email digest (daily)", description: "Morning summary to your inbox" },
  { value: "weekly_email", label: "Email digest (weekly)", description: "Weekly roundup every Monday" },
];

export default function Step4Signals() {
  const { signalPreferences, signalDelivery, setSignalPreferences, setSignalDelivery } =
    useOnboardingStore();

  const toggleSignal = (key: SignalType) => {
    if (signalPreferences.includes(key)) {
      setSignalPreferences(signalPreferences.filter((s) => s !== key));
    } else {
      setSignalPreferences([...signalPreferences, key]);
    }
  };

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-2xl font-semibold text-[#0F0F0F]">Choose your signals</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Select the buying signals you want to track. All are on by default.
        </p>
      </div>

      {/* Signal cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SIGNAL_OPTIONS.map((sig) => {
          const selected = signalPreferences.includes(sig.key);
          return (
            <button
              key={sig.key}
              type="button"
              onClick={() => toggleSignal(sig.key)}
              className={`text-left rounded-xl border p-4 transition-all ${
                selected
                  ? "border-[#6366F1] bg-[#EEF2FF]"
                  : "border-[#E5E7EB] bg-white hover:border-[#C7D2FE]"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-[#0F0F0F]">{sig.label}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">{sig.description}</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    selected
                      ? "bg-[#6366F1] border-[#6366F1]"
                      : "border-[#D1D5DB] bg-white"
                  }`}
                >
                  {selected && (
                    <Icon icon="solar:check-read-bold" className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {signalPreferences.length === 0 && (
        <p className="text-xs text-[#EF4444]">Select at least one signal type to continue.</p>
      )}

      {/* Signal delivery */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-[#374151]">
          How would you like to receive signals?
        </label>
        <div className="flex flex-col gap-2">
          {DELIVERY_OPTIONS.map((opt) => {
            const active = signalDelivery === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSignalDelivery(opt.value)}
                className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                  active
                    ? "border-[#6366F1] bg-[#EEF2FF]"
                    : "border-[#E5E7EB] bg-white hover:border-[#C7D2FE]"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    active ? "border-[#6366F1]" : "border-[#D1D5DB]"
                  }`}
                >
                  {active && <div className="w-2 h-2 rounded-full bg-[#6366F1]" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#0F0F0F]">{opt.label}</p>
                  <p className="text-xs text-[#6B7280]">{opt.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
