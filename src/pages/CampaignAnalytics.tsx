import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Mail, 
  MousePointer, 
  MessageSquare, 
  AlertTriangle,
  UserMinus,
  Calendar,
  Download,
  Share2,
  Send,
  Play,
  MoreHorizontal
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
    title: "Sequence started",
    value: campaignData.metrics.sent.toLocaleString(),
    icon: Send,
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-600 dark:text-blue-400"
  },
  {
    title: "Open rate",
    value: `${campaignData.metrics.openRate}%`,
    subValue: campaignData.metrics.opened.toLocaleString(),
    icon: Mail,
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-600 dark:text-emerald-400"
  },
  {
    title: "Click rate",
    value: `${campaignData.metrics.clickRate}%`,
    subValue: campaignData.metrics.clicked.toLocaleString(),
    icon: MousePointer,
    bgColor: "bg-violet-500/10",
    textColor: "text-violet-600 dark:text-violet-400"
  },
  {
    title: "Reply rate",
    value: `${campaignData.metrics.replyRate}%`,
    subValue: campaignData.metrics.replied.toLocaleString(),
    icon: MessageSquare,
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-600 dark:text-amber-400"
  },
  {
    title: "Bounced",
    value: `${campaignData.metrics.bounceRate}%`,
    subValue: campaignData.metrics.bounced.toLocaleString(),
    icon: AlertTriangle,
    bgColor: "bg-red-500/10",
    textColor: "text-red-600 dark:text-red-400"
  },
  {
    title: "Unsubscribed",
    value: `${campaignData.metrics.unsubscribeRate}%`,
    subValue: campaignData.metrics.unsubscribed.toLocaleString(),
    icon: UserMinus,
    bgColor: "bg-slate-500/10",
    textColor: "text-slate-600 dark:text-slate-400"
  }
];

export default function CampaignAnalytics() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("analytics");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <section className="relative bg-gradient-hero px-6 py-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate("/campaigns")}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-white">
                  {campaignData.name}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/70">Status:</span>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                  {campaignData.status}
                </Badge>
                <span className="text-sm text-white/70">{campaignData.progress}%</span>
              </div>
              
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Play className="h-4 w-4 mr-2" />
                Resume campaign
              </Button>
              <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tabs - Similar to reference screenshots */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-12 bg-transparent border-none p-0 gap-6">
              <TabsTrigger 
                value="analytics" 
                className="px-1 py-3 h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-primary font-medium"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="leads" 
                className="px-1 py-3 h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-primary font-medium"
              >
                Leads
              </TabsTrigger>
              <TabsTrigger 
                value="sequence" 
                className="px-1 py-3 h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-primary font-medium"
              >
                Sequence
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* KPI Cards - Shown on Analytics tab */}
        {activeTab === "analytics" && (
          <section className="animate-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {kpiCards.map((kpi, index) => (
                <Card 
                  key={kpi.title} 
                  className="border-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", kpi.bgColor)}>
                        <kpi.icon className={cn("h-5 w-5", kpi.textColor)} />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">{kpi.title}</p>
                      <div className="flex items-baseline gap-2">
                        <p className={cn("text-2xl font-bold", kpi.textColor)}>{kpi.value}</p>
                        {kpi.subValue && (
                          <span className="text-sm text-muted-foreground">| {kpi.subValue}</span>
                        )}
                      </div>
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
