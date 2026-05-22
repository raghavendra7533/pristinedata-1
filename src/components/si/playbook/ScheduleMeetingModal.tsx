import { Icon } from "@iconify/react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ScheduleMeetingModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-md rounded-2xl border border-[--si-card-border] p-6 shadow-xl"
        style={{ backgroundColor: "var(--si-card-bg)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[--si-text-muted] hover:text-[--si-text-primary] transition-colors"
        >
          <Icon icon="solar:close-circle-linear" className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[--si-primary]/10 mb-4">
          <Icon icon="solar:calendar-mark-linear" className="w-6 h-6 text-[--si-primary]" />
        </div>

        {/* Heading */}
        <h2 className="text-base font-semibold text-[--si-text-primary] mb-1">
          Schedule a Meeting
        </h2>
        <p className="text-sm text-[--si-text-muted] mb-6">
          Connect your calendar to schedule directly from Pristine
        </p>

        {/* Calendar options */}
        <div className="flex flex-col gap-3">
          <button
            disabled
            className="flex items-center gap-3 w-full rounded-xl border border-[--si-card-border] px-4 py-3 text-sm font-medium text-[--si-text-primary] hover:bg-white/5 transition-colors opacity-70 cursor-not-allowed"
          >
            <img
              src="https://www.gstatic.com/images/branding/product/2x/calendar_2020q4_48dp.png"
              alt="Google Calendar"
              className="w-5 h-5 object-contain"
            />
            Connect Google Calendar
          </button>

          <button
            disabled
            className="flex items-center gap-3 w-full rounded-xl border border-[--si-card-border] px-4 py-3 text-sm font-medium text-[--si-text-primary] hover:bg-white/5 transition-colors opacity-70 cursor-not-allowed"
          >
            <Icon icon="logos:microsoft-icon" className="w-5 h-5" />
            Connect Microsoft Calendar
          </button>
        </div>

        {/* Future-state hint */}
        <p className="mt-5 text-xs text-[--si-text-muted] text-center">
          After scheduling, you'll be prompted to upload meeting notes for AI-powered next actions.
        </p>
      </div>
    </div>
  );
}
