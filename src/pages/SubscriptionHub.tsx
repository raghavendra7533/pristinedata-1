import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { UpgradeDialog } from "@/components/subscription/UpgradeDialog";
import { PlanDetailsDialog } from "@/components/subscription/PlanDetailsDialog";
import { UsageGraph } from "@/components/subscription/UsageGraph";
import { SalesIntelligenceCard } from "@/components/subscription/SalesIntelligenceCard";
import { SalesIntelligenceUpgradeDialog } from "@/components/subscription/SalesIntelligenceUpgradeDialog";
import CampaignCalendar from "@/pages/CampaignCalendar";

// ─── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_DATA = {
  companyName: "Acme Corporation",
  planName: "Founder's Package",
  billingPeriod: "monthly" as "monthly" | "annual",
  cycleStartDate: "2025-01-17",
  cycleEndDate: "2025-02-16",
  daysLeftInCycle: 12,
  baseMonthlyCredits: 12000,
  additionalCredits: 3500,

  leadEnrichment: {
    emailEnrichment: 1840,
    emailCreditsPer: 2,
    mobileEnrichment: 285,
    mobileCreditsPer: 4,
  },
  aiEnrichment: {
    accountInsights: 450,
    accountCreditsPer: 1,
    contactInsights: 620,
    contactCreditsPer: 1,
  },
  personalizationAgent: {
    messagePersonalization: 2150,
    creditsPer: 1,
  },
  salesIntelligence: {
    plan: "Pro",
    pricePerUser: 149,
    usersLicensed: 3,
    playbooksThisMonth: 42,
    playbookLimit: null as number | null,
    billingPeriod: "monthly" as "monthly" | "annual",
  },
};

// ─── Usage metric card ─────────────────────────────────────────────────────────

interface Breakdown {
  label: string;
  count: number;
  creditsPerUnit: number;
  color: string;
}

interface UsageMetricProps {
  title: string;
  totalCreditsUsed: number;
  description: string;
  icon: string;
  iconColor: string;
  accentClass: string;
  breakdowns?: Breakdown[];
}

function UsageMetric({ title, totalCreditsUsed, description, icon, iconColor, accentClass, breakdowns }: UsageMetricProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accentClass}`}>
              <Icon icon={icon} className={`h-5 w-5 ${iconColor}`} />
            </div>
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          <HoverCard>
            <HoverCardTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground transition-colors mt-0.5">
                <Icon icon="solar:info-circle-linear" className="h-4 w-4" />
              </button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-1.5">
                <h4 className="text-sm font-semibold">{title}</h4>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-3xl font-bold">{totalCreditsUsed.toLocaleString()}</span>
          <span className="text-sm text-muted-foreground">credits used</span>
        </div>

        {breakdowns && breakdowns.length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            {breakdowns.map((b, idx) => {
              const total = b.count * b.creditsPerUnit;
              return (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-sm ${b.color}`} />
                    <span className="text-muted-foreground">{b.label}:</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium">{b.count.toLocaleString()}</span>
                    <span className="text-muted-foreground">({total.toLocaleString()} credits)</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

type Tab = "subscription" | "campaign-calendar";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "subscription", label: "Subscription & Credits", icon: "solar:wallet-money-linear" },
  { id: "campaign-calendar", label: "Campaign Calendar", icon: "solar:calendar-mark-linear" },
];

export default function SubscriptionHub() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("subscription");
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [planDetailsOpen, setPlanDetailsOpen] = useState(false);
  const [siUpgradeOpen, setSiUpgradeOpen] = useState(false);
  const [planData, setPlanData] = useState(MOCK_DATA);

  const handlePlanUpgrade = (planName: string, credits: number, billingPeriod: "monthly" | "annual") => {
    setPlanData({ ...planData, planName, baseMonthlyCredits: credits, billingPeriod });
  };

  const handleCreditsPurchase = (credits: number) => {
    setPlanData({ ...planData, additionalCredits: planData.additionalCredits + credits });
  };

  const leadCredits =
    planData.leadEnrichment.emailEnrichment * planData.leadEnrichment.emailCreditsPer +
    planData.leadEnrichment.mobileEnrichment * planData.leadEnrichment.mobileCreditsPer;

  const aiCredits =
    planData.aiEnrichment.accountInsights * planData.aiEnrichment.accountCreditsPer +
    planData.aiEnrichment.contactInsights * planData.aiEnrichment.contactCreditsPer;

  const personalizationCredits =
    planData.personalizationAgent.messagePersonalization * planData.personalizationAgent.creditsPer;

  const totalAvailable = planData.baseMonthlyCredits + planData.additionalCredits;
  const totalUsed = leadCredits + aiCredits + personalizationCredits;
  const creditBalance = totalAvailable - totalUsed;
  const usedPct = Math.min((totalUsed / totalAvailable) * 100, 100);
  const isLow = usedPct >= 80;

  return (
    <div className="min-h-full">
      {/* ── Admin header + tab strip ── */}
      <div className="border-b border-border bg-card px-6 pt-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Admin</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your subscription, credits, and campaign operations.
              </p>
            </div>
            {activeTab === "subscription" && (
              <Button onClick={() => navigate("/pricing-calculator")} variant="outline" size="sm" className="gap-2">
                <Icon icon="solar:calculator-linear" className="h-4 w-4" />
                Pricing Calculator
              </Button>
            )}
          </div>

          {/* Tab strip */}
          <div className="flex items-center gap-1">
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                    active
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  <Icon icon={tab.icon} className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <UpgradeDialog
        open={upgradeDialogOpen}
        onOpenChange={setUpgradeDialogOpen}
        currentPlan={planData.planName}
        currentBillingPeriod={planData.billingPeriod}
        onPlanUpgrade={handlePlanUpgrade}
        onCreditsPurchase={handleCreditsPurchase}
      />
      <PlanDetailsDialog
        open={planDetailsOpen}
        onOpenChange={setPlanDetailsOpen}
        planName={planData.planName}
        companyName={planData.companyName}
      />
      <SalesIntelligenceUpgradeDialog
        open={siUpgradeOpen}
        onOpenChange={setSiUpgradeOpen}
        currentPlan={planData.salesIntelligence.plan}
        currentUsers={planData.salesIntelligence.usersLicensed}
        currentBillingPeriod={planData.salesIntelligence.billingPeriod}
        onPlanChange={(plan, users, billingPeriod) =>
          setPlanData((d) => ({ ...d, salesIntelligence: { ...d.salesIntelligence, plan, usersLicensed: users, billingPeriod } }))
        }
      />

      {/* ── Tab panels ── */}
      {activeTab === "campaign-calendar" && <CampaignCalendar />}

      {activeTab === "subscription" && (
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* ── Plan summary card ── */}
        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Company + plan */}
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Company</p>
                <p className="text-base font-semibold text-foreground">{planData.companyName}</p>

                <p className="text-xs text-muted-foreground font-medium mt-4 mb-1">Current Plan</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setPlanDetailsOpen(true)}
                    className="text-base font-semibold text-foreground hover:text-primary underline-offset-4 hover:underline transition-colors"
                  >
                    {planData.planName}
                  </button>
                  <Badge variant="secondary" className="text-xs">Active</Badge>
                  {planData.billingPeriod === "annual" && (
                    <Badge className="text-xs bg-emerald-500 text-white">Save 15%</Badge>
                  )}
                </div>
                <div className="mt-2 space-y-0.5">
                  <p className="text-xs text-muted-foreground">
                    Billing: <span className="text-foreground font-medium capitalize">{planData.billingPeriod}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Base credits: <span className="text-foreground font-medium">{planData.baseMonthlyCredits.toLocaleString()}</span>
                  </p>
                  {planData.additionalCredits > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Additional: <span className="text-primary font-medium">{planData.additionalCredits.toLocaleString()}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Credit balance */}
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Credit Balance</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className={`text-3xl font-bold ${isLow ? "text-destructive" : "text-foreground"}`}>
                    {creditBalance.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground">remaining</span>
                </div>
                {/* Progress bar */}
                <div className="h-2 rounded-full bg-secondary overflow-hidden mb-1.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${isLow ? "bg-destructive" : "bg-primary"}`}
                    style={{ width: `${usedPct}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{totalUsed.toLocaleString()} used</span>
                  <span>of {totalAvailable.toLocaleString()}</span>
                </div>
              </div>

              {/* Billing cycle */}
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1 flex items-center gap-1">
                  <Icon icon="solar:calendar-linear" className="h-3.5 w-3.5" />
                  Billing Cycle
                </p>
                <p className="text-3xl font-bold text-foreground">{planData.daysLeftInCycle} days left</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {planData.cycleStartDate} to {planData.cycleEndDate}
                </p>
                <Button
                  size="sm"
                  className="mt-4 gap-1.5"
                  onClick={() => setUpgradeDialogOpen(true)}
                >
                  <Icon icon="solar:add-circle-linear" className="h-4 w-4" />
                  Add Credits or Upgrade
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Usage section ── */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-foreground">Usage to Date</h2>

          <UsageGraph />

          {/* Credit breakdown grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 auto-rows-fr">
            <UsageMetric
              title="Contact Intelligence"
              totalCreditsUsed={leadCredits}
              icon="solar:user-id-bold-duotone"
              iconColor="text-primary"
              accentClass="bg-primary/10"
              description="Contact enrichment with email + AI insights (2 cr each). Mobile number enrichment (4 cr each)."
              breakdowns={[
                { label: "Contact Intelligence", count: planData.leadEnrichment.emailEnrichment, creditsPerUnit: planData.leadEnrichment.emailCreditsPer, color: "bg-blue-500" },
                { label: "Mobile Enrichment", count: planData.leadEnrichment.mobileEnrichment, creditsPerUnit: planData.leadEnrichment.mobileCreditsPer, color: "bg-emerald-500" },
              ]}
            />

            <UsageMetric
              title="AI Enrichment"
              totalCreditsUsed={aiCredits}
              icon="solar:cpu-bolt-bold-duotone"
              iconColor="text-violet-600"
              accentClass="bg-violet-500/10"
              description="AI-powered account and contact insights without email enrichment. 1 credit per insight."
              breakdowns={[
                { label: "Account Insights", count: planData.aiEnrichment.accountInsights, creditsPerUnit: planData.aiEnrichment.accountCreditsPer, color: "bg-violet-500" },
                { label: "Contact Insights", count: planData.aiEnrichment.contactInsights, creditsPerUnit: planData.aiEnrichment.contactCreditsPer, color: "bg-pink-500" },
              ]}
            />

            <UsageMetric
              title="Personalization Agent"
              totalCreditsUsed={personalizationCredits}
              icon="solar:magic-stick-3-bold-duotone"
              iconColor="text-amber-600"
              accentClass="bg-amber-500/10"
              description="AI-generated personalized messages for outreach campaigns. 1 credit per message."
              breakdowns={[
                { label: "Message Personalization", count: planData.personalizationAgent.messagePersonalization, creditsPerUnit: planData.personalizationAgent.creditsPer, color: "bg-amber-500" },
              ]}
            />

            <SalesIntelligenceCard
              plan={planData.salesIntelligence.plan}
              pricePerUser={planData.salesIntelligence.pricePerUser}
              usersLicensed={planData.salesIntelligence.usersLicensed}
              playbooksThisMonth={planData.salesIntelligence.playbooksThisMonth}
              playbookLimit={planData.salesIntelligence.playbookLimit}
              onUpgradeClick={() => setSiUpgradeOpen(true)}
            />
          </div>
        </div>

      </div>
      )}
    </div>
  );
}
