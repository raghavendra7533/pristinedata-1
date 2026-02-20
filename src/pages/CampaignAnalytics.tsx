import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { AnalyticsTab } from "@/components/campaign/analytics/AnalyticsTab";
import { LeadsTab } from "@/components/campaign/analytics/LeadsTab";
import { SequenceTab } from "@/components/campaign/analytics/SequenceTab";

// Mock campaign data
const campaignData = {
  id: 7,
  name: "Q4 Enterprise Push",
  type: "Sales Outreach",
  status: "Completed",
  progress: 100,
  dateRange: "Nov 15 - Dec 20, 2024",
  totalLeads: 1800,
  metrics: {
    sent: 1800,
    opened: 941,
    openRate: 52.3,
    clicked: 520,
    clickRate: 28.9,
    replied: 223,
    replyRate: 12.4,
    bounced: 23,
    bounceRate: 1.3,
    unsubscribed: 8,
    unsubscribeRate: 0.4
  }
};

// Mock daily data for chart
const dailyData = [
  { date: "Nov 15", sent: 450, opened: 234, clicked: 89, replied: 34 },
  { date: "Nov 18", sent: 380, opened: 198, clicked: 76, replied: 28 },
  { date: "Nov 21", sent: 320, opened: 186, clicked: 72, replied: 31 },
  { date: "Nov 24", sent: 280, opened: 156, clicked: 68, replied: 25 },
  { date: "Nov 27", sent: 220, opened: 128, clicked: 54, replied: 22 },
  { date: "Nov 30", sent: 150, opened: 98, clicked: 42, replied: 18 },
  { date: "Dec 03", sent: 0, opened: 89, clicked: 38, replied: 15 },
  { date: "Dec 06", sent: 0, opened: 52, clicked: 28, replied: 12 },
  { date: "Dec 10", sent: 0, opened: 0, clicked: 18, replied: 14 },
  { date: "Dec 15", sent: 0, opened: 0, clicked: 15, replied: 12 },
  { date: "Dec 20", sent: 0, opened: 0, clicked: 10, replied: 12 },
];

// Mock step analytics
const stepAnalytics = [
  {
    step: "Step 1",
    stepName: "Initial Outreach",
    sent: 1800,
    opened: 941,
    openRate: 52.3,
    replied: 89,
    replyRate: 4.9,
    clicked: 234,
    clickRate: 13.0,
    variants: [
      { name: "A", sent: 900, opened: 485, openRate: 53.9, replied: 48, replyRate: 5.3, clicked: 124, clickRate: 13.8 },
      { name: "B", sent: 900, opened: 456, openRate: 50.7, replied: 41, replyRate: 4.6, clicked: 110, clickRate: 12.2 },
    ]
  },
  {
    step: "Step 2",
    stepName: "Follow-up",
    sent: 1620,
    opened: 842,
    openRate: 52.0,
    replied: 78,
    replyRate: 4.8,
    clicked: 186,
    clickRate: 11.5,
    variants: [
      { name: "A", sent: 1620, opened: 842, openRate: 52.0, replied: 78, replyRate: 4.8, clicked: 186, clickRate: 11.5 },
    ]
  },
  {
    step: "Step 3",
    stepName: "Final Touch",
    sent: 1450,
    opened: 725,
    openRate: 50.0,
    replied: 56,
    replyRate: 3.9,
    clicked: 100,
    clickRate: 6.9,
    variants: [
      { name: "A", sent: 1450, opened: 725, openRate: 50.0, replied: 56, replyRate: 3.9, clicked: 100, clickRate: 6.9 },
    ]
  }
];

const kpiCards = [
  {
    title: "Sent",
    value: campaignData.metrics.sent.toLocaleString(),
    icon: "solar:plain-2-linear",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-600 dark:text-blue-400"
  },
  {
    title: "Open Rate",
    value: `${campaignData.metrics.openRate}%`,
    subValue: campaignData.metrics.opened.toLocaleString(),
    icon: "solar:letter-opened-linear",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-600 dark:text-emerald-400"
  },
  {
    title: "Click Rate",
    value: `${campaignData.metrics.clickRate}%`,
    subValue: campaignData.metrics.clicked.toLocaleString(),
    icon: "solar:cursor-linear",
    bgColor: "bg-violet-500/10",
    textColor: "text-violet-600 dark:text-violet-400"
  },
  {
    title: "Reply Rate",
    value: `${campaignData.metrics.replyRate}%`,
    subValue: campaignData.metrics.replied.toLocaleString(),
    icon: "solar:chat-round-line-linear",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-600 dark:text-amber-400"
  },
  {
    title: "Bounced",
    value: `${campaignData.metrics.bounceRate}%`,
    subValue: campaignData.metrics.bounced.toLocaleString(),
    icon: "solar:danger-triangle-linear",
    bgColor: "bg-red-500/10",
    textColor: "text-red-600 dark:text-red-400"
  },
  {
    title: "Unsubscribed",
    value: `${campaignData.metrics.unsubscribeRate}%`,
    subValue: campaignData.metrics.unsubscribed.toLocaleString(),
    icon: "solar:user-minus-linear",
    bgColor: "bg-slate-500/10",
    textColor: "text-slate-600 dark:text-slate-400"
  }
];

export default function CampaignAnalytics() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("analytics");

  return (
    <div className="min-h-full">
      {/* Header - Card Style Top Bar */}
      <header className="bg-card border-b border-border px-4 py-3 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left - Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/campaigns")}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Icon icon="solar:arrow-left-linear" className="h-4 w-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-semibold text-foreground">
                  {campaignData.name}
                </h1>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px]",
                    campaignData.status === "Completed"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                  )}
                >
                  {campaignData.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon icon="solar:calendar-linear" className="h-3 w-3" />
                {campaignData.dateRange}
                <span className="text-muted-foreground/50">•</span>
                <span>{campaignData.totalLeads.toLocaleString()} leads</span>
              </div>
            </div>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              <Icon icon="solar:share-linear" className="h-3.5 w-3.5 mr-1.5" />
              Share
            </Button>
            {campaignData.status === "Completed" ? (
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs">
                <Icon icon="solar:copy-linear" className="h-3.5 w-3.5 mr-1.5" />
                Duplicate
              </Button>
            ) : (
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs">
                <Icon icon="solar:play-linear" className="h-3.5 w-3.5 mr-1.5" />
                Resume
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Tabs */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-10 bg-transparent border-none p-0 gap-4">
              <TabsTrigger
                value="analytics"
                className="px-1 py-2 h-10 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground text-sm font-medium"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="leads"
                className="px-1 py-2 h-10 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground text-sm font-medium"
              >
                Leads
              </TabsTrigger>
              <TabsTrigger
                value="sequence"
                className="px-1 py-2 h-10 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground text-sm font-medium"
              >
                Sequence
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* KPI Cards - Shown on Analytics tab */}
        {activeTab === "analytics" && (
          <section className="animate-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {kpiCards.map((kpi) => (
                <Card key={kpi.title}>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", kpi.bgColor)}>
                        <Icon icon={kpi.icon} className={cn("h-3.5 w-3.5", kpi.textColor)} />
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground mb-0.5">{kpi.title}</p>
                    <div className="flex items-baseline gap-1.5">
                      <p className={cn("text-xl font-bold", kpi.textColor)}>{kpi.value}</p>
                      {kpi.subValue && (
                        <span className="text-xs text-muted-foreground">({kpi.subValue})</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Tab Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="analytics" className="mt-0 animate-fade-in">
            <AnalyticsTab dailyData={dailyData} />
          </TabsContent>

          <TabsContent value="leads" className="mt-0 animate-fade-in">
            <LeadsTab />
          </TabsContent>

          <TabsContent value="sequence" className="mt-0 animate-fade-in">
            <SequenceTab stepAnalytics={stepAnalytics} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
