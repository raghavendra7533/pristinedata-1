import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = "All" | "CRM" | "Email" | "Calendar" | "Messaging";
type CrmProvider = "salesforce" | "hubspot";

interface Integration {
  id: string;
  name: string;
  category: Exclude<Category, "All">;
  description: string;
  badge?: "Recommended";
  icon: string;
  brandBg: string;
}

interface ComingSoonIntegration {
  id: string;
  name: string;
  icon: string;
  brandBg: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const INTEGRATIONS: Integration[] = [
  {
    id: "gmail",
    name: "Gmail",
    category: "Email",
    description: "Sync email threads and auto-enrich contact activity from your inbox.",
    badge: "Recommended",
    icon: "logos:google-gmail",
    brandBg: "bg-red-50",
  },
  {
    id: "crm",
    name: "CRM",
    category: "CRM",
    description: "Bi-directional sync of accounts, contacts, and opportunities.",
    badge: "Recommended",
    icon: "logos:salesforce",
    brandBg: "bg-blue-50",
  },
  {
    id: "gcal",
    name: "Google Calendar",
    category: "Calendar",
    description: "Pull meeting context into playbooks and track engagement cadence.",
    icon: "logos:google-calendar",
    brandBg: "bg-blue-50",
  },
  {
    id: "slack",
    name: "Slack",
    category: "Messaging",
    description: "Receive signal alerts and share playbooks directly in Slack channels.",
    icon: "logos:slack-icon",
    brandBg: "bg-purple-50",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    category: "Messaging",
    description: "Send follow-up messages and receive reply signals from WhatsApp Business.",
    icon: "logos:whatsapp-icon",
    brandBg: "bg-green-50",
  },
];

const COMING_SOON: ComingSoonIntegration[] = [
  { id: "outreach", name: "Outreach", icon: "solar:mailbox-bold", brandBg: "bg-violet-50" },
  { id: "hubspot-seq", name: "HubSpot Sequences", icon: "logos:hubspot", brandBg: "bg-orange-50" },
  { id: "li-nav", name: "LinkedIn Sales Navigator", icon: "logos:linkedin-icon", brandBg: "bg-blue-50" },
];

const CATEGORIES: Category[] = ["All", "CRM", "Email", "Calendar", "Messaging"];

// ─── StatusBadge ──────────────────────────────────────────────────────────────

function StatusBadge({ connected, badge }: { connected: boolean; badge?: "Recommended" }) {
  if (connected) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 whitespace-nowrap">
        <Icon icon="solar:check-circle-bold" className="h-3 w-3" />
        Connected
      </span>
    );
  }
  if (badge === "Recommended") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20 whitespace-nowrap">
        Recommended
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200 whitespace-nowrap">
      Not connected
    </span>
  );
}

// ─── IntegrationCard ──────────────────────────────────────────────────────────

interface IntegrationCardProps {
  integration: Integration;
  connected: boolean;
  disconnectConfirm: boolean;
  crmSelection?: CrmProvider;
  onCrmChange?: (v: CrmProvider) => void;
  onConnect: () => void;
  onDisconnectRequest: () => void;
  onDisconnectConfirm: () => void;
  onDisconnectCancel: () => void;
}

function IntegrationCard({
  integration,
  connected,
  disconnectConfirm,
  crmSelection,
  onCrmChange,
  onConnect,
  onDisconnectRequest,
  onDisconnectConfirm,
  onDisconnectCancel,
}: IntegrationCardProps) {
  const isCrm = integration.id === "crm";
  const cardIcon =
    isCrm && crmSelection === "hubspot" ? "logos:hubspot" : integration.icon;
  const cardBrandBg =
    isCrm && crmSelection === "hubspot" ? "bg-orange-50" : integration.brandBg;

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6",
        "transition-all duration-200 hover:-translate-y-px hover:shadow-md",
        connected && "border-l-4 border-l-emerald-500 bg-emerald-50/20"
      )}
    >
      {/* Top row: logo + badge */}
      <div className="flex items-start justify-between gap-2">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", cardBrandBg)}>
          <Icon icon={cardIcon} className="h-7 w-7" />
        </div>
        <StatusBadge connected={connected} badge={integration.badge} />
      </div>

      {/* Name + description */}
      <div>
        <p className="font-bold text-base text-foreground mb-1">{integration.name}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{integration.description}</p>
      </div>

      {/* CRM provider toggle */}
      {isCrm && !connected && (
        <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs font-medium">
          {(["salesforce", "hubspot"] as CrmProvider[]).map((p) => (
            <button
              key={p}
              onClick={() => onCrmChange?.(p)}
              className={cn(
                "flex-1 py-1.5 capitalize transition-colors duration-150",
                crmSelection === p
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent"
              )}
            >
              {p === "salesforce" ? "Salesforce" : "HubSpot"}
            </button>
          ))}
        </div>
      )}

      {/* Actions */}
      {disconnectConfirm ? (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Disconnect {integration.name}? This will stop syncing data.
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={onDisconnectCancel}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-8 text-xs text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
              onClick={onDisconnectConfirm}
            >
              Disconnect
            </Button>
          </div>
        </div>
      ) : connected ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
            <Icon icon="solar:check-circle-bold" className="h-4 w-4" />
            Connected
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 justify-start px-0"
            onClick={onDisconnectRequest}
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <Button
          size="sm"
          className="w-full h-9 text-sm bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200"
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
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 opacity-60">
      <div className="flex items-start justify-between gap-2">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", integration.brandBg)}>
          <Icon icon={integration.icon} className="h-7 w-7" />
        </div>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200 whitespace-nowrap">
          Coming soon
        </span>
      </div>

      <p className="font-bold text-base text-foreground">{integration.name}</p>

      <Button
        size="sm"
        variant="outline"
        className="w-full h-9 text-sm transition-colors duration-200"
        onClick={onNotify}
        disabled={notified}
      >
        {notified ? (
          <>
            <Icon icon="solar:check-circle-bold" className="h-4 w-4 mr-2 text-emerald-600" />
            You'll be notified
          </>
        ) : (
          "Notify me"
        )}
      </Button>
    </div>
  );
}

// ─── Banner ───────────────────────────────────────────────────────────────────

function Banner({ variant, onDismiss }: { variant: "zero" | "partial"; onDismiss: () => void }) {
  const isZero = variant === "zero";
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 rounded-xl px-5 py-4 border transition-all duration-200",
        isZero ? "bg-primary/5 border-primary/20" : "bg-blue-50 border-blue-200"
      )}
    >
      <div className="flex items-start gap-3">
        <Icon
          icon={isZero ? "solar:danger-circle-linear" : "solar:info-circle-linear"}
          className={cn("h-5 w-5 mt-0.5 flex-shrink-0", isZero ? "text-primary" : "text-blue-600")}
        />
        <p className={cn("text-sm font-medium", isZero ? "text-primary" : "text-blue-700")}>
          {isZero
            ? "Connect at least Gmail or your CRM to unlock the full Pristine experience."
            : "Good start. Connect your CRM to get bi-directional sync."}
        </p>
      </div>
      <button
        onClick={onDismiss}
        className={cn(
          "p-1 rounded-md transition-colors flex-shrink-0",
          isZero
            ? "text-primary/60 hover:text-primary hover:bg-primary/10"
            : "text-blue-500 hover:text-blue-700 hover:bg-blue-100"
        )}
      >
        <Icon icon="solar:close-circle-linear" className="h-4 w-4" />
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Integrations() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [crmSelection, setCrmSelection] = useState<CrmProvider>("salesforce");
  const [disconnectConfirm, setDisconnectConfirm] = useState<string | null>(null);
  const [notifiedIds, setNotifiedIds] = useState<Set<string>>(new Set());

  const isConnected = (id: string) => connectedIds.has(id);

  const allRecommendedConnected = isConnected("gmail") && isConnected("crm");

  const showBanner =
    !bannerDismissed &&
    !allRecommendedConnected &&
    (connectedIds.size === 0 || !isConnected("crm"));

  const bannerVariant: "zero" | "partial" = connectedIds.size === 0 ? "zero" : "partial";

  const filteredIntegrations =
    activeCategory === "All"
      ? INTEGRATIONS
      : INTEGRATIONS.filter((i) => i.category === activeCategory);

  const handleConnect = (id: string) => {
    setConnectedIds((prev) => new Set([...prev, id]));
    const integration = INTEGRATIONS.find((i) => i.id === id);
    const displayName =
      id === "crm"
        ? crmSelection === "salesforce" ? "Salesforce" : "HubSpot"
        : integration?.name ?? id;
    toast.success(`${displayName} connected successfully.`);
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
    <div className="min-h-full bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10">

          {/* ── Left column ─────────────────────────────────────────────── */}
          <div className="lg:sticky lg:top-8 self-start space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Integrations</h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Connect Pristine to your existing stack. The more context we have, the sharper your signals.
              </p>
            </div>

            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    activeCategory === cat
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
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
              ))}
            </div>

            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
              <Icon icon="solar:add-circle-linear" className="h-4 w-4" />
              Request an integration
            </button>
          </div>

          {/* ── Right column ────────────────────────────────────────────── */}
          <div className="space-y-6">
            {/* Banner */}
            {showBanner && (
              <Banner variant={bannerVariant} onDismiss={() => setBannerDismissed(true)} />
            )}

            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredIntegrations.length > 0 ? (
                filteredIntegrations.map((integration) => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                    connected={isConnected(integration.id)}
                    disconnectConfirm={disconnectConfirm === integration.id}
                    crmSelection={integration.id === "crm" ? crmSelection : undefined}
                    onCrmChange={integration.id === "crm" ? setCrmSelection : undefined}
                    onConnect={() => handleConnect(integration.id)}
                    onDisconnectRequest={() => setDisconnectConfirm(integration.id)}
                    onDisconnectConfirm={() => handleDisconnectConfirm(integration.id)}
                    onDisconnectCancel={() => setDisconnectConfirm(null)}
                  />
                ))
              ) : (
                <div className="col-span-2 flex flex-col items-center justify-center py-16 text-center">
                  <Icon icon="solar:widget-5-linear" className="h-10 w-10 text-muted-foreground/40 mb-3" />
                  <p className="text-sm text-muted-foreground">No integrations in this category yet.</p>
                </div>
              )}
            </div>

            {/* Coming soon section — only on "All" */}
            {activeCategory === "All" && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Icon icon="solar:clock-circle-linear" className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Coming soon</h2>
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
