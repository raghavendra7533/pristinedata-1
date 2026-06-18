import { useState } from "react";
import { Icon } from "@iconify/react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (notes: string) => void;
}

export function AddMeetingNotesModal({ open, onClose, onSave }: Props) {
  const [notes, setNotes] = useState("");

  if (!open) return null;

  function handleSave() {
    if (!notes.trim()) return;
    onSave(notes.trim());
    setNotes("");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative z-10 w-full max-w-lg rounded-2xl border border-[--si-card-border] shadow-xl overflow-hidden"
        style={{ backgroundColor: "var(--si-card-bg)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[--si-card-border]">
          <div className="flex items-center gap-2">
            <Icon icon="solar:notes-linear" className="w-5 h-5 text-[--si-primary]" />
            <span className="text-sm font-semibold text-[--si-text-primary]">Add Meeting Notes</span>
          </div>
          <button onClick={onClose} className="text-[--si-text-muted] hover:text-[--si-text-primary] transition-colors">
            <Icon icon="solar:close-circle-linear" className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <p className="text-xs text-[--si-text-secondary]">
            Paste or type your notes from the call. We'll generate next-best-action suggestions from them.
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Discussed budget timeline, champion is Sarah Chen, blocker is procurement sign-off..."
            rows={8}
            autoFocus
            className="w-full rounded-xl border border-[--si-card-border] bg-white px-3 py-2 text-sm text-[--si-text-primary] placeholder:text-gray-400 focus:outline-none focus:border-[--si-primary] focus:ring-1 focus:ring-[--si-primary]/30 transition-colors resize-none"
          />
          <div className="flex items-center justify-between pt-1">
            <button onClick={onClose} className="text-sm text-[--si-text-muted] hover:text-[--si-text-primary] transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!notes.trim()}
              className="flex items-center gap-1.5 rounded-full bg-[--si-primary] text-white px-5 py-2 text-sm font-medium hover:bg-[--si-primary-hover] transition-colors disabled:opacity-50"
            >
              <Icon icon="solar:magic-stick-3-linear" className="w-4 h-4" />
              Save & Generate Next Actions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
