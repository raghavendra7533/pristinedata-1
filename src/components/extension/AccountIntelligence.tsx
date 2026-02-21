import { Icon } from "@iconify/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const AccountIntelligence = () => {
  const companyData = {
    name: "Pristine Data AI",
    domain: "pristinedata.ai",
    description: "A fast-growing B2B SaaS company providing AI-powered sales intelligence and data enrichment solutions. The platform helps enterprise sales teams identify, engage, and convert high-value prospects through advanced data analytics and personalization.",
    size: "50-100 employees",
    industry: "B2B SaaS",
    headquarters: "San Mateo, CA",
    founded: "2021",
    funding: "Series A",
    fundingAmount: "$15M",
    techStack: ["HubSpot", "Snowflake", "AWS", "React", "Python"]
  };

  const objectives = [
    { text: "Transform enterprise sales with AI-powered intelligence platform", priority: "high" },
    { text: "Achieve category leadership in sales tech space", priority: "high" },
    { text: "Scale to $100M ARR within 24 months", priority: "medium" },
    { text: "Build world-class go-to-market organization", priority: "medium" }
  ];

  const challenges = [
    { text: "Competitive market with established players", severity: "high" },
    { text: "Need for rapid product innovation cycle", severity: "medium" },
    { text: "Scaling sales organization efficiently", severity: "medium" },
    { text: "Data quality and integration complexity", severity: "low" }
  ];

  const signals = [
    { type: "hiring", label: "Hiring Signal", description: "5 new sales positions posted this month", icon: "solar:users-group-two-rounded-linear", color: "emerald" },
    { type: "funding", label: "Funding News", description: "Series A announced 3 months ago", icon: "solar:wallet-money-linear", color: "violet" },
    { type: "tech", label: "Tech Change", description: "Recently adopted Snowflake", icon: "solar:programming-linear", color: "blue" }
  ];

  const metrics = [
    { label: "Employee Growth", value: "32%", trend: "up", period: "YoY" },
    { label: "Web Traffic", value: "125K", trend: "up", period: "monthly" },
    { label: "Social Engagement", value: "High", trend: "stable", period: "" }
  ];

  return (
    <div className="space-y-4">
      {/* Company Overview Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center overflow-hidden">
                <img
                  src={`https://logo.clearbit.com/${companyData.domain}`}
                  alt={companyData.name}
                  className="w-full h-full object-contain p-1.5"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <span className="hidden text-lg font-semibold text-muted-foreground">
                  {companyData.name.charAt(0)}
                </span>
              </div>
              <div>
                <CardTitle className="text-base">{companyData.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{companyData.domain}</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              {companyData.funding}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {companyData.description}
          </p>

          {/* Company Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50">
              <Icon icon="solar:users-group-rounded-linear" className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] text-muted-foreground">Company Size</p>
                <p className="text-xs font-medium">{companyData.size}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50">
              <Icon icon="solar:tag-linear" className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] text-muted-foreground">Industry</p>
                <p className="text-xs font-medium">{companyData.industry}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50">
              <Icon icon="solar:map-point-linear" className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] text-muted-foreground">Headquarters</p>
                <p className="text-xs font-medium">{companyData.headquarters}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50">
              <Icon icon="solar:calendar-linear" className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] text-muted-foreground">Founded</p>
                <p className="text-xs font-medium">{companyData.founded}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Tech Stack */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Tech Stack</p>
            <div className="flex flex-wrap gap-1.5">
              {companyData.techStack.map((tech, idx) => (
                <Badge key={idx} variant="outline" className="text-[10px] font-normal">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Intent Signals */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Icon icon="solar:bolt-bold" className="h-4 w-4 text-amber-500" />
            Intent Signals
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Icon icon="solar:info-circle-linear" className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">Real-time buying signals detected from hiring patterns, funding news, and technology changes</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {signals.map((signal, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border",
                  signal.color === "emerald" && "bg-emerald-500/5 border-emerald-500/20",
                  signal.color === "violet" && "bg-violet-500/5 border-violet-500/20",
                  signal.color === "blue" && "bg-blue-500/5 border-blue-500/20"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                  signal.color === "emerald" && "bg-emerald-500/10",
                  signal.color === "violet" && "bg-violet-500/10",
                  signal.color === "blue" && "bg-blue-500/10"
                )}>
                  <Icon
                    icon={signal.icon}
                    className={cn(
                      "h-4 w-4",
                      signal.color === "emerald" && "text-emerald-600 dark:text-emerald-400",
                      signal.color === "violet" && "text-violet-600 dark:text-violet-400",
                      signal.color === "blue" && "text-blue-600 dark:text-blue-400"
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium">{signal.label}</p>
                  <p className="text-xs text-muted-foreground">{signal.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Growth Metrics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Icon icon="solar:chart-2-bold" className="h-4 w-4 text-primary" />
            Growth Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {metrics.map((metric, idx) => (
              <div key={idx} className="text-center p-3 rounded-lg bg-muted/50">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className="text-lg font-bold">{metric.value}</span>
                  {metric.trend === "up" && (
                    <Icon icon="solar:arrow-up-linear" className="h-4 w-4 text-emerald-500" />
                  )}
                  {metric.trend === "down" && (
                    <Icon icon="solar:arrow-down-linear" className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground">{metric.label}</p>
                {metric.period && (
                  <p className="text-[9px] text-muted-foreground/70">{metric.period}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strategic Objectives */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Icon icon="solar:flag-bold" className="h-4 w-4 text-emerald-500" />
            Strategic Objectives
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Icon icon="solar:info-circle-linear" className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">Strategic priorities identified from company announcements, funding news, and hiring patterns</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {objectives.map((obj, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0",
                  obj.priority === "high" && "bg-emerald-500",
                  obj.priority === "medium" && "bg-amber-500",
                  obj.priority === "low" && "bg-slate-400"
                )} />
                <span className="text-sm text-foreground">{obj.text}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Key Challenges */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Icon icon="solar:danger-triangle-bold" className="h-4 w-4 text-amber-500" />
            Key Challenges
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Icon icon="solar:info-circle-linear" className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">Organizational challenges based on company stage, market position, and competitive landscape</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {challenges.map((challenge, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0",
                  challenge.severity === "high" && "bg-red-500",
                  challenge.severity === "medium" && "bg-amber-500",
                  challenge.severity === "low" && "bg-slate-400"
                )} />
                <span className="text-sm text-foreground">{challenge.text}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Competitive Landscape */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Icon icon="solar:shield-check-bold" className="h-4 w-4 text-primary" />
            Competitive Landscape
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Apollo.io", strength: 85, position: "Market Leader" },
              { name: "ZoomInfo", strength: 90, position: "Enterprise Focus" },
              { name: "Lusha", strength: 65, position: "SMB Focus" }
            ].map((competitor, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">{competitor.name}</span>
                  <Badge variant="outline" className="text-[9px]">{competitor.position}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={competitor.strength} className="h-1.5 flex-1" />
                  <span className="text-[10px] text-muted-foreground w-8">{competitor.strength}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent News */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Icon icon="solar:document-text-bold" className="h-4 w-4 text-primary" />
            Recent News & Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { title: "Series A Funding Announced", date: "2 months ago", source: "TechCrunch" },
              { title: "New AI Feature Launch", date: "3 weeks ago", source: "Company Blog" },
              { title: "Partnership with Snowflake", date: "1 month ago", source: "PR Newswire" }
            ].map((news, idx) => (
              <div key={idx} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <Icon icon="solar:link-linear" className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium group-hover:text-primary transition-colors">{news.title}</p>
                  <p className="text-[10px] text-muted-foreground">{news.source} · {news.date}</p>
                </div>
                <Icon icon="solar:arrow-right-up-linear" className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
