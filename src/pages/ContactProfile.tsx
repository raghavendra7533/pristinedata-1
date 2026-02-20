import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
const ContactProfile = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const linkedinUrl = searchParams.get("linkedin") || "";
  const [activeOpener, setActiveOpener] = useState<string | null>(null);

  // Mock data - in real app, this would come from API based on LinkedIn URL
  const contact = {
    name: "Kyle Hollingsworth",
    title: "VP of Sales",
    headline: "Helping revenue teams compete and win in the age of Account Based Buying - We're Hiring!!!",
    email: "kyle.hollingsworth@6sense.com",
    phone: "+1 (555) 123-4567",
    linkedin: linkedinUrl || "https://www.linkedin.com/in/kyle-hollingsworth",
    avatar: "",
    company: "6sense",
    location: "San Francisco, CA",
    objectives: ["Increase adoption of AI-driven insights among sales teams", "Enhance customer engagement through personalized account-based marketing", "Drive revenue growth by optimizing the sales pipeline using predictive analytics"],
    painPoints: ["Challenge in integrating diverse data signals into actionable insights for sales teams", "Difficulty in ensuring user adoption of the predictive analytics platform", "Pressure to deliver measurable ROI from sales initiatives in a competitive landscape"],
    rationale: "As VP of Sales, Kyle needs to facilitate the use of 6sense's AI-driven tools to improve sales outcomes. The complexity of deploying a predictive analytics platform demands strong user adoption and training. In the IT and services industry, demonstrating clear ROI is critical to maintaining competitive advantage.",
    keywords: ["Account Based Marketing", "Predictive Analytics", "Sales Intelligence", "B2B Sales", "Revenue Operations", "AI-driven Insights"],
    talkingPoints: ["How 6sense helps sales teams prioritize high-value accounts using predictive analytics", "The impact of AI-driven insights on shortening sales cycles and improving win rates", "Best practices for integrating account-based marketing with sales operations", "ROI measurement frameworks for B2B sales technology investments"],
    experience: [{
      title: "VP of Sales",
      company: "6sense",
      duration: "2020 - Present",
      description: "Leading revenue teams in account-based strategies and predictive analytics adoption"
    }, {
      title: "Director of Sales",
      company: "Previous Company",
      duration: "2016 - 2020",
      description: "Built and scaled enterprise sales organization from $10M to $50M ARR"
    }],
    socialSummary: {
      recentActivity: "Active on LinkedIn with posts about B2B sales strategies and predictive analytics",
      interests: ["Revenue Operations", "AI in Sales", "Account-Based Marketing", "Sales Leadership"],
      engagementStyle: "Regularly shares industry insights and engages with sales technology content"
    },
    careerHighlights: {
      highlights: ["Grew revenue team from 15 to 85+ sales professionals over 3 years", "Architected ABM strategy that increased enterprise deal velocity by 40%", "Led successful expansion into EMEA and APAC markets"],
      industryLeadership: ["Featured speaker at SaaStr Annual 2023 on 'The Future of Revenue Operations'", "Published thought leadership in Harvard Business Review on predictive sales", "Advisory board member for RevOps Co-op community"],
      awards: ["Sales Leader of the Year 2022 - AA-ISP", "Top 25 Revenue Leaders - Pavilion"]
    }
  };
  const salesOpeners = {
    icebreakers: ["I noticed 6sense recently expanded their AI capabilities - how has that shift impacted your team's approach to account prioritization?", "Congratulations on the recent product launch! With that growth, I imagine scaling revenue operations has become a key focus.", "I saw your post about predictive analytics adoption - your insights on change management were spot on."]
  };
  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };
  const handleCopyOpener = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };
  return <div className="min-h-full bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4 -ml-2">
            <Icon icon="solar:arrow-left-linear" className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex items-start justify-between gap-6">
            <div className="flex items-start gap-5">
              <Avatar className="h-20 w-20 border-2 border-primary/20 rounded-xl">
                <AvatarImage src={contact.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-violet-600 text-white text-xl rounded-xl">
                  {getInitials(contact.name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-xl font-semibold text-foreground">{contact.name}</h1>
                  <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wide bg-primary/10 text-primary border border-primary/20">
                    {contact.title}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-3 max-w-2xl line-clamp-2">
                  {contact.headline}
                </p>

                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    <Icon icon="solar:letter-linear" className="h-3.5 w-3.5" />
                    {contact.email}
                  </a>
                  <span className="flex items-center gap-1.5">
                    <Icon icon="solar:phone-linear" className="h-3.5 w-3.5" />
                    {contact.phone}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Icon icon="solar:buildings-2-linear" className="h-3.5 w-3.5" />
                    {contact.company}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Icon icon="solar:map-point-linear" className="h-3.5 w-3.5" />
                    {contact.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <Button variant="outline" size="icon" asChild className="h-9 w-9">
                <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                  <Icon icon="mdi:linkedin" className="h-4 w-4" />
                </a>
              </Button>
              <Button size="sm">
                <Icon icon="solar:letter-linear" className="mr-2 h-4 w-4" />
                Message
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs defaultValue="contact" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="contact" className="gap-2">
              <Icon icon="solar:user-linear" className="h-4 w-4" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="account" className="gap-2">
              <Icon icon="solar:buildings-2-linear" className="h-4 w-4" />
              Account (Beta)
            </TabsTrigger>
            <TabsTrigger value="playbook" className="gap-2">
              <Icon icon="solar:bolt-linear" className="h-4 w-4" />
              Opportunity Playbook
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <Accordion type="multiple" defaultValue={["sales-openers", "objectives"]} className="w-full">
                  {/* Sales Openers & Talking Points */}
                  <AccordionItem value="sales-openers" className="border-b border-border">
                    <AccordionTrigger className="text-base font-semibold hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Icon icon="solar:chat-round-dots-linear" className="h-5 w-5 text-primary" />
                        Sales Openers
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <div className="space-y-4">
                        {/* Icebreakers */}
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Icon icon="solar:chat-line-linear" className="h-4 w-4 text-emerald-500" />
                            <span className="text-sm font-medium text-foreground">Icebreakers</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {salesOpeners.icebreakers.map((opener, idx) => <button key={idx} onClick={() => setActiveOpener(activeOpener === opener ? null : opener)} className={cn("text-left px-3 py-2 rounded-lg text-sm transition-all", activeOpener === opener ? "bg-primary text-primary-foreground shadow-md" : "bg-muted/50 hover:bg-muted text-foreground")}>
                                <span className="line-clamp-1">{opener.slice(0, 60)}...</span>
                              </button>)}
                          </div>
                        </div>

                        {/* Expanded Opener */}
                        {activeOpener && <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border animate-in fade-in slide-in-from-top-2">
                            <p className="text-sm text-foreground leading-relaxed">{activeOpener}</p>
                            <div className="flex gap-2 mt-3">
                              <Button size="sm" variant="default" onClick={() => handleCopyOpener(activeOpener)}>
                                <Icon icon="solar:copy-linear" className="h-3.5 w-3.5 mr-1.5" />
                                Copy
                              </Button>
                              <Button size="sm" variant="outline">
                                <Icon icon="solar:plain-2-linear" className="h-3.5 w-3.5 mr-1.5" />
                                Use in Email
                              </Button>
                            </div>
                          </div>}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Strategic Objectives and Challenges */}
                  <AccordionItem value="objectives" className="border-b border-border">
                    <AccordionTrigger className="text-base font-semibold hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Icon icon="solar:target-linear" className="h-5 w-5 text-primary" />
                        Strategic Objectives and Challenges
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      <div>
                        <h4 className="font-semibold mb-3 text-foreground text-sm flex items-center gap-2">
                          <Icon icon="solar:flag-linear" className="h-4 w-4 text-emerald-500" />
                          Strategic Objectives
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground ml-6">
                          {contact.objectives.map((obj, idx) => <li key={idx} className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>{obj}</span>
                          </li>)}
                        </ul>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-semibold mb-3 text-foreground text-sm flex items-center gap-2">
                          <Icon icon="solar:danger-triangle-linear" className="h-4 w-4 text-amber-500" />
                          Challenges or Pain Points
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground ml-6">
                          {contact.painPoints.map((pain, idx) => <li key={idx} className="flex items-start gap-2">
                            <span className="text-amber-500 mt-0.5">•</span>
                            <span>{pain}</span>
                          </li>)}
                        </ul>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-semibold mb-3 text-foreground text-sm flex items-center gap-2">
                          <Icon icon="solar:lightbulb-linear" className="h-4 w-4 text-violet-500" />
                          Rationale
                        </h4>
                        <p className="text-sm text-muted-foreground ml-6">{contact.rationale}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Social Summary */}
                  <AccordionItem value="social-summary" className="border-b border-border">
                    <AccordionTrigger className="text-base font-semibold hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Icon icon="solar:share-circle-linear" className="h-5 w-5 text-primary" />
                        Social Summary
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div>
                        <h4 className="font-semibold mb-2 text-foreground text-sm">Recent Activity</h4>
                        <p className="text-sm text-muted-foreground">{contact.socialSummary.recentActivity}</p>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-semibold mb-2 text-foreground text-sm">Interests & Topics</h4>
                        <div className="flex flex-wrap gap-2">
                          {contact.socialSummary.interests.map((interest, idx) => <Badge key={idx} variant="outline" className="text-xs">
                              {interest}
                            </Badge>)}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-semibold mb-2 text-foreground text-sm">Engagement Style</h4>
                        <p className="text-sm text-muted-foreground">{contact.socialSummary.engagementStyle}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Career Highlights & Industry Leadership */}
                  <AccordionItem value="career-highlights" className="border-b border-border">
                    <AccordionTrigger className="text-base font-semibold hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Icon icon="solar:medal-ribbon-star-linear" className="h-5 w-5 text-primary" />
                        Career Highlights & Industry Leadership
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div>
                        <h4 className="font-semibold mb-2 text-foreground text-sm">Key Achievements</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          {contact.careerHighlights.highlights.map((highlight, idx) => <li key={idx} className="flex items-start gap-2">
                            <Icon icon="solar:check-circle-linear" className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>{highlight}</span>
                          </li>)}
                        </ul>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-semibold mb-2 text-foreground text-sm">Industry Leadership</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          {contact.careerHighlights.industryLeadership.map((item, idx) => <li key={idx} className="flex items-start gap-2">
                            <Icon icon="solar:star-linear" className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>)}
                        </ul>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-semibold mb-2 text-foreground text-sm">Awards & Recognition</h4>
                        <div className="flex flex-wrap gap-2">
                          {contact.careerHighlights.awards.map((award, idx) => <Badge key={idx} variant="secondary" className="text-xs bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                              <Icon icon="solar:cup-star-linear" className="h-3 w-3 mr-1" />
                              {award}
                            </Badge>)}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Experience */}
                  <AccordionItem value="experience" className="border-none">
                    <AccordionTrigger className="text-base font-semibold hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Icon icon="solar:case-linear" className="h-5 w-5 text-primary" />
                        Experience
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <div className="space-y-4">
                        {contact.experience.map((exp, idx) => <div key={idx} className="border-l-2 border-primary/30 pl-4">
                            <h4 className="font-semibold text-sm text-foreground">{exp.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <span className="font-medium text-primary">{exp.company}</span>
                              <span>•</span>
                              <span>{exp.duration}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">{exp.description}</p>
                          </div>)}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Icon icon="solar:buildings-2-linear" className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Account Intelligence</h3>
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  Company insights, org charts, and account health metrics coming soon.
                </p>
                <Badge variant="secondary" className="mt-4 text-xs">Beta</Badge>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="playbook" className="space-y-6">
            {/* Playbook Header Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <Icon icon="solar:play-circle-linear" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Active</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon icon="solar:graph-up-linear" className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Stage</p>
                      <p className="text-sm font-semibold">Discovery</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <Icon icon="solar:dollar-linear" className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Deal Value</p>
                      <p className="text-sm font-semibold">$125,000</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Icon icon="solar:calendar-linear" className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Expected Close</p>
                      <p className="text-sm font-semibold">Q2 2025</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Items */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Icon icon="solar:checklist-linear" className="h-5 w-5 text-primary" />
                  Next Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { task: "Schedule discovery call with technical team", priority: "high", due: "Today" },
                    { task: "Send ROI calculator and case studies", priority: "medium", due: "Tomorrow" },
                    { task: "Follow up on security questionnaire", priority: "medium", due: "This week" },
                    { task: "Prepare executive presentation", priority: "low", due: "Next week" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <div className={cn(
                        "w-2 h-2 rounded-full flex-shrink-0",
                        item.priority === "high" && "bg-red-500",
                        item.priority === "medium" && "bg-amber-500",
                        item.priority === "low" && "bg-emerald-500"
                      )} />
                      <span className="text-sm flex-1">{item.task}</span>
                      <Badge variant="outline" className="text-[10px]">{item.due}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Deal Timeline */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Icon icon="solar:history-linear" className="h-5 w-5 text-primary" />
                  Deal Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { date: "Feb 18, 2025", event: "Discovery call completed", type: "meeting", notes: "Discussed pain points around data integration" },
                    { date: "Feb 15, 2025", event: "Initial outreach sent", type: "email", notes: "Personalized email based on recent LinkedIn post" },
                    { date: "Feb 12, 2025", event: "Lead added to pipeline", type: "system", notes: "Matched ICP criteria from 6sense intent data" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          item.type === "meeting" && "bg-emerald-500/10",
                          item.type === "email" && "bg-blue-500/10",
                          item.type === "system" && "bg-slate-500/10"
                        )}>
                          <Icon
                            icon={item.type === "meeting" ? "solar:video-conference-linear" : item.type === "email" ? "solar:letter-linear" : "solar:bolt-linear"}
                            className={cn(
                              "h-4 w-4",
                              item.type === "meeting" && "text-emerald-600 dark:text-emerald-400",
                              item.type === "email" && "text-blue-600 dark:text-blue-400",
                              item.type === "system" && "text-slate-600 dark:text-slate-400"
                            )}
                          />
                        </div>
                        {idx < 2 && <div className="w-px h-full bg-border mt-2" />}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{item.event}</span>
                          <span className="text-xs text-muted-foreground">{item.date}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{item.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Competitive Intel & Talking Points */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Icon icon="solar:shield-check-linear" className="h-5 w-5 text-primary" />
                    Competitive Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-[10px]">Competitor</Badge>
                        <span className="text-sm font-medium">Gong</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Currently evaluating Gong for conversation intelligence. Key differentiator: our predictive analytics capabilities.</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-[10px]">Objection</Badge>
                        <span className="text-sm font-medium">Integration Concerns</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Worried about CRM integration complexity. Emphasize our native Salesforce connector.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Icon icon="solar:chat-round-dots-linear" className="h-5 w-5 text-primary" />
                    Key Talking Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {contact.talkingPoints.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                        <Icon icon="solar:chat-line-linear" className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{point}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleCopyOpener(point)}>
                          <Icon icon="solar:copy-linear" className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>;
};
export default ContactProfile;