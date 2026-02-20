import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";

interface CampaignReviewProps {
  data: {
    name: string;
    theme: string;
    stages: number;
    contactList: string;
    instructions: string;
  };
  onBack: () => void;
  onLaunch: () => void;
}

const themeLabels: Record<string, string> = {
  "event-followup": "Event Outreach",
  "sales-outreach": "Sales Outreach",
  "competitive": "Competitor Takeout",
  "nurture": "Nurture Campaign",
  "product-launch": "Awareness"
};

// Mock email stages with sample emails
const mockEmailStages = [
  {
    title: "Initial Outreach",
    samples: [
      {
        to: "josh@compscience.com",
        subject: "Transform CompScience's Partner Onboarding Process",
        preview: "Hi Josh, As a leader at CompScience, you're likely navigating the complexities of integrating..."
      },
      {
        to: "sarah@techcorp.io",
        subject: "Transform TechCorp's Partner Onboarding Process",
        preview: "Hi Sarah, As a leader at TechCorp, you're likely navigating the complexities of integrating..."
      }
    ]
  },
  {
    title: "1st Follow-up",
    samples: [
      {
        to: "josh@compscience.com",
        subject: "Quick Question About CompScience's Integration Strategy",
        preview: "Hi Josh, I wanted to follow up on my previous message about streamlining your partner..."
      },
      {
        to: "sarah@techcorp.io",
        subject: "Quick Question About TechCorp's Integration Strategy",
        preview: "Hi Sarah, I wanted to follow up on my previous message about streamlining your partner..."
      }
    ]
  },
  {
    title: "2nd Follow-up",
    samples: [
      {
        to: "josh@compscience.com",
        subject: "Final Follow-up: Integration Solutions for CompScience",
        preview: "Hi Josh, This is my final follow-up regarding our AI-powered integration platform..."
      },
      {
        to: "sarah@techcorp.io",
        subject: "Final Follow-up: Integration Solutions for TechCorp",
        preview: "Hi Sarah, This is my final follow-up regarding our AI-powered integration platform..."
      }
    ]
  },
  {
    title: "3rd Follow-up",
    samples: [
      {
        to: "josh@compscience.com",
        subject: "One More Thing for CompScience",
        preview: "Hi Josh, I know your inbox is probably overflowing, so I'll keep this brief..."
      },
      {
        to: "sarah@techcorp.io",
        subject: "One More Thing for TechCorp",
        preview: "Hi Sarah, I know your inbox is probably overflowing, so I'll keep this brief..."
      }
    ]
  },
  {
    title: "Final Touch",
    samples: [
      {
        to: "josh@compscience.com",
        subject: "Closing the Loop - CompScience",
        preview: "Hi Josh, This will be my last email on this topic. I genuinely believe our platform..."
      },
      {
        to: "sarah@techcorp.io",
        subject: "Closing the Loop - TechCorp",
        preview: "Hi Sarah, This will be my last email on this topic. I genuinely believe our platform..."
      }
    ]
  }
];

const CampaignReview = ({ data, onBack }: CampaignReviewProps) => {
  const [expandedStage, setExpandedStage] = useState<number | null>(null);
  const stages = mockEmailStages.slice(0, data.stages);

  const toggleStage = (index: number) => {
    setExpandedStage(expandedStage === index ? null : index);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Campaign Summary Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon icon="solar:check-circle-bold" className="h-4 w-4 text-emerald-500" />
              <CardTitle className="text-base font-semibold">Ready to Launch</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <Icon icon="solar:pen-linear" className="h-3.5 w-3.5 mr-1" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Campaign Name</p>
              <p className="text-sm font-medium text-foreground">
                {data.name || "Untitled Campaign"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Theme</p>
              <p className="text-sm font-medium text-foreground">
                {themeLabels[data.theme] || "Not Selected"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Stages</p>
              <p className="text-sm font-medium text-foreground">{data.stages}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Contact List</p>
              <p className="text-sm font-medium text-foreground">
                {data.contactList || "Not Selected"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emails Card with Accordion */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon icon="solar:letter-linear" className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-semibold">Email Sequence</CardTitle>
            </div>
            <Badge variant="outline" className="text-xs">
              {data.stages} {data.stages === 1 ? "Email" : "Emails"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-2">
            {stages.map((stage, index) => (
              <div key={index} className="rounded-lg border border-border overflow-hidden">
                {/* Accordion Header */}
                <button
                  onClick={() => toggleStage(index)}
                  className="w-full flex items-center gap-3 p-3 bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    {index + 1}
                  </div>
                  <p className="flex-1 text-sm font-medium text-foreground text-left">{stage.title}</p>
                  <Badge variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0">
                    <Icon icon="solar:check-read-linear" className="h-3 w-3 mr-1" />
                    Ready
                  </Badge>
                  <Icon
                    icon="solar:alt-arrow-down-linear"
                    className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                      expandedStage === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Accordion Content - Sample Emails */}
                {expandedStage === index && (
                  <div className="p-3 pt-0 space-y-2 border-t border-border bg-background">
                    <p className="text-xs text-muted-foreground pt-3 pb-1">Sample emails for this stage:</p>
                    {stage.samples.map((sample, sampleIdx) => (
                      <div
                        key={sampleIdx}
                        className="p-3 rounded-md bg-muted/20 border border-border/50 space-y-1.5"
                      >
                        <div className="flex items-center gap-2">
                          <Icon icon="solar:user-linear" className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">To:</span>
                          <span className="text-xs font-medium text-foreground">{sample.to}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Icon icon="solar:letter-linear" className="h-3 w-3 text-muted-foreground mt-0.5" />
                          <span className="text-xs text-muted-foreground">Subject:</span>
                          <span className="text-xs font-medium text-foreground">{sample.subject}</span>
                        </div>
                        <p className="text-xs text-muted-foreground pl-5 line-clamp-2">
                          {sample.preview}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions Card (if any) */}
      {data.instructions && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Icon icon="solar:notes-linear" className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-semibold">Additional Instructions</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-muted-foreground">{data.instructions}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CampaignReview;
