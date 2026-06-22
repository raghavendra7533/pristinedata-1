import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { MOCK_WATCHLIST_ACCOUNTS, MOCK_PLAYBOOKS } from "@/lib/si/mockData";
import type { PlaybookData } from "@/lib/si/types";
import { AccountContextPanel } from "@/components/si/playbook/AccountContextPanel";
import { PlaybookTabs } from "@/components/si/playbook/PlaybookTabs";
import { ScheduleMeetingModal } from "@/components/si/playbook/ScheduleMeetingModal";
import { AddMeetingNotesModal } from "@/components/si/playbook/AddMeetingNotesModal";

export default function SIPlaybook() {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();

  const account =
    MOCK_WATCHLIST_ACCOUNTS.find((a) => a.id === accountId) ?? MOCK_WATCHLIST_ACCOUNTS[0];

  const rawPlaybook: PlaybookData =
    MOCK_PLAYBOOKS[accountId ?? ""] ?? MOCK_PLAYBOOKS[Object.keys(MOCK_PLAYBOOKS)[0]];

  const [nextActions, setNextActions] = useState<PlaybookData["nextActions"]>(rawPlaybook.nextActions);
  const [timeline, setTimeline] = useState<PlaybookData["timeline"]>(rawPlaybook.timeline);
  const [versions, setVersions] = useState<PlaybookData["versions"]>(rawPlaybook.versions ?? []);

  useEffect(() => {
    setNextActions(rawPlaybook.nextActions);
    setTimeline(rawPlaybook.timeline);
    setVersions(rawPlaybook.versions ?? []);
  }, [accountId]); // eslint-disable-line react-hooks/exhaustive-deps

  const [isGenerating, setIsGenerating] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [hasMeetingNotes, setHasMeetingNotes] = useState(false);
  const [activeTabOverride, setActiveTabOverride] = useState<"Next Actions" | undefined>(undefined);

  function handleGenerate() {
    setIsGenerating(true);
    setTimeout(() => {
      const nextVersion = (versions?.length ?? 0) + 1;
      setVersions((prev) => [
        ...(prev ?? []),
        { version: nextVersion, generatedAt: new Date().toISOString() },
      ]);
      setIsGenerating(false);
    }, 2000);
  }

  function handleToggleAction(id: string) {
    setNextActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, done: !a.done } : a))
    );
  }

  function handleSaveNotes(notes: string) {
    setTimeline((prev) => [
      ...prev,
      { date: new Date().toISOString(), event: `Meeting notes added: "${notes.slice(0, 140)}${notes.length > 140 ? "…" : ""}"`, type: "meeting" as const },
    ]);
    setHasMeetingNotes(true);
    setActiveTabOverride("Next Actions");
    setShowNotesModal(false);
  }

  const playbook: PlaybookData = { ...rawPlaybook, nextActions, timeline };

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
      <div className="flex-1 overflow-y-auto">

        {/* Sticky top bar */}
        <div
          className="sticky top-0 z-10 px-6 pt-5 pb-4 border-b border-[--si-card-border]"
          style={{ backgroundColor: "var(--si-bg)" }}
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-[--si-text-muted] mb-3">
            <button
              onClick={() => navigate("/si/watchlist")}
              className="hover:text-[--si-text-secondary] transition-colors"
            >
              Accounts
            </button>
            <Icon icon="solar:alt-arrow-right-linear" className="w-3 h-3" />
            <button
              onClick={() => navigate(`/si/account/${account?.id}`)}
              className="hover:text-[--si-text-secondary] transition-colors"
            >
              {playbook.accountName}
            </button>
            <Icon icon="solar:alt-arrow-right-linear" className="w-3 h-3" />
            <span className="text-[--si-text-secondary]">Playbook</span>
          </div>

          {/* Title row */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-[--si-text-primary] leading-tight">
                {playbook.accountName} · Sales Co-Pilot Playbook
              </h1>

              {/* Meta row */}
              <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-2">
                {playbook.version && (
                  <span className="flex items-center gap-1.5 text-xs text-[--si-text-muted]">
                    <Icon icon="solar:layers-minimalistic-linear" className="w-3.5 h-3.5" />
                    Version v{playbook.version} · Last generated{" "}
                    {new Date(playbook.generatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                )}
                {playbook.sourceMeeting && (
                  <span className="flex items-center gap-1.5 text-xs text-[--si-text-muted]">
                    <Icon icon="solar:calendar-linear" className="w-3.5 h-3.5" />
                    Source meeting: {playbook.sourceMeeting}
                  </span>
                )}
                {(playbook.dealStage || playbook.dealValue) && (
                  <span className="flex items-center gap-1.5 text-xs text-[--si-text-muted]">
                    <Icon icon="solar:dollar-minimalistic-linear" className="w-3.5 h-3.5" />
                    {[playbook.dealStage, playbook.dealValue].filter(Boolean).join(" · ")}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setShowScheduleModal(true)}
                className="inline-flex items-center gap-2 rounded-full border border-[--si-card-border] text-[--si-text-primary] px-3.5 py-2 text-xs font-medium hover:bg-[--si-card-bg] transition-colors"
              >
                <Icon icon="solar:calendar-add-linear" className="w-3.5 h-3.5" />
                Schedule meeting
              </button>
              <button
                onClick={() => setShowNotesModal(true)}
                className="inline-flex items-center gap-2 rounded-full border border-[--si-card-border] text-[--si-text-primary] px-3.5 py-2 text-xs font-medium hover:bg-[--si-card-bg] transition-colors"
              >
                <Icon icon="solar:notes-linear" className="w-3.5 h-3.5" />
                Add notes
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 rounded-full bg-[--si-primary] text-white px-3.5 py-2 text-xs font-medium hover:bg-[--si-primary-hover] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating…
                  </>
                ) : (
                  <>
                    <Icon icon="solar:magic-stick-3-linear" className="w-3.5 h-3.5" />
                    Regenerate
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Modals */}
        <ScheduleMeetingModal
          open={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          onScheduled={() => setShowScheduleModal(false)}
        />
        <AddMeetingNotesModal
          open={showNotesModal}
          onClose={() => setShowNotesModal(false)}
          onSave={handleSaveNotes}
        />

        {/* Tab content */}
        <div className="p-6">
          <PlaybookTabs
            playbook={playbook}
            accountName={account?.accountName}
            onToggleAction={handleToggleAction}
            hasMeetingNotes={hasMeetingNotes}
            activeTabOverride={activeTabOverride}
            versions={versions}
          />
        </div>
      </div>
    </div>
  );
}
