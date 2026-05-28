import { useState } from "react";
import { Icon } from "@iconify/react";

interface Props {
  open: boolean;
  onClose: () => void;
  onScheduled?: () => void;
}

const ATTENDEES = [
  { id: "a1", name: "Sarah Chen", title: "VP of Sales", email: "s.chen@lattice.com" },
  { id: "a2", name: "Marcus Webb", title: "Head of Revenue Ops", email: "m.webb@lattice.com" },
  { id: "a3", name: "Priya Kapoor", title: "CRO", email: "p.kapoor@lattice.com" },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const DATES = ["Jun 2", "Jun 3", "Jun 4", "Jun 5", "Jun 6"];

const SLOTS: Record<string, string[]> = {
  "Jun 2": ["9:00 AM", "10:30 AM", "2:00 PM"],
  "Jun 3": ["11:00 AM", "3:00 PM"],
  "Jun 4": ["9:30 AM", "1:00 PM", "4:00 PM"],
  "Jun 5": ["10:00 AM"],
  "Jun 6": ["9:00 AM", "11:30 AM", "2:30 PM"],
};

const DURATIONS = ["30 min", "45 min", "60 min"];

type Step = "attendees" | "time" | "details" | "success";

export function ScheduleMeetingModal({ open, onClose, onScheduled }: Props) {
  const [step, setStep] = useState<Step>("attendees");
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>(["a1"]);
  const [selectedDate, setSelectedDate] = useState("Jun 3");
  const [selectedSlot, setSelectedSlot] = useState("11:00 AM");
  const [duration, setDuration] = useState("30 min");
  const [title, setTitle] = useState("Discovery Call – Lattice");
  const [agenda, setAgenda] = useState("");

  function reset() {
    setStep("attendees");
    setSelectedAttendees(["a1"]);
    setSelectedDate("Jun 3");
    setSelectedSlot("11:00 AM");
    setDuration("30 min");
    setTitle("Discovery Call – Lattice");
    setAgenda("");
  }

  function handleClose() {
    reset();
    onClose();
  }

  function toggleAttendee(id: string) {
    setSelectedAttendees((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  }

  if (!open) return null;

  const STEP_LABELS: Record<Step, string> = {
    attendees: "Attendees",
    time: "Pick a time",
    details: "Details",
    success: "Confirmed",
  };

  const steps: Step[] = ["attendees", "time", "details"];
  const currentStepIdx = steps.indexOf(step as Step);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={handleClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative z-10 w-full max-w-lg rounded-2xl border border-[--si-card-border] shadow-xl overflow-hidden"
        style={{ backgroundColor: "var(--si-card-bg)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {step !== "success" && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[--si-card-border]">
              <div className="flex items-center gap-3">
                <img
                  src="https://www.gstatic.com/images/branding/product/2x/calendar_2020q4_48dp.png"
                  alt="Google Calendar"
                  className="w-5 h-5 object-contain"
                />
                <span className="text-sm font-semibold text-[--si-text-primary]">Schedule Meeting</span>
              </div>
              <button onClick={handleClose} className="text-[--si-text-muted] hover:text-[--si-text-primary] transition-colors">
                <Icon icon="solar:close-circle-linear" className="w-5 h-5" />
              </button>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2 px-6 py-3 border-b border-[--si-card-border]">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 text-xs font-medium ${i <= currentStepIdx ? "text-[--si-primary]" : "text-[--si-text-muted]"}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${i < currentStepIdx ? "bg-[--si-primary] border-[--si-primary] text-white" : i === currentStepIdx ? "border-[--si-primary] text-[--si-primary]" : "border-gray-300 text-gray-400"}`}>
                      {i < currentStepIdx ? <Icon icon="solar:check-circle-bold" className="w-3 h-3" /> : i + 1}
                    </span>
                    {STEP_LABELS[s]}
                  </div>
                  {i < steps.length - 1 && <div className={`w-8 h-px ${i < currentStepIdx ? "bg-[--si-primary]" : "bg-gray-200"}`} />}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Step: Attendees */}
        {step === "attendees" && (
          <div className="p-6 flex flex-col gap-4">
            <div>
              <p className="text-xs font-semibold text-[--si-text-secondary] uppercase tracking-wide mb-1">From account</p>
              <p className="text-sm text-[--si-text-muted]">Select who to invite</p>
            </div>
            <div className="flex flex-col gap-2">
              {ATTENDEES.map((a) => {
                const selected = selectedAttendees.includes(a.id);
                return (
                  <button
                    key={a.id}
                    onClick={() => toggleAttendee(a.id)}
                    className={`flex items-center gap-3 w-full rounded-xl border px-4 py-3 text-left transition-colors ${selected ? "border-[--si-primary] bg-indigo-50/60" : "border-[--si-card-border] hover:bg-gray-50"}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-semibold flex-shrink-0">
                      {a.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[--si-text-primary]">{a.name}</p>
                      <p className="text-xs text-[--si-text-muted]">{a.title} · {a.email}</p>
                    </div>
                    {selected && <Icon icon="solar:check-circle-bold" className="w-4 h-4 text-[--si-primary] flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-end pt-1">
              <button
                onClick={() => setStep("time")}
                disabled={selectedAttendees.length === 0}
                className="flex items-center gap-1.5 rounded-full bg-[--si-primary] text-white px-5 py-2 text-sm font-medium hover:bg-[--si-primary-hover] transition-colors disabled:opacity-50"
              >
                Next
                <Icon icon="solar:arrow-right-linear" className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step: Time */}
        {step === "time" && (
          <div className="p-6 flex flex-col gap-4">
            {/* Duration */}
            <div>
              <p className="text-xs font-semibold text-[--si-text-secondary] uppercase tracking-wide mb-2">Duration</p>
              <div className="flex gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${duration === d ? "border-[--si-primary] bg-indigo-50/60 text-[--si-primary]" : "border-[--si-card-border] text-[--si-text-secondary] hover:bg-gray-50"}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Day columns */}
            <div>
              <p className="text-xs font-semibold text-[--si-text-secondary] uppercase tracking-wide mb-2">Available slots — next 5 days</p>
              <div className="grid grid-cols-5 gap-2">
                {DAYS.map((day, i) => {
                  const date = DATES[i];
                  const slots = SLOTS[date] ?? [];
                  return (
                    <div key={day} className="flex flex-col gap-1.5">
                      <div className="text-center">
                        <p className="text-[10px] font-semibold text-[--si-text-muted] uppercase">{day}</p>
                        <p className="text-xs text-[--si-text-secondary]">{date}</p>
                      </div>
                      {slots.map((slot) => {
                        const active = selectedDate === date && selectedSlot === slot;
                        return (
                          <button
                            key={slot}
                            onClick={() => { setSelectedDate(date); setSelectedSlot(slot); }}
                            className={`rounded-lg border px-1 py-1.5 text-[11px] font-medium transition-colors text-center ${active ? "border-[--si-primary] bg-indigo-50/60 text-[--si-primary]" : "border-[--si-card-border] text-[--si-text-secondary] hover:bg-gray-50"}`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button onClick={() => setStep("attendees")} className="text-sm text-[--si-text-muted] hover:text-[--si-text-primary] transition-colors">
                ← Back
              </button>
              <button
                onClick={() => setStep("details")}
                className="flex items-center gap-1.5 rounded-full bg-[--si-primary] text-white px-5 py-2 text-sm font-medium hover:bg-[--si-primary-hover] transition-colors"
              >
                Next
                <Icon icon="solar:arrow-right-linear" className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step: Details */}
        {step === "details" && (
          <div className="p-6 flex flex-col gap-4">
            {/* Summary */}
            <div className="rounded-xl border border-[--si-card-border] bg-gray-50/50 px-4 py-3 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-sm text-[--si-text-secondary]">
                <Icon icon="solar:calendar-mark-linear" className="w-4 h-4 text-[--si-primary]" />
                <span className="font-medium text-[--si-text-primary]">{selectedDate} · {selectedSlot}</span>
                <span className="text-[--si-text-muted]">· {duration}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {selectedAttendees.map((id) => {
                  const a = ATTENDEES.find((x) => x.id === id)!;
                  return (
                    <span key={id} className="inline-flex items-center gap-1 text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                      <Icon icon="solar:user-linear" className="w-3 h-3" />
                      {a.name}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-xs font-semibold text-[--si-text-secondary] uppercase tracking-wide block mb-1.5">Meeting title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-[--si-card-border] bg-white px-3 py-2 text-sm text-[--si-text-primary] focus:outline-none focus:border-[--si-primary] focus:ring-1 focus:ring-[--si-primary]/30 transition-colors"
              />
            </div>

            {/* Agenda */}
            <div>
              <label className="text-xs font-semibold text-[--si-text-secondary] uppercase tracking-wide block mb-1.5">Agenda <span className="text-[--si-text-muted] normal-case font-normal">(optional)</span></label>
              <textarea
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
                placeholder="e.g. Intro, pain discovery, demo walkthrough..."
                rows={3}
                className="w-full rounded-xl border border-[--si-card-border] bg-white px-3 py-2 text-sm text-[--si-text-primary] placeholder:text-gray-400 focus:outline-none focus:border-[--si-primary] focus:ring-1 focus:ring-[--si-primary]/30 transition-colors resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button onClick={() => setStep("time")} className="text-sm text-[--si-text-muted] hover:text-[--si-text-primary] transition-colors">
                ← Back
              </button>
              <button
                onClick={() => setStep("success")}
                className="flex items-center gap-1.5 rounded-full bg-[--si-primary] text-white px-5 py-2 text-sm font-medium hover:bg-[--si-primary-hover] transition-colors"
              >
                <Icon icon="solar:calendar-add-linear" className="w-4 h-4" />
                Add to Google Calendar
              </button>
            </div>
          </div>
        )}

        {/* Success */}
        {step === "success" && (
          <div className="p-8 flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
              <Icon icon="solar:check-circle-bold" className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <p className="text-base font-semibold text-[--si-text-primary] mb-1">Meeting scheduled</p>
              <p className="text-sm text-[--si-text-muted]">{title}</p>
              <p className="text-sm text-[--si-text-secondary] mt-0.5">{selectedDate} · {selectedSlot} · {duration}</p>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              {selectedAttendees.map((id) => {
                const a = ATTENDEES.find((x) => x.id === id)!;
                return (
                  <span key={id} className="inline-flex items-center gap-1 text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                    {a.name}
                  </span>
                );
              })}
            </div>
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 w-full text-left flex items-start gap-3">
              <img
                src="https://www.gstatic.com/images/branding/product/2x/calendar_2020q4_48dp.png"
                alt="Google Calendar"
                className="w-4 h-4 mt-0.5 object-contain flex-shrink-0"
              />
              <div>
                <p className="text-xs font-medium text-green-800">Added to Google Calendar</p>
                <p className="text-xs text-green-600 mt-0.5">Invites sent to {selectedAttendees.length} attendee{selectedAttendees.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
            <p className="text-xs text-[--si-text-muted]">
              After your meeting, upload notes to unlock AI-generated next actions.
            </p>
            <button
              onClick={() => { onScheduled?.(); handleClose(); }}
              className="rounded-full bg-[--si-primary] text-white px-6 py-2 text-sm font-medium hover:bg-[--si-primary-hover] transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
