import { useState } from "react";
import { Icon } from "@iconify/react";
import { SIGNAL_OPTIONS } from "@/lib/si/constants";
import type { SignalType } from "@/lib/si/types";

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (domain: string, signals: SignalType[]) => void;
}

export function AddAccountModal({ isOpen, onClose, onAdd }: AddAccountModalProps) {
  const [domain, setDomain] = useState("");
  const [selectedSignals, setSelectedSignals] = useState<SignalType[]>(
    SIGNAL_OPTIONS.map((s) => s.key)
  );

  if (!isOpen) return null;

  function toggleSignal(key: SignalType) {
    setSelectedSignals((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  function handleAdd() {
    if (!domain.trim()) return;
    onAdd(domain.trim(), selectedSignals);
    setDomain("");
    setSelectedSignals(SIGNAL_OPTIONS.map((s) => s.key));
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-[12px] p-6 w-[480px] shadow-xl flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[--si-text-primary]">Add Account to Watchlist</h2>
          <button
            onClick={onClose}
            className="text-[--si-text-muted] hover:text-[--si-text-secondary] transition-colors"
          >
            <Icon icon="solar:close-circle-linear" className="w-5 h-5" />
          </button>
        </div>

        {/* Domain input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[--si-text-secondary]">Company Domain</label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="company.com"
            className="border border-[--si-card-border] rounded-lg px-3 py-2 text-sm text-[--si-text-primary] placeholder:text-[--si-text-muted] focus:outline-none focus:ring-1 focus:ring-[--si-primary]"
          />
        </div>

        {/* Signal preferences */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[--si-text-secondary]">Monitor Signals</label>
          <div className="flex flex-wrap gap-2">
            {SIGNAL_OPTIONS.map((signal) => {
              const active = selectedSignals.includes(signal.key);
              return (
                <button
                  key={signal.key}
                  onClick={() => toggleSignal(signal.key)}
                  className={
                    active
                      ? "bg-[--si-primary] text-white rounded-full px-3 py-1 text-sm font-medium transition-colors"
                      : "border border-[--si-card-border] rounded-full px-3 py-1 text-sm text-[--si-text-secondary] hover:bg-gray-50 transition-colors"
                  }
                >
                  {signal.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            onClick={onClose}
            className="rounded-full border border-[--si-card-border] px-4 py-2 text-sm font-medium text-[--si-text-secondary] hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!domain.trim()}
            className="rounded-full bg-[--si-primary] text-white px-4 py-2 text-sm font-medium hover:bg-[--si-primary-hover] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add Account
          </button>
        </div>
      </div>
    </div>
  );
}
