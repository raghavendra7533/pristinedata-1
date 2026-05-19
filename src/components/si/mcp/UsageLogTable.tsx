import { Icon } from "@iconify/react";

const MOCK_LOGS = [
  { timestamp: "2026-05-17 09:14:22", tool: "generate_opportunity_playbook", domain: "lattice.com", status: "Success", latencyMs: 1240 },
  { timestamp: "2026-05-17 08:55:10", tool: "get_watchlist_signals", domain: "—", status: "Success", latencyMs: 310 },
  { timestamp: "2026-05-16 17:30:01", tool: "search_icp_accounts", domain: "—", status: "Success", latencyMs: 890 },
  { timestamp: "2026-05-16 15:12:44", tool: "generate_opportunity_playbook", domain: "gong.io", status: "Error", latencyMs: 5010 },
  { timestamp: "2026-05-16 11:05:33", tool: "get_watchlist_signals", domain: "—", status: "Success", latencyMs: 280 },
  { timestamp: "2026-05-15 14:22:17", tool: "search_icp_accounts", domain: "—", status: "Success", latencyMs: 950 },
  { timestamp: "2026-05-15 10:08:55", tool: "generate_opportunity_playbook", domain: "outreach.io", status: "Success", latencyMs: 1100 },
  { timestamp: "2026-05-14 16:45:30", tool: "get_watchlist_signals", domain: "—", status: "Success", latencyMs: 295 },
];

export default function UsageLogTable() {
  return (
    <div className="rounded-[12px] border border-[--si-card-border] bg-[--si-card-bg] overflow-hidden">
      <div className="px-4 py-3 border-b border-[--si-card-border] flex items-center gap-2">
        <Icon icon="solar:history-linear" width={16} className="text-[--si-text-secondary]" />
        <h2 className="text-sm font-semibold text-[--si-text-primary]">Usage Log</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[--si-card-border] bg-gray-50/60">
              <th className="text-left px-4 py-2.5 font-medium text-[--si-text-secondary] whitespace-nowrap">Timestamp</th>
              <th className="text-left px-4 py-2.5 font-medium text-[--si-text-secondary] whitespace-nowrap">Tool Called</th>
              <th className="text-left px-4 py-2.5 font-medium text-[--si-text-secondary]">Domain</th>
              <th className="text-left px-4 py-2.5 font-medium text-[--si-text-secondary]">Status</th>
              <th className="text-left px-4 py-2.5 font-medium text-[--si-text-secondary] whitespace-nowrap">Latency</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_LOGS.map((log, i) => (
              <tr
                key={i}
                className={i < MOCK_LOGS.length - 1 ? "border-b border-[--si-card-border]" : ""}
              >
                <td className="px-4 py-3 font-mono text-xs text-[--si-text-secondary] whitespace-nowrap">
                  {log.timestamp}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-[--si-text-primary] whitespace-nowrap">
                  {log.tool}
                </td>
                <td className="px-4 py-3 text-[--si-text-secondary] text-xs">
                  {log.domain}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-medium ${
                      log.status === "Success" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-[--si-text-secondary] whitespace-nowrap">
                  {log.latencyMs.toLocaleString()}ms
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
