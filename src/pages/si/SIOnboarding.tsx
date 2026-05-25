import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useUserProfileStore } from "@/lib/si/userProfileStore";

type Screen = "loading" | "confirmation";

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
  const profile = useUserProfileStore((s) => s.profile);
  const setProfile = useUserProfileStore((s) => s.setProfile);
  const [screen, setScreen] = useState<Screen>("loading");

  const firstName = profile?.name?.split(" ")[0] ?? "";
  const roleTitle = profile?.role ?? "";

  useEffect(() => {
    const timer = setTimeout(() => setScreen("confirmation"), 2200);
    return () => clearTimeout(timer);
  }, []);

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
            You're all set{firstName ? `, ${firstName}` : ""}
          </h2>
          <p className="text-sm text-[#6B7280] leading-relaxed">
            {getRoleCategory(roleTitle) === "sdr"
              ? "Your ICP has been generated from your website. Let's find your first batch of target accounts."
              : "Your ICP has been generated from your website. Review and edit it anytime in settings."}
          </p>
        </div>
        <button
          onClick={() => {
            setProfile({ onboardingCompleted: true });
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
