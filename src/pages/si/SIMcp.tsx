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
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

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

export default function SIMcp() {
  const [configCopied, setConfigCopied] = useState(false);

  function copyConfig() {
    navigator.clipboard.writeText(QUICKSTART_JSON);
    setConfigCopied(true);
    setTimeout(() => setConfigCopied(false), 1500);
  }

  return (
    <div className="p-8 max-w-3xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-[--si-text-primary]">MCP Integration</h1>

      {/* Endpoint + API Key */}
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
    </div>
  );
}
