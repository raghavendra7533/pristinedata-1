import { useState } from "react";
import { Icon } from "@iconify/react";
import APIKeyCard from "@/components/si/mcp/APIKeyCard";
import MCPToolsTable from "@/components/si/mcp/MCPToolsTable";
import UsageLogTable from "@/components/si/mcp/UsageLogTable";

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
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
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

export default function SIMcpSettings() {
  const [configCopied, setConfigCopied] = useState(false);

  function copyConfig() {
    navigator.clipboard.writeText(QUICKSTART_JSON);
    setConfigCopied(true);
    setTimeout(() => setConfigCopied(false), 1500);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Icon icon="solar:code-square-bold" width={20} className="text-indigo-500" />
        <h2 className="text-base font-semibold text-[--si-text-primary]">Developer API</h2>
      </div>
      <p className="text-sm text-[--si-text-secondary] -mt-4">
        Connect Pristine's MCP server to query playbooks and signals from your own tools.
      </p>

      {/* API Key */}
      <APIKeyCard />

      {/* Available Tools */}
      <MCPToolsTable />

      {/* Claude Code Quickstart */}
      <CollapsibleSection title="Claude Code Quickstart" icon="solar:code-linear">
        <p className="text-sm text-[--si-text-secondary]">
          Add the following to your{" "}
          <code className="font-mono text-xs px-1.5 py-0.5 rounded border border-[--si-card-border]" style={{ backgroundColor: "var(--si-card-border)" }}>
            ~/.claude/claude_code_config.json
          </code>
          :
        </p>
        <pre className="font-mono text-xs rounded-lg p-4 border border-[--si-card-border] overflow-x-auto text-[--si-text-primary]" style={{ backgroundColor: "var(--si-card-bg)" }}>
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
    </div>
  );
}
