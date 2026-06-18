import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Category = "All" | "CRM" | "Email" | "Calendar" | "Messaging";

interface Integration {
  id: string;
  name: string;
  category: Exclude<Category, "All">;
  description: string;
  badge?: "Recommended";
  icon: string;
  brandBg: string; // light bg class; paired with dark: override
  brandBgDark: string;
}

interface ComingSoonIntegration {
  id: string;
  name: string;
  icon: string;
  brandBg: string;
  brandBgDark: string;
  contactUs?: boolean;
}

const INTEGRATIONS: Integration[] = [
  {
    id: "gmail",
    name: "Gmail",
    category: "Email",
    description: "Sync email threads and auto-enrich contact activity from your inbox.",
    badge: "Recommended",
    icon: "logos:google-gmail",
    brandBg: "bg-red-50",
    brandBgDark: "dark:bg-red-950/40",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    category: "CRM",
    description: "Bi-directional sync of accounts, contacts, and opportunities.",
    badge: "Recommended",
    icon: "logos:salesforce",
    brandBg: "bg-blue-50",
    brandBgDark: "dark:bg-blue-950/40",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "CRM",
    description: "Bi-directional sync of accounts, contacts, and opportunities.",
    badge: "Recommended",
    icon: "logos:hubspot",
    brandBg: "bg-orange-50",
    brandBgDark: "dark:bg-orange-950/40",
  },
  {
    id: "gcal",
    name: "Google Calendar",
    category: "Calendar",
    description: "Pull meeting context into playbooks and track engagement cadence.",
    icon: "logos:google-calendar",
    brandBg: "bg-blue-50",
    brandBgDark: "dark:bg-blue-950/40",
  },
  {
    id: "slack",
    name: "Slack",
    category: "Messaging",
    description: "Receive signal alerts and share playbooks directly in Slack channels.",
    icon: "logos:slack-icon",
    brandBg: "bg-purple-50",
    brandBgDark: "dark:bg-purple-950/40",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    category: "Messaging",
    description: "Send follow-up messages and receive reply signals from WhatsApp Business.",
    icon: "logos:whatsapp-icon",
    brandBg: "bg-green-50",
    brandBgDark: "dark:bg-green-950/40",
  },
];

const COMING_SOON: ComingSoonIntegration[] = [
  { id: "outreach", name: "Outreach", icon: "solar:mailbox-bold", brandBg: "bg-violet-50", brandBgDark: "dark:bg-violet-950/40", contactUs: true },
  { id: "hubspot-seq", name: "HubSpot Sequences", icon: "logos:hubspot", brandBg: "bg-orange-50", brandBgDark: "dark:bg-orange-950/40" },
  { id: "li-nav", name: "LinkedIn Sales Navigator", icon: "logos:linkedin-icon", brandBg: "bg-blue-50", brandBgDark: "dark:bg-blue-950/40" },
];

const CATEGORIES: Category[] = ["All", "CRM", "Email", "Calendar", "Messaging"];

// ─── StatusBadge ──────────────────────────────────────────────────────────────

function StatusBadge({ connected, badge }: { connected: boolean; badge?: "Recommended" }) {
  if (connected) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 whitespace-nowrap">
        <Icon icon="solar:check-circle-bold" className="h-3 w-3" />
        Connected
      </span>
    );
  }
  if (badge === "Recommended") {
    return (
      <span
        className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap border"
        style={{
          backgroundColor: "color-mix(in srgb, var(--si-primary) 10%, transparent)",
          color: "var(--si-primary)",
          borderColor: "color-mix(in srgb, var(--si-primary) 25%, transparent)",
        }}
      >
        Recommended
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap border"
      style={{
        backgroundColor: "color-mix(in srgb, var(--si-text-muted) 12%, transparent)",
        color: "var(--si-text-muted)",
        borderColor: "color-mix(in srgb, var(--si-text-muted) 20%, transparent)",
      }}
    >
      Not connected
    </span>
  );
}

// ─── IntegrationCard ──────────────────────────────────────────────────────────

interface IntegrationCardProps {
  integration: Integration;
  connected: boolean;
  disconnectConfirm: boolean;
  onConnect: () => void;
  onDisconnectRequest: () => void;
  onDisconnectConfirm: () => void;
  onDisconnectCancel: () => void;
}

function IntegrationCard({
  integration,
  connected,
  disconnectConfirm,
  onConnect,
  onDisconnectRequest,
  onDisconnectConfirm,
  onDisconnectCancel,
}: IntegrationCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col gap-4 rounded-xl border p-6",
        "transition-all duration-200 hover:-translate-y-px hover:shadow-md",
        connected && "border-l-4 border-l-emerald-500"
      )}
      style={{
        backgroundColor: "var(--si-card-bg)",
        borderColor: connected ? undefined : "var(--si-card-border)",
        boxShadow: "var(--si-card-shadow)",
      }}
    >
      {/* Logo + badge */}
      <div className="flex items-start justify-between gap-2">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", integration.brandBg, integration.brandBgDark)}>
          <Icon icon={integration.icon} className="h-7 w-7" />
        </div>
        <StatusBadge connected={connected} badge={integration.badge} />
      </div>

      {/* Name + description */}
      <div>
        <p className="font-bold text-base mb-1" style={{ color: "var(--si-text-primary)" }}>
          {integration.name}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "var(--si-text-secondary)" }}>
          {integration.description}
        </p>
      </div>

      {/* Actions */}
      {disconnectConfirm ? (
        <div className="space-y-2">
          <p className="text-xs" style={{ color: "var(--si-text-muted)" }}>
            Disconnect {integration.name}? This will stop syncing data.
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={onDisconnectCancel}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-8 text-xs text-red-500 border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50"
              onClick={onDisconnectConfirm}
            >
              Disconnect
            </Button>
          </div>
        </div>
      ) : connected ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-emerald-500 text-sm font-medium">
            <Icon icon="solar:check-circle-bold" className="h-4 w-4" />
            Connected
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 text-xs text-red-500 hover:text-red-400 hover:bg-red-500/10 justify-start px-0"
            onClick={onDisconnectRequest}
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <Button
          size="sm"
          className="w-full h-9 text-sm text-white transition-colors duration-200"
          style={{ backgroundColor: "var(--si-primary)" }}
          onClick={onConnect}
        >
          Connect
        </Button>
      )}
    </div>
  );
}

// ─── ComingSoonCard ───────────────────────────────────────────────────────────

function ComingSoonCard({
  integration,
  notified,
  onNotify,
}: {
  integration: ComingSoonIntegration;
  notified: boolean;
  onNotify: () => void;
}) {
  return (
    <div
      className="flex flex-col gap-4 rounded-xl border p-6 opacity-60"
      style={{
        backgroundColor: "var(--si-card-bg)",
        borderColor: "var(--si-card-border)",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", integration.brandBg, integration.brandBgDark)}>
          <Icon icon={integration.icon} className="h-7 w-7" />
        </div>
        <span
          className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap border"
          style={{
            backgroundColor: "color-mix(in srgb, var(--si-text-muted) 12%, transparent)",
            color: "var(--si-text-muted)",
            borderColor: "color-mix(in srgb, var(--si-text-muted) 20%, transparent)",
          }}
        >
          Coming soon
        </span>
      </div>

      <div>
        <p className="font-bold text-base" style={{ color: "var(--si-text-primary)" }}>
          {integration.name}
        </p>
        {integration.contactUs && (
          <p className="text-xs mt-1" style={{ color: "var(--si-text-muted)" }}>
            Already using Outreach? We can connect it with our demand gen product.
          </p>
        )}
      </div>

      {integration.contactUs ? (
        <Button
          size="sm"
          variant="outline"
          className="w-full h-9 text-sm transition-colors duration-200"
          style={{
            borderColor: "color-mix(in srgb, var(--si-primary) 40%, transparent)",
            color: "var(--si-primary)",
          }}
          onClick={() => toast("Our team will reach out to get you set up.")}
        >
          <Icon icon="solar:chat-round-call-linear" className="h-4 w-4 mr-2" />
          Contact us
        </Button>
      ) : (
        <Button
          size="sm"
          variant="outline"
          className="w-full h-9 text-sm transition-colors duration-200"
          onClick={onNotify}
          disabled={notified}
        >
          {notified ? (
            <>
              <Icon icon="solar:check-circle-bold" className="h-4 w-4 mr-2 text-emerald-500" />
              You'll be notified
            </>
          ) : (
            "Notify me"
          )}
        </Button>
      )}
    </div>
  );
}

// ─── Banner ───────────────────────────────────────────────────────────────────

function Banner({ variant, onDismiss }: { variant: "zero" | "partial"; onDismiss: () => void }) {
  const isZero = variant === "zero";
  return (
    <div
      className="flex items-start justify-between gap-4 rounded-xl px-5 py-4 border transition-all duration-200"
      style={{
        backgroundColor: isZero
          ? "color-mix(in srgb, var(--si-primary) 8%, transparent)"
          : "color-mix(in srgb, #3B82F6 8%, transparent)",
        borderColor: isZero
          ? "color-mix(in srgb, var(--si-primary) 25%, transparent)"
          : "color-mix(in srgb, #3B82F6 25%, transparent)",
      }}
    >
      <div className="flex items-start gap-3">
        <Icon
          icon={isZero ? "solar:danger-circle-linear" : "solar:info-circle-linear"}
          className="h-5 w-5 mt-0.5 flex-shrink-0"
          style={{ color: isZero ? "var(--si-primary)" : "#3B82F6" }}
        />
        <p
          className="text-sm font-medium"
          style={{ color: isZero ? "var(--si-primary)" : "var(--si-text-secondary)" }}
        >
          {isZero
            ? "Connect at least Gmail or your CRM to unlock the full Pristine experience."
            : "Good start. Connect your CRM to get bi-directional sync."}
        </p>
      </div>
      <button
        onClick={onDismiss}
        className="p-1 rounded-md transition-colors flex-shrink-0"
        style={{ color: "var(--si-text-muted)" }}
      >
        <Icon icon="solar:close-circle-linear" className="h-4 w-4" />
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SIIntegrations({ embedded = false }: { embedded?: boolean }) {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [disconnectConfirm, setDisconnectConfirm] = useState<string | null>(null);
  const [notifiedIds, setNotifiedIds] = useState<Set<string>>(new Set());

  const isConnected = (id: string) => connectedIds.has(id);
  const crmConnected = isConnected("salesforce") || isConnected("hubspot");
  const allRecommendedConnected = isConnected("gmail") && crmConnected;
  const showBanner =
    !bannerDismissed &&
    !allRecommendedConnected &&
    (connectedIds.size === 0 || !crmConnected);
  const bannerVariant: "zero" | "partial" = connectedIds.size === 0 ? "zero" : "partial";

  const filteredIntegrations =
    activeCategory === "All"
      ? INTEGRATIONS
      : INTEGRATIONS.filter((i) => i.category === activeCategory);

  const handleConnect = (id: string) => {
    setConnectedIds((prev) => new Set([...prev, id]));
    const name = INTEGRATIONS.find((i) => i.id === id)?.name ?? id;
    toast.success(`${name} connected successfully.`);
  };

  const handleDisconnectConfirm = (id: string) => {
    setConnectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setDisconnectConfirm(null);
    const name = INTEGRATIONS.find((i) => i.id === id)?.name ?? id;
    toast(`${name} disconnected.`);
  };

  return (
    <div className={embedded ? "" : "min-h-full p-8"} style={embedded ? undefined : { backgroundColor: "var(--si-bg)" }}>
      <div className={embedded ? "" : "max-w-6xl mx-auto"}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10">

          {/* ── Left column ─────────────────────────────────────────────── */}
          <div className="lg:sticky lg:top-8 self-start space-y-8">
            {!embedded && (
              <div>
                <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--si-text-primary)" }}>
                  Integrations
                </h1>
                <p className="text-sm leading-relaxed" style={{ color: "var(--si-text-secondary)" }}>
                  Connect Pristine to your existing stack. The more context we have, the sharper your signals.
                </p>
              </div>
            )}

            <div className="space-y-1">
              {CATEGORIES.map((cat) => {
                const active = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                    style={{
                      backgroundColor: active ? "color-mix(in srgb, var(--si-primary) 10%, transparent)" : "transparent",
                      color: active ? "var(--si-primary)" : "var(--si-text-muted)",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "color-mix(in srgb, var(--si-text-muted) 8%, transparent)";
                        (e.currentTarget as HTMLElement).style.color = "var(--si-text-secondary)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                        (e.currentTarget as HTMLElement).style.color = "var(--si-text-muted)";
                      }
                    }}
                  >
                    <Icon
                      icon={
                        cat === "All" ? "solar:widget-5-linear" :
                        cat === "CRM" ? "solar:database-linear" :
                        cat === "Email" ? "solar:letter-linear" :
                        cat === "Calendar" ? "solar:calendar-linear" :
                        "solar:chat-round-linear"
                      }
                      className="h-4 w-4 flex-shrink-0"
                    />
                    {cat}
                  </button>
                );
              })}
            </div>

            <button
              className="flex items-center gap-2 text-sm transition-colors duration-200"
              style={{ color: "var(--si-text-muted)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--si-primary)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--si-text-muted)")}
            >
              <Icon icon="solar:add-circle-linear" className="h-4 w-4" />
              Request an integration
            </button>
          </div>

          {/* ── Right column ────────────────────────────────────────────── */}
          <div className="space-y-6">
            {showBanner && (
              <Banner variant={bannerVariant} onDismiss={() => setBannerDismissed(true)} />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredIntegrations.length > 0 ? (
                filteredIntegrations.map((integration) => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                    connected={isConnected(integration.id)}
                    disconnectConfirm={disconnectConfirm === integration.id}
                    onConnect={() => handleConnect(integration.id)}
                    onDisconnectRequest={() => setDisconnectConfirm(integration.id)}
                    onDisconnectConfirm={() => handleDisconnectConfirm(integration.id)}
                    onDisconnectCancel={() => setDisconnectConfirm(null)}
                  />
                ))
              ) : (
                <div className="col-span-2 flex flex-col items-center justify-center py-16 text-center">
                  <Icon icon="solar:widget-5-linear" className="h-10 w-10 mb-3" style={{ color: "var(--si-text-muted)" }} />
                  <p className="text-sm" style={{ color: "var(--si-text-muted)" }}>No integrations in this category yet.</p>
                </div>
              )}
            </div>

            {activeCategory === "All" && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Icon icon="solar:clock-circle-linear" className="h-4 w-4" style={{ color: "var(--si-text-muted)" }} />
                  <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--si-text-muted)" }}>
                    Coming soon
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {COMING_SOON.map((cs) => (
                    <ComingSoonCard
                      key={cs.id}
                      integration={cs}
                      notified={notifiedIds.has(cs.id)}
                      onNotify={() => setNotifiedIds((prev) => new Set([...prev, cs.id]))}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
