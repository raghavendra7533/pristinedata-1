import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import logo from "@/assets/pristine-data-logo.svg";

type CrmOption = "Salesforce" | "HubSpot";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  badgeLabel: string;
  badgeColor: string;
  isRecommended: boolean;
  hasCrmDropdown?: boolean;
}

const INTEGRATIONS: Integration[] = [
  {
    id: "gmail",
    name: "Gmail",
    description: "Sync email threads and auto-enrich contact activity from your inbox.",
    icon: "solar:letter-bold",
    badgeLabel: "Recommended",
    badgeColor: "bg-indigo-100 text-indigo-700",
    isRecommended: true,
  },
  {
    id: "crm",
    name: "CRM",
    description: "Bi-directional sync of accounts, contacts, and opportunities.",
    icon: "solar:buildings-bold",
    badgeLabel: "Recommended",
    badgeColor: "bg-indigo-100 text-indigo-700",
    isRecommended: true,
    hasCrmDropdown: true,
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Pull meeting context into playbooks and track engagement cadence.",
    icon: "solar:calendar-bold",
    badgeLabel: "Suggested",
    badgeColor: "bg-blue-100 text-blue-700",
    isRecommended: false,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Receive signal alerts and share playbooks directly in Slack channels.",
    icon: "solar:chat-round-dots-bold",
    badgeLabel: "Optional",
    badgeColor: "bg-slate-100 text-slate-600",
    isRecommended: false,
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    description: "Send follow-up messages and receive reply signals from WhatsApp Business.",
    icon: "solar:phone-bold",
    badgeLabel: "Optional",
    badgeColor: "bg-slate-100 text-slate-600",
    isRecommended: false,
  },
];

export default function OnboardingIntegrations() {
  const navigate = useNavigate();
  const [connected, setConnected] = useState<Set<string>>(new Set());
  const [crmOption, setCrmOption] = useState<CrmOption>("Salesforce");
  const [showWarning, setShowWarning] = useState(false);

  const hasRecommended = connected.has("gmail") || connected.has("crm");

  function toggleConnect(id: string) {
    setConnected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    setShowWarning(false);
  }

  function handleContinue() {
    if (connected.size === 0) {
      setShowWarning(true);
      return;
    }
    if (!hasRecommended) {
      setShowWarning(true);
      return;
    }
    navigate("/si/dashboard");
  }

  function handleProceedAnyway() {
    navigate("/si/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#F8F8FA] flex items-center justify-center p-6">
      <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-8 w-full max-w-md mx-auto shadow-sm">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <img src={logo} alt="Pristine Data" className="h-8 w-auto" />
        </div>

        {/* Header */}
        <h1 className="text-xl font-bold text-[#0F0F0F] text-center mb-1">Connect your tools</h1>
        <p className="text-sm text-[#6B7280] text-center mb-6 leading-relaxed">
          Pristine works best when it can sync with your existing stack. You can always do this later from Settings.
        </p>

        {/* Integration cards */}
        <div className="flex flex-col gap-3 mb-6">
          {INTEGRATIONS.map((integration) => {
            const isConnected = connected.has(integration.id);
            return (
              <div
                key={integration.id}
                className="border border-[#E5E7EB] rounded-lg px-4 py-3 flex items-center gap-3"
              >
                {/* Icon */}
                <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-[#F3F4F6] flex items-center justify-center">
                  <Icon icon={integration.icon} className="h-5 w-5 text-[#6366F1]" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-[#111827]">
                      {integration.hasCrmDropdown ? (
                        <select
                          value={crmOption}
                          onChange={(e) => setCrmOption(e.target.value as CrmOption)}
                          className="text-sm font-semibold text-[#111827] bg-transparent border-none outline-none cursor-pointer pr-1"
                        >
                          <option value="Salesforce">Salesforce</option>
                          <option value="HubSpot">HubSpot</option>
                        </select>
                      ) : (
                        integration.name
                      )}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                        integration.badgeColor
                      )}
                    >
                      {integration.badgeLabel}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7280] mt-0.5 leading-snug">{integration.description}</p>
                </div>

                {/* Connect button */}
                <button
                  onClick={() => toggleConnect(integration.id)}
                  className={cn(
                    "flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors",
                    isConnected
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-[#6366F1] text-white hover:bg-[#4F46E5]"
                  )}
                >
                  {isConnected ? (
                    <span className="flex items-center gap-1">
                      <Icon icon="solar:check-circle-bold" className="h-3.5 w-3.5" />
                      Connected
                    </span>
                  ) : (
                    "Connect"
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Continue button */}
        <button
          onClick={handleContinue}
          className="rounded-full bg-[#6366F1] text-white w-full py-2.5 text-sm font-semibold hover:bg-[#4F46E5] transition-colors"
        >
          Continue to Pristine
        </button>

        {/* Inline warning */}
        {showWarning && (
          <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
            <p className="text-xs text-amber-800 leading-relaxed">
              You haven't connected any tools. Some features like scheduling meetings and CRM sync won't work until you
              do.
            </p>
            <button
              onClick={handleProceedAnyway}
              className="mt-2 text-xs font-semibold text-amber-700 hover:text-amber-900 underline transition-colors"
            >
              Continue anyway
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
