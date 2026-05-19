import { useOnboardingStore } from "@/lib/si/onboardingStore";
import { PRIMARY_ROLES, SALES_MOTIONS, DEAL_SIZES, SALES_CYCLES } from "@/lib/si/constants";

interface SingleSelectChipsProps {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
}

function SingleSelectChips({ label, options, value, onChange, required }: SingleSelectChipsProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[#374151]">
        {label}
        {required && <span className="text-[#EF4444] ml-0.5">*</span>}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`rounded-full border px-3 py-1 text-sm cursor-pointer transition-colors ${
                selected
                  ? "bg-[#6366F1] text-white border-[#6366F1]"
                  : "border-[#E5E7EB] text-[#374151] hover:border-[#6366F1]"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Step5Role() {
  const { role, setRole } = useOnboardingStore();

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-2xl font-semibold text-[#0F0F0F]">Tell us about your role</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          We use this to personalize playbooks and signal prioritization for your workflow.
        </p>
      </div>

      <SingleSelectChips
        label="Primary role"
        options={PRIMARY_ROLES}
        value={role.primaryRole}
        onChange={(val) => setRole({ primaryRole: val })}
        required
      />

      {role.primaryRole === "" && (
        <p className="text-xs text-[#EF4444] -mt-4">Select your primary role to continue.</p>
      )}

      <SingleSelectChips
        label="Sales motion"
        options={SALES_MOTIONS}
        value={role.salesMotion}
        onChange={(val) => setRole({ salesMotion: val })}
      />

      <SingleSelectChips
        label="Average deal size"
        options={DEAL_SIZES}
        value={role.dealSize}
        onChange={(val) => setRole({ dealSize: val })}
      />

      <SingleSelectChips
        label="Average sales cycle"
        options={SALES_CYCLES}
        value={role.salesCycle}
        onChange={(val) => setRole({ salesCycle: val })}
      />
    </div>
  );
}
