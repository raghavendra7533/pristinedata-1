import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export const ContactIntelligence = () => {
  const objectives = [
    "Accelerate revenue growth through AI-driven GTM automation",
    "Reduce customer acquisition costs via lifecycle optimization",
    "Expand enterprise market share in financial services sector",
    "Build scalable data infrastructure for predictive analytics"
  ];

  const challenges = [
    "Integration complexity with legacy CRM systems",
    "Data quality and enrichment at scale",
    "Competitive pressure from established players",
    "Resource constraints in engineering team"
  ];

  const talkingPoints = [
    "Proven track record scaling B2B SaaS from 0 to 50M ARR",
    "Deep expertise in data enrichment and AI/ML applications",
    "Strong relationships with enterprise buyers in tech sector",
    "Recent success implementing Snowflake + HubSpot stack",
    "Interest in modern GTM tools and automation platforms",
    "Active thought leader on LinkedIn (4K+ followers)"
  ];

  return (
    <div className="space-y-4">
      <Accordion type="multiple" defaultValue={["objectives", "talking-points"]} className="space-y-4">
        {/* Strategic Objectives and Pain Points */}
        <AccordionItem value="objectives" className="border-0">
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
                    Strategic Objectives and Pain Points
                  </CardTitle>
                </div>
              </AccordionTrigger>
            </CardHeader>
            <AccordionContent>
              <CardContent className="space-y-4 pt-2">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-semibold text-foreground">Objectives</h4>
                    <HoverCard>
                      <HoverCardTrigger>
                        <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                      </HoverCardTrigger>
                      <HoverCardContent className="w-72 text-xs">
                        AI-identified strategic objectives based on role, company stage, and recent activities
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
                    <h4 className="text-sm font-semibold text-foreground">Challenges</h4>
                    <HoverCard>
                      <HoverCardTrigger>
                        <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                      </HoverCardTrigger>
                      <HoverCardContent className="w-72 text-xs">
                        Pain points inferred from company signals and industry context
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

        {/* Talking Points */}
        <AccordionItem value="talking-points" className="border-0">
          <Card className="rounded-2xl border-0 shadow-card bg-card border-l-4 border-l-accent">
            <CardHeader className="pb-3">
              <AccordionTrigger className="hover:no-underline py-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <CardTitle className="text-base font-semibold text-left">
                    Talking Points
                  </CardTitle>
                </div>
              </AccordionTrigger>
            </CardHeader>
            <AccordionContent>
              <CardContent className="pt-2">
                <ul className="space-y-2">
                  {talkingPoints.map((point, i) => (
                    <li key={i} className="flex gap-2 text-sm text-foreground">
                      <span className="text-accent mt-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
