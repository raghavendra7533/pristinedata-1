import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import { MOCK_WATCHLIST_ACCOUNTS, MOCK_PLAYBOOKS, MOCK_ACCOUNT_DETAILS } from "@/lib/si/mockData";
import { AccountIntelligenceSection } from "@/components/si/account/AccountIntelligenceSection";
import { SIGNAL_TYPES } from "@/lib/si/constants";
import type { Stakeholder, AccountMeeting, MutualActionItem, SignalType } from "@/lib/si/types";

// ── style maps ────────────────────────────────────────────────────────────────

const TAG_STYLES: Record<string, string> = {
  indigo: "bg-indigo-50 text-indigo-700 border border-indigo-100",
  green:  "bg-emerald-50 text-emerald-700 border border-emerald-100",
  amber:  "bg-amber-50 text-amber-700 border border-amber-100",
  rose:   "bg-rose-50 text-rose-700 border border-rose-100",
  gray:   "bg-gray-100 text-gray-600 border border-gray-200",
};

const ROLE_STYLES: Record<Stakeholder["role"], string> = {
  Champion:         "bg-emerald-50 text-emerald-700 border border-emerald-100",
  "Economic Buyer": "bg-indigo-50 text-indigo-700 border border-indigo-100",
  Influencer:       "bg-gray-100 text-gray-600 border border-gray-200",
  Blocker:          "bg-rose-50 text-rose-700 border border-rose-100",
  Ops:              "bg-amber-50 text-amber-700 border border-amber-100",
};

const HEALTH_STYLES = {
  "On track": "bg-emerald-50 text-emerald-700",
  "At risk":  "bg-amber-50 text-amber-700",
  "Blocked":  "bg-rose-50 text-rose-700",
};

const ACTION_STATUS = {
  done:   { textClass: "line-through text-[--si-text-muted]", label: "Done",   labelClass: "text-[--si-text-muted]" },
  due:    { textClass: "text-[--si-text-primary]",            label: "Due",    labelClass: "text-amber-600 font-medium" },
  target: { textClass: "text-[--si-text-primary]",            label: "Target", labelClass: "text-[--si-text-muted]" },
};

// ── sub-components ────────────────────────────────────────────────────────────

function MeetingCard({ meeting }: { meeting: AccountMeeting }) {
  return (
    <div className="flex gap-4 py-5" style={{ borderBottom: "1px solid var(--si-card-border)" }}>
      <div className="text-right flex-shrink-0 w-[90px]">
        <p className="text-xs font-semibold text-[--si-text-primary]">{meeting.date} · {meeting.durationMin}m</p>
        <p className="text-[11px] text-[--si-text-muted] mt-0.5 leading-snug">{meeting.meetingType}</p>
      </div>
      <div className="flex-shrink-0 pt-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-[--si-primary] ring-[3px] ring-[--si-primary]/15" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[--si-text-primary] mb-0.5">{meeting.title}</p>
        <p className="text-xs text-[--si-text-muted] mb-2.5">{meeting.attendees}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {meeting.tags.map((t) => (
            <span key={t.label} className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${TAG_STYLES[t.color]}`}>
              {t.label}
            </span>
          ))}
        </div>
        <p className="text-[13px] text-[--si-text-secondary] leading-relaxed">{meeting.summary}</p>
        <div className="flex items-center gap-4 mt-3">
          <button className="flex items-center gap-1 text-[11px] text-[--si-text-muted] hover:text-[--si-primary] transition-colors">
            <Icon icon="solar:document-text-linear" className="w-3.5 h-3.5" />
            View raw notes
          </button>
          <button className="flex items-center gap-1 text-[11px] text-[--si-text-muted] hover:text-[--si-primary] transition-colors">
            <Icon icon="solar:restart-linear" className="w-3.5 h-3.5" />
            Regenerate summary
          </button>
        </div>
      </div>
    </div>
  );
}

function DealSnapshotCard({ snapshot }: { snapshot: NonNullable<typeof MOCK_ACCOUNT_DETAILS[string]["dealSnapshot"]> }) {
  return (
    <div className="rounded-[14px] overflow-hidden" style={{ border: "1px solid var(--si-card-border)", backgroundColor: "var(--si-card-bg)" }}>
      <div className="px-4 py-3.5 flex items-center justify-between" style={{ borderBottom: "1px solid var(--si-card-border)" }}>
        <span className="text-sm font-semibold text-[--si-text-primary]">Deal snapshot</span>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${HEALTH_STYLES[snapshot.health]}`}>
          ● {snapshot.health}
        </span>
      </div>
      <div className="px-4 py-4 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[--si-text-muted] mb-0.5">Amount</p>
            <p className="text-sm font-semibold text-[--si-text-primary]">{snapshot.amount}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[--si-text-muted] mb-0.5">Stage · probability</p>
            <p className="text-sm font-semibold text-[--si-text-primary]">{snapshot.stageProbability}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[--si-text-muted] mb-0.5">Next milestone</p>
            <p className="text-sm font-medium text-[--si-text-primary]">{snapshot.nextMilestone}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[--si-text-muted] mb-0.5">Meetings logged</p>
            <p className="text-sm text-[--si-text-primary]">
              <span className="font-semibold">{snapshot.meetingsLogged}</span>
              <span className="text-[--si-text-muted]"> · {snapshot.meetingsPeriod}</span>
            </p>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[--si-text-muted] mb-0.5">Team</p>
          <p className="text-xs text-[--si-text-secondary]">{snapshot.team}</p>
        </div>
        {snapshot.pathLabel && (
          <span className="self-start text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
            {snapshot.pathLabel}
          </span>
        )}
      </div>
    </div>
  );
}

function MutualActionPlanCard({ items }: { items: MutualActionItem[] }) {
  return (
    <div className="rounded-[14px] overflow-hidden" style={{ border: "1px solid var(--si-card-border)", backgroundColor: "var(--si-card-bg)" }}>
      <div className="px-4 py-3.5 flex items-center justify-between" style={{ borderBottom: "1px solid var(--si-card-border)" }}>
        <span className="text-sm font-semibold text-[--si-text-primary]">Mutual action plan</span>
        <span className="text-[11px] text-[--si-text-muted]">Auto-updated after each meeting</span>
      </div>
      <div className="px-4 py-4 flex flex-col gap-3.5">
        {items.map((item) => {
          const s = ACTION_STATUS[item.status];
          return (
            <div key={item.id} className="flex items-start gap-2.5">
              <div className={`mt-0.5 w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border ${
                item.status === "done" ? "bg-[--si-primary] border-[--si-primary]" : "border-[--si-card-border]"
              }`}>
                {item.status === "done" && <Icon icon="solar:check-read-linear" className="w-2.5 h-2.5 text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] leading-snug ${s.textClass}`}>{item.text}</p>
                <p className="text-[11px] text-[--si-text-muted] mt-0.5">
                  {item.assignee} · <span className={s.labelClass}>{s.label}</span> · {item.dateLabel}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

const tabs = ["Account Overview", "ICP", "Social", "Deep Dive", "Intel"] as const;
type Tab = typeof tabs[number];

export default function SIAccountView() {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("Account Overview");

  const account = MOCK_WATCHLIST_ACCOUNTS.find((a) => a.id === accountId);
  const playbook = accountId ? MOCK_PLAYBOOKS[accountId] : undefined;
  const details = accountId ? MOCK_ACCOUNT_DETAILS[accountId] : undefined;

  if (!account) {
    return (
      <div data-theme="si" className="p-6">
        <p className="text-sm text-[--si-text-secondary]">Account not found.</p>
      </div>
    );
  }

  const stakeholders = playbook?.stakeholders ?? [];
  const hasMeetings = (details?.meetings ?? []).length > 0;
  const recentSignals = account.signals.slice(0, 5);

  return (
    <div className="flex h-screen" data-theme="si">

      {/* ── Left sidebar: identity + signals only ── */}
      <div
        className="w-[280px] flex-shrink-0 border-r border-[--si-card-border] overflow-y-auto flex flex-col"
        style={{ backgroundColor: "var(--si-card-bg)" }}
      >
        {/* Account identity */}
        <div className="p-5 border-b border-[--si-card-border]">
          <div className="flex items-center gap-3 mb-3">
            {!imgError ? (
              <img
                src={`https://www.google.com/s2/favicons?sz=48&domain=${account.domain}`}
                alt={account.accountName}
                className="w-10 h-10 rounded-xl object-contain flex-shrink-0 bg-gray-50 p-0.5 border border-[--si-card-border]"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-base font-bold text-white bg-indigo-500">
                {account.accountName.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-base font-semibold text-[--si-text-primary] leading-tight truncate">{account.accountName}</p>
              <p className="text-xs text-[--si-text-muted] mt-0.5">{account.domain}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mb-3">
            {[account.revenue, account.employees, account.industry].map((v) => (
              <span key={v} className="text-xs text-[--si-text-muted]">{v}</span>
            ))}
            <span className="text-xs text-[--si-text-muted] w-full">{account.location}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: account.intentLabel === "Hot" ? "#FEF3C7" : account.intentLabel === "Warm" ? "#FFF7ED" : "#F3F4F6",
              color: account.intentLabel === "Hot" ? "#D97706" : account.intentLabel === "Warm" ? "#EA580C" : "#6B7280",
            }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ backgroundColor: account.intentLabel === "Hot" ? "#D97706" : account.intentLabel === "Warm" ? "#EA580C" : "#9CA3AF" }} />
            {account.intentLabel} · {account.intentScore}
          </div>
        </div>

        {/* Recent signals */}
        <div className="p-5 border-b border-[--si-card-border] flex flex-col gap-2.5">
          <p className="text-[10px] font-semibold text-[--si-text-muted] uppercase tracking-widest mb-0.5">Recent Signals</p>
          {recentSignals.length === 0 ? (
            <p className="text-xs text-[--si-text-muted]">No signals yet.</p>
          ) : (
            recentSignals.map((signal) => {
              const config = SIGNAL_TYPES[signal.type as SignalType];
              return (
                <div
                  key={signal.id}
                  className="flex flex-col gap-1 rounded-lg px-3 py-2.5"
                  style={{ border: `1px solid ${config?.color ?? "#6366F1"}30`, backgroundColor: (config?.color ?? "#6366F1") + "0a" }}
                >
                  <span className="text-[11px] font-bold" style={{ color: config?.color ?? "#6366F1" }}>
                    {config?.label ?? signal.type}
                  </span>
                  <p className="text-[11px] text-[--si-text-secondary] leading-relaxed line-clamp-3">{signal.summary}</p>
                </div>
              );
            })
          )}
        </div>

        {/* Contacts */}
        <div className="p-5 flex flex-col gap-2.5">
          <p className="text-[10px] font-semibold text-[--si-text-muted] uppercase tracking-widest mb-0.5">
            Contacts{stakeholders.length > 0 ? ` · ${stakeholders.length}` : ""}
          </p>
          {stakeholders.length === 0 ? (
            <p className="text-xs text-[--si-text-muted]">No contacts added yet.</p>
          ) : (
            stakeholders.map((s) => (
              <div key={s.id} className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold text-white ${
                  s.role === "Champion" ? "bg-emerald-500" : s.role === "Economic Buyer" ? "bg-indigo-500" : s.role === "Blocker" ? "bg-rose-500" : "bg-gray-400"
                }`}>
                  {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[--si-text-primary] truncate">{s.name}</p>
                  <p className="text-[11px] text-[--si-text-muted] truncate">{s.title}</p>
                </div>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-[4px] flex-shrink-0 ${ROLE_STYLES[s.role]}`}>
                  {s.role === "Blocker" ? "Blocker" : s.role === "Economic Buyer" ? "EB" : s.role}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Right: scrollable content ── */}
      <div className="flex-1 overflow-y-auto">

        {/* Sticky top bar */}
        <div
          className="sticky top-0 z-10 px-6 pt-5 pb-0 border-b border-[--si-card-border]"
          style={{ backgroundColor: "var(--si-bg)" }}
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-[--si-text-muted] mb-2">
            <button onClick={() => navigate("/si/watchlist")} className="hover:text-[--si-text-secondary] transition-colors">Accounts</button>
            <Icon icon="solar:alt-arrow-right-linear" className="w-3 h-3" />
            <span className="text-[--si-text-secondary]">{account.accountName}</span>
            <Icon icon="solar:alt-arrow-right-linear" className="w-3 h-3" />
            <span className="text-[--si-text-secondary]">Account</span>
          </div>

          {/* Title + actions */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-xl font-semibold text-[--si-text-primary]">
                {account.accountName} · Account Overview
              </h1>
              {(details?.dealStage || details?.dealValue || details?.champion) && (
                <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-1.5">
                  {details?.dealValue && details?.targetCloseDate && (
                    <span className="flex items-center gap-1 text-xs text-[--si-text-muted]">
                      <Icon icon="solar:dollar-minimalistic-linear" className="w-3.5 h-3.5" />
                      {details.dealValue} · Target close {details.targetCloseDate}
                    </span>
                  )}
                  {details?.champion && (
                    <span className="flex items-center gap-1 text-xs text-[--si-text-muted]">
                      <Icon icon="solar:user-rounded-linear" className="w-3.5 h-3.5" />
                      Champion · {details.champion}
                    </span>
                  )}
                  {details?.playbookVersion && (
                    <span className="flex items-center gap-1 text-xs text-[--si-text-muted]">
                      <Icon icon="solar:layers-minimalistic-linear" className="w-3.5 h-3.5" />
                      Playbook v{details.playbookVersion}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button className="inline-flex items-center gap-2 rounded-full border border-[--si-card-border] text-[--si-text-primary] px-3.5 py-2 text-xs font-medium hover:bg-[--si-card-bg] transition-colors">
                <Icon icon="solar:arrow-right-up-linear" className="w-3.5 h-3.5" />
                Open in Salesforce
              </button>
              <button
                onClick={() => navigate(`/si/playbook/${account.id}`)}
                className="inline-flex items-center gap-2 rounded-full bg-[--si-primary] text-white px-3.5 py-2 text-xs font-medium hover:bg-[--si-primary-hover] transition-colors"
              >
                <Icon icon={playbook ? "solar:notebook-bookmark-linear" : "solar:bolt-linear"} className="w-3.5 h-3.5" />
                {playbook ? "Open Playbook" : "Start Playbook"}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-0">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm px-4 py-2.5 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "border-[--si-primary] text-[--si-primary] font-semibold"
                    : "border-transparent text-[--si-text-secondary] hover:text-[--si-text-primary]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab content ── */}
        <div className="p-6 flex flex-col gap-5">

          {/* ── Account Overview ── */}
          {activeTab === "Account Overview" && (
            <div className="grid grid-cols-[1fr_300px] gap-5 items-start">
              <div className="flex flex-col gap-5">

                {/* Company Overview */}
                {details?.companyOverview && (
                  <div className="rounded-[14px] overflow-hidden" style={{ border: "1px solid var(--si-card-border)", backgroundColor: "var(--si-card-bg)" }}>
                    <div className="px-5 py-3.5 flex items-center gap-2" style={{ borderBottom: "1px solid var(--si-card-border)" }}>
                      <Icon icon="solar:buildings-2-linear" className="w-4 h-4 text-indigo-500" />
                      <h3 className="text-sm font-semibold text-[--si-text-primary]">Company Overview</h3>
                    </div>
                    <div className="px-5 py-4">
                      <p className="text-[13px] text-[--si-text-secondary] leading-relaxed">{details.companyOverview}</p>
                    </div>
                  </div>
                )}

                {/* Meeting timeline */}
                <div className="rounded-[14px] overflow-hidden" style={{ border: "1px solid var(--si-card-border)", backgroundColor: "var(--si-card-bg)" }}>
                  <div className="px-5 py-3.5 flex items-center justify-between" style={{ borderBottom: "1px solid var(--si-card-border)" }}>
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:calendar-linear" className="w-4 h-4 text-indigo-500" />
                      <h3 className="text-sm font-semibold text-[--si-text-primary]">Meeting timeline</h3>
                    </div>
                    {hasMeetings && (
                      <span className="text-[11px] text-[--si-text-muted]">
                        {details!.meetings.length} meetings captured · last 7 days
                      </span>
                    )}
                  </div>
                  {hasMeetings ? (
                    <div className="px-5">
                      {details!.meetings.map((m) => <MeetingCard key={m.id} meeting={m} />)}
                    </div>
                  ) : (
                    <div className="px-5 py-10 flex flex-col items-center gap-2 text-center">
                      <Icon icon="solar:calendar-add-linear" className="w-8 h-8 text-[--si-text-muted]" />
                      <p className="text-sm text-[--si-text-muted]">No meetings logged yet.</p>
                      <button className="text-xs text-[--si-primary] hover:underline mt-1">Log your first call</button>
                    </div>
                  )}
                </div>

                {/* Account Brief */}
                <div className="rounded-[14px] overflow-hidden" style={{ border: "1px solid var(--si-card-border)", backgroundColor: "var(--si-card-bg)" }}>
                  <div className="px-5 py-3.5 flex items-center justify-between" style={{ borderBottom: "1px solid var(--si-card-border)" }}>
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:document-text-linear" className="w-4 h-4 text-indigo-500" />
                      <h3 className="text-sm font-semibold text-[--si-text-primary]">Account Brief</h3>
                    </div>
                    {hasMeetings && details?.accountSummaryWithMeetings ? (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">Summarized from timeline + notes</span>
                    ) : (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Business context only</span>
                    )}
                  </div>
                  <div className="px-5 py-4">
                    {hasMeetings && details?.accountSummaryWithMeetings ? (
                      details.accountSummaryWithMeetings.split("\n\n").map((p, i) => (
                        <p key={i} className="text-[13px] text-[--si-text-secondary] leading-relaxed mb-3 last:mb-0">{p}</p>
                      ))
                    ) : details?.accountSummaryWithoutMeetings ? (
                      details.accountSummaryWithoutMeetings.split("\n\n").map((p, i) => (
                        <p key={i} className="text-[13px] text-[--si-text-secondary] leading-relaxed mb-3 last:mb-0">{p}</p>
                      ))
                    ) : (
                      <p className="text-sm text-[--si-text-muted]">No summary available yet.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right col: deal + MAP only */}
              <div className="flex flex-col gap-4">
                {details?.dealSnapshot && <DealSnapshotCard snapshot={details.dealSnapshot} />}
                {details?.mutualActionPlan && details.mutualActionPlan.length > 0 && (
                  <MutualActionPlanCard items={details.mutualActionPlan} />
                )}
              </div>
            </div>
          )}

          {/* ── ICP ── */}
          {activeTab === "ICP" && (
            <div className="flex flex-col gap-4">
              <div className="rounded-[14px] overflow-hidden" style={{ border: "1px solid var(--si-card-border)", backgroundColor: "var(--si-card-bg)" }}>
                <div className="px-5 py-3.5 flex items-center gap-2" style={{ borderBottom: "1px solid var(--si-card-border)" }}>
                  <Icon icon="solar:target-linear" className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-sm font-semibold text-[--si-text-primary]">Who they sell to</h3>
                  <span className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Their ICP segments</span>
                </div>
                {details?.icpPersonas && details.icpPersonas.length > 0 ? (
                  <div className="px-5 py-4 flex flex-col gap-3">
                    {details.icpPersonas.map((persona, i) => (
                      <div key={i} className="flex items-start gap-3.5 rounded-xl px-4 py-3.5"
                        style={{ border: "1px solid var(--si-card-border)", backgroundColor: "var(--si-bg)" }}>
                        <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold text-white bg-indigo-500 mt-0.5">
                          {i + 1}
                        </div>
                        <p className="text-[13px] text-[--si-text-secondary] leading-relaxed">{persona}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-5 py-10 text-center">
                    <p className="text-sm text-[--si-text-muted]">ICP segments not yet generated.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Social ── */}
          {activeTab === "Social" && (
            <div className="flex flex-col gap-5">

              {/* Messaging Themes */}
              <div className="rounded-[14px] overflow-hidden" style={{ border: "1px solid var(--si-card-border)", backgroundColor: "var(--si-card-bg)" }}>
                <div className="px-5 py-3.5 flex items-center gap-2" style={{ borderBottom: "1px solid var(--si-card-border)" }}>
                  <Icon icon="solar:chat-round-dots-linear" className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-sm font-semibold text-[--si-text-primary]">Messaging Themes</h3>
                </div>
                {details?.messagingThemes && details.messagingThemes.length > 0 ? (
                  <div className="divide-y divide-[--si-card-border]">
                    {details.messagingThemes.map((theme, i) => (
                      <div key={i} className="flex items-start gap-3.5 px-5 py-4">
                        <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold bg-indigo-50 text-indigo-600 mt-0.5">
                          {i + 1}
                        </div>
                        <p className="text-[13px] text-[--si-text-secondary] leading-relaxed">{theme}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-5 py-8 text-center">
                    <p className="text-sm text-[--si-text-muted]">No messaging themes available.</p>
                  </div>
                )}
              </div>

              {/* Priority Topics + Engagement Hooks side by side */}
              <div className="grid grid-cols-2 gap-5">

                {/* Priority Topics */}
                <div className="rounded-[14px] overflow-hidden" style={{ border: "1px solid var(--si-card-border)", backgroundColor: "var(--si-card-bg)" }}>
                  <div className="px-5 py-3.5 flex items-center gap-2" style={{ borderBottom: "1px solid var(--si-card-border)" }}>
                    <Icon icon="solar:bookmark-linear" className="w-4 h-4 text-violet-500" />
                    <h3 className="text-sm font-semibold text-[--si-text-primary]">Priority Topics</h3>
                  </div>
                  {details?.priorityTopics && details.priorityTopics.length > 0 ? (
                    <div className="px-5 py-4 flex flex-col gap-3">
                      {details.priorityTopics.map((topic, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <Icon icon="solar:tag-linear" className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 mt-0.5" />
                          <p className="text-[13px] text-[--si-text-secondary] leading-relaxed">{topic}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-5 py-8 text-center">
                      <p className="text-sm text-[--si-text-muted]">No priority topics available.</p>
                    </div>
                  )}
                </div>

                {/* Engagement Hooks */}
                <div className="rounded-[14px] overflow-hidden" style={{ border: "1px solid var(--si-card-border)", backgroundColor: "var(--si-card-bg)" }}>
                  <div className="px-5 py-3.5 flex items-center gap-2" style={{ borderBottom: "1px solid var(--si-card-border)" }}>
                    <Icon icon="solar:bolt-linear" className="w-4 h-4 text-amber-500" />
                    <h3 className="text-sm font-semibold text-[--si-text-primary]">Engagement Hooks</h3>
                  </div>
                  {details?.engagementHooks && details.engagementHooks.length > 0 ? (
                    <div className="px-5 py-4 flex flex-col gap-3">
                      {details.engagementHooks.map((hook, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <Icon icon="solar:arrow-right-linear" className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                          <p className="text-[13px] text-[--si-text-secondary] leading-relaxed">{hook}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-5 py-8 text-center">
                      <p className="text-sm text-[--si-text-muted]">No engagement hooks available.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Data Quality Note */}
              {details?.dataQualityNote && (
                <div className="flex items-start gap-3 rounded-[14px] px-5 py-4"
                  style={{ border: "1px solid #FDE68A", backgroundColor: "#FFFBEB" }}>
                  <Icon icon="solar:info-circle-linear" className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-widest mb-1">Data Quality Note</p>
                    <p className="text-[13px] text-amber-800 leading-relaxed">{details.dataQualityNote}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Deep Dive ── */}
          {activeTab === "Deep Dive" && (
            <div className="flex flex-col gap-5">

              {/* Company Overview */}
              <div className="rounded-[14px] overflow-hidden" style={{ border: "1px solid var(--si-card-border)", backgroundColor: "var(--si-card-bg)" }}>
                <div className="px-5 py-3.5" style={{ borderBottom: "1px solid var(--si-card-border)" }}>
                  <h3 className="text-sm font-semibold text-[--si-text-primary]">Company Overview</h3>
                </div>
                <div className="px-5 py-4">
                  {details?.companyOverview ? (
                    <p className="text-[13px] text-[--si-text-secondary] leading-relaxed">{details.companyOverview}</p>
                  ) : (
                    <p className="text-sm text-[--si-text-muted]">Company overview not yet generated.</p>
                  )}
                </div>
              </div>

              {/* Product & ICP */}
              <div className="rounded-[14px] overflow-hidden" style={{ border: "1px solid var(--si-card-border)", backgroundColor: "var(--si-card-bg)" }}>
                <div className="px-5 py-3.5" style={{ borderBottom: "1px solid var(--si-card-border)" }}>
                  <h3 className="text-sm font-semibold text-[--si-text-primary]">Product & ICP</h3>
                </div>
                <div className="px-5 py-4 flex flex-col gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[--si-text-muted] mb-1.5">Product</p>
                    <p className="text-[13px] text-[--si-text-secondary] leading-relaxed">
                      {details?.productOffering ?? "Not available"}
                    </p>
                  </div>
                  <div style={{ borderTop: "1px solid var(--si-card-border)", paddingTop: "1rem" }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[--si-text-muted] mb-1.5">Their ICP</p>
                    <p className="text-[13px] text-[--si-text-secondary] leading-relaxed">
                      {details?.icpSummary ?? "Not available"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Strategic Objectives */}
              <div className="rounded-[14px] overflow-hidden" style={{ border: "1px solid var(--si-card-border)", backgroundColor: "var(--si-card-bg)" }}>
                <div className="px-5 py-3.5" style={{ borderBottom: "1px solid var(--si-card-border)" }}>
                  <h3 className="text-sm font-semibold text-[--si-text-primary]">Strategic Objectives & Challenges</h3>
                </div>
                <div className="px-5 py-4">
                  {details?.strategicObjectives && details.strategicObjectives.length > 0 ? (
                    <ul className="flex flex-col gap-2.5">
                      {details.strategicObjectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[--si-primary] flex-shrink-0" />
                          <span className="text-[13px] text-[--si-text-secondary] leading-relaxed">{obj}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-[--si-text-muted]">Strategic objectives not yet generated.</p>
                  )}
                </div>
              </div>

              {/* Competitive Landscape */}
              <div className="rounded-[14px] overflow-hidden" style={{ border: "1px solid var(--si-card-border)", backgroundColor: "var(--si-card-bg)" }}>
                <div className="px-5 py-3.5 flex items-center gap-2" style={{ borderBottom: "1px solid var(--si-card-border)" }}>
                  <Icon icon="solar:chart-2-linear" className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-sm font-semibold text-[--si-text-primary]">Competitive Landscape</h3>
                </div>

                {details?.competitorOverview || details?.competitors || details?.marketPosition ? (
                  <div className="flex flex-col">
                    {/* Overview */}
                    {details.competitorOverview && (
                      <div className="px-5 py-4" style={{ borderBottom: details.competitors?.length ? "1px solid var(--si-card-border)" : undefined }}>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[--si-text-muted] mb-1.5">Overview</p>
                        <p className="text-[13px] text-[--si-text-secondary] leading-relaxed">{details.competitorOverview}</p>
                      </div>
                    )}

                    {/* Competitors */}
                    {details.competitors && details.competitors.length > 0 && (
                      <div className="px-5 py-4" style={{ borderBottom: details.marketPosition ? "1px solid var(--si-card-border)" : undefined }}>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[--si-text-muted] mb-3">Competitors</p>
                        <div className="flex flex-col gap-3">
                          {details.competitors.map((c, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <span className="flex-shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-[6px] bg-gray-100 text-gray-700 border border-gray-200 mt-0.5 whitespace-nowrap">
                                {c.name}
                              </span>
                              <p className="text-[13px] text-[--si-text-secondary] leading-relaxed">{c.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Market Position */}
                    {details.marketPosition && (
                      <div className="px-5 py-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[--si-text-muted] mb-1.5">Market Position</p>
                        <p className="text-[13px] text-[--si-text-secondary] leading-relaxed">{details.marketPosition}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="px-5 py-10 text-center">
                    <p className="text-sm text-[--si-text-muted]">Competitive research not yet generated.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Intel ── */}
          {activeTab === "Intel" && <AccountIntelligenceSection playbook={playbook} />}

        </div>
      </div>
    </div>
  );
}
