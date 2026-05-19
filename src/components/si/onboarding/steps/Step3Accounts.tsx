import { useState } from "react";
import { Icon } from "@iconify/react";
import { useOnboardingStore } from "@/lib/si/onboardingStore";

const MAX_DOMAINS = 20;

export default function Step3Accounts() {
  const { watchedDomains, setWatchedDomains } = useOnboardingStore();
  const [input, setInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = input.trim().toLowerCase().replace(/^https?:\/\//, "");
      if (val && !watchedDomains.includes(val) && watchedDomains.length < MAX_DOMAINS) {
        setWatchedDomains([...watchedDomains, val]);
      }
      setInput("");
    }
  };

  const removeDomain = (domain: string) => {
    setWatchedDomains(watchedDomains.filter((d) => d !== domain));
  };

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-2xl font-semibold text-[#0F0F0F]">Add accounts to watch</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Enter domains of companies you want to track for buying signals.
        </p>
      </div>

      {/* Domain tag input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#374151]">
          Company domains{" "}
          <span className="text-[#9CA3AF] font-normal">
            ({watchedDomains.length}/{MAX_DOMAINS})
          </span>
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Type a domain and press Enter (e.g. "acme.com")'
          disabled={watchedDomains.length >= MAX_DOMAINS}
          className="border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-[#6366F1] disabled:bg-[#F9FAFB] disabled:cursor-not-allowed"
        />
        <p className="text-xs text-[#6B7280]">
          We'll start watching these accounts for signals immediately.
        </p>
      </div>

      {/* Domain tags */}
      {watchedDomains.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {watchedDomains.map((domain) => (
            <span
              key={domain}
              className="inline-flex items-center gap-1.5 bg-[#F3F4F6] text-[#374151] rounded-full px-3 py-1 text-sm"
            >
              <Icon icon="solar:global-linear" className="w-3.5 h-3.5 text-[#6B7280]" />
              {domain}
              <button
                type="button"
                onClick={() => removeDomain(domain)}
                className="ml-0.5 text-[#9CA3AF] hover:text-[#EF4444]"
              >
                <Icon icon="solar:close-circle-bold" className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Empty state info */}
      {watchedDomains.length === 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-[#E0E7FF] bg-[#EEF2FF] px-4 py-3">
          <Icon icon="solar:info-circle-bold" className="w-5 h-5 text-[#6366F1] mt-0.5 shrink-0" />
          <p className="text-sm text-[#4338CA]">
            If you skip this step, we'll populate your watchlist with 5 demo accounts so you can
            explore the product.
          </p>
        </div>
      )}
    </div>
  );
}
