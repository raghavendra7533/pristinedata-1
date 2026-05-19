import { useState, useRef, KeyboardEvent } from "react";
import { Icon } from "@iconify/react";
import type { SignalType } from "@/lib/si/types";

// ─── Types ───────────────────────────────────────────────────────────────────

interface SuggestedContact {
  id: string;
  name: string;
  title: string;
  company: string;
  avatarInitials: string;
}

type NotificationChannel = "slack" | "whatsapp" | "email";

interface SignalOption {
  key: SignalType;
  label: string;
  icon: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const SIGNAL_OPTIONS: SignalOption[] = [
  { key: "new_funding", label: "Funding", icon: "solar:dollar-minimalistic-linear" },
  { key: "hiring_surge", label: "Hiring", icon: "solar:users-group-rounded-linear" },
  { key: "intent_surge", label: "Intent", icon: "solar:target-linear" },
  { key: "leadership_change", label: "News", icon: "solar:newspaper-linear" },
];

const CHANNEL_OPTIONS: Array<{ key: NotificationChannel; label: string; icon: string }> = [
  { key: "slack", label: "Slack", icon: "solar:chat-round-dots-linear" },
  { key: "whatsapp", label: "WhatsApp", icon: "solar:phone-calling-linear" },
  { key: "email", label: "Email", icon: "solar:letter-linear" },
];

const MOCK_CONTACTS: Record<string, SuggestedContact[]> = {
  default: [
    { id: "c1", name: "Sarah Chen", title: "Chief Revenue Officer", company: "", avatarInitials: "SC" },
    { id: "c2", name: "Marcus Webb", title: "VP of Sales", company: "", avatarInitials: "MW" },
    { id: "c3", name: "Priya Nair", title: "Chief Marketing Officer", company: "", avatarInitials: "PN" },
    { id: "c4", name: "Daniel Torres", title: "CEO", company: "", avatarInitials: "DT" },
    { id: "c5", name: "Lena Hoffmann", title: "VP of Engineering", company: "", avatarInitials: "LH" },
  ],
};

function getContactsForAccount(accountName: string): SuggestedContact[] {
  const base = MOCK_CONTACTS[accountName.toLowerCase()] ?? MOCK_CONTACTS.default;
  return base.map((c) => ({ ...c, company: accountName }));
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all ${
            i < current
              ? "w-6 bg-[--si-primary]"
              : i === current
              ? "w-6 bg-[--si-primary] opacity-100"
              : "w-3 bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface CreateWatchlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (accounts: string[], signals: SignalType[], channel: NotificationChannel) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CreateWatchlistModal({ isOpen, onClose, onAdd }: CreateWatchlistModalProps) {
  const [step, setStep] = useState(0);

  // Step 1
  const [accounts, setAccounts] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  // Step 2
  const [selectedContactIds, setSelectedContactIds] = useState<Set<string>>(new Set());

  // Step 3
  const [selectedSignals, setSelectedSignals] = useState<SignalType[]>(
    SIGNAL_OPTIONS.map((s) => s.key)
  );
  const [selectedChannel, setSelectedChannel] = useState<NotificationChannel>("slack");

  const inputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // ── Derived ──────────────────────────────────────────────────────────────

  const suggestedContacts: SuggestedContact[] = accounts.flatMap((acc, idx) =>
    getContactsForAccount(acc).map((c) => ({ ...c, id: `${idx}-${c.id}` }))
  );

  // ── Step 1 handlers ──────────────────────────────────────────────────────

  function addAccount(name: string) {
    const trimmed = name.trim();
    if (!trimmed || accounts.includes(trimmed) || accounts.length >= 10) return;
    setAccounts((prev) => [...prev, trimmed]);
    setInputValue("");
  }

  function removeAccount(name: string) {
    setAccounts((prev) => prev.filter((a) => a !== name));
  }

  function handleInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addAccount(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && accounts.length > 0) {
      removeAccount(accounts[accounts.length - 1]);
    }
  }

  // ── Step 2 handlers ──────────────────────────────────────────────────────

  function toggleContact(id: string) {
    setSelectedContactIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAllContacts() {
    if (selectedContactIds.size === suggestedContacts.length) {
      setSelectedContactIds(new Set());
    } else {
      setSelectedContactIds(new Set(suggestedContacts.map((c) => c.id)));
    }
  }

  // ── Step 3 handlers ──────────────────────────────────────────────────────

  function toggleSignal(key: SignalType) {
    setSelectedSignals((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  // ── Finish ───────────────────────────────────────────────────────────────

  function handleFinish() {
    onAdd(accounts, selectedSignals, selectedChannel);
    // Reset
    setStep(0);
    setAccounts([]);
    setInputValue("");
    setSelectedContactIds(new Set());
    setSelectedSignals(SIGNAL_OPTIONS.map((s) => s.key));
    setSelectedChannel("slack");
  }

  function handleClose() {
    setStep(0);
    setAccounts([]);
    setInputValue("");
    setSelectedContactIds(new Set());
    setSelectedSignals(SIGNAL_OPTIONS.map((s) => s.key));
    setSelectedChannel("slack");
    onClose();
  }

  // ── Step titles ──────────────────────────────────────────────────────────

  const stepMeta = [
    { title: "Add accounts", subtitle: "Type company names you want to watch (up to 10)" },
    { title: "Select contacts", subtitle: "Choose contacts to track across these accounts" },
    { title: "Configure alerts", subtitle: "Pick signals and where to receive notifications" },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="rounded-[14px] w-[520px] shadow-xl flex flex-col overflow-hidden" style={{ backgroundColor: "var(--si-card-bg)" }}>
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-0.5">
              <StepIndicator current={step} total={3} />
              <span className="text-[11px] font-semibold text-[--si-text-muted] uppercase tracking-widest">
                Step {step + 1} of 3
              </span>
            </div>
            <h2 className="text-base font-semibold text-[--si-text-primary]">
              {stepMeta[step].title}
            </h2>
            <p className="text-xs text-[--si-text-muted]">{stepMeta[step].subtitle}</p>
          </div>
          <button
            onClick={handleClose}
            className="text-[--si-text-muted] hover:text-[--si-text-secondary] transition-colors mt-0.5"
          >
            <Icon icon="solar:close-circle-linear" className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 min-h-[280px] flex flex-col">
          {step === 0 && (
            <Step1
              accounts={accounts}
              inputValue={inputValue}
              onInputChange={setInputValue}
              onInputKeyDown={handleInputKeyDown}
              onAddAccount={addAccount}
              onRemoveAccount={removeAccount}
              inputRef={inputRef}
            />
          )}
          {step === 1 && (
            <Step2
              contacts={suggestedContacts}
              selectedIds={selectedContactIds}
              onToggle={toggleContact}
              onToggleAll={toggleAllContacts}
            />
          )}
          {step === 2 && (
            <Step3
              signals={selectedSignals}
              onToggleSignal={toggleSignal}
              channel={selectedChannel}
              onChannelChange={setSelectedChannel}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 pb-5 pt-2">
          <button
            onClick={() => (step === 0 ? handleClose() : setStep((s) => s - 1))}
            className="rounded-full border border-[--si-card-border] px-4 py-2 text-sm font-medium text-[--si-text-secondary] hover:bg-gray-50 transition-colors"
          >
            {step === 0 ? "Cancel" : "Back"}
          </button>
          <button
            onClick={() => (step < 2 ? setStep((s) => s + 1) : handleFinish())}
            disabled={step === 0 && accounts.length === 0}
            className="rounded-full bg-[--si-primary] text-white px-5 py-2 text-sm font-medium hover:bg-[--si-primary-hover] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {step < 2 ? "Continue" : "Add to Watchlist"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Step 1: Account name tags ────────────────────────────────────────────────

function Step1({
  accounts,
  inputValue,
  onInputChange,
  onInputKeyDown,
  onAddAccount,
  onRemoveAccount,
  inputRef,
}: {
  accounts: string[];
  inputValue: string;
  onInputChange: (v: string) => void;
  onInputKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onAddAccount: (v: string) => void;
  onRemoveAccount: (v: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}) {
  const atCap = accounts.length >= 10;

  return (
    <div className="flex flex-col gap-4 flex-1">
      {/* Tag input box */}
      <div
        className="min-h-[100px] flex flex-wrap gap-2 p-3 border border-[--si-card-border] rounded-lg cursor-text focus-within:ring-1 focus-within:ring-[--si-primary] focus-within:border-[--si-primary] transition-all"
        onClick={() => inputRef.current?.focus()}
      >
        {accounts.map((acc) => (
          <span
            key={acc}
            className="flex items-center gap-1.5 bg-[--si-primary]/10 text-[--si-primary] rounded-full px-2.5 py-0.5 text-sm font-medium"
          >
            {acc}
            <button
              onClick={(e) => { e.stopPropagation(); onRemoveAccount(acc); }}
              className="hover:text-[--si-primary-hover] transition-colors"
            >
              <Icon icon="solar:close-circle-bold" className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
        {!atCap && (
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={onInputKeyDown}
            onBlur={() => { if (inputValue.trim()) onAddAccount(inputValue); }}
            placeholder={accounts.length === 0 ? "Type a company name and press Enter…" : "Add another…"}
            className="flex-1 min-w-[160px] text-sm text-[--si-text-primary] placeholder:text-[--si-text-muted] bg-transparent outline-none"
          />
        )}
      </div>

      {/* Cap indicator */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-[--si-text-muted]">
          Press <kbd className="bg-gray-100 border border-gray-200 rounded px-1 py-0.5 text-[10px] font-mono">Enter</kbd> or <kbd className="bg-gray-100 border border-gray-200 rounded px-1 py-0.5 text-[10px] font-mono">,</kbd> to add
        </p>
        <span className={`text-xs font-medium ${atCap ? "text-amber-500" : "text-[--si-text-muted]"}`}>
          {accounts.length}/10 accounts
        </span>
      </div>

      {atCap && (
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
          You've reached the 10-account limit. Remove an account to add another.
        </p>
      )}
    </div>
  );
}

// ─── Step 2: Contact selection ────────────────────────────────────────────────

function Step2({
  contacts,
  selectedIds,
  onToggle,
  onToggleAll,
}: {
  contacts: SuggestedContact[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
}) {
  const allSelected = selectedIds.size === contacts.length && contacts.length > 0;

  return (
    <div className="flex flex-col gap-3 flex-1">
      {/* Select all */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-[--si-text-muted]">
          {contacts.length} contacts found across your accounts
        </p>
        <button
          onClick={onToggleAll}
          className="text-xs font-medium text-[--si-primary] hover:underline"
        >
          {allSelected ? "Deselect all" : "Select all"}
        </button>
      </div>

      {/* Contact list */}
      <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[280px] pr-0.5">
        {contacts.map((contact) => {
          const checked = selectedIds.has(contact.id);
          return (
            <button
              key={contact.id}
              onClick={() => onToggle(contact.id)}
              className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                checked
                  ? "border-[--si-primary]/30 bg-[--si-primary]/5"
                  : "border-[--si-card-border] hover:bg-gray-50"
              }`}
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[--si-primary] to-indigo-400 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
                {contact.avatarInitials}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[--si-text-primary] truncate">{contact.name}</p>
                <p className="text-xs text-[--si-text-muted] truncate">
                  {contact.title} · {contact.company}
                </p>
              </div>
              {/* Checkbox */}
              <div
                className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all ${
                  checked
                    ? "bg-[--si-primary] border-[--si-primary]"
                    : "border-gray-300 bg-white"
                }`}
              >
                {checked && <Icon icon="solar:check-read-linear" className="w-3 h-3 text-white" />}
              </div>
            </button>
          );
        })}
      </div>

      {contacts.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 py-8">
          <Icon icon="solar:users-group-rounded-linear" className="w-8 h-8 text-[--si-text-muted]" />
          <p className="text-sm text-[--si-text-muted]">No contacts found. You can skip this step.</p>
        </div>
      )}
    </div>
  );
}

// ─── Step 3: Signal + channel config ─────────────────────────────────────────

function Step3({
  signals,
  onToggleSignal,
  channel,
  onChannelChange,
}: {
  signals: SignalType[];
  onToggleSignal: (key: SignalType) => void;
  channel: NotificationChannel;
  onChannelChange: (c: NotificationChannel) => void;
}) {
  return (
    <div className="flex flex-col gap-5 flex-1">
      {/* Signal types */}
      <div className="flex flex-col gap-2.5">
        <label className="text-sm font-medium text-[--si-text-secondary]">Notify me about</label>
        <div className="grid grid-cols-2 gap-2">
          {SIGNAL_OPTIONS.map((opt) => {
            const active = signals.includes(opt.key);
            return (
              <button
                key={opt.key}
                onClick={() => onToggleSignal(opt.key)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-left transition-all ${
                  active
                    ? "border-[--si-primary]/40 bg-[--si-primary]/5 text-[--si-primary]"
                    : "border-[--si-card-border] text-[--si-text-secondary] hover:bg-gray-50"
                }`}
              >
                <Icon icon={opt.icon} className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium">{opt.label}</span>
                {active && (
                  <Icon icon="solar:check-circle-bold" className="w-4 h-4 ml-auto flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notification channel */}
      <div className="flex flex-col gap-2.5">
        <label className="text-sm font-medium text-[--si-text-secondary]">Send alerts to</label>
        <div className="flex gap-2">
          {CHANNEL_OPTIONS.map((opt) => {
            const active = channel === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => onChannelChange(opt.key)}
                className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-lg border transition-all ${
                  active
                    ? "border-[--si-primary] bg-[--si-primary]/5 text-[--si-primary]"
                    : "border-[--si-card-border] text-[--si-text-secondary] hover:bg-gray-50"
                }`}
              >
                <Icon icon={opt.icon} className="w-5 h-5" />
                <span className="text-xs font-medium">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
