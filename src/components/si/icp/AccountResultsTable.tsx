import { useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import type { ICPAccount } from "@/lib/si/types";

export interface AccountResultsTableProps {
  accounts: ICPAccount[];
  onAddToWatchlist: (account: ICPAccount) => void;
}

const PAGE_SIZE = 25;

function ScorePill({ score }: { score: number }) {
  let cls = "bg-gray-100 text-gray-600";
  if (score >= 80) cls = "bg-green-100 text-green-700";
  else if (score >= 60) cls = "bg-amber-100 text-amber-700";
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {score}
    </span>
  );
}

export default function AccountResultsTable({ accounts, onAddToWatchlist }: AccountResultsTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return accounts;
    return accounts.filter(
      (a) =>
        a.companyName.toLowerCase().includes(q) ||
        a.domain.toLowerCase().includes(q)
    );
  }, [accounts, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const exportCSV = () => {
    const header = ["Company", "Domain", "Industry", "Revenue", "Employees", "Location", "ICP Score", "Watched"];
    const rows = filtered.map((a) => [
      a.companyName,
      a.domain,
      a.industry,
      a.revenue,
      String(a.employees),
      a.location,
      String(a.icpScore),
      a.isWatched ? "Yes" : "No",
    ]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "icp-accounts.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Icon
            icon="solar:magnifer-linear"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[--si-text-muted]"
            width={16}
            height={16}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Filter by company name or domain"
            className="w-full rounded-lg border border-[--si-card-border] bg-[--si-card-bg] pl-9 pr-3 py-2 text-sm text-[--si-text-primary] focus:outline-none focus:border-[--si-primary] placeholder:text-[--si-text-muted]"
          />
        </div>
        <button
          type="button"
          onClick={exportCSV}
          className="flex items-center gap-1.5 rounded-lg border border-[--si-card-border] px-3 py-2 text-sm text-[--si-text-secondary] hover:text-[--si-text-primary] hover:border-[--si-primary] transition-colors"
        >
          <Icon icon="solar:download-linear" width={16} height={16} />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="rounded-[12px] border border-[--si-card-border] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[--si-card-bg] border-b border-[--si-card-border]">
              {["Company", "Industry", "Revenue", "Employees", "Location", "ICP Score", "Actions"].map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-semibold text-[--si-text-muted] uppercase tracking-wide whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-[--si-text-muted] text-sm">
                  No accounts match this ICP. Try broadening your filters.
                </td>
              </tr>
            ) : (
              pageRows.map((account, idx) => (
                <tr
                  key={account.id}
                  className={`border-b border-[--si-card-border] last:border-0 transition-colors hover:bg-[--si-card-border]/20 ${
                    idx % 2 === 1 ? "bg-[--si-card-border]/10" : "bg-transparent"
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-[--si-text-primary]">{account.companyName}</div>
                    <div className="text-xs text-[--si-text-muted]">{account.domain}</div>
                  </td>
                  <td className="px-4 py-3 text-[--si-text-secondary]">{account.industry}</td>
                  <td className="px-4 py-3 text-[--si-text-secondary] whitespace-nowrap">{account.revenue}</td>
                  <td className="px-4 py-3 text-[--si-text-secondary]">{account.employees.toLocaleString()}</td>
                  <td className="px-4 py-3 text-[--si-text-secondary]">{account.location}</td>
                  <td className="px-4 py-3">
                    <ScorePill score={account.icpScore} />
                  </td>
                  <td className="px-4 py-3">
                    {account.isWatched ? (
                      <button
                        disabled
                        className="rounded-full border border-[--si-card-border] px-3 py-1 text-xs font-medium text-[--si-text-muted] cursor-default"
                      >
                        Watching
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onAddToWatchlist(account)}
                        className="rounded-full bg-[--si-primary] text-white px-3 py-1 text-xs font-medium hover:bg-[--si-primary-hover] transition-colors"
                      >
                        Watch
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-[--si-text-muted]">
        <span>
          {filtered.length === 0
            ? "No results"
            : `Showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filtered.length)} of ${filtered.length}`}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-[--si-card-border] px-3 py-1.5 text-xs font-medium disabled:opacity-40 hover:enabled:border-[--si-primary] hover:enabled:text-[--si-primary] transition-colors"
          >
            Prev
          </button>
          <span className="text-xs">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-[--si-card-border] px-3 py-1.5 text-xs font-medium disabled:opacity-40 hover:enabled:border-[--si-primary] hover:enabled:text-[--si-primary] transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
