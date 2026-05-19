import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import { MOCK_WATCHLIST_ACCOUNTS, MOCK_PLAYBOOKS } from "@/lib/si/mockData";
import type { PlaybookData } from "@/lib/si/types";
import { AccountContextPanel } from "@/components/si/playbook/AccountContextPanel";
import { PlaybookTabs } from "@/components/si/playbook/PlaybookTabs";

export default function SIPlaybook() {
  const { accountId } = useParams<{ accountId: string }>();

  // Resolve account
  const account =
    MOCK_WATCHLIST_ACCOUNTS.find((a) => a.id === accountId) ?? MOCK_WATCHLIST_ACCOUNTS[0];

  // Resolve playbook
  const rawPlaybook: PlaybookData =
    MOCK_PLAYBOOKS[accountId ?? ""] ?? MOCK_PLAYBOOKS[Object.keys(MOCK_PLAYBOOKS)[0]];

  // Local state for next actions (so toggles persist without re-render issues)
  const [nextActions, setNextActions] = useState<PlaybookData["nextActions"]>(rawPlaybook.nextActions);

  // Reset when account changes
  useEffect(() => {
    setNextActions(rawPlaybook.nextActions);
  }, [accountId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Simulated "generate" loading
  const [isGenerating, setIsGenerating] = useState(false);

  function handleGenerate() {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  }

  function handleToggleAction(id: string) {
    setNextActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, done: !a.done } : a))
    );
  }

  const playbook: PlaybookData = { ...rawPlaybook, nextActions };

  return (
    <div className="flex h-screen" data-theme="si">
      {/* Left: sticky context panel */}
      <div
        className="w-[300px] flex-shrink-0 border-r border-[--si-card-border] overflow-y-auto p-4 sticky top-0 h-screen"
        style={{ backgroundColor: "var(--si-card-bg)" }}
      >
        {account && (
          <AccountContextPanel
            account={account}
            stakeholders={playbook.stakeholders}
            onAddStakeholder={() => {}}
          />
        )}
      </div>

      {/* Right: scrollable playbook content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <p className="text-xs text-[--si-text-muted] mb-0.5">Playbook</p>
            <h1 className="text-xl font-semibold text-[--si-text-primary]">{playbook.accountName}</h1>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 rounded-full bg-[--si-primary] text-white px-4 py-2 text-sm font-medium hover:bg-[--si-primary-hover] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Generating…
              </>
            ) : (
              <>
                <Icon icon="solar:magic-stick-3-linear" className="w-4 h-4" />
                Generate Playbook
              </>
            )}
          </button>
        </div>

        {/* Generated at label */}
        <p className="text-xs text-[--si-text-muted] mb-6">
          Last generated{" "}
          {new Date(playbook.generatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>

        {/* Tabs */}
        <PlaybookTabs playbook={playbook} accountName={account?.accountName} onToggleAction={handleToggleAction} />
      </div>
    </div>
  );
}
