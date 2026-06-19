import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import SICreditManagement from "./SICreditManagement";
import SINotifications from "./SINotifications";
import SIIntegrations from "./SIIntegrations";

const TAB_GROUPS = [
  {
    label: "Plan",
    tabs: [
      { key: "profile", label: "Profile", icon: "solar:user-circle-linear" },
      { key: "teams", label: "Users & Teams", icon: "solar:users-group-rounded-linear" },
      { key: "billing", label: "Billing & Credits", icon: "solar:wallet-money-linear" },
    ],
  },
  {
    label: "Settings",
    tabs: [
      { key: "integrations", label: "Integrations", icon: "solar:link-circle-linear" },
      { key: "linktable", label: "Link Table", icon: "solar:table-linear" },
      { key: "notifications", label: "Notifications", icon: "solar:bell-bing-linear" },
    ],
  },
] as const;

type TabKey = "profile" | "teams" | "billing" | "integrations" | "linktable" | "notifications";

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--si-card-bg)", border: "1px solid var(--si-card-border)" }}>
        <Icon icon="solar:clock-circle-linear" width={20} style={{ color: "var(--si-text-secondary)" }} />
      </div>
      <p className="text-sm font-medium" style={{ color: "var(--si-text-primary)" }}>{label}</p>
      <p className="text-[13px]" style={{ color: "var(--si-text-secondary)" }}>This section is coming soon.</p>
    </div>
  );
}

export default function SISettings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab") as TabKey | null;
  const [activeTab, setActiveTab] = useState<TabKey>(tabParam ?? "billing");

  function selectTab(tab: TabKey) {
    setActiveTab(tab);
    setSearchParams({ tab });
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--si-bg)", fontFamily: "var(--si-font)" }}>
      <div className="px-6 py-5 border-b" style={{ backgroundColor: "var(--si-card-bg)", borderColor: "var(--si-card-border)" }}>
        <div className="max-w-5xl mx-auto">
          <h1 className="text-[22px] font-bold" style={{ color: "var(--si-text-primary)" }}>Settings</h1>
          <p className="text-[13px] mt-0.5" style={{ color: "var(--si-text-secondary)" }}>
            Manage your plan, credits, integrations, and preferences in one place.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-4">
        <div className="flex items-end gap-0 border-b" style={{ borderColor: "var(--si-card-border)" }}>
          {TAB_GROUPS.map((group, gi) => (
            <div key={group.label} className={`flex items-end gap-0${gi > 0 ? " ml-6" : ""}`}>
              <div className="flex flex-col">
                <span
                  className="px-4 pb-1 text-[11px] font-semibold tracking-widest uppercase"
                  style={{ color: "var(--si-text-secondary)", opacity: 0.6 }}
                >
                  {group.label}
                </span>
                <div className="flex items-center gap-0">
                  {group.tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => selectTab(tab.key as TabKey)}
                      className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px"
                      style={{
                        borderColor: activeTab === tab.key ? "var(--si-primary)" : "transparent",
                        color: activeTab === tab.key ? "var(--si-primary)" : "var(--si-text-secondary)",
                      }}
                    >
                      <Icon icon={tab.icon} width={16} />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              {gi < TAB_GROUPS.length - 1 && (
                <div className="self-stretch w-px mx-3 mb-0" style={{ backgroundColor: "var(--si-card-border)" }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={activeTab === "integrations" ? "max-w-6xl mx-auto px-6 py-6" : "max-w-5xl mx-auto px-6 py-6"}>
        {activeTab === "profile" && <ComingSoon label="Profile" />}
        {activeTab === "teams" && <ComingSoon label="Users & Teams" />}
        {activeTab === "billing" && <SICreditManagement embedded />}
        {activeTab === "integrations" && <SIIntegrations embedded />}
        {activeTab === "linktable" && <ComingSoon label="Link Table" />}
        {activeTab === "notifications" && <SINotifications />}
      </div>
    </div>
  );
}
