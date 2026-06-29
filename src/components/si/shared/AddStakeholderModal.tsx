import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import type { Stakeholder } from "@/lib/si/types";

export const ROLE_STYLES: Record<Stakeholder["role"], string> = {
  Champion:         "bg-emerald-50 text-emerald-700 border border-emerald-100",
  "Economic Buyer": "bg-indigo-50 text-indigo-700 border border-indigo-100",
  Influencer:       "bg-gray-100 text-gray-600 border border-gray-200",
  Blocker:          "bg-rose-50 text-rose-700 border border-rose-100",
  Ops:              "bg-amber-50 text-amber-700 border border-amber-100",
};

const CONTACT_POOL = [
  { id: "cp-001", name: "Alex Rivera",  title: "VP of Sales" },
  { id: "cp-002", name: "Jordan Lee",   title: "Head of Marketing" },
  { id: "cp-003", name: "Taylor Kim",   title: "Director of RevOps" },
  { id: "cp-004", name: "Morgan Patel", title: "CTO" },
  { id: "cp-005", name: "Casey Wu",     title: "VP Engineering" },
  { id: "cp-006", name: "Sam Torres",   title: "CFO" },
  { id: "cp-007", name: "Riley Huang",  title: "Head of Procurement" },
  { id: "cp-008", name: "Dana Foster",  title: "IT Security Lead" },
];

const ROLES: Stakeholder["role"][] = ["Champion", "Influencer", "Economic Buyer", "Blocker", "Ops"];

type AddMode = "search" | "email" | "linkedin";

const MODE_TABS: { key: AddMode; icon: string; label: string }[] = [
  { key: "search",   icon: "solar:magnifer-linear",    label: "Search"   },
  { key: "email",    icon: "solar:letter-linear",      label: "Email"    },
  { key: "linkedin", icon: "solar:link-circle-linear", label: "LinkedIn" },
];

export function AddStakeholderModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (s: Stakeholder) => void;
}) {
  const [mode, setMode] = useState<AddMode>("search");
  const [query, setQuery] = useState("");
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [role, setRole] = useState<Stakeholder["role"]>("Influencer");
  const [selected, setSelected] = useState<typeof CONTACT_POOL[0] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, [mode]);

  const filtered = query.length > 0
    ? CONTACT_POOL.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.title.toLowerCase().includes(query.toLowerCase())
      )
    : CONTACT_POOL;

  function handleAdd() {
    if (mode === "search") {
      if (!selected) return;
      onAdd({ id: `sh-new-${Date.now()}`, name: selected.name, title: selected.title, role, sentiment: "unknown", lastActiveDaysAgo: 0 });
    } else {
      if (!name.trim()) return;
      onAdd({
        id: `sh-new-${Date.now()}`,
        name: name.trim(),
        title: mode === "email"
          ? identifier.trim()
          : identifier.replace(/.*linkedin\.com\/in\//, "").replace(/\/$/, ""),
        role,
        sentiment: "unknown",
        lastActiveDaysAgo: 0,
      });
    }
    onClose();
  }

  const canAdd = mode === "search" ? !!selected : !!name.trim();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-[420px] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ backgroundColor: "var(--si-card-bg)", border: "1px solid var(--si-card-border)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--si-card-border)" }}>
          <p className="text-sm font-semibold text-[--si-text-primary]">Add Stakeholder</p>
          <button onClick={onClose} className="text-[--si-text-muted] hover:text-[--si-text-primary] transition-colors">
            <Icon icon="solar:close-circle-linear" className="w-4 h-4" />
          </button>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-1 px-5 pt-4 pb-1">
          {MODE_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => { setMode(t.key); setQuery(""); setIdentifier(""); setSelected(null); }}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                mode === t.key
                  ? "bg-[--si-primary] text-white"
                  : "text-[--si-text-secondary] hover:text-[--si-text-primary] border border-[--si-card-border]"
              }`}
            >
              <Icon icon={t.icon} className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="px-5 pt-4 pb-5 flex flex-col gap-4">

          {/* Search */}
          {mode === "search" && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ border: "1px solid var(--si-card-border)", backgroundColor: "var(--si-bg)" }}>
                <Icon icon="solar:magnifer-linear" className="w-4 h-4 text-[--si-text-muted] flex-shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
                  placeholder="Search by name or title…"
                  className="flex-1 text-sm bg-transparent outline-none text-[--si-text-primary] placeholder:text-[--si-text-muted]"
                />
                {query && (
                  <button onClick={() => { setQuery(""); setSelected(null); }} className="text-[--si-text-muted] hover:text-[--si-text-primary]">
                    <Icon icon="solar:close-circle-linear" className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="rounded-lg overflow-hidden flex flex-col" style={{ border: "1px solid var(--si-card-border)", maxHeight: 200, overflowY: "auto" }}>
                {filtered.length === 0 ? (
                  <p className="px-4 py-3 text-xs text-[--si-text-muted]">No contacts found.</p>
                ) : (
                  filtered.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelected(selected?.id === c.id ? null : c)}
                      className={`flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        selected?.id === c.id ? "bg-[--si-primary]/10" : "hover:bg-[--si-bg]"
                      }`}
                      style={{ borderBottom: "1px solid var(--si-card-border)" }}
                    >
                      <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white bg-gray-400">
                        {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[--si-text-primary] truncate">{c.name}</p>
                        <p className="text-[11px] text-[--si-text-muted] truncate">{c.title}</p>
                      </div>
                      {selected?.id === c.id && (
                        <Icon icon="solar:check-circle-bold" className="w-4 h-4 text-[--si-primary] flex-shrink-0" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Email */}
          {mode === "email" && (
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-[11px] font-semibold text-[--si-text-muted] uppercase tracking-wider mb-1.5">Name</p>
                <input
                  ref={inputRef}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none text-[--si-text-primary] placeholder:text-[--si-text-muted]"
                  style={{ border: "1px solid var(--si-card-border)", backgroundColor: "var(--si-bg)" }}
                />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[--si-text-muted] uppercase tracking-wider mb-1.5">Email address</p>
                <input
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@company.com"
                  type="email"
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none text-[--si-text-primary] placeholder:text-[--si-text-muted]"
                  style={{ border: "1px solid var(--si-card-border)", backgroundColor: "var(--si-bg)" }}
                />
              </div>
            </div>
          )}

          {/* LinkedIn */}
          {mode === "linkedin" && (
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-[11px] font-semibold text-[--si-text-muted] uppercase tracking-wider mb-1.5">Name</p>
                <input
                  ref={inputRef}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none text-[--si-text-primary] placeholder:text-[--si-text-muted]"
                  style={{ border: "1px solid var(--si-card-border)", backgroundColor: "var(--si-bg)" }}
                />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[--si-text-muted] uppercase tracking-wider mb-1.5">LinkedIn URL</p>
                <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ border: "1px solid var(--si-card-border)", backgroundColor: "var(--si-bg)" }}>
                  <Icon icon="solar:link-circle-linear" className="w-4 h-4 text-[--si-text-muted] flex-shrink-0" />
                  <input
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="linkedin.com/in/username"
                    className="flex-1 text-sm bg-transparent outline-none text-[--si-text-primary] placeholder:text-[--si-text-muted]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Role picker */}
          <div>
            <p className="text-[11px] font-semibold text-[--si-text-muted] uppercase tracking-wider mb-2">Role</p>
            <div className="flex flex-wrap gap-1.5">
              {ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-[6px] transition-colors border ${
                    role === r ? ROLE_STYLES[r] + " ring-1 ring-offset-0" : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={onClose}
              className="text-xs font-semibold px-4 py-2 rounded-lg text-[--si-text-secondary] hover:text-[--si-text-primary] transition-colors border border-[--si-card-border]"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!canAdd}
              className={`text-xs font-semibold px-4 py-2 rounded-lg transition-colors ${
                canAdd
                  ? "bg-[--si-primary] text-white hover:opacity-90"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Add contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
