import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Building2, Users, DollarSign, MapPin, Sparkles, Calendar, FileText, Mail, MessageSquare, RefreshCw, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { toast } from "sonner";

// Mock data
const mockAccount = {
  id: "acc-1",
  name: "Acme Robotics",
  domain: "acmerobotics.com",
  logo: "🤖",
  arr: "$12M",
  employees: "450",
  hq: "San Francisco, CA",
  industry: "Industrial Automation",
  techStack: ["Salesforce", "HubSpot", "Slack", "AWS", "PostgreSQL"],
};

const mockNews = [
  {
    id: "n1",
    title: "Acme Robotics raises $25M Series B",
    source: "TechCrunch",
    publishedAt: "2 days ago",
    summary: "Leading industrial automation firm secures funding to expand AI-powered robotics platform.",
  },
  {
    id: "n2",
    title: "Partnership announced with major automotive manufacturer",
    source: "Business Wire",
    publishedAt: "1 week ago",
    summary: "Strategic partnership to deploy automation solutions across manufacturing facilities.",
  },
  {
    id: "n3",
    title: "New VP of Engineering appointed",
    source: "LinkedIn",
    publishedAt: "2 weeks ago",
    summary: "Former Tesla executive joins to lead technical innovation initiatives.",
  },
];

const mockCompetitors = [
  { name: "RoboTech Inc", positioning: "Lower cost, limited AI capabilities", strength: "Price", weakness: "Innovation" },
  { name: "AutoMate Systems", positioning: "Enterprise focus, legacy platform", strength: "Market share", weakness: "Modern features" },
  { name: "SmartBots Co", positioning: "Emerging player, cloud-first", strength: "Technology", weakness: "Scale" },
];

const mockObjectives = [
  { persona: "Economic Buyer", text: "Reduce operational costs by 30%", confidence: 0.9 },
  { persona: "Technical Evaluator", text: "Modernize data infrastructure", confidence: 0.85 },
  { persona: "Champion", text: "Improve team productivity and insights", confidence: 0.95 },
];

const mockPainPoints = [
  { persona: "Economic Buyer", text: "High cost of data maintenance", confidence: 0.9 },
  { persona: "Technical Evaluator", text: "Legacy systems creating data silos", confidence: 0.85 },
  { persona: "Champion", text: "Manual data cleaning taking too much time", confidence: 0.8 },
];

const mockDiscoveryQuestions = [
  { category: "Current State", question: "How are you currently managing your customer data quality?", priority: "high" },
  { category: "Pain Points", question: "What's the biggest challenge your team faces with data accuracy?", priority: "high" },
  { category: "Process", question: "Who owns data quality decisions today?", priority: "medium" },
  { category: "Tech Stack", question: "How does your current CRM integration work?", priority: "medium" },
  { category: "Timeline", question: "What's driving the urgency for a solution now?", priority: "high" },
];

const mockStoryboardBlocks = [
  {
    id: "sb1",
    title: "The Data Quality Problem",
    goal: "Establish credibility on the pain",
    feature: "Live Data Audit",
    steps: ["Show their actual data quality score", "Highlight specific issues", "Quantify business impact"],
    proof: "Case study: Similar company improved by 40%",
  },
  {
    id: "sb2",
    title: "Automated Enrichment",
    goal: "Demonstrate the 'magic moment'",
    feature: "One-Click Enrichment",
    steps: ["Upload sample CSV", "Watch real-time enrichment", "Compare before/after"],
    proof: "Live data from 50+ premium sources",
  },
  {
    id: "sb3",
    title: "Integration & Scale",
    goal: "Address technical concerns",
    feature: "CRM Integration",
    steps: ["Show Salesforce bidirectional sync", "Demonstrate real-time updates", "Highlight security & compliance"],
    proof: "SOC 2, 99.9% uptime SLA",
  },
];

const personas = ["Economic Buyer", "Technical Evaluator", "Champion", "Security", "Procurement"];

export default function SCWorkspace() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accountId = searchParams.get("account") || "acc-1";
  
  const [selectedPersona, setSelectedPersona] = useState<string>("Economic Buyer");
  const [selectedMeeting, setSelectedMeeting] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("brief");
  const [liveNotes, setLiveNotes] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [followUpTone, setFollowUpTone] = useState("consultative");

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast.info("Refreshing intelligence...", {
      description: "Pulling the latest signals (≤30s)",
    });
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Intelligence updated", {
        description: "Latest company news and insights loaded",
      });
    }, 2000);
  };

  const handlePrepMeeting = () => {
    toast.success("Meeting prep ready!", {
      description: "Brief, plan, and storyboard hydrated for your upcoming call",
    });
  };

  const handleCopyToDeck = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard", {
      description: "Ready to paste into your deck",
    });
  };

  const handlePromoteToSCPack = () => {
    toast.info("Generating SC Pack...", {
      description: "Creating Demo Storyboard, Integration Sketch, and Security Pack",
    });
    setTimeout(() => {
      toast.success("SC Pack ready!", {
        description: "All materials generated and ready to view",
      });
    }, 2000);
  };

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <section className="bg-gradient-hero px-4 sm:px-6 py-4 sticky top-0 z-20 border-b">
        <div className="max-w-[1920px] mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/account-search")}
                className="gap-2 text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="hidden sm:flex items-center gap-2 text-sm text-white/70">
                <span>Sales Intelligence</span>
                <span>/</span>
                <span>SC Workspace</span>
                <span>/</span>
                <span className="text-white font-medium">{mockAccount.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button
                size="sm"
                onClick={handlePrepMeeting}
                className="gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Prep Meeting
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Three-Column Layout */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN - Account Context & Selectors */}
          <div className="lg:col-span-3 space-y-4">
            {/* Account Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="text-4xl">{mockAccount.logo}</div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{mockAccount.name}</CardTitle>
                    <CardDescription className="text-xs truncate">{mockAccount.domain}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{mockAccount.arr}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{mockAccount.employees}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs truncate">{mockAccount.hq}</span>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-medium mb-2">Tech Stack</p>
                  <div className="flex flex-wrap gap-1">
                    {mockAccount.techStack.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Persona Selector */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Persona Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {personas.map((persona) => (
                    <Badge
                      key={persona}
                      variant={selectedPersona === persona ? "default" : "outline"}
                      className="cursor-pointer text-xs"
                      onClick={() => setSelectedPersona(persona)}
                    >
                      {persona}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Meeting Selector */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Upcoming Meeting</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select value={selectedMeeting || ""} onValueChange={setSelectedMeeting}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a meeting..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meet-1">Tomorrow 2PM - Discovery Call</SelectItem>
                    <SelectItem value="meet-2">Friday 10AM - Technical Deep Dive</SelectItem>
                    <SelectItem value="meet-3">Next Week - Executive Review</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-2">
              <Button
                variant="default"
                className="w-full gap-2"
                onClick={handlePromoteToSCPack}
              >
                <Sparkles className="h-4 w-4" />
                Promote to SC Pack
              </Button>
              <Button
                variant="outline"
                className="w-full gap-2"
              >
                <FileText className="h-4 w-4" />
                Export Brief
              </Button>
            </div>
          </div>

          {/* CENTER COLUMN - Tabs */}
          <div className="lg:col-span-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="brief">Brief</TabsTrigger>
                <TabsTrigger value="value">Value Story</TabsTrigger>
                <TabsTrigger value="discovery">Discovery</TabsTrigger>
                <TabsTrigger value="demo">Demo</TabsTrigger>
              </TabsList>

              {/* Brief Tab */}
              <TabsContent value="brief" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Company Overview</CardTitle>
                    <CardDescription>Latest intelligence and market position</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Industry</h4>
                      <p className="text-sm text-muted-foreground">{mockAccount.industry}</p>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Recent News</h4>
                      <div className="space-y-3">
                        {mockNews.map((news) => (
                          <HoverCard key={news.id}>
                            <HoverCardTrigger asChild>
                              <div className="cursor-pointer group">
                                <div className="flex items-start justify-between gap-2">
                                  <h5 className="text-sm font-medium group-hover:text-primary transition-colors">
                                    {news.title}
                                  </h5>
                                  <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {news.source}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {news.publishedAt}
                                  </span>
                                </div>
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                              <p className="text-sm">{news.summary}</p>
                            </HoverCardContent>
                          </HoverCard>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Competitors</h4>
                      <div className="space-y-2">
                        {mockCompetitors.map((comp) => (
                          <HoverCard key={comp.name}>
                            <HoverCardTrigger asChild>
                              <div className="flex items-center gap-2 cursor-pointer">
                                <Badge variant="secondary">{comp.name}</Badge>
                                <span className="text-xs text-muted-foreground">
                                  {comp.positioning}
                                </span>
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent>
                              <div className="space-y-2">
                                <div>
                                  <span className="text-xs font-semibold">Strength: </span>
                                  <span className="text-xs text-muted-foreground">{comp.strength}</span>
                                </div>
                                <div>
                                  <span className="text-xs font-semibold">Weakness: </span>
                                  <span className="text-xs text-muted-foreground">{comp.weakness}</span>
                                </div>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Value Story Tab */}
              <TabsContent value="value" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Value Story</CardTitle>
                        <CardDescription>Persona-aware objectives and narrative</CardDescription>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {selectedPersona}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Strategic Objectives</h4>
                      <div className="space-y-2">
                        {mockObjectives
                          .filter((obj) => obj.persona === selectedPersona)
                          .map((obj, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <div className="flex-1">
                                <p className="text-sm">{obj.text}</p>
                              </div>
                              <Badge
                                variant="secondary"
                                className="text-xs"
                              >
                                {Math.round(obj.confidence * 100)}% confidence
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Pain Points</h4>
                      <div className="space-y-2">
                        {mockPainPoints
                          .filter((pain) => pain.persona === selectedPersona)
                          .map((pain, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <div className="flex-1">
                                <p className="text-sm">{pain.text}</p>
                              </div>
                              <Badge
                                variant="secondary"
                                className="text-xs"
                              >
                                {Math.round(pain.confidence * 100)}% confidence
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </div>
                    <Separator />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleCopyToDeck("Value Story content")}
                      >
                        <Copy className="h-3 w-3" />
                        Copy to Deck
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleCopyToDeck("Value Story email")}
                      >
                        <Mail className="h-3 w-3" />
                        Copy to Email
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Discovery Plan Tab */}
              <TabsContent value="discovery" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Discovery Plan</CardTitle>
                    <CardDescription>Key questions and validation points</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockDiscoveryQuestions.map((q, idx) => (
                        <div key={idx} className="flex items-start justify-between gap-3 p-3 rounded-lg border">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {q.category}
                              </Badge>
                              <Badge
                                variant={q.priority === "high" ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {q.priority}
                              </Badge>
                            </div>
                            <p className="text-sm">{q.question}</p>
                          </div>
                          <Button size="sm" variant="ghost">
                            Add to Agenda
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Demo Storyboard Tab */}
              <TabsContent value="demo" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Demo Storyboard</CardTitle>
                    <CardDescription>Show, tell, prove sequence</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockStoryboardBlocks.map((block, idx) => (
                        <Card key={block.id}>
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-base">{idx + 1}. {block.title}</CardTitle>
                                <CardDescription className="text-xs">{block.goal}</CardDescription>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {block.feature}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <h5 className="text-xs font-semibold mb-2">Steps</h5>
                              <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                                {block.steps.map((step, i) => (
                                  <li key={i}>{step}</li>
                                ))}
                              </ol>
                            </div>
                            <div>
                              <h5 className="text-xs font-semibold mb-1">Proof</h5>
                              <p className="text-sm text-muted-foreground">{block.proof}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* RIGHT COLUMN - Live Notes & Follow-up */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="sticky top-24">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Live Notes</CardTitle>
                <CardDescription className="text-xs">Use /action, /risk, /nextstep</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ScrollArea className="h-64">
                  <Textarea
                    placeholder="Type your notes here... Use slash commands for quick tags"
                    value={liveNotes}
                    onChange={(e) => setLiveNotes(e.target.value)}
                    className="min-h-60 resize-none"
                  />
                </ScrollArea>
                <p className="text-xs text-muted-foreground">
                  Auto-saves • {new Date().toLocaleTimeString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Follow-up Generator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-xs font-medium mb-2 block">Tone</label>
                  <Select value={followUpTone} onValueChange={setFollowUpTone}>
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="concise">Concise</SelectItem>
                      <SelectItem value="consultative">Consultative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full gap-2 justify-start">
                    <Mail className="h-3 w-3" />
                    Email Recap
                  </Button>
                  <Button variant="outline" size="sm" className="w-full gap-2 justify-start">
                    <MessageSquare className="h-3 w-3" />
                    LinkedIn Blurb
                  </Button>
                  <Button variant="outline" size="sm" className="w-full gap-2 justify-start">
                    <MessageSquare className="h-3 w-3" />
                    Slack Summary
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
