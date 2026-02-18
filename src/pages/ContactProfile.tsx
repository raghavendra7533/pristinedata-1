import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Mail, Linkedin, Building2, MapPin, Phone, MessageCircle, Copy, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
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
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex items-start justify-between gap-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24 border-2 border-primary/20">
                <AvatarImage src={contact.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {getInitials(contact.name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{contact.name}</h1>
                  <Badge variant="secondary" className="text-xs">
                    {contact.title}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground mb-4 max-w-3xl">
                  {contact.headline}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${contact.email}`} className="hover:text-primary transition-colors">
                      {contact.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>{contact.company}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{contact.location}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
              <Button className="px-6">
                <Mail className="mr-2 h-4 w-4" />
                Message
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="contact" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="account">Account (Beta)</TabsTrigger>
            <TabsTrigger value="playbook">Opportunity Playbook</TabsTrigger>
          </TabsList>

          <TabsContent value="contact" className="space-y-4">
            <Card className="p-6">
              <Accordion type="multiple" defaultValue={["sales-openers", "objectives"]} className="w-full">
                {/* Sales Openers & Talking Points */}
                <AccordionItem value="sales-openers" className="border-b-2 border-primary/10">
                  <AccordionTrigger className="text-lg font-semibold">
                    <div className="flex items-center gap-2">
                      
                      Sales Openers
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <div className="space-y-4">
                      {/* Icebreakers */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <MessageCircle className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm font-medium text-foreground">Icebreakers</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {salesOpeners.icebreakers.map((opener, idx) => <button key={idx} onClick={() => setActiveOpener(activeOpener === opener ? null : opener)} className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${activeOpener === opener ? "bg-primary text-primary-foreground shadow-md" : "bg-muted/50 hover:bg-muted text-foreground"}`}>
                              <span className="line-clamp-1">{opener.slice(0, 60)}...</span>
                            </button>)}
                        </div>
                      </div>

                      {/* Expanded Opener */}
                      {activeOpener && <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border animate-in fade-in slide-in-from-top-2">
                          <p className="text-sm text-foreground leading-relaxed">{activeOpener}</p>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="default" onClick={() => handleCopyOpener(activeOpener)}>
                              <Copy className="h-3.5 w-3.5 mr-1.5" />
                              Copy
                            </Button>
                            <Button size="sm" variant="outline">
                              <Send className="h-3.5 w-3.5 mr-1.5" />
                              Use in Email
                            </Button>
                          </div>
                        </div>}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Strategic Objectives and Challenges */}
                <AccordionItem value="objectives">
                  <AccordionTrigger className="text-lg font-semibold">
                    Strategic Objectives and Challenges
                  </AccordionTrigger>
                  <AccordionContent className="space-y-6 pt-4">
                    <div>
                      <h4 className="font-semibold mb-3 text-foreground">Strategic Objectives:</h4>
                      <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                        {contact.objectives.map((obj, idx) => <li key={idx}>{obj}</li>)}
                      </ul>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-3 text-foreground">Challenges or Pain Points:</h4>
                      <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                        {contact.painPoints.map((pain, idx) => <li key={idx}>{pain}</li>)}
                      </ul>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-3 text-foreground">Rationale:</h4>
                      <p className="text-muted-foreground">{contact.rationale}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Social Summary */}
                <AccordionItem value="social-summary">
                  <AccordionTrigger className="text-lg font-semibold">
                    Social Summary
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-foreground">Recent Activity:</h4>
                      <p className="text-muted-foreground">{contact.socialSummary.recentActivity}</p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-2 text-foreground">Interests & Topics:</h4>
                      <div className="flex flex-wrap gap-2">
                        {contact.socialSummary.interests.map((interest, idx) => <Badge key={idx} variant="outline" className="px-3 py-1">
                            {interest}
                          </Badge>)}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-2 text-foreground">Engagement Style:</h4>
                      <p className="text-muted-foreground">{contact.socialSummary.engagementStyle}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Career Highlights & Industry Leadership */}
                <AccordionItem value="career-highlights">
                  <AccordionTrigger className="text-lg font-semibold">
                    Career Highlights & Industry Leadership
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-foreground">Key Achievements:</h4>
                      <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                        {contact.careerHighlights.highlights.map((highlight, idx) => <li key={idx}>{highlight}</li>)}
                      </ul>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-2 text-foreground">Industry Leadership:</h4>
                      <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                        {contact.careerHighlights.industryLeadership.map((item, idx) => <li key={idx}>{item}</li>)}
                      </ul>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-2 text-foreground">Awards & Recognition:</h4>
                      <div className="flex flex-wrap gap-2">
                        {contact.careerHighlights.awards.map((award, idx) => <Badge key={idx} variant="secondary" className="px-3 py-1">
                            {award}
                          </Badge>)}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Experience */}
                <AccordionItem value="experience">
                  <AccordionTrigger className="text-lg font-semibold">
                    Experience
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <div className="space-y-6">
                      {contact.experience.map((exp, idx) => <div key={idx} className="border-l-2 border-primary/20 pl-4">
                          <h4 className="font-semibold text-foreground">{exp.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <span className="font-medium">{exp.company}</span>
                            <span>•</span>
                            <span>{exp.duration}</span>
                          </div>
                          <p className="text-muted-foreground mt-2">{exp.description}</p>
                        </div>)}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Account information coming soon...</p>
            </Card>
          </TabsContent>

          <TabsContent value="playbook">
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Opportunity playbook coming soon...</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>;
};
export default ContactProfile;