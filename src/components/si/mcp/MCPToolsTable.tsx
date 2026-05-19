import { MCP_TOOLS } from "@/lib/si/constants";

export default function MCPToolsTable() {
  return (
    <div className="rounded-[12px] border border-[--si-card-border] bg-[--si-card-bg] overflow-hidden">
      <div className="px-4 py-3 border-b border-[--si-card-border]">
        <h2 className="text-sm font-semibold text-[--si-text-primary]">Available Tools</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[--si-card-border] bg-gray-50/60">
              <th className="text-left px-4 py-2.5 font-medium text-[--si-text-secondary] whitespace-nowrap">Tool Name</th>
              <th className="text-left px-4 py-2.5 font-medium text-[--si-text-secondary]">Description</th>
              <th className="text-left px-4 py-2.5 font-medium text-[--si-text-secondary] whitespace-nowrap">Parameters</th>
              <th className="text-left px-4 py-2.5 font-medium text-[--si-text-secondary]">Status</th>
            </tr>
          </thead>
          <tbody>
            {MCP_TOOLS.map((tool, i) => (
              <tr
                key={tool.name}
                className={i < MCP_TOOLS.length - 1 ? "border-b border-[--si-card-border]" : ""}
              >
                <td className="px-4 py-3 font-mono text-xs text-[--si-text-primary] whitespace-nowrap">
                  {tool.name}
                </td>
                <td className="px-4 py-3 text-[--si-text-secondary]">{tool.description}</td>
                <td className="px-4 py-3 font-mono text-xs text-[--si-text-secondary] whitespace-nowrap">
                  {tool.parameters}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 text-green-600 text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
