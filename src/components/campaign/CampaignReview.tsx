import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, FileEdit, CheckCircle2, Mail } from "lucide-react";

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
  "event-followup": "Event Follow-up",
  "sales-outreach": "Sales Outreach",
  "competitive": "Competitive",
  "nurture": "Nurture Campaign",
  "product-launch": "Product Launch"
};

// Mock email stages
const mockEmailStages = [
  "Sales Outreach - Initial",
  "Sales Outreach - 1st Followup",
  "Sales Outreach - 2nd Followup"
];

const CampaignReview = ({ data, onBack, onLaunch }: CampaignReviewProps) => {
  const stages = mockEmailStages.slice(0, data.stages);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-4xl font-bold">Let's go!</h2>
          <p className="text-lg text-muted-foreground">
            Your campaign is ready! Review details below before proceeding.
          </p>
        </div>
      </div>

      {/* Campaign Summary Card */}
      <Card className="border-border/50 shadow-lg">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Campaign</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-primary hover:text-primary/80"
            >
              <FileEdit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-4 gap-8">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Campaign Name
              </p>
              <p className="text-base font-medium text-foreground">
                {data.name || "Untitled Campaign"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Campaign Theme
              </p>
              <p className="text-base font-medium text-foreground">
                {themeLabels[data.theme] || "Not Selected"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Campaign Stages
              </p>
              <p className="text-base font-medium text-foreground">{data.stages}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Contact List
              </p>
              <p className="text-base font-medium text-foreground">
                {data.contactList || "Pristine_Data_Leads_Q1"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emails Summary Card */}
      <Card className="border-border/50 shadow-lg">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Emails</CardTitle>
            <Badge variant="outline" className="text-sm">
              <Mail className="h-3.5 w-3.5 mr-1.5" />
              {data.stages} {data.stages === 1 ? "Email" : "Emails"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {stages.map((stage, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  {index + 1}
                </div>
                <p className="flex-1 font-medium text-foreground">{stage}</p>
                <Badge variant="secondary" className="text-xs">
                  Ready
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4 pt-4">
        <Button
          variant="outline"
          size="lg"
          onClick={onBack}
          className="px-8"
        >
          Back to Preview
        </Button>
        <Button
          size="lg"
          onClick={onLaunch}
          className="px-12 bg-gradient-to-r from-primary via-accent to-secondary hover:opacity-90 shadow-lg"
        >
          <Sparkles className="h-5 w-5 mr-2" />
          Launch Campaign
        </Button>
      </div>
    </div>
  );
};

export default CampaignReview;
