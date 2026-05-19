import { useState } from "react";
import { Icon } from "@iconify/react";
import { useOnboardingStore } from "@/lib/si/onboardingStore";
import { INDUSTRIES, GEOGRAPHIES, SENIORITY_LEVELS } from "@/lib/si/constants";

export default function Step2ICP() {
  const { icp, setICP } = useOnboardingStore();
  const [jobTitleInput, setJobTitleInput] = useState("");

  const toggleIndustry = (ind: string) => {
    if (icp.industries.includes(ind)) {
      setICP({ industries: icp.industries.filter((i) => i !== ind) });
    } else {
      setICP({ industries: [...icp.industries, ind] });
    }
  };

  const toggleGeo = (geo: string) => {
    if (icp.geographies.includes(geo)) {
      setICP({ geographies: icp.geographies.filter((g) => g !== geo) });
    } else {
      setICP({ geographies: [...icp.geographies, geo] });
    }
  };

  const toggleSeniority = (s: string) => {
    if (icp.seniorityLevels.includes(s)) {
      setICP({ seniorityLevels: icp.seniorityLevels.filter((l) => l !== s) });
    } else {
      setICP({ seniorityLevels: [...icp.seniorityLevels, s] });
    }
  };

  const handleJobTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && jobTitleInput.trim()) {
      e.preventDefault();
      const val = jobTitleInput.trim();
      if (!icp.jobTitles.includes(val)) {
        setICP({ jobTitles: [...icp.jobTitles, val] });
      }
      setJobTitleInput("");
    }
  };

  const removeJobTitle = (title: string) => {
    setICP({ jobTitles: icp.jobTitles.filter((t) => t !== title) });
  };

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-2xl font-semibold text-[#0F0F0F]">Define your ideal customer</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          We use this to surface accounts that match your best-fit profile.
        </p>
      </div>

      {/* Target industries */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#374151]">
          Target industries <span className="text-[#EF4444]">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map((ind) => {
            const selected = icp.industries.includes(ind);
            return (
              <button
                key={ind}
                type="button"
                onClick={() => toggleIndustry(ind)}
                className={`rounded-full border px-3 py-1 text-sm cursor-pointer transition-colors ${
                  selected
                    ? "bg-[#6366F1] text-white border-[#6366F1]"
                    : "border-[#E5E7EB] text-[#374151] hover:border-[#6366F1]"
                }`}
              >
                {ind}
              </button>
            );
          })}
        </div>
        {icp.industries.length === 0 && (
          <p className="text-xs text-[#EF4444]">Select at least one industry to continue.</p>
        )}
      </div>

      {/* Employee range */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#374151]">Company size (employees)</label>
        <div className="flex items-center gap-3">
          <div className="flex-1 space-y-1">
            <span className="text-xs text-[#6B7280]">Min employees</span>
            <input
              type="number"
              min={0}
              value={icp.employeeMin}
              onChange={(e) => setICP({ employeeMin: Number(e.target.value) })}
              className="border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#6366F1]"
            />
          </div>
          <span className="text-[#9CA3AF] mt-5">—</span>
          <div className="flex-1 space-y-1">
            <span className="text-xs text-[#6B7280]">Max employees</span>
            <input
              type="number"
              min={0}
              value={icp.employeeMax}
              onChange={(e) => setICP({ employeeMax: Number(e.target.value) })}
              className="border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#6366F1]"
            />
          </div>
        </div>
      </div>

      {/* Revenue range */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#374151]">Revenue range</label>
        <div className="flex items-center gap-3">
          <div className="flex-1 space-y-1">
            <span className="text-xs text-[#6B7280]">Min revenue ($M)</span>
            <input
              type="number"
              min={0}
              value={icp.revenueMin}
              onChange={(e) => setICP({ revenueMin: Number(e.target.value) })}
              className="border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#6366F1]"
            />
          </div>
          <span className="text-[#9CA3AF] mt-5">—</span>
          <div className="flex-1 space-y-1">
            <span className="text-xs text-[#6B7280]">Max revenue ($M)</span>
            <input
              type="number"
              min={0}
              value={icp.revenueMax}
              onChange={(e) => setICP({ revenueMax: Number(e.target.value) })}
              className="border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#6366F1]"
            />
          </div>
        </div>
      </div>

      {/* Geographies */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#374151]">Geographies</label>
        <div className="flex flex-wrap gap-2">
          {GEOGRAPHIES.map((geo) => {
            const selected = icp.geographies.includes(geo);
            return (
              <button
                key={geo}
                type="button"
                onClick={() => toggleGeo(geo)}
                className={`rounded-full border px-3 py-1 text-sm cursor-pointer transition-colors ${
                  selected
                    ? "bg-[#6366F1] text-white border-[#6366F1]"
                    : "border-[#E5E7EB] text-[#374151] hover:border-[#6366F1]"
                }`}
              >
                {geo}
              </button>
            );
          })}
        </div>
      </div>

      {/* Target job titles */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#374151]">Target job titles</label>
        <input
          type="text"
          value={jobTitleInput}
          onChange={(e) => setJobTitleInput(e.target.value)}
          onKeyDown={handleJobTitleKeyDown}
          placeholder='Type a title and press Enter (e.g. "VP of Sales")'
          className="border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#6366F1]"
        />
        {icp.jobTitles.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {icp.jobTitles.map((title) => (
              <span
                key={title}
                className="inline-flex items-center gap-1 bg-[#EEF2FF] text-[#4F46E5] rounded-full px-3 py-1 text-sm"
              >
                {title}
                <button
                  type="button"
                  onClick={() => removeJobTitle(title)}
                  className="ml-0.5 text-[#6366F1] hover:text-[#EF4444]"
                >
                  <Icon icon="solar:close-circle-bold" className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Seniority levels */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#374151]">Seniority levels</label>
        <div className="flex flex-wrap gap-2">
          {SENIORITY_LEVELS.map((s) => {
            const selected = icp.seniorityLevels.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleSeniority(s)}
                className={`rounded-full border px-3 py-1 text-sm cursor-pointer transition-colors ${
                  selected
                    ? "bg-[#6366F1] text-white border-[#6366F1]"
                    : "border-[#E5E7EB] text-[#374151] hover:border-[#6366F1]"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
