import { ExternalLink, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const PlaybookIntelligence = () => {
  return (
    <div className="space-y-4">
      <Card className="border-none shadow-card bg-card rounded-2xl border-l-4 border-l-accent">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base">Opportunity Playbook</CardTitle>
            </div>
          </div>
          <CardDescription className="text-xs">
            Strategic guidance for this opportunity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground leading-relaxed">
              This opportunity shows strong potential based on recent company expansion into automation technologies. 
              Key decision-maker is actively engaged in digital transformation initiatives, with budget allocated for Q1.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Recommended approach: Focus on ROI metrics and integration capabilities with their existing HubSpot stack.
            </p>
          </div>

          <div className="pt-2 border-t">
            <Button 
              variant="outline" 
              className="w-full gap-2 justify-between group"
              onClick={() => window.open('/opportunities', '_blank')}
            >
              <span className="flex items-center gap-2">
                <span>View Full Playbook</span>
              </span>
              <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
