import { useState, useMemo, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useUserProfileStore } from "@/lib/si/userProfileStore";
import { MOCK_SIGNALS, MOCK_WATCHLIST_ACCOUNTS } from "@/lib/si/mockData";
import type { SignalType } from "@/lib/si/types";

// ─── Mock data ──────────────────────────────────────────────────────────────

const MORNING_BRIEF_ACCOUNTS = [
  {
    id: "acc-clari",
    name: "Clari",
    domain: "clari.com",
    contact: "Sarah Kim, VP Finance",
    bestCallReason: "Series E just closed. Finance persona is in evaluation mode — budget cycle opens Q3. You haven't spoken in 7 days.",
    context: "Series E just closed. Finance persona in evaluation mode; budget cycle opens Q3. You have 2 contacts.",
    cta: "Draft outreach →",
    ctaStyle: "funding" as const,
  },
  {
    id: "acc-clearbit",
    name: "Clearbit",
    domain: "clearbit.com",
    contact: "Marcus Holt, VP Engineering",
    bestCallReason: "Buying committee active for 8 days. Vendor evaluation window closes in ~3 days. You haven't spoken since April 12.",
    context: "Buying committee researching visitor ID tools (your category) across 14 properties. 3 decision-makers identified.",
    cta: "View intent details →",
    ctaStyle: "intent" as const,
  },
  {
    id: "acc-gong",
    name: "Gong",
    domain: "gong.io",
    contact: "James Rubin, CRO",
    bestCallReason: "34 GTM & eng roles posted this week. Hiring ramp signals expanded budget ahead of Celebrate conference.",
    context: "Hiring 14 sales & eng roles ahead of Celebrate conference. Complementary tooling pitch window open this week.",
    cta: "View hiring signal →",
    ctaStyle: "hiring" as const,
  },
];

const STATS = [
  { label: "ACCOUNTS AT RISK", value: 3,  sub: "Longest: Outreach (22d)", subColor: "#F59E0B", icon: "solar:danger-triangle-bold",         iconColor: "#EF4444" },
  { label: "NEW SIGNALS",       value: 17, sub: "3 high priority",          subColor: "#10B981", icon: "solar:pulse-2-bold",                  iconColor: "#6366F1" },
  { label: "OPEN TASKS",        value: 5,  sub: "2 overdue",                subColor: "#EF4444", icon: "solar:checklist-minimalistic-bold",   iconColor: "#F59E0B" },
  { label: "WATCHLIST",         value: 12, sub: "4 active signals",         subColor: "#6366F1", icon: "solar:bookmark-bold",                 iconColor: "#8B5CF6" },
];

const QUEUE_ITEMS = [
  {
    id: "q1",
    task: "Follow up",
    company: "Clari",
    contact: "Sarah Kim, VP Finance",
    signal: "Series E closed 7d ago — budget cycle opens Q3",
    signalIcon: "solar:bolt-bold",
    badge: "Now",
    badgeColor: "#EF4444",
    meta: "Overdue · 7 days since last touch",
    done: false,
  },
  {
    id: "q2",
    task: "Send deck",
    company: "Clearbit",
    contact: "3 decision-makers",
    signal: "Intent surge · buying window closing in ~3 days",
    signalIcon: "solar:bolt-bold",
    badge: "Now",
    badgeColor: "#EF4444",
    meta: "Overdue · created 3 days ago",
    done: false,
  },
  {
    id: "q3",
    task: "LinkedIn connect",
    company: "Gong",
    contact: "SDR hiring lead",
    signal: "Hiring surge · warm intro via James L.",
    signalIcon: "solar:users-group-rounded-bold",
    badge: "Today",
    badgeColor: "#F59E0B",
    meta: "Due today",
    done: false,
  },
  {
    id: "q4",
    task: "Prep discovery call",
    company: "Outreach",
    contact: "",
    signal: "Call Thu 2pm · no-touch risk (22 days)",
    signalIcon: "solar:calendar-bold",
    badge: "Thu",
    badgeColor: "#9CA3AF",
    meta: "Due Thursday",
    done: false,
  },
  {
    id: "q5",
    task: "Research Salesloft migration path",
    company: "",
    contact: "",
    signal: "",
    signalIcon: "",
    badge: "",
    badgeColor: "",
    meta: "Done · 9:14 AM",
    done: true,
  },
];

const FILTER_TABS: { key: "all" | SignalType; label: string }[] = [
  { key: "all",            label: "All"     },
  { key: "new_funding",    label: "Funding" },
  { key: "intent_surge",   label: "Intent"  },
  { key: "hiring_surge",   label: "Hiring"  },
];

const SIGNAL_META: Record<string, { label: string; color: string; bg: string }> = {
  new_funding:       { label: "NEW FUNDING",   color: "var(--si-signal-funding)",    bg: "rgba(217,119,6,0.1)"   },
  intent_surge:      { label: "INTENT SURGE",  color: "var(--si-signal-intent)",     bg: "rgba(124,58,237,0.1)"  },
  hiring_surge:      { label: "HIRING SURGE",  color: "var(--si-signal-hiring)",     bg: "rgba(37,99,235,0.1)"   },
  tech_change:       { label: "TECH CHANGE",   color: "var(--si-signal-tech)",       bg: "rgba(5,150,105,0.1)"   },
  leadership_change: { label: "LEADERSHIP",    color: "var(--si-signal-leadership)", bg: "rgba(219,39,119,0.1)"  },
  expansion:         { label: "EXPANSION",     color: "var(--si-signal-expansion)",  bg: "rgba(234,88,12,0.1)"   },
};

const CTA_BUTTON: Record<string, React.CSSProperties> = {
  funding: { background: "rgba(217,119,6,0.08)",  color: "var(--si-signal-funding)",  border: "1px solid rgba(217,119,6,0.2)"  },
  intent:  { background: "rgba(124,58,237,0.08)", color: "var(--si-signal-intent)",   border: "1px solid rgba(124,58,237,0.2)" },
  hiring:  { background: "rgba(37,99,235,0.08)",  color: "var(--si-signal-hiring)",   border: "1px solid rgba(37,99,235,0.2)"  },
};

function urgencyFromId(id: string): number {
  const n = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return (n % 3) + 3;
}

function daysAgoLabel(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  return d === 0 ? "Today" : d === 1 ? "1d ago" : `${d}d ago`;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function UrgencyDots({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-[3px]">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            width: 7, height: 7,
            borderRadius: "50%",
            backgroundColor: i <= level ? "var(--si-signal-funding)" : "var(--si-card-border)",
          }}
        />
      ))}
    </div>
  );
}

function AccountInitialBadge({ name, domain, size = 32 }: { name: string; domain?: string; size?: number }) {
  const colors = ["#6366F1", "#7C3AED", "#2563EB", "#059669", "#D97706", "#DB2777"];
  const idx = name.charCodeAt(0) % colors.length;
  const [imgFailed, setImgFailed] = useState(false);

  if (domain && !imgFailed) {
    return (
      <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "1px solid #E5E7EB", backgroundColor: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img
          src={`https://www.google.com/s2/favicons?sz=64&domain=${domain}`}
          alt={name}
          style={{ width: size * 0.6, height: size * 0.6, objectFit: "contain" }}
          onError={() => setImgFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        width: size, height: size,
        borderRadius: "50%",
        backgroundColor: colors[idx],
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 700,
        fontSize: size * 0.4,
        color: "#fff",
        flexShrink: 0,
        letterSpacing: "-0.01em",
      }}
    >
      {name.slice(0, 1).toUpperCase()}
    </div>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export default function SIDashboard() {
  const navigate = useNavigate();
  const { watchedAccounts, profile } = useUserProfileStore();
  const [icpBannerDismissed, setIcpBannerDismissed] = useState(
    () => localStorage.getItem("si-icp-banner-dismissed") === "true"
  );

  const handleDismissIcpBanner = () => {
    localStorage.setItem("si-icp-banner-dismissed", "true");
    setIcpBannerDismissed(true);
  };
  const [signalFilter, setSignalFilter] = useState<"all" | SignalType>("all");
  const shuffledBriefAccounts = useMemo(
    () => [...MORNING_BRIEF_ACCOUNTS].sort(() => Math.random() - 0.5),
    []
  );
  const heroAccount = shuffledBriefAccounts[0];
  const bestCallAccount = shuffledBriefAccounts[1] ?? shuffledBriefAccounts[0];
  const [checkedItems, setCheckedItems] = useState<Set<string>>(
    () => new Set(QUEUE_ITEMS.filter((q) => q.done).map((q) => q.id))
  );
  const toggleItem = (id: string) =>
    setCheckedItems((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const filteredSignals = [...MOCK_SIGNALS]
    .sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime())
    .filter((s) => signalFilter === "all" || s.type === signalFilter);

  const watchlistCount = watchedAccounts.length || 12;

  const cardStyle: React.CSSProperties = {
    backgroundColor: "var(--si-card-bg)",
    border: "1px solid var(--si-card-border)",
    borderRadius: 12,
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--si-text-muted)",
  };

  const displayFont: React.CSSProperties = {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  };

  return (
    <div style={{ backgroundColor: "var(--si-bg)", minHeight: "100%" }}>

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-6"
        style={{ backgroundColor: "var(--si-card-bg)", borderBottom: "1px solid var(--si-card-border)", height: 57 }}
      >
        <div>
          <p style={{ ...displayFont, fontSize: 15, fontWeight: 700, color: "var(--si-text-primary)" }}>
            My Dashboard
          </p>
          <p style={{ fontSize: 11, color: "var(--si-text-muted)", marginTop: 1 }}>{today}</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => navigate("/si/watchlist")}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 12, fontWeight: 600,
              padding: "6px 12px", borderRadius: 8,
              border: "1px solid var(--si-card-border)",
              color: "var(--si-text-secondary)",
              backgroundColor: "var(--si-card-bg)",
              cursor: "pointer",
            }}
          >
            <Icon icon="solar:bookmark-linear" width={13} />
            Watchlist
            <span
              style={{
                fontSize: 10, fontWeight: 700,
                padding: "1px 6px", borderRadius: 20,
                backgroundColor: "var(--si-primary)", color: "#fff",
              }}
            >
              {watchlistCount}
            </span>
          </button>

          <button
            onClick={() => navigate("/si/search")}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              fontSize: 12, color: "var(--si-text-muted)",
              padding: "6px 14px", borderRadius: 8, width: 240,
              border: "1px solid var(--si-card-border)",
              backgroundColor: "var(--si-card-bg)", cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <Icon icon="solar:magnifer-linear" width={13} />
            Search accounts, contacts...
          </button>

          <button style={{ position: "relative", padding: 6, color: "var(--si-text-muted)", background: "none", border: "none", cursor: "pointer" }}>
            <Icon icon="solar:bell-linear" width={18} />
            <span style={{ position: "absolute", top: 5, right: 5, width: 7, height: 7, borderRadius: "50%", backgroundColor: "var(--si-primary)" }} />
          </button>

          <button
            onClick={() => navigate("/si/icp")}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 12, fontWeight: 600,
              padding: "6px 14px", borderRadius: 8,
              backgroundColor: "var(--si-primary)", color: "#fff", border: "none", cursor: "pointer",
            }}
          >
            <Icon icon="solar:add-circle-linear" width={13} />
            Add Account
          </button>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* ── THIN METRICS BAR ─────────────────────────────────────────── */}
        <div
          style={{
            display: "flex", alignItems: "center", gap: 0,
            backgroundColor: "var(--si-card-bg)",
            border: "1px solid var(--si-card-border)",
            borderRadius: 8,
            padding: "0 16px",
            height: 36,
            marginBottom: 12,
          }}
        >
          {STATS.map((s, i) => (
            <Fragment key={s.label}>
              {i > 0 && (
                <div style={{ width: 1, height: 16, backgroundColor: "var(--si-card-border)", flexShrink: 0 }} />
              )}
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: i === 0 ? "0 16px 0 0" : "0 16px",
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    color: "var(--si-text-muted)",
                  }}
                >
                  {s.label}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--si-text-primary)" }}>
                  {s.value}
                </span>
                <span style={{ fontSize: 10, color: s.subColor }}>
                  {s.sub}
                </span>
              </div>
            </Fragment>
          ))}
        </div>

        {/* ── ICP CALLOUT BANNER ───────────────────────────────────────── */}
        {!icpBannerDismissed && profile?.icp && (
          <div className="flex items-start justify-between gap-4 rounded-2xl border border-[#E0E7FF] bg-[#EEF2FF] px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0">
                <Icon icon="solar:magic-stick-3-bold" className="w-4 h-4 text-[#6366F1]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#3730A3]">
                  We built your starting ICP from your website.
                </p>
                <p className="text-sm text-[#4338CA] mt-0.5">
                  Your signal feed is already filtered for accounts that fit. Refine your ICP anytime.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <a
                href="/si/icp"
                className="text-sm font-semibold text-[#6366F1] hover:text-[#4F46E5] transition-colors whitespace-nowrap"
              >
                Refine ICP →
              </a>
              <button
                onClick={handleDismissIcpBanner}
                className="text-[#6366F1] hover:text-[#4F46E5] transition-colors"
                aria-label="Dismiss"
              >
                <Icon icon="solar:close-circle-linear" className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── HERO ROW: Hero Banner + Best Call side by side ───────────── */}
        <div style={{ display: "flex", gap: 20, alignItems: "stretch" }}>

          {/* Left: Hero Banner */}
          <div
            style={{
              flex: 1,
              borderRadius: 14,
              padding: "24px 28px",
              background: "linear-gradient(135deg, #080D1A 0%, #0F0A2E 50%, #111827 100%)",
              border: "1px solid rgba(99,102,241,0.18)",
              boxShadow: "0 0 40px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
              position: "relative",
            }}
          >
            <div style={{
              position: "absolute", top: 0, right: 0, bottom: 0,
              width: 220, borderRadius: "0 14px 14px 0",
              background: "radial-gradient(ellipse at top right, rgba(99,102,241,0.12) 0%, transparent 65%)",
              pointerEvents: "none", zIndex: 0,
            }} />
            <p
              style={{
                ...displayFont,
                fontSize: 22,
                fontWeight: 800,
                color: "#fff",
                lineHeight: 1.35,
                letterSpacing: "-0.02em",
                position: "relative",
              }}
            >
              You have a{" "}
              <em
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: 26,
                  background: "linear-gradient(90deg, #A5B4FC, #818CF8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                3-day window
              </em>
              {" "}on{" "}
              <span style={{ color: "#E0E7FF", fontWeight: 800 }}>{heroAccount.name}.</span>
            </p>
            <p style={{ fontSize: 13, color: "#6B7DB3", marginTop: 8, lineHeight: 1.55, position: "relative" }}>
              Intent surge started 8 days ago — buying windows like this typically close in 10–12 days.
            </p>
            <button
              onClick={() => navigate(`/si/playbook/${heroAccount.id}`)}
              style={{
                marginTop: 16,
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                borderRadius: 999,
                background: "linear-gradient(135deg, #6366F1, #818CF8)",
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                letterSpacing: "0.01em",
              }}
            >
              View Opp Playbook
              <Icon icon="solar:arrow-right-linear" width={13} />
            </button>

            {/* Signal evidence chips */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, flexWrap: "wrap", position: "relative" }}>
              {[
                { icon: "solar:bolt-bold",              label: "Intent surge · 8d active",     color: "#A78BFA", bg: "rgba(139,92,246,0.12)",  border: "rgba(139,92,246,0.2)"  },
                { icon: "solar:users-group-rounded-bold", label: "3 decision-makers ID'd",     color: "#67E8F9", bg: "rgba(6,182,212,0.1)",    border: "rgba(6,182,212,0.18)"  },
                { icon: "solar:hourglass-bold",         label: "Window closes ~3d",            color: "#FCA5A5", bg: "rgba(239,68,68,0.1)",    border: "rgba(239,68,68,0.18)"  },
              ].map((chip) => (
                <span
                  key={chip.label}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "4px 10px", borderRadius: 999,
                    backgroundColor: chip.bg,
                    border: `1px solid ${chip.border}`,
                    fontSize: 11, fontWeight: 600,
                    color: chip.color,
                    letterSpacing: "0.01em",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  <Icon icon={chip.icon} width={10} />
                  {chip.label}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Best Call to Make Today */}
          <div
            style={{
              width: 300,
              flexShrink: 0,
              borderRadius: 14,
              overflow: "hidden",
              border: "1px solid var(--si-card-border)",
              backgroundColor: "var(--si-card-bg)",
            }}
          >
            <div style={{ padding: "20px 20px 20px", height: "100%", boxSizing: "border-box", background: "linear-gradient(160deg, rgba(20,184,166,0.08) 0%, transparent 60%)", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Icon icon="solar:stars-bold-duotone" width={14} style={{ color: "#14B8A6" }} />
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#14B8A6" }}>
                  Best call to make today
                </span>
              </div>
              <p style={{ ...displayFont, fontSize: 16, fontWeight: 800, color: "var(--si-text-primary)", lineHeight: 1.3, letterSpacing: "-0.02em" }}>
                <button
                  onClick={() => navigate(`/si/accounts/${bestCallAccount.id}`)}
                  style={{ ...displayFont, fontSize: 16, fontWeight: 800, color: "var(--si-text-primary)", background: "none", border: "none", padding: 0, cursor: "pointer", letterSpacing: "-0.02em" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--si-primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--si-text-primary)")}
                >{bestCallAccount.name}</button>
                {" — "}
                <span style={{ color: "var(--si-text-secondary)", fontWeight: 600 }}>{bestCallAccount.contact}</span>
              </p>
              <p style={{ fontSize: 12, lineHeight: 1.65, color: "var(--si-text-secondary)" }}>
                {bestCallAccount.bestCallReason}
              </p>
              <button
                onClick={() => navigate(`/si/playbook/${bestCallAccount.id}`)}
                style={{
                  marginTop: "auto",
                  width: "100%",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  fontSize: 12, fontWeight: 700,
                  padding: "9px 16px", borderRadius: 999, cursor: "pointer",
                  backgroundColor: "#134E4A", color: "#fff", border: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0F3D39")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#134E4A")}
              >
                <Icon icon="solar:letter-bold" width={13} />
                Draft outreach now
              </button>
            </div>
          </div>
        </div>

        {/* ── AI MORNING BRIEF ─────────────────────────────────────────── */}
        <div style={cardStyle}>
          <div
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "14px 20px 12px",
              borderBottom: "1px solid var(--si-card-border)",
            }}
          >
            <div
              style={{
                width: 28, height: 28, borderRadius: 8,
                background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon icon="solar:stars-bold-duotone" width={14} style={{ color: "#A5B4FC" }} />
            </div>
            <span style={labelStyle}>✦ AI Morning Brief · {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" })}</span>
          </div>

          <div style={{ padding: "14px 20px 16px" }}>
            <p
              style={{
                ...displayFont,
                fontSize: 13,
                fontWeight: 700,
                color: "var(--si-primary)",
                marginBottom: 14,
                letterSpacing: "-0.01em",
              }}
            >
              3 accounts in your book are in active buying motion.
            </p>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {shuffledBriefAccounts.map((acct, i) => (
                <div
                  key={acct.id}
                  style={{
                    display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16,
                    padding: "11px 0",
                    borderBottom: i < MORNING_BRIEF_ACCOUNTS.length - 1 ? "1px solid var(--si-card-border)" : "none",
                  }}
                >
                  <p style={{ fontSize: 12.5, lineHeight: 1.55, color: "var(--si-text-secondary)", flex: 1 }}>
                    <button
                      onClick={() => navigate(`/si/accounts/${acct.id}`)}
                      style={{ ...displayFont, fontWeight: 700, color: "var(--si-text-primary)", background: "none", border: "none", padding: 0, cursor: "pointer" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--si-primary)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--si-text-primary)")}
                    >{acct.name}</button>
                    {" — "}
                    {acct.context}
                  </p>
                  <button
                    onClick={() => navigate(`/si/playbook/${acct.id}`)}
                    style={{
                      ...CTA_BUTTON[acct.ctaStyle],
                      ...displayFont,
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "5px 12px",
                      borderRadius: 7,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      letterSpacing: "0.01em",
                    }}
                  >
                    {acct.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── BOTTOM ROW: signals + sidebar ────────────────────────────── */}
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>

          {/* LEFT: Priority Signals */}
          <div style={{ flex: 1, minWidth: 0, height: "100%", overflowY: "auto" }}>
            <div>
              {/* Section header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#F59E0B", display: "inline-block" }} />
                  <span style={labelStyle}>Priority Signals</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {FILTER_TABS.map((tab) => {
                    const active = signalFilter === tab.key;
                    const count = tab.key === "all"
                      ? MOCK_SIGNALS.length
                      : MOCK_SIGNALS.filter((s) => s.type === tab.key).length;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setSignalFilter(tab.key)}
                        style={{
                          ...displayFont,
                          fontSize: 11, fontWeight: 600,
                          padding: "4px 10px", borderRadius: 20, cursor: "pointer",
                          transition: "all 0.15s",
                          ...(active
                            ? { backgroundColor: "var(--si-primary)", color: "#fff", border: "1px solid transparent" }
                            : { backgroundColor: "var(--si-card-bg)", color: "var(--si-text-secondary)", border: "1px solid var(--si-card-border)" }
                          ),
                        }}
                      >
                        {tab.label}
                        {tab.key === "all" && (
                          <span
                            style={{
                              marginLeft: 5, fontSize: 10, fontWeight: 700,
                              padding: "0px 5px", borderRadius: 10,
                              backgroundColor: active ? "rgba(255,255,255,0.2)" : "var(--si-bg)",
                              color: active ? "#fff" : "var(--si-text-muted)",
                            }}
                          >
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => navigate("/si/signals")}
                    style={{ ...displayFont, fontSize: 12, fontWeight: 600, color: "var(--si-primary)", background: "none", border: "none", cursor: "pointer", marginLeft: 4 }}
                  >
                    View all →
                  </button>
                </div>
              </div>

              {/* Signal cards — top 3 */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filteredSignals.slice(0, 3).map((signal) => {
                  const account = MOCK_WATCHLIST_ACCOUNTS.find((a) => a.id === signal.accountId);
                  if (!account) return null;
                  const meta = SIGNAL_META[signal.type] ?? { label: signal.type, color: "#6366F1", bg: "rgba(99,102,241,0.1)" };
                  const urgency = urgencyFromId(signal.id);

                  return (
                    <div
                      key={signal.id}
                      style={{
                        ...cardStyle,
                        padding: "14px 18px",
                        transition: "border-color 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)")}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--si-card-border)")}
                    >
                      {/* Top row */}
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flex: 1, minWidth: 0 }}>
                          <AccountInitialBadge name={account.accountName} domain={account.domain} size={34} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                              <button
                                onClick={() => navigate(`/si/accounts/${account.id}`)}
                                style={{ ...displayFont, fontSize: 13, fontWeight: 700, color: "var(--si-text-primary)", background: "none", border: "none", padding: 0, cursor: "pointer" }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--si-primary)")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--si-text-primary)")}
                              >
                                {account.accountName}
                              </button>
                              <span style={{ fontSize: 11, color: "var(--si-text-muted)" }}>{account.domain}</span>
                              <span
                                style={{
                                  ...displayFont,
                                  fontSize: 9, fontWeight: 800, letterSpacing: "0.08em",
                                  padding: "2px 7px", borderRadius: 5,
                                  backgroundColor: meta.bg, color: meta.color,
                                }}
                              >
                                {meta.label}
                              </span>
                              {signal.signalLevel === "contact" && (
                                <span
                                  style={{
                                    ...displayFont,
                                    fontSize: 9, fontWeight: 700, letterSpacing: "0.06em",
                                    padding: "2px 7px", borderRadius: 5,
                                    backgroundColor: "#F3F4F6", color: "#4B5563",
                                  }}
                                >
                                  CONTACT
                                </span>
                              )}
                            </div>
                            {signal.signalLevel === "contact" && signal.contactName && (
                              <p style={{ fontSize: 11, color: "var(--si-text-muted)", marginTop: 3 }}>
                                {signal.contactName} · {signal.contactTitle}
                              </p>
                            )}
                            <p style={{ fontSize: 12, lineHeight: 1.6, color: "var(--si-text-secondary)", marginTop: 5 }}>
                              <span style={{ fontWeight: 600, color: "var(--si-text-primary)" }}>{signal.headline}. </span>
                              {signal.summary}
                            </p>
                          </div>
                        </div>
                        <span style={{ fontSize: 11, color: "var(--si-text-muted)", flexShrink: 0, marginTop: 2 }}>
                          {daysAgoLabel(signal.detectedAt)}
                        </span>
                      </div>

                      {/* Bottom row */}
                      <div
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          marginTop: 12, paddingTop: 10,
                          borderTop: "1px solid var(--si-card-border)",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <button
                            onClick={() => navigate(`/si/playbook/${signal.accountId}`)}
                            style={{
                              display: "flex", alignItems: "center", gap: 5,
                              ...displayFont, fontSize: 11, fontWeight: 700,
                              padding: "5px 12px", borderRadius: 7, cursor: "pointer",
                              backgroundColor: "rgba(99,102,241,0.08)",
                              color: "var(--si-primary)",
                              border: "1px solid rgba(99,102,241,0.18)",
                            }}
                          >
                            <Icon icon="solar:letter-linear" width={11} />
                            Draft outreach
                          </button>
                          <button
                            onClick={() => navigate(`/si/playbook/${signal.accountId}`)}
                            style={{
                              display: "flex", alignItems: "center", gap: 5,
                              ...displayFont, fontSize: 11, fontWeight: 600,
                              padding: "5px 12px", borderRadius: 7, cursor: "pointer",
                              backgroundColor: "var(--si-bg)",
                              color: "var(--si-text-secondary)",
                              border: "1px solid var(--si-card-border)",
                            }}
                          >
                            <Icon icon="solar:document-text-linear" width={11} />
                            View playbook
                          </button>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 10, color: "var(--si-text-muted)", fontWeight: 500 }}>Urgency</span>
                          <UrgencyDots level={urgency} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* View all signals link */}
              <div style={{ textAlign: "center", paddingTop: 12 }}>
                <button
                  onClick={() => navigate("/si/watchlist")}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 12, fontWeight: 600, color: "var(--si-primary)",
                  }}
                >
                  View all signals →
                </button>
              </div>
            </div>
          </div>{/* end left signals column */}

          {/* ── RIGHT SIDEBAR: Queue only ──────────────────────────────── */}
          <div style={{ width: 300, flexShrink: 0, display: "flex", flexDirection: "column", gap: 0, position: "sticky", top: 57, borderRadius: 16, overflow: "hidden", border: "1px solid var(--si-card-border)", backgroundColor: "var(--si-card-bg)" }}>

            {/* Queue header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px 10px" }}>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--si-text-primary)" }}>
                Your Queue · {QUEUE_ITEMS.filter(q => !checkedItems.has(q.id)).length} open
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#EF4444", backgroundColor: "rgba(239,68,68,0.08)", padding: "2px 8px", borderRadius: 999 }}>
                2 overdue
              </span>
            </div>

            {/* Queue items — top 3 */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {QUEUE_ITEMS.slice(0, 3).map((item, i) => {
                const checked = checkedItems.has(item.id);
                const isOverdue = item.badgeColor === "#EF4444";
                return (
                  <div
                    key={item.id}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 10,
                      padding: "10px 18px",
                      borderTop: "1px solid var(--si-card-border)",
                      backgroundColor: checked ? "rgba(0,0,0,0.02)" : "transparent",
                    }}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleItem(item.id)}
                      style={{
                        marginTop: 2, width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                        border: checked ? "none" : "1.5px solid #D1D5DB",
                        backgroundColor: checked ? "#14B8A6" : "transparent",
                        cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      {checked && <Icon icon="solar:check-read-bold" width={11} style={{ color: "#fff" }} />}
                    </button>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 6 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.35, color: "var(--si-text-primary)", textDecoration: checked ? "line-through" : "none", opacity: checked ? 0.45 : 1 }}>
                          {item.task}{item.company ? ` · ${item.company}` : ""}
                          {item.contact ? <span style={{ color: "var(--si-text-secondary)", fontWeight: 500 }}>{` → ${item.contact}`}</span> : null}
                        </p>
                        {item.badge && !checked && (
                          <span style={{
                            flexShrink: 0, fontSize: 10, fontWeight: 700,
                            padding: "2px 8px", borderRadius: 999,
                            backgroundColor: `${item.badgeColor}18`,
                            color: item.badgeColor,
                          }}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.signal && !checked && (
                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
                          <Icon icon={item.signalIcon} width={11} style={{ color: "#14B8A6", flexShrink: 0 }} />
                          <span style={{ fontSize: 11, color: "#14B8A6", lineHeight: 1.4 }}>{item.signal}</span>
                        </div>
                      )}
                      <p style={{ fontSize: 11, color: isOverdue ? "#EF4444" : "var(--si-text-muted)", marginTop: 2 }}>{item.meta}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
