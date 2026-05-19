import { useOnboardingStore } from "@/lib/si/onboardingStore";
import {
  INDUSTRIES,
  TEAM_SIZES,
  REVENUE_RANGES,
  OUTBOUND_TOOLS,
} from "@/lib/si/constants";

export default function Step1Company() {
  const { company, setCompany } = useOnboardingStore();

  const toggleTool = (tool: string) => {
    const current = company.currentTools;
    if (current.includes(tool)) {
      setCompany({ currentTools: current.filter((t) => t !== tool) });
    } else {
      setCompany({ currentTools: [...current, tool] });
    }
  };

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-2xl font-semibold text-[#0F0F0F]">Tell us about your company</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          This helps us tailor your signal feed and ICP recommendations.
        </p>
      </div>

      {/* Website */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[#374151]">Company website</label>
        <input
          type="text"
          value={company.website}
          onChange={(e) => setCompany({ website: e.target.value })}
          placeholder="yourcompany.com"
          className="border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#6366F1]"
        />
      </div>

      {/* Industry */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[#374151]">Industry</label>
        <select
          value={company.industry}
          onChange={(e) => setCompany({ industry: e.target.value })}
          className="border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#6366F1] bg-white"
        >
          <option value="">Select industry...</option>
          {INDUSTRIES.map((ind) => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>
      </div>

      {/* Team size */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[#374151]">Team size</label>
        <select
          value={company.teamSize}
          onChange={(e) => setCompany({ teamSize: e.target.value })}
          className="border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#6366F1] bg-white"
        >
          <option value="">Select team size...</option>
          {TEAM_SIZES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Annual revenue */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-[#374151]">Annual revenue</label>
        <select
          value={company.revenue}
          onChange={(e) => setCompany({ revenue: e.target.value })}
          className="border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#6366F1] bg-white"
        >
          <option value="">Select revenue range...</option>
          {REVENUE_RANGES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Current outbound tools */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#374151]">Current outbound tools</label>
        <div className="flex flex-wrap gap-2">
          {OUTBOUND_TOOLS.map((tool) => {
            const selected = company.currentTools.includes(tool);
            return (
              <button
                key={tool}
                type="button"
                onClick={() => toggleTool(tool)}
                className={`rounded-full border px-3 py-1 text-sm cursor-pointer transition-colors ${
                  selected
                    ? "bg-[#6366F1] text-white border-[#6366F1]"
                    : "border-[#E5E7EB] text-[#374151] hover:border-[#6366F1]"
                }`}
              >
                {tool}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
