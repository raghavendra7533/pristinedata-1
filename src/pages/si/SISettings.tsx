import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import SICreditManagement from "./SICreditManagement";
import SINotifications from "./SINotifications";
import SIMcpSettings from "./SIMcpSettings";
import SIIntegrations from "./SIIntegrations";

const TABS = [
  { key: "credits", label: "Credits & Plan", icon: "solar:wallet-money-linear" },
  { key: "notifications", label: "Notifications", icon: "solar:bell-bing-linear" },
  { key: "integrations", label: "Integrations", icon: "solar:link-circle-linear" },
  { key: "mcp", label: "MCP", icon: "solar:code-square-linear" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function SISettings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab") as TabKey | null;
  const [activeTab, setActiveTab] = useState<TabKey>(tabParam ?? "credits");

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
        <div className="flex items-center gap-1 border-b" style={{ borderColor: "var(--si-card-border)" }}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => selectTab(tab.key)}
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

      <div className={activeTab === "integrations" ? "max-w-6xl mx-auto px-6 py-6" : "max-w-5xl mx-auto px-6 py-6"}>
        {activeTab === "credits" && <SICreditManagement embedded />}
        {activeTab === "notifications" && <SINotifications />}
        {activeTab === "integrations" && <SIIntegrations embedded />}
        {activeTab === "mcp" && <SIMcpSettings />}
      </div>
    </div>
  );
}
