import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export const AccountIntelligence = () => {
  const objectives = [
    "Transform enterprise sales with AI-powered intelligence platform",
    "Achieve category leadership in sales tech space",
    "Scale to $100M ARR within 24 months",
    "Build world-class go-to-market organization"
  ];

  const challenges = [
    "Competitive market with established players",
    "Need for rapid product innovation cycle",
    "Scaling sales organization efficiently",
    "Data quality and integration complexity"
  ];

  return (
    <div className="space-y-4">
      <Accordion type="multiple" defaultValue={["overview", "account-objectives"]} className="space-y-4">
        {/* Company Overview */}
        <AccordionItem value="overview" className="border-0">
          <Card className="rounded-2xl border-0 shadow-card bg-card border-l-4 border-l-secondary">
            <CardHeader className="pb-3">
              <AccordionTrigger className="hover:no-underline py-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <CardTitle className="text-base font-semibold text-left">
                    Company Overview
                  </CardTitle>
                </div>
              </AccordionTrigger>
            </CardHeader>
            <AccordionContent>
              <CardContent className="space-y-4 pt-2">
                <p className="text-sm text-foreground leading-relaxed">
                  Pristine Data AI is a fast-growing B2B SaaS company providing AI-powered sales intelligence 
                  and data enrichment solutions. The platform helps enterprise sales teams identify, engage, 
                  and convert high-value prospects through advanced data analytics and personalization.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Company Size</div>
                    <div className="text-sm font-medium">50-100 employees</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Industry</div>
                    <div className="text-sm font-medium">B2B SaaS</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Headquarters</div>
                    <div className="text-sm font-medium">San Mateo, CA</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Founded</div>
                    <div className="text-sm font-medium">2021</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Tech Stack</div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="rounded-full">HubSpot</Badge>
                    <Badge variant="secondary" className="rounded-full">Snowflake</Badge>
                    <Badge variant="secondary" className="rounded-full">AWS</Badge>
                    <Badge variant="secondary" className="rounded-full">React</Badge>
                  </div>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Strategic Objectives */}
        <AccordionItem value="account-objectives" className="border-0">
          <Card className="rounded-2xl border-0 shadow-card bg-card border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <AccordionTrigger className="hover:no-underline py-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <CardTitle className="text-base font-semibold text-left">
                    Strategic Objectives & Challenges
                  </CardTitle>
                </div>
              </AccordionTrigger>
            </CardHeader>
            <AccordionContent>
              <CardContent className="space-y-4 pt-2">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-semibold text-foreground">Company Objectives</h4>
                    <HoverCard>
                      <HoverCardTrigger>
                        <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                      </HoverCardTrigger>
                      <HoverCardContent className="w-72 text-xs">
                        Strategic priorities identified from company announcements, funding news, and hiring patterns
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                  <ul className="space-y-2">
                    {objectives.map((obj, i) => (
                      <li key={i} className="flex gap-2 text-sm text-foreground">
                        <span className="text-primary mt-1">•</span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-semibold text-foreground">Key Challenges</h4>
                    <HoverCard>
                      <HoverCardTrigger>
                        <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                      </HoverCardTrigger>
                      <HoverCardContent className="w-72 text-xs">
                        Organizational challenges based on company stage, market position, and competitive landscape
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                  <ul className="space-y-2">
                    {challenges.map((challenge, i) => (
                      <li key={i} className="flex gap-2 text-sm text-foreground">
                        <span className="text-destructive mt-1">•</span>
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
