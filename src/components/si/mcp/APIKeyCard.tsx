import { useState } from "react";
import { Icon } from "@iconify/react";

const MCP_ENDPOINT = "https://mcp.pristinedata.ai/v1";

function generateSuffix(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function APIKeyCard() {
  const [endpointCopied, setEndpointCopied] = useState(false);
  const [keyCopied, setKeyCopied] = useState(false);
  const [keySuffix, setKeySuffix] = useState<string>(() => generateSuffix());

  const maskedKey = `sk-prist-••••••••••••••••••••••••${keySuffix}`;

  function copyEndpoint() {
    navigator.clipboard.writeText(MCP_ENDPOINT);
    setEndpointCopied(true);
    setTimeout(() => setEndpointCopied(false), 1500);
  }

  function copyKey() {
    navigator.clipboard.writeText(`sk-prist-placeholder-${keySuffix}`);
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 1500);
  }

  function regenerate() {
    if (confirm("Are you sure you want to regenerate your API key? Your existing key will stop working immediately.")) {
      setKeySuffix(generateSuffix());
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* MCP Endpoint */}
      <div className="rounded-[12px] border border-[--si-card-border] bg-[--si-card-bg] p-4">
        <h2 className="text-sm font-semibold text-[--si-text-primary] mb-3">Your MCP Endpoint</h2>
        <div className="flex items-center gap-2">
          <code className="flex-1 font-mono text-sm rounded-lg px-3 py-2 border border-[--si-card-border] text-[--si-text-primary]" style={{ backgroundColor: "var(--si-card-bg)" }}>
            {MCP_ENDPOINT}
          </code>
          <button
            onClick={copyEndpoint}
            className="rounded-full border border-[--si-card-border] px-3 py-2 text-sm font-medium text-[--si-text-secondary] hover:bg-white/5 transition-colors flex items-center gap-1.5"
            title="Copy endpoint"
          >
            {endpointCopied ? (
              <Icon icon="solar:check-circle-linear" className="text-green-500" width={16} />
            ) : (
              <Icon icon="solar:copy-linear" width={16} />
            )}
            <span>{endpointCopied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* API Key */}
      <div className="rounded-[12px] border border-[--si-card-border] bg-[--si-card-bg] p-4">
        <h2 className="text-sm font-semibold text-[--si-text-primary] mb-3">API Key</h2>
        <div className="flex items-center gap-2">
          <code className="flex-1 font-mono text-sm rounded-lg px-3 py-2 border border-[--si-card-border] text-[--si-text-primary] tracking-wide" style={{ backgroundColor: "var(--si-card-bg)" }}>
            {maskedKey}
          </code>
          <button
            onClick={copyKey}
            className="rounded-full border border-[--si-card-border] px-3 py-2 text-sm font-medium text-[--si-text-secondary] hover:bg-white/5 transition-colors flex items-center gap-1.5"
          >
            {keyCopied ? (
              <Icon icon="solar:check-circle-linear" className="text-green-500" width={16} />
            ) : (
              <Icon icon="solar:copy-linear" width={16} />
            )}
            <span>{keyCopied ? "Copied" : "Copy Key"}</span>
          </button>
          <button
            onClick={regenerate}
            className="rounded-full border border-[--si-card-border] px-3 py-2 text-sm font-medium text-[--si-text-secondary] hover:bg-white/5 transition-colors flex items-center gap-1.5"
          >
            <Icon icon="solar:restart-linear" width={16} />
            <span>Regenerate</span>
          </button>
        </div>
      </div>
    </div>
  );
}
