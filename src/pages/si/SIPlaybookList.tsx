import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { MOCK_PLAYBOOK_LIST } from "@/lib/si/mockData";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function SIPlaybookList() {
  const navigate = useNavigate();

  return (
    <div data-theme="si" className="p-6 flex flex-col gap-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
          Playbooks
        </p>
        <h1 className="text-2xl font-bold text-gray-900">Active Playbooks</h1>
      </div>

      {MOCK_PLAYBOOK_LIST.length === 0 ? (
        <div className="rounded-[12px] border border-[--si-card-border] bg-[--si-card-bg] p-12 flex flex-col items-center gap-3 text-center">
          <Icon icon="solar:notebook-bookmark-linear" className="w-10 h-10 text-[--si-text-muted]" />
          <p className="text-sm text-[--si-text-secondary] max-w-sm">
            No active playbooks yet. Open an account from your watchlist and click Start Playbook.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {MOCK_PLAYBOOK_LIST.map((pb) => (
            <div
              key={pb.id}
              className="rounded-[12px] border border-[--si-card-border] bg-[--si-card-bg] p-4 flex items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-gray-900">{pb.accountName}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      pb.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {pb.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-1">Updated {formatDate(pb.lastUpdated)}</p>
                <p className="text-sm text-gray-600 truncate">{pb.nextAction}</p>
              </div>
              <button
                onClick={() => navigate(`/si/playbook/${pb.accountId}`)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex-shrink-0"
              >
                Open Playbook
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
