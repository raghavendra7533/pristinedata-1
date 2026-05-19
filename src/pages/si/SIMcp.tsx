import { useState } from "react";
import { Icon } from "@iconify/react";
import APIKeyCard from "@/components/si/mcp/APIKeyCard";
import MCPToolsTable from "@/components/si/mcp/MCPToolsTable";
import UsageLogTable from "@/components/si/mcp/UsageLogTable";
import { useUserProfileStore } from "@/lib/si/userProfileStore";

const QUICKSTART_JSON = JSON.stringify(
  {
    mcpServers: {
      "pristine-si": {
        url: "https://mcp.pristinedata.ai/v1",
        apiKey: "YOUR_API_KEY_HERE",
        tools: ["generate_opportunity_playbook", "get_watchlist_signals", "search_icp_accounts"],
      },
    },
  },
  null,
  2
);

// ─── Integration cards config ───────────────────────────────────────────────

type CrmPlatform = "salesforce" | "hubspot";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconColor: string;
  type: "oauth" | "crm";
}

const INTEGRATIONS: Integration[] = [
  {
    id: "gmail",
    name: "Gmail",
    description: "Sync email threads and auto-enrich contact activity from your inbox.",
    icon: "logos:google-gmail",
    iconColor: "",
    type: "oauth",
  },
  {
    id: "google_calendar",
    name: "Google Calendar",
    description: "Pull meeting context into playbooks and track engagement cadence.",
    icon: "logos:google-calendar",
    iconColor: "",
    type: "oauth",
  },
  {
    id: "crm",
    name: "CRM",
    description: "Bi-directional sync of accounts, contacts, and opportunities.",
    icon: "solar:database-bold",
    iconColor: "#6366F1",
    type: "crm",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Receive signal alerts and share playbooks directly in Slack channels.",
    icon: "logos:slack-icon",
    iconColor: "",
    type: "oauth",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    description: "Send follow-up messages and receive reply signals from WhatsApp Business.",
    icon: "logos:whatsapp-icon",
    iconColor: "",
    type: "oauth",
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatusPill({ connected }: { connected: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
      style={{
        backgroundColor: connected ? "#ECFDF5" : "#F3F4F6",
        color: connected ? "#059669" : "#6B7280",
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: connected ? "#10B981" : "#D1D5DB" }}
      />
      {connected ? "Connected" : "Not connected"}
    </span>
  );
}

function IntegrationCard({ integration }: { integration: Integration }) {
  const [connected, setConnected] = useState(false);
  const [crmPlatform, setCrmPlatform] = useState<CrmPlatform>("salesforce");

  return (
    <div
      className="flex items-start gap-4 p-5 rounded-xl border transition-shadow hover:shadow-sm"
      style={{ borderColor: "var(--si-card-border)", backgroundColor: "var(--si-card-bg)" }}
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "#F9FAFB", border: "1px solid var(--si-card-border)" }}
      >
        {integration.iconColor ? (
          <Icon icon={integration.icon} width={22} style={{ color: integration.iconColor }} />
        ) : (
          <Icon icon={integration.icon} width={22} />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-semibold text-[--si-text-primary]">{integration.name}</span>
          <StatusPill connected={connected} />
        </div>

        {/* CRM platform picker */}
        {integration.type === "crm" && (
          <select
            value={crmPlatform}
            onChange={(e) => setCrmPlatform(e.target.value as CrmPlatform)}
            className="mb-2 mt-1 text-xs rounded-md border px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            style={{ borderColor: "var(--si-card-border)", color: "var(--si-text-secondary)" }}
          >
            <option value="salesforce">Salesforce</option>
            <option value="hubspot">HubSpot</option>
          </select>
        )}

        <p className="text-xs text-[--si-text-secondary] leading-relaxed">{integration.description}</p>
      </div>

      {/* Action */}
      <div className="flex-shrink-0 pt-0.5">
        {connected ? (
          <button
            onClick={() => setConnected(false)}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors hover:bg-red-50 hover:border-red-200 hover:text-red-600"
            style={{ borderColor: "var(--si-card-border)", color: "var(--si-text-secondary)" }}
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={() => setConnected(true)}
            className="text-xs font-semibold px-4 py-1.5 rounded-lg text-white transition-colors"
            style={{ backgroundColor: "var(--si-primary)" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--si-primary-hover)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--si-primary)")
            }
          >
            Connect
          </button>
        )}
      </div>
    </div>
  );
}

function CollapsibleSection({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-[12px] border border-[--si-card-border] bg-[--si-card-bg] overflow-hidden">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50/60 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Icon icon={icon} width={16} className="text-[--si-text-secondary]" />
          <span className="text-sm font-semibold text-[--si-text-primary]">{title}</span>
        </span>
        <Icon
          icon={isOpen ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"}
          width={16}
          className="text-[--si-text-secondary]"
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 border-t border-[--si-card-border] pt-4 flex flex-col gap-3">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SIMcp() {
  const [configCopied, setConfigCopied] = useState(false);
  const { profile, setProfile } = useUserProfileStore();
  const signalDelivery = profile?.signalDelivery ?? "platform";
  const isSdrRole = /sdr|bdr|business.?development|outbound/i.test(profile?.role ?? "");

  function copyConfig() {
    navigator.clipboard.writeText(QUICKSTART_JSON);
    setConfigCopied(true);
    setTimeout(() => setConfigCopied(false), 1500);
  }

  return (
    <div className="p-8 max-w-3xl mx-auto flex flex-col gap-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-[--si-text-primary]">Settings</h1>
        <p className="text-sm text-[--si-text-secondary] mt-1">
          Manage your integrations and developer configuration.
        </p>
      </div>

      {/* ── Integrations ── */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Icon icon="solar:plug-circle-bold" width={20} className="text-indigo-500" />
          <h2 className="text-base font-semibold text-[--si-text-primary]">Integrations</h2>
        </div>
        <p className="text-sm text-[--si-text-secondary] -mt-2">
          Connect your tools so Pristine can enrich signals, sync context, and surface the right
          intelligence at the right time.
        </p>

        <div className="flex flex-col gap-3">
          {INTEGRATIONS.map((integration) => (
            <IntegrationCard key={integration.id} integration={integration} />
          ))}
        </div>
      </section>

      {/* ── Signal Preferences ── */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Icon icon="solar:bell-bing-bold" width={20} className="text-indigo-500" />
          <h2 className="text-base font-semibold text-[--si-text-primary]">Signal Preferences</h2>
        </div>
        <p className="text-sm text-[--si-text-secondary] -mt-2">
          Choose how and when you receive signal notifications.
        </p>
        <div className="flex flex-col gap-3">
          {[
            {
              key: "platform" as const,
              label: "Real-time (in-app)",
              description: "Signals appear on your dashboard as they happen. Best for focused accounts.",
              icon: "solar:bell-linear",
              recommended: !isSdrRole,
            },
            {
              key: "daily_email" as const,
              label: "Daily digest",
              description: "A curated summary of signals delivered to your inbox each morning.",
              icon: "solar:letter-linear",
              recommended: isSdrRole,
            },
            {
              key: "weekly_email" as const,
              label: "Weekly digest",
              description: "A weekly rollup of the most important signals across your watchlist.",
              icon: "solar:calendar-linear",
              recommended: false,
            },
          ].map(({ key, label, description, icon, recommended }) => (
            <button
              key={key}
              onClick={() => setProfile({ signalDelivery: key })}
              className={`flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${
                signalDelivery === key
                  ? "border-indigo-300 bg-indigo-50/60"
                  : "hover:bg-gray-50/60"
              }`}
              style={{ borderColor: signalDelivery === key ? undefined : "var(--si-card-border)", backgroundColor: signalDelivery === key ? undefined : "var(--si-card-bg)" }}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: signalDelivery === key ? "#E0E7FF" : "#F9FAFB", border: "1px solid var(--si-card-border)" }}>
                <Icon icon={icon} width={18} style={{ color: signalDelivery === key ? "#4F46E5" : "var(--si-text-secondary)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-sm font-semibold ${signalDelivery === key ? "text-indigo-700" : "text-[--si-text-primary]"}`}>{label}</span>
                  {recommended && (
                    <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                      Recommended
                    </span>
                  )}
                  {signalDelivery === key && (
                    <Icon icon="solar:check-circle-bold" width={14} className="text-indigo-500 ml-auto flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-[--si-text-secondary] leading-relaxed">{description}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── MCP / Developer (de-emphasized) ── */}
      <section className="flex flex-col gap-3">
        <CollapsibleSection title="Developer API" icon="solar:code-linear" defaultOpen={false}>
          {/* API Key */}
          <APIKeyCard />

          {/* Available Tools */}
          <MCPToolsTable />

          {/* Claude Code Quickstart */}
          <CollapsibleSection title="Claude Code Quickstart" icon="solar:code-linear">
            <p className="text-sm text-[--si-text-secondary]">
              Add the following to your{" "}
              <code className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded border border-[--si-card-border]">
                ~/.claude/claude_code_config.json
              </code>
              :
            </p>
            <pre className="font-mono text-xs bg-gray-50 rounded-lg p-4 border border-[--si-card-border] overflow-x-auto text-[--si-text-primary]">
              {QUICKSTART_JSON}
            </pre>
            <div>
              <button
                onClick={copyConfig}
                className="rounded-full bg-[--si-primary] text-white px-4 py-2 text-sm font-medium hover:bg-[--si-primary-hover] transition-colors flex items-center gap-1.5"
              >
                {configCopied ? (
                  <Icon icon="solar:check-circle-linear" width={16} />
                ) : (
                  <Icon icon="solar:copy-linear" width={16} />
                )}
                <span>{configCopied ? "Copied!" : "Copy config"}</span>
              </button>
            </div>
          </CollapsibleSection>

          {/* Usage Log */}
          <UsageLogTable />
        </CollapsibleSection>
      </section>
    </div>
  );
}
