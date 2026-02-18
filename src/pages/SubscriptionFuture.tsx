import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Sparkles, Brain, Bot, Plus, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UpgradeDialog } from "@/components/subscription/UpgradeDialog";
import { PlanDetailsDialog } from "@/components/subscription/PlanDetailsDialog";
import { UsageGraph } from "@/components/subscription/UsageGraph";
import { SalesIntelligenceCard } from "@/components/subscription/SalesIntelligenceCard";
import { SalesIntelligenceUpgradeDialog } from "@/components/subscription/SalesIntelligenceUpgradeDialog";
import { useState } from "react";

// Mock data - replace with actual data from your backend
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
    plan: "Pro", // or "Basic"
    pricePerUser: 149,
    usersLicensed: 3,
    playbooksThisMonth: 42,
    playbookLimit: null, // null for unlimited on Pro, or a number for Basic (50)
    billingPeriod: "monthly" as "monthly" | "annual",
  },
};

interface UsageMetricProps {
  title: string;
  totalCreditsUsed: number;
  note: string;
  icon: React.ReactNode;
  breakdowns?: {
    label: string;
    count: number;
    creditsPerUnit: number;
    color: string;
  }[];
}

function UsageMetric({ title, totalCreditsUsed, note, icon, breakdowns }: UsageMetricProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-3xl font-bold">{totalCreditsUsed.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">credits used</span>
          </div>
        </div>
        
        {breakdowns && breakdowns.length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            {breakdowns.map((breakdown, idx) => {
              const totalCredits = breakdown.count * breakdown.creditsPerUnit;
              return (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-sm ${breakdown.color}`} />
                    <span className="text-muted-foreground">{breakdown.label}:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{breakdown.count.toLocaleString()} enrichments</span>
                    <span className="text-muted-foreground">
                      ({totalCredits.toLocaleString()} credits)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">{note}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SubscriptionHub() {
  const navigate = useNavigate();
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [planDetailsOpen, setPlanDetailsOpen] = useState(false);
  const [siUpgradeDialogOpen, setSiUpgradeDialogOpen] = useState(false);
  const [planData, setPlanData] = useState(MOCK_DATA);
  
  const handlePlanUpgrade = (planName: string, credits: number, billingPeriod: "monthly" | "annual") => {
    setPlanData({
      ...planData,
      planName,
      baseMonthlyCredits: credits,
      billingPeriod
    });
  };
  
  const handleCreditsPurchase = (credits: number) => {
    setPlanData({
      ...planData,
      additionalCredits: planData.additionalCredits + credits
    });
  };
  
  const handleSiPlanChange = (plan: string, users: number, billingPeriod: "monthly" | "annual") => {
    let basePricePerUser = plan === "Pro" ? (users >= 10 ? 129 : 149) : (users >= 10 ? 89 : 99);
    
    // Apply 15% annual discount
    if (billingPeriod === "annual") {
      basePricePerUser = Math.round(basePricePerUser * 0.85);
    }
    
    setPlanData({
      ...planData,
      salesIntelligence: {
        ...planData.salesIntelligence,
        plan,
        usersLicensed: users,
        pricePerUser: basePricePerUser,
        playbookLimit: plan === "Pro" ? null : 50,
        billingPeriod
      }
    });
  };
  
  // Calculate total credits used for each category
  const leadEnrichmentCredits = 
    ((planData.leadEnrichment?.emailEnrichment || 0) * (planData.leadEnrichment?.emailCreditsPer || 2)) +
    ((planData.leadEnrichment?.mobileEnrichment || 0) * (planData.leadEnrichment?.mobileCreditsPer || 4));
  
  const aiEnrichmentCredits = 
    ((planData.aiEnrichment?.accountInsights || 0) * (planData.aiEnrichment?.accountCreditsPer || 1)) +
    ((planData.aiEnrichment?.contactInsights || 0) * (planData.aiEnrichment?.contactCreditsPer || 1));
  
  const personalizationCredits = 
    (planData.personalizationAgent?.messagePersonalization || 0) * (planData.personalizationAgent?.creditsPer || 1);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
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
        open={siUpgradeDialogOpen}
        onOpenChange={setSiUpgradeDialogOpen}
        currentPlan={planData.salesIntelligence?.plan || "Basic"}
        currentUsers={planData.salesIntelligence?.usersLicensed || 1}
        currentBillingPeriod={planData.salesIntelligence?.billingPeriod}
        onPlanChange={handleSiPlanChange}
      />
      
      {/* Header with Gradient Band */}
      <section className="relative bg-gradient-hero px-6 py-6">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white mb-1">
                Subscription Hub
              </h1>
              <p className="text-sm text-white/80">
                Track usage, manage credits, and upgrade your plan - all in one place.
              </p>
            </div>
            <Button 
              variant="secondary"
              onClick={() => navigate('/pricing-calculator')}
              className="gap-2"
            >
              <Calculator className="h-4 w-4" />
              Pricing Calculator
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Plan Info Card */}
        <div className="space-y-4">
          
          <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Company</div>
                  <div className="text-lg font-semibold">{planData.companyName}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Current Plan</div>
                  <div className="text-lg font-semibold flex items-center gap-2">
                    <button 
                      onClick={() => setPlanDetailsOpen(true)}
                      className="hover:text-primary underline-offset-4 hover:underline transition-colors"
                    >
                      {planData.planName}
                    </button>
                    <Badge variant="secondary" className="text-xs">Active</Badge>
                    {planData.billingPeriod === "annual" && (
                      <Badge className="text-xs bg-green-500 text-white">Save 15%</Badge>
                    )}
                  </div>
                  <div className="space-y-0.5 mt-2">
                    <div className="text-xs text-muted-foreground">
                      Billing: <span className="font-medium text-foreground capitalize">{planData.billingPeriod}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Base monthly credits: <span className="font-medium text-foreground">{planData.baseMonthlyCredits.toLocaleString()}</span>
                    </div>
                    {planData.additionalCredits > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Additional credits: <span className="font-medium text-primary">{planData.additionalCredits.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Billing Cycle
                  </div>
                  <div className="text-lg font-semibold">
                    {planData.daysLeftInCycle} days left
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {planData.cycleStartDate} to {planData.cycleEndDate}
                  </div>
                  <Button 
                    size="sm" 
                    className="mt-3"
                    onClick={() => setUpgradeDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Credits or Upgrade
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Metrics - Above the Fold */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Usage to Date</h2>
          
          {/* Usage Graph */}
          <UsageGraph />
          
          <div className="space-y-6 mt-6">
            {/* 4 usage metric cards in 2x2 grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UsageMetric
                title="Contact Intelligence"
                totalCreditsUsed={leadEnrichmentCredits}
                note="Enrich contacts with email + intelligence insights and mobile numbers"
                icon={<Sparkles className="h-5 w-5 text-primary" />}
                breakdowns={[
                  {
                    label: "Contact Intelligence",
                    count: planData.leadEnrichment?.emailEnrichment || 0,
                    creditsPerUnit: planData.leadEnrichment?.emailCreditsPer || 2,
                    color: "bg-blue-500"
                  },
                  {
                    label: "Mobile Enrichment",
                    count: planData.leadEnrichment?.mobileEnrichment || 0,
                    creditsPerUnit: planData.leadEnrichment?.mobileCreditsPer || 4,
                    color: "bg-green-500"
                  }
                ]}
              />
              
              <UsageMetric
                title="AI Enrichment"
                totalCreditsUsed={aiEnrichmentCredits}
                note="AI-powered insights for accounts and contacts"
                icon={<Brain className="h-5 w-5 text-primary" />}
                breakdowns={[
                  {
                    label: "Account Insights",
                    count: planData.aiEnrichment?.accountInsights || 0,
                    creditsPerUnit: planData.aiEnrichment?.accountCreditsPer || 1,
                    color: "bg-purple-500"
                  },
                  {
                    label: "Contact Insights",
                    count: planData.aiEnrichment?.contactInsights || 0,
                    creditsPerUnit: planData.aiEnrichment?.contactCreditsPer || 1,
                    color: "bg-pink-500"
                  }
                ]}
              />
              
              <UsageMetric
                title="Personalization Agent"
                totalCreditsUsed={personalizationCredits}
                note="AI-generated personalized messages for outreach campaigns"
                icon={<Bot className="h-5 w-5 text-primary" />}
                breakdowns={[
                  {
                    label: "Message Personalization",
                    count: planData.personalizationAgent?.messagePersonalization || 0,
                    creditsPerUnit: planData.personalizationAgent?.creditsPer || 1,
                    color: "bg-violet-500"
                  }
                ]}
              />
              
              <SalesIntelligenceCard
                plan={planData.salesIntelligence?.plan || "Basic"}
                pricePerUser={planData.salesIntelligence?.pricePerUser || 99}
                usersLicensed={planData.salesIntelligence?.usersLicensed || 1}
                playbooksThisMonth={planData.salesIntelligence?.playbooksThisMonth || 0}
                playbookLimit={planData.salesIntelligence?.playbookLimit}
                onUpgradeClick={() => setSiUpgradeDialogOpen(true)}
              />
            </div>
          </div>
        </div>

        {/* Purchase Options - Now removed from main content */}
      </div>
    </div>
  );
}