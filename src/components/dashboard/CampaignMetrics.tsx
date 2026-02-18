import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, MousePointer, MessageSquare, TrendingUp, Award, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
type TimePeriod = "performance" | "recent" | "active";
export default function CampaignMetrics() {
  const navigate = useNavigate();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("performance");

  // Mock data - would come from API
  const topCampaigns = {
    performance: {
      name: "Q1 SaaS Outreach",
      sent: 450,
      openRate: 52.3,
      clickRate: 24.1,
      responseRate: 11.2
    },
    recent: {
      name: "Healthcare Lead Nurture",
      sent: 1240,
      openRate: 48.7,
      clickRate: 21.5,
      responseRate: 9.8
    }
  };
  const activeCampaigns = [{
    id: 1,
    name: "Q1 SaaS Outreach",
    type: "Sales Outreach",
    totalLeads: 1200,
    contacted: 600,
    stage: "1 of 3",
    openRate: 45.2,
    clickRate: 24.1,
    status: "Active"
  }, {
    id: 2,
    name: "Healthcare Lead Nurture",
    type: "Lead Nurture",
    totalLeads: 850,
    contacted: 420,
    stage: "2 of 3",
    openRate: 38.7,
    clickRate: 18.5,
    status: "Active"
  }, {
    id: 3,
    name: "Event Follow-up",
    type: "Event Outreach",
    totalLeads: 650,
    contacted: 380,
    stage: "3 of 3",
    openRate: 52.1,
    clickRate: 28.3,
    status: "Active"
  }];
  const currentMetrics = timePeriod !== "active" ? topCampaigns[timePeriod] : null;
  const metricCards = currentMetrics ? [{
    title: "Sent",
    value: currentMetrics.sent.toLocaleString(),
    icon: Mail,
    color: "from-purple-500 to-purple-600"
  }, {
    title: "Open Rate",
    value: `${currentMetrics.openRate}%`,
    icon: TrendingUp,
    color: "from-indigo-500 to-indigo-600"
  }, {
    title: "Click Rate",
    value: `${currentMetrics.clickRate}%`,
    icon: MousePointer,
    color: "from-violet-500 to-violet-600"
  }, {
    title: "Response Rate",
    value: `${currentMetrics.responseRate}%`,
    icon: MessageSquare,
    color: "from-fuchsia-500 to-fuchsia-600"
  }] : [];
  return <Card className="border-2 shadow-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">Campaigns</CardTitle>
          </div>
          <Tabs value={timePeriod} onValueChange={v => setTimePeriod(v as TimePeriod)}>
            <TabsList className="h-9">
              <TabsTrigger value="performance" className="text-xs">Performance</TabsTrigger>
              <TabsTrigger value="recent" className="text-xs">Recent</TabsTrigger>
              <TabsTrigger value="active" className="text-xs">Active Campaigns</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {timePeriod !== "active" ? currentMetrics && <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">{currentMetrics.name}</h3>
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20">
              {timePeriod === "performance" ? "Best Performance" : "Most Recent"}
            </Badge>
          </div> : <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20">
              Active
            </Badge>
          </div>}
      </CardHeader>
      <CardContent>
        {timePeriod === "active" ? <div className="space-y-3">
            {activeCampaigns.map(campaign => <div key={campaign.id} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-br from-muted/30 to-muted/50 hover:shadow-md transition-all duration-300 cursor-pointer group" onClick={() => navigate(`/campaigns/${campaign.id}`)}>
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground truncate">{campaign.name}</h4>
                      
                    </div>
                    <p className="text-xs text-muted-foreground">{campaign.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{campaign.totalLeads}</p>
                    <p className="text-xs text-muted-foreground">Total Leads</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{campaign.contacted}</p>
                    <p className="text-xs text-muted-foreground">Contacted</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{campaign.stage}</p>
                    <p className="text-xs text-muted-foreground">Stage</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{campaign.openRate}%</p>
                    <p className="text-xs text-muted-foreground">Open Rate</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{campaign.clickRate}%</p>
                    <p className="text-xs text-muted-foreground">Click Rate</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>)}
          </div> : <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {metricCards.map(metric => <div key={metric.title} className="relative overflow-hidden rounded-lg bg-gradient-to-br from-muted/30 to-muted/50 p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                    <metric.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">{metric.title}</p>
                  <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                </div>
              </div>)}
          </div>}
      </CardContent>
    </Card>;
}