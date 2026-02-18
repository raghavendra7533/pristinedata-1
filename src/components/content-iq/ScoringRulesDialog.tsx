import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, FileCheck, Target, FileText, BookOpen, Info } from "lucide-react";

interface ScoringRulesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  {
    name: "Quantity",
    icon: BarChart3,
    description: "Measures the breadth and volume of your content library",
    criteria: [
      "Number of core assets (decks, one-pagers, data sheets)",
      "Coverage across buyer journey stages",
      "Asset variety (videos, case studies, white papers)",
      "Freshness and update frequency",
    ],
  },
  {
    name: "Quality",
    icon: FileCheck,
    description: "Evaluates content clarity, depth, and effectiveness",
    criteria: [
      "Clarity of value propositions",
      "Depth of technical documentation",
      "Inclusion of proof points and metrics",
      "Professional polish and brand consistency",
    ],
  },
  {
    name: "Competitive Intelligence",
    icon: Target,
    description: "Assesses competitive positioning materials",
    criteria: [
      "Competitor comparison grids",
      "Battle cards and differentiation guides",
      "Win/loss analysis documentation",
      "Market positioning statements",
    ],
  },
  {
    name: "Pitch Materials",
    icon: FileText,
    description: "Reviews sales presentation assets",
    criteria: [
      "Discovery and demo deck quality",
      "Industry or persona-specific decks",
      "Use-case and scenario examples",
      "ROI calculators and value tools",
    ],
  },
  {
    name: "Playbook Support",
    icon: BookOpen,
    description: "Checks enablement and process documentation",
    criteria: [
      "Discovery question banks",
      "Objection handling guides",
      "Talk tracks and messaging frameworks",
      "Process playbooks and checklists",
    ],
  },
];

export const ScoringRulesDialog = ({ open, onOpenChange }: ScoringRulesDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Content IQ Scoring Rules</DialogTitle>
          <DialogDescription>
            Understanding how your content health score is calculated
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Overall Scoring */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                  <Info className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Overall Health Score</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your overall health score (1.0–5.0) is calculated as the average of all five category scores.
                    Each category is equally weighted to ensure comprehensive coverage across all dimensions of content quality.
                  </p>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                      <div className="font-semibold text-emerald-700 dark:text-emerald-400">4.0–5.0 Excellent</div>
                      <div className="text-emerald-600 dark:text-emerald-500 mt-1">Comprehensive & sales-ready</div>
                    </div>
                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                      <div className="font-semibold text-amber-700 dark:text-amber-400">2.5–3.9 Good</div>
                      <div className="text-amber-600 dark:text-amber-500 mt-1">Solid foundation</div>
                    </div>
                    <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
                      <div className="font-semibold text-rose-700 dark:text-rose-400">1.0–2.4 Needs Improvement</div>
                      <div className="text-rose-600 dark:text-rose-500 mt-1">Critical gaps</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Category Scoring Criteria</h3>
            <div className="space-y-4">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Card key={category.name} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-base">{category.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                        </div>
                      </div>
                      <div className="ml-11">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Scoring factors:</p>
                        <ul className="space-y-1.5">
                          {category.criteria.map((criterion, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <span className="text-primary mt-0.5">•</span>
                              <span>{criterion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Methodology Note */}
          <Card className="border-muted">
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground">
                <strong>Assessment methodology:</strong> Content IQ analyzes your uploaded files, metadata, and content structure
                to evaluate each category. Scores are assigned based on the presence, quality, and completeness of relevant materials.
                The system identifies gaps by comparing your library against best-practice sales enablement frameworks.
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
