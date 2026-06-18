import { Icon } from "@iconify/react";
import { useUserProfileStore } from "@/lib/si/userProfileStore";

const CHANNELS = [
  {
    key: "platform" as const,
    label: "In-app",
    description: "See notifications inside Pristine — no extra setup required.",
    icon: "solar:bell-bing-bold",
    iconColor: "#6366F1",
  },
  {
    key: "email" as const,
    label: "Gmail",
    description: "Get notified by email through your connected Gmail account.",
    icon: "logos:google-gmail",
    iconColor: "",
  },
  {
    key: "slack" as const,
    label: "Slack",
    description: "Send alerts to a Slack channel or DM via the Slack integration.",
    icon: "logos:slack-icon",
    iconColor: "",
  },
  {
    key: "whatsapp" as const,
    label: "WhatsApp",
    description: "Receive a WhatsApp message for time-sensitive signals.",
    icon: "logos:whatsapp-icon",
    iconColor: "",
  },
];

export default function SINotifications() {
  const { profile, setProfile } = useUserProfileStore();
  const signalDelivery = profile?.signalDelivery ?? "platform";
  const notificationChannel = profile?.notificationChannel ?? "platform";
  const isSdrRole = /sdr|bdr|business.?development|outbound/i.test(profile?.role ?? "");

  return (
    <div className="flex flex-col gap-8">
      {/* ── Delivery channel ── */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Icon icon="solar:devices-linear" width={20} className="text-indigo-500" />
          <h2 className="text-base font-semibold text-[--si-text-primary]">Delivery Channel</h2>
        </div>
        <p className="text-sm text-[--si-text-secondary] -mt-2">
          Choose where you want to receive your signal notifications.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {CHANNELS.map(({ key, label, description, icon, iconColor }) => {
            const active = notificationChannel === key;
            return (
              <button
                key={key}
                onClick={() => setProfile({ notificationChannel: key })}
                className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                  active ? "border-indigo-300 bg-indigo-50/60" : "hover:bg-white/5"
                }`}
                style={{
                  borderColor: active ? undefined : "var(--si-card-border)",
                  backgroundColor: active ? undefined : "var(--si-card-bg)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: active ? "#E0E7FF" : "var(--si-card-border)", border: "1px solid var(--si-card-border)" }}
                >
                  {iconColor ? (
                    <Icon icon={icon} width={18} style={{ color: iconColor }} />
                  ) : (
                    <Icon icon={icon} width={18} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-sm font-semibold ${active ? "text-indigo-700" : "text-[--si-text-primary]"}`}>
                      {label}
                    </span>
                    {active && (
                      <Icon icon="solar:check-circle-bold" width={14} className="text-indigo-500 ml-auto flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-[--si-text-secondary] leading-relaxed">{description}</p>
                </div>
              </button>
            );
          })}
        </div>
        {notificationChannel !== "platform" && (
          <p className="text-xs text-[--si-text-muted] flex items-center gap-1.5">
            <Icon icon="solar:info-circle-linear" width={14} />
            Make sure {CHANNELS.find((c) => c.key === notificationChannel)?.label} is connected under the Integrations tab.
          </p>
        )}
      </section>

      {/* ── Delivery frequency ── */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Icon icon="solar:bell-bing-bold" width={20} className="text-indigo-500" />
          <h2 className="text-base font-semibold text-[--si-text-primary]">Delivery Frequency</h2>
        </div>
        <p className="text-sm text-[--si-text-secondary] -mt-2">
          Choose how often you receive signal notifications.
        </p>
        <div className="flex flex-col gap-3">
          {[
            {
              key: "platform" as const,
              label: "Real-time",
              description: "Signals appear as they happen. Best for focused accounts.",
              icon: "solar:bolt-linear",
              recommended: !isSdrRole,
            },
            {
              key: "daily_email" as const,
              label: "Daily digest",
              description: "A curated summary of signals delivered each morning.",
              icon: "solar:letter-linear",
              recommended: isSdrRole,
            },
            {
              key: "weekly_email" as const,
              label: "Weekly digest",
              description: "A weekly rollup of the most important signals across your watchlist.",
              icon: "solar:calendar-linear",
              recommended: false,
            },
          ].map(({ key, label, description, icon, recommended }) => (
            <button
              key={key}
              onClick={() => setProfile({ signalDelivery: key })}
              className={`flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${
                signalDelivery === key ? "border-indigo-300 bg-indigo-50/60" : "hover:bg-white/5"
              }`}
              style={{ borderColor: signalDelivery === key ? undefined : "var(--si-card-border)", backgroundColor: signalDelivery === key ? undefined : "var(--si-card-bg)" }}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: signalDelivery === key ? "#E0E7FF" : "var(--si-card-border)", border: "1px solid var(--si-card-border)" }}>
                <Icon icon={icon} width={18} style={{ color: signalDelivery === key ? "#4F46E5" : "var(--si-text-secondary)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-sm font-semibold ${signalDelivery === key ? "text-indigo-700" : "text-[--si-text-primary]"}`}>{label}</span>
                  {recommended && (
                    <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                      Recommended
                    </span>
                  )}
                  {signalDelivery === key && (
                    <Icon icon="solar:check-circle-bold" width={14} className="text-indigo-500 ml-auto flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-[--si-text-secondary] leading-relaxed">{description}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
