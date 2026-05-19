import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useUserProfileStore } from "@/lib/si/userProfileStore";
import logo from "@/assets/pristine-data-logo.svg";

type Screen = "form" | "loading" | "confirmation";

function getRoleCategory(role: string): "sdr" | "ae" {
  const lower = role.toLowerCase();
  if (
    lower.includes("sdr") ||
    lower.includes("bdr") ||
    lower.includes("business development") ||
    lower.includes("development rep") ||
    lower.includes("outbound")
  ) {
    return "sdr";
  }
  return "ae";
}

export default function SIOnboarding() {
  const navigate = useNavigate();
  const setProfile = useUserProfileStore((s) => s.setProfile);
  const [screen, setScreen] = useState<Screen>("form");

  const [fullName, setFullName] = useState("");
  const [companyDomain, setCompanyDomain] = useState("");
  const [roleTitle, setRoleTitle] = useState("");

  const canSubmit =
    fullName.trim() !== "" &&
    companyDomain.trim() !== "" &&
    roleTitle.trim() !== "";

  const handleSubmit = () => {
    if (!canSubmit) return;
    setScreen("loading");
    setTimeout(() => {
      setScreen("confirmation");
    }, 2200);
  };

  if (screen === "loading") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] flex items-center justify-center">
            <Icon
              icon="solar:settings-bold"
              className="w-7 h-7 text-[#6366F1] animate-spin"
            />
          </div>
          <p className="text-base font-semibold text-[#0F0F0F]">
            Setting up your workspace...
          </p>
          <p className="text-sm text-[#6B7280]">
            Analysing your website and building your ICP
          </p>
        </div>
      </div>
    );
  }

  if (screen === "confirmation") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans px-4">
        <div className="max-w-md w-full flex flex-col items-center gap-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#ECFDF5] flex items-center justify-center">
            <Icon
              icon="solar:check-circle-bold"
              className="w-8 h-8 text-[#10B981]"
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-[#0F0F0F]">
              You're all set, {fullName.split(" ")[0]}
            </h2>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              {getRoleCategory(roleTitle) === "sdr"
                ? "Your ICP has been generated from your website. Let's find your first batch of target accounts."
                : "Your ICP has been generated from your website. Review and edit it anytime in settings."}
            </p>
          </div>
          <button
            onClick={() => {
              setProfile({ onboardingCompleted: true, role: roleTitle });
              navigate(getRoleCategory(roleTitle) === "sdr" ? "/si/icp" : "/si/watchlist");
            }}
            className="w-full rounded-full bg-[#6366F1] text-white px-6 py-3 text-sm font-medium hover:bg-[#4F46E5] transition-colors"
          >
            {getRoleCategory(roleTitle) === "sdr"
              ? "Discover your target accounts"
              : "Start building your watchlist"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Progress bar */}
      <div className="w-full h-1 bg-[#6366F1]" />

      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-[#F3F4F6]">
        <img src={logo} alt="Pristine Data" className="h-7 w-auto" />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto px-4 py-10">
        <div className="max-w-md mx-auto space-y-7">
          <div>
            <h2 className="text-2xl font-semibold text-[#0F0F0F]">
              Welcome — let's get you started
            </h2>
            <p className="mt-1 text-sm text-[#6B7280]">
              We'll generate your ICP automatically from your website.
            </p>
          </div>

          {/* Full name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#374151]">
              Full name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Smith"
              className="border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#111827] w-full focus:outline-none focus:border-[#6366F1] placeholder:text-[#9CA3AF]"
            />
          </div>

          {/* Company domain */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#374151]">
              Company domain or website URL
            </label>
            <input
              type="text"
              value={companyDomain}
              onChange={(e) => setCompanyDomain(e.target.value)}
              placeholder="yourcompany.com"
              className="border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#111827] w-full focus:outline-none focus:border-[#6366F1] placeholder:text-[#9CA3AF]"
            />
          </div>

          {/* Role / title */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#374151]">
              Your role / title
            </label>
            <input
              type="text"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="e.g. Account Executive, VP of Sales"
              className="border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm text-[#111827] w-full focus:outline-none focus:border-[#6366F1] placeholder:text-[#9CA3AF]"
            />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#F3F4F6] px-8 py-4 flex justify-end bg-white">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="rounded-full bg-[#6366F1] text-white px-6 py-2.5 text-sm font-medium hover:bg-[#4F46E5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
