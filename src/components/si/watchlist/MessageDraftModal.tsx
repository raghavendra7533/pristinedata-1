import { useState } from "react";
import { Icon } from "@iconify/react";
import type { WatchlistAccount } from "@/lib/si/types";
import { SIGNAL_TYPES } from "@/lib/si/constants";

interface MessageDraftModalProps {
  account: WatchlistAccount;
  onClose: () => void;
}

function buildDraft(account: WatchlistAccount): string {
  const topSignal = [...account.signals]
    .sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime())[0];

  if (!topSignal) {
    return `Hi there,\n\nI've been following ${account.accountName} closely and wanted to reach out — I think there's a strong fit between what we're doing at Pristine and where your team is headed.\n\nWould love to connect for a quick 20 minutes. What does your calendar look like this week?`;
  }

  const signalLabel = SIGNAL_TYPES[topSignal.type]?.label ?? topSignal.type;
  const headline = topSignal.headline ?? topSignal.summary;

  return `Hi [Name],\n\nI noticed ${account.accountName} recently had a ${signalLabel.toLowerCase()} — "${headline}"\n\nThat's exactly the kind of moment where we've seen teams like yours move fast. Pristine can help you [specific value prop here].\n\nWorth a quick 20 minutes this week?`;
}

export function MessageDraftModal({ account, onClose }: MessageDraftModalProps) {
  const [draft, setDraft] = useState(() => buildDraft(account));
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(draft).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <img
              src={`https://www.google.com/s2/favicons?sz=32&domain=${account.domain}`}
              alt={account.accountName}
              className="w-5 h-5 rounded-sm object-contain"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
            <div>
              <p className="text-[13px] font-semibold text-gray-900">Message {account.accountName}</p>
              <p className="text-[11px] text-gray-400">Signal-driven outreach draft</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Icon icon="solar:close-circle-linear" className="w-5 h-5" />
          </button>
        </div>

        {/* Draft area */}
        <div className="px-5 py-4 flex flex-col gap-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={9}
            className="w-full text-sm text-gray-800 leading-relaxed resize-none border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors"
          />
          <p className="text-[11px] text-gray-400">
            Edit before sending. Replace <span className="font-medium text-gray-600">[Name]</span> and personalize as needed.
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Icon icon="solar:letter-linear" className="w-4 h-4" />
              Open in Email
            </button>
            <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Icon icon="solar:chat-square-linear" className="w-4 h-4" />
              LinkedIn
            </button>
          </div>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              copied
                ? "bg-green-50 text-green-600 border border-green-200"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            <Icon icon={copied ? "solar:check-circle-linear" : "solar:copy-linear"} className="w-4 h-4" />
            {copied ? "Copied!" : "Copy message"}
          </button>
        </div>
      </div>
    </div>
  );
}
